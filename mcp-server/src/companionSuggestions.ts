import { readFileSync } from "node:fs";
import { join } from "node:path";

export type CompanionTier = "A" | "B";

export interface CompanionTool {
  name: string;
  homepage: string;
  offer: string;
}

export interface CompanionSituation {
  id: string;
  tier: CompanionTier;
  phases: string[];
  trigger: string;
  tools: CompanionTool[];
}

export interface CompanionCatalog {
  shelf: string;
  rules: string[];
  situations: CompanionSituation[];
}

export function loadCompanionCatalog(contentDir: string): CompanionCatalog | null {
  const path = join(contentDir, "companion-tools.json");
  try {
    const raw = readFileSync(path, "utf-8");
    const parsed = JSON.parse(raw) as CompanionCatalog;
    if (!Array.isArray(parsed.situations)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function filterCompanionSituations(
  catalog: CompanionCatalog,
  opts: { phase?: string; situation?: string }
): CompanionSituation[] {
  let rows = catalog.situations;
  if (opts.situation) {
    const id = opts.situation.toLowerCase();
    rows = rows.filter((s) => s.id === id);
  }
  if (opts.phase) {
    rows = rows.filter((s) => s.phases.includes(opts.phase as string));
  }
  return rows;
}

function formatSituation(s: CompanionSituation): string {
  const tools = s.tools
    .map((t) => `- **${t.name}** (${t.homepage}): ${t.offer}`)
    .join("\n");
  return `### \`${s.id}\` (tier ${s.tier}, phases ${s.phases.join(", ")})\n\n${s.trigger}\n\n${tools}`;
}

export function formatCompanionSuggestions(
  catalog: CompanionCatalog,
  opts: { phase?: string; situation?: string }
): { text: string; json: Record<string, unknown> } {
  const filtered = filterCompanionSituations(catalog, opts);
  const situationIds = catalog.situations.map((s) => s.id);
  const rules = catalog.rules.map((r) => `- ${r}`).join("\n");

  if (!opts.phase && !opts.situation) {
    const index = catalog.situations
      .map((s) => `- \`${s.id}\` (tier ${s.tier}): ${s.trigger} → ${s.tools.map((t) => t.name).join(", ")}`)
      .join("\n");
    const text = [
      "# Companion suggestions",
      "",
      `Shelf: ${catalog.shelf}`,
      "",
      "Pass `phase` (1–7) or `situation` for a filtered offer. These tools are optional.",
      "",
      "## Rules",
      "",
      rules,
      "",
      "## Situation ids",
      "",
      index,
    ].join("\n");
    return {
      text,
      json: {
        shelf: catalog.shelf,
        rules: catalog.rules,
        situations: catalog.situations,
        filter: { phase: null, situation: null },
      },
    };
  }

  if (filtered.length === 0) {
    const text = [
      "No companion matches that filter.",
      opts.phase ? `phase: ${opts.phase}` : "",
      opts.situation ? `situation: ${opts.situation}` : "",
      "",
      `Known situation ids: ${situationIds.join(", ")}`,
      `Shelf: ${catalog.shelf}`,
    ]
      .filter(Boolean)
      .join("\n");
    return {
      text,
      json: {
        shelf: catalog.shelf,
        matches: [],
        filter: { phase: opts.phase ?? null, situation: opts.situation ?? null },
        situationIds,
      },
    };
  }

  const headerBits = [
    opts.phase ? `phase ${opts.phase}` : "",
    opts.situation ? `situation \`${opts.situation}\`` : "",
  ].filter(Boolean);
  const text = [
    `# Companion suggestions (${headerBits.join(", ")})`,
    "",
    "Optional. Do not install unless the user asked. One sentence plus the homepage in the human-facing offer.",
    "",
    rules,
    "",
    filtered.map(formatSituation).join("\n\n"),
    "",
    `Shelf: ${catalog.shelf}`,
  ].join("\n");

  return {
    text,
    json: {
      shelf: catalog.shelf,
      rules: catalog.rules,
      filter: { phase: opts.phase ?? null, situation: opts.situation ?? null },
      matches: filtered,
    },
  };
}

const FOOTER_LIMIT = 6;

/** Situation ids to lead with on the getPhaseGuidance footer (signature jobs). */
const PHASE_FOOTER_SITUATIONS: Record<string, string[]> = {
  "1": ["dns-hosting", "markdown-site", "hard-to-undo", "voice-journal", "multi-app-local"],
  "2": ["multi-app-local", "local-ollama", "ollama-vram", "static-publish"],
  "3": ["unclear-cause", "ollama-vram"],
  "4": ["docs-drift", "ship-label", "voice-journal"],
  "5": ["docs-drift", "hard-to-undo", "git-backup"],
  "6": ["copy-review", "docs-drift"],
  "7": ["newcomer-readiness", "ship-label", "markdown-site", "dns-hosting", "git-backup", "docs-drift"],
};

export function formatPhaseCompanionFooter(
  catalog: CompanionCatalog,
  phase: string
): string {
  const preferred = PHASE_FOOTER_SITUATIONS[phase] ?? [];
  const byId = new Map(catalog.situations.map((s) => [s.id, s]));
  const rest = filterCompanionSituations(catalog, { phase }).sort((a, b) =>
    a.tier === b.tier ? 0 : a.tier === "A" ? -1 : 1
  );
  const ordered: CompanionSituation[] = [];
  const used = new Set<string>();
  for (const id of preferred) {
    const s = byId.get(id);
    if (s && s.phases.includes(phase)) {
      ordered.push(s);
      used.add(s.id);
    }
  }
  for (const s of rest) {
    if (!used.has(s.id)) ordered.push(s);
  }
  if (ordered.length === 0) return "";

  const seen = new Set<string>();
  const lines: string[] = [];
  for (const s of ordered) {
    for (const t of s.tools) {
      if (seen.has(t.name)) continue;
      seen.add(t.name);
      lines.push(`- **${t.name}** (${s.id}): ${t.offer} ${t.homepage}`);
      if (lines.length >= FOOTER_LIMIT) break;
    }
    if (lines.length >= FOOTER_LIMIT) break;
  }

  return [
    "## Optional companions",
    "",
    "These are optional. Do not install unless the user asked. Call **`getCompanionSuggestions`** with this phase or a `situation` id for the filtered offer. Persist outcomes in tracking.",
    "",
    ...lines,
    "",
    `Shelf: ${catalog.shelf}`,
  ].join("\n");
}
