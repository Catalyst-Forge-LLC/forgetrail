#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { stripForgeTrailTemplateToShell } from "./templateStrip.js";
import { validateTrackingData, formatValidationResult } from "./trackingValidate.js";
import { ingestPlanArtifact } from "./planIngest.js";
import { toolResult } from "./mcpFormat.js";
import {
  formatCompanionSuggestions,
  formatPhaseCompanionFooter,
  loadCompanionCatalog,
} from "./companionSuggestions.js";

// ---------------------------------------------------------------------------
// Resolve the ForgeTrail content root.
// 1. FORGETRAIL_ROOT
// 2. Parent of mcp-server/ (clone or nested forgetrail package)
// 3. Installed `forgetrail` package (when this server is forgetrail-mcp alone)
// ---------------------------------------------------------------------------
function looksLikeForgetrailRoot(dir: string): boolean {
  return existsSync(join(dir, "WORKFLOW.md")) && existsSync(join(dir, "content"));
}

function resolveForgetrailRoot(): string {
  if (process.env.FORGETRAIL_ROOT) return resolve(process.env.FORGETRAIL_ROOT);

  const fromNestedDist = resolve(import.meta.dirname, "..", "..");
  if (looksLikeForgetrailRoot(fromNestedDist)) return fromNestedDist;

  try {
    const req = createRequire(import.meta.url);
    const pkgJson = req.resolve("forgetrail/package.json");
    const fromPkg = dirname(pkgJson);
    if (looksLikeForgetrailRoot(fromPkg)) return fromPkg;
  } catch {
    // forgetrail is not a sibling install
  }

  return fromNestedDist;
}

const FORGETRAIL_ROOT = resolveForgetrailRoot();

const DOCS_DIR = join(FORGETRAIL_ROOT, "docs");
const PROMPTS_DIR = join(FORGETRAIL_ROOT, "prompts");
const WORKFLOW_PATH = join(FORGETRAIL_ROOT, "WORKFLOW.md");
const TRACKING_SCHEMA_PATH = join(FORGETRAIL_ROOT, "TRACKING_SCHEMA.md");
const WORKFLOW_TRACKING_PATH = join(FORGETRAIL_ROOT, "workflow_tracking.json");
const MCP_CONTENT_DIR = join(FORGETRAIL_ROOT, "content");

/** Default getTemplate mode: `shell` (IP-safe) unless FORGETRAIL_TEMPLATE_DEFAULT_MODE=full */
function defaultTemplateMode(): "full" | "shell" {
  const v = process.env.FORGETRAIL_TEMPLATE_DEFAULT_MODE?.toLowerCase();
  if (v === "full") return "full";
  if (v === "shell") return "shell";
  return "shell";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readFile(path: string): string {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return "";
  }
}

/** Slice WORKFLOW.md from a ## heading up to (but not including) the next ## at column 0 */
function extractWorkflowSection(full: string, heading: string): string {
  const idx = full.indexOf(heading);
  if (idx === -1) return "";
  const searchFrom = idx + heading.length;
  const nextH2 = full.indexOf("\n## ", searchFrom);
  return (nextH2 === -1 ? full.slice(idx) : full.slice(idx, nextH2)).trim();
}

const PROGRESSIVE_DOCS_HEADING = "## 1a. Progressive documentation schedule";

function listDir(dir: string, ext = ".md"): string[] {
  try {
    return readdirSync(dir).filter((f) => f.endsWith(ext));
  } catch {
    return [];
  }
}

/** Starter tracking JSON with _forgetrail/ paths rewritten for MCP-only repos */
function workflowTrackingJsonForMcp(): string {
  const raw = readFile(WORKFLOW_TRACKING_PATH);
  if (!raw) {
    return "";
  }
  return raw
    .replace(
      / \(from _forgetrail\/docs\/ template\)/g,
      " (via ForgeTrail MCP getTemplate — use the template name matching the doc, e.g. CONTEXT_PROMPT)"
    )
    .replace(
      / \(from _forgetrail\/prompts\/black-hat-audit\.md\)/g,
      " (via ForgeTrail MCP runAudit with type black-hat)"
    )
    .replace(
      / \(_forgetrail\/prompts\/docs-alignment-audit\.md\)/g,
      " (ForgeTrail MCP runAudit with type docs-alignment)"
    );
}

/**
 * Single-call greenfield kickoff: same material as getNewProjectBootstrap +
 * getInitialWorkflowTracking + getPostBootstrapUserMessage + optional Cursor rules
 * (phase status + lessons gate + lessons MCP detail).
 */
function buildNewProjectKickoff(
  includeCursorRule: boolean
): { ok: true; text: string } | { ok: false; text: string } {
  const bootstrapPath = join(MCP_CONTENT_DIR, "NEW_PROJECT_BOOTSTRAP.md");
  const postPath = join(MCP_CONTENT_DIR, "POST_BOOTSTRAP_USER_MESSAGE.md");
  const cursorPath = join(MCP_CONTENT_DIR, "cursor-rules", "forgetrail-phase-status.mdc");
  const lessonsGatePath = join(MCP_CONTENT_DIR, "cursor-rules", "forgetrail-lessons-gate.mdc");
  const lessonsMcpPath = join(MCP_CONTENT_DIR, "cursor-rules", "forgetrail-lessons-mcp.mdc");

  const bootstrap = readFile(bootstrapPath);
  const postBoot = readFile(postPath);
  const json = workflowTrackingJsonForMcp();

  if (!bootstrap) {
    return {
      ok: false,
      text: "NEW_PROJECT_BOOTSTRAP.md not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
    };
  }
  if (!postBoot) {
    return {
      ok: false,
      text: "POST_BOOTSTRAP_USER_MESSAGE.md not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
    };
  }
  if (!json) {
    return { ok: false, text: "workflow_tracking.json not found under FORGETRAIL_ROOT." };
  }

  const intro =
    "# ForgeTrail — new project kickoff (bundled)\n\n" +
    "This **single** response replaces separate calls to **`getNewProjectBootstrap`**, **`getInitialWorkflowTracking`**, **`getPostBootstrapUserMessage`**" +
    (includeCursorRule
      ? ", **`getForgeTrailCursorPhaseRule`**, and **`getForgeTrailCursorLessonsRules`**"
      : "") +
    ". Write the files below, then reply to the user per **Post-bootstrap user message** (short; no JSON or tool dump).\n\n" +
    "**Greenfield git:** No `.git` yet is normal. After bootstrap files exist, run **`git init -b main`** if `git rev-parse --is-inside-work-tree` fails — see **Greenfield git** in Bootstrap methodology. Do **not** treat early `git status` / `fatal: not a git repository` as a blocking error.\n\n" +
    "**Genesis / Try path:** If **`docs/GENESIS.md`** exists, call **`ingestPlanArtifact`** with its contents before locking Phase 1. If the user only has an idea, offer **`getGenesisSpecPrompt`** (save as `docs/GENESIS.md`) or point humans at repo-root **`TRY_FORGETRAIL.md`** (no MCP).\n\n" +
    "---\n\n";

  let text =
    intro +
    "## Bootstrap methodology\n\n" +
    bootstrap.trim() +
    "\n\n---\n\n" +
    "## `.forgetrail/workflow_tracking.json`\n\n" +
    "Create **`.forgetrail/`** if missing. Adjust `project` fields. Maintain per `getTrackingSchema`. Do **not** paste this JSON to the user.\n\n" +
    "```json\n" +
    json.trim() +
    "\n```\n\n---\n\n" +
    "## Post-bootstrap user message\n\n" +
    postBoot.trim();

  if (includeCursorRule) {
    const cursor = readFile(cursorPath);
    if (!cursor) {
      return {
        ok: false,
        text:
          "cursor-rules/forgetrail-phase-status.mdc not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
      };
    }
    text +=
      "\n\n---\n\n" +
      "## Cursor rules — phase status (skip section if not using Cursor)\n\n" +
      "Write the following to `.cursor/rules/forgetrail-phase-status.mdc` (create directories if needed).\n\n" +
      cursor.trim();

    const lessonsGate = readFile(lessonsGatePath);
    const lessonsMcp = readFile(lessonsMcpPath);
    if (lessonsGate && lessonsMcp) {
      text +=
        "\n\n---\n\n" +
        "## Cursor rules — lessons gate + MCP detail (recommended)\n\n" +
        "Write the following to `.cursor/rules/forgetrail-lessons-gate.mdc`:\n\n" +
        lessonsGate.trim() +
        "\n\n---\n\n" +
        "Write the following to `.cursor/rules/forgetrail-lessons-mcp.mdc`. Adjust **globs** in the frontmatter if your layout differs (e.g. not `src/routes` / `src/lib`).\n\n" +
        lessonsMcp.trim();
    }
  }

  return { ok: true, text };
}

/** Extract the phase sections from WORKFLOW.md */
function parsePhases(workflow: string): Map<string, string> {
  const phases = new Map<string, string>();
  const phaseRegex = /^### Phase (\d): (.+)$/gm;
  const sections: { num: string; name: string; start: number }[] = [];

  let match;
  while ((match = phaseRegex.exec(workflow)) !== null) {
    sections.push({ num: match[1], name: match[2], start: match.index });
  }

  for (let i = 0; i < sections.length; i++) {
    const end = i + 1 < sections.length ? sections[i + 1].start : undefined;
    const content = workflow.slice(sections[i].start, end).trim();
    phases.set(sections[i].num, content);
  }

  return phases;
}

/**
 * Extract lesson-like blocks from markdown content.
 * Matches blockquotes (> lines), bold callouts, "Key insight", "Lesson",
 * "Anti-Pattern", and structured guidance blocks.
 */
function extractLessons(
  content: string,
  source: string
): { text: string; source: string }[] {
  const lessons: { text: string; source: string }[] = [];
  const lines = content.split("\n");

  // Collect blockquote runs (consecutive > lines)
  let blockquote: string[] = [];
  for (const line of lines) {
    if (line.startsWith(">")) {
      blockquote.push(line.replace(/^>\s?/, ""));
    } else {
      if (blockquote.length > 0) {
        lessons.push({ text: blockquote.join("\n").trim(), source });
        blockquote = [];
      }
    }
  }
  if (blockquote.length > 0) {
    lessons.push({ text: blockquote.join("\n").trim(), source });
  }

  // Collect "Key insight:" and "Anti-Pattern" paragraphs
  const keyInsightRegex =
    /\*\*(?:Key insight|Reusable lesson|Anti-Pattern \d+)[:\.]?\*\*\s*([\s\S]*?)(?=\n\n|\n###|\n\*\*|$)/gi;
  let m;
  while ((m = keyInsightRegex.exec(content)) !== null) {
    lessons.push({ text: m[0].trim(), source });
  }

  return lessons;
}

/** Classify phase + task for subagent decomposition recommendations. */
function resolveSubagentPhaseCategory(
  phase: string,
  taskDescription: string
): "audit" | "iterate" | "general" {
  const combined = `${phase} ${taskDescription}`.toLowerCase();
  if (
    /\b7\b|harden|hardening|production prep|launch|black-hat|security audit|code quality audit/.test(
      combined
    )
  ) {
    return "audit";
  }
  if (/\b4\b|iterate|iteration|feature|refine|\b5\b|refactor|spike|prototype/.test(combined)) {
    return "iterate";
  }
  return "general";
}

// ---------------------------------------------------------------------------
// Pre-load content
// ---------------------------------------------------------------------------

const workflow = readFile(WORKFLOW_PATH);
const phases = parsePhases(workflow);
const trackingSchema = readFile(TRACKING_SCHEMA_PATH);

const docFiles = listDir(DOCS_DIR);
const promptFiles = listDir(PROMPTS_DIR);
const companionCatalog = loadCompanionCatalog(MCP_CONTENT_DIR);

// Build a flat lesson index across all docs + workflow
const lessonIndex: { text: string; source: string }[] = [];
for (const file of docFiles) {
  const content = readFile(join(DOCS_DIR, file));
  lessonIndex.push(...extractLessons(content, `docs/${file}`));
}
lessonIndex.push(...extractLessons(workflow, "WORKFLOW.md"));

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "forgetrail",
  version: "0.1.0",
});

// -- Tool: ping -------------------------------------------------------------

server.tool(
  "ping",
  "Connectivity check: returns ok, package version, FORGETRAIL_ROOT, and whether WORKFLOW.md was found. " +
    "Use format=json for headless pipelines. Lists complementary agent primitives (subagents, plan mode).",
  {
    format: z
      .enum(["text", "json"])
      .optional()
      .describe("text (default) or json for structured headless output"),
  },
  async ({ format }) => {
    const pkgPath = join(import.meta.dirname, "..", "package.json");
    let pkgVersion = "unknown";
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as { version?: string };
      pkgVersion = pkg.version ?? "unknown";
    } catch {
      /* keep unknown */
    }
    const workflowOk = Boolean(readFile(WORKFLOW_PATH));
    const text = [
      "ForgeTrail MCP: ok",
      `forgetrail-mcp version: ${pkgVersion}`,
      `FORGETRAIL_ROOT: ${FORGETRAIL_ROOT}`,
      `WORKFLOW.md: ${workflowOk ? "readable" : "missing (check FORGETRAIL_ROOT)"}`,
      "subagentSupportRecommended: true (use suggestSubagentDecomposition when host supports parallel workers)",
      "planModeRecommended: true for Phase 1 (getPlanModePatterns, ingestPlanArtifact on approval)",
      "Greenfield kickoff (forgetrail-mcp ≥0.2.1): tools register as getNewProjectKickoff, kickoffGreenfield, kickoffGreenfieldNoCursor — ping does not enumerate tools; it only confirms this process, version, and paths. If your client does not show those names, reconnect MCP or read content/KICKOFF_WITHOUT_MCP.md.",
    ].join("\n");

    return toolResult(format, {
      text,
      json: {
        ok: true,
        version: pkgVersion,
        forgetrailRoot: FORGETRAIL_ROOT,
        workflowReadable: workflowOk,
        subagentSupportRecommended: true,
        planModeRecommended: true,
        complementaryPrimitives: [
          "spawn_subagent / Task subagents",
          "native plan mode",
          "todo_write",
          "persistent skills",
        ],
        recommendedTools: [
          "getNewProjectKickoff",
          "getPhaseGuidance",
          "getCompanionSuggestions",
          "suggestSubagentDecomposition",
          "validateTracking",
          "ingestPlanArtifact",
        ],
      },
    });
  }
);

// -- Tool: getPhaseGuidance ------------------------------------------------

server.tool(
  "getPhaseGuidance",
  "Get ForgeTrail methodology guidance for a specific development phase (1-7). " +
    "Returns entry/exit criteria, playbook, prompt patterns, anti-patterns, and an optional companions footer.",
  { phase: z.string().describe("Phase number (1-7) or keyword like 'architecture', 'scaffolding', 'hardening'") },
  async ({ phase }) => {
    const phaseMap: Record<string, string> = {
      architecture: "1", planning: "1",
      scaffolding: "2", scaffold: "2", build: "2",
      stabilization: "3", bugs: "3", "bug fixing": "3",
      features: "4", iteration: "4", "feature iteration": "4",
      refactoring: "5", "code health": "5", refactor: "5",
      strategy: "6", alignment: "6", roadmap: "6", strategic: "6",
      hardening: "7", production: "7", launch: "7", "production prep": "7",
    };

    const num = phaseMap[phase.toLowerCase()] ?? phase.replace(/\D/g, "");
    const content = phases.get(num);

    if (!content) {
      return {
        content: [{
          type: "text" as const,
          text: `Phase "${phase}" not found. Available phases: 1 (Architecture), 2 (Scaffolding), 3 (Stabilization), 4 (Feature Iteration), 5 (Refactoring), 6 (Strategic Alignment), 7 (Hardening).`,
        }],
      };
    }

    // Also pull the matching playbook section
    const playbook = workflow.match(
      new RegExp(`### Phase ${num}:.*?(?=### Phase \\d|## \\d|---\n|$)`, "s")
    );
    // Pull from the "Per-Phase Playbook" section (section 2)
    const playbookSection = workflow.split("## 2. Per-Phase Playbook")[1] ?? "";
    const playbookMatch = playbookSection.match(
      new RegExp(`### Phase ${num}:.*?(?=### Phase \\d|## \\d|---\n|$)`, "s")
    );

    let result = content;
    if (playbookMatch && !content.includes("What to provide")) {
      result += "\n\n---\n\n## Playbook\n\n" + playbookMatch[0].trim();
    }

    if (num === "1") {
      result +=
        "\n\n---\n\n## Native plan mode (when available)\n\n" +
        "Prefer the host's plan mode for all Phase 1 work. On user approval, call **`ingestPlanArtifact`** with the approved plan text " +
        "to map into `docs/PHASE_1_BRIEF.md` + `decisions[]`, or call **`getPlanModePatterns`** for the full handoff flow. " +
        "Do not scaffold until the brief is locked.";
    }

    if (companionCatalog) {
      const footer = formatPhaseCompanionFooter(companionCatalog, num);
      if (footer) {
        result += "\n\n---\n\n" + footer;
      }
    }

    return { content: [{ type: "text" as const, text: result }] };
  }
);

// -- Tool: searchLessons ---------------------------------------------------

server.tool(
  "searchLessons",
  "Search ForgeTrail's lesson database by keyword. Returns battle-tested lessons, " +
    "anti-patterns, and insights from real production development.",
  {
    query: z.string().describe("Search keywords (e.g. 'PocketBase auth', 'silent failures', 'DOCX', 'billing')"),
    limit: z.number().optional().default(10).describe("Max results to return (default 10)"),
  },
  async ({ query, limit }) => {
    const terms = query.toLowerCase().split(/\s+/);

    const scored = lessonIndex
      .map((lesson) => {
        const lower = lesson.text.toLowerCase();
        const hits = terms.filter((t) => lower.includes(t)).length;
        return { ...lesson, score: hits };
      })
      .filter((l) => l.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    if (scored.length === 0) {
      return {
        content: [{
          type: "text" as const,
          text: `No lessons found matching "${query}". Try broader keywords. The lesson database covers: PocketBase, Svelte/SvelteKit, Stripe, DOCX, LLM integration, security, billing, deployment, CSS, error handling, auth, and more.`,
        }],
      };
    }

    const formatted = scored
      .map((l, i) => `### ${i + 1}. [${l.source}]\n\n${l.text}`)
      .join("\n\n---\n\n");

    return {
      content: [{
        type: "text" as const,
        text: `Found ${scored.length} lesson(s) matching "${query}":\n\n${formatted}`,
      }],
    };
  }
);

// -- Tool: getTemplate -----------------------------------------------------

server.tool(
  "getTemplate",
  "Get a ForgeTrail document template from the single-source docs/*.md files. " +
    "mode 'shell' strips blockquote callouts that start with ForgeTrail enrichment markers (💡 📝 🔧) " +
    "so structure and placeholders remain without long lessons/examples; use mode 'full' for the complete file. " +
    "Default mode follows FORGETRAIL_TEMPLATE_DEFAULT_MODE (shell if unset). " +
    "Pass format=json or includeMetadata=true for structured headless output.",
  {
    name: z.string().describe(
      "Template name (e.g. 'PHASE_1_BRIEF', 'CONTEXT_PROMPT', 'CODE_QUALITY', 'BRAND_AND_PRODUCT', 'DEPLOYMENT'). " +
        "Omit the .md extension. Use 'list' to see all available templates."
    ),
    mode: z
      .enum(["full", "shell"])
      .optional()
      .describe(
        "'shell' = structure + instructions, enrichment blockquotes removed. 'full' = entire markdown as authored. " +
          "Omit to use FORGETRAIL_TEMPLATE_DEFAULT_MODE env (defaults to shell)."
      ),
    format: z
      .enum(["text", "json"])
      .optional()
      .describe("text (default) or json — json returns name, mode, path, and content fields"),
    includeMetadata: z
      .boolean()
      .optional()
      .describe("When true with format=json, include template metadata (path, mode, name)"),
  },
  async ({ name, mode, format, includeMetadata }) => {
    if (name.toLowerCase() === "list") {
      const templates = docFiles.map((f) => f.replace(".md", ""));
      const def = defaultTemplateMode();
      const listText =
        `Available templates (${templates.length}):\n\n${templates.map((t) => `- ${t}`).join("\n")}\n\n` +
        `Default getTemplate mode: \`${def}\` (set FORGETRAIL_TEMPLATE_DEFAULT_MODE=full or shell). ` +
        `Pass mode explicitly to override.`;
      return toolResult(format, {
        text: listText,
        json: {
          templates,
          defaultMode: def,
          count: templates.length,
        },
      });
    }

    const filename = name.endsWith(".md") ? name : `${name}.md`;
    const path = join(DOCS_DIR, filename);
    const content = readFile(path);

    if (!content) {
      const miss = `Template "${name}" not found. Use getTemplate({ name: "list" }) to see available templates.`;
      return toolResult(format, {
        text: miss,
        json: { error: miss, name },
      });
    }

    const resolvedMode = mode ?? defaultTemplateMode();
    const out =
      resolvedMode === "shell" ? stripForgeTrailTemplateToShell(content) : content;

    const text = out;
    const json: Record<string, unknown> = {
      name: name.replace(/\.md$/, ""),
      mode: resolvedMode,
      path: `docs/${filename}`,
      content: out,
    };
    if (format === "json") {
      return toolResult("json", { text, json });
    }
    if (includeMetadata) {
      return {
        content: [{
          type: "text" as const,
          text: `${text}\n\n---\n\nMetadata (includeMetadata):\n${JSON.stringify(json, null, 2)}`,
        }],
      };
    }
    return { content: [{ type: "text" as const, text }] };
  }
);

// -- Tool: runAudit --------------------------------------------------------

server.tool(
  "runAudit",
  "Get a ForgeTrail audit prompt to run against the current project. " +
    "Returns the full structured prompt for security, pre-launch, brand copy, or other audits. " +
    "Pass format=json or includeMetadata=true for structured headless output.",
  {
    type: z.string().describe(
      "Audit type: 'black-hat' (security), 'pre-launch' (readiness), " +
      "'cialdini' (marketing), 'competitor' (competitive analysis), " +
      "'docs-alignment' (documentation consistency), 'brand-copy' (copy editing), " +
      "'landing-page' (landing page rewrite). Use 'list' to see all."
    ),
    format: z
      .enum(["text", "json"])
      .optional()
      .describe("text (default) or json"),
    includeMetadata: z
      .boolean()
      .optional()
      .describe("When true, response includes audit type, filename, and recommendedSubagentPersona hint"),
  },
  async ({ type, format, includeMetadata }) => {
    if (type.toLowerCase() === "list") {
      const prompts = promptFiles.map((f) => f.replace(".md", ""));
      const listText = `Available audit prompts (${prompts.length}):\n\n${prompts.map((p) => `- ${p}`).join("\n")}`;
      return toolResult(format, {
        text: listText,
        json: { audits: prompts, count: prompts.length },
      });
    }

    // Fuzzy match: allow short names like "security" -> "black-hat-audit"
    const aliases: Record<string, string> = {
      security: "black-hat-audit",
      "black-hat": "black-hat-audit",
      "pre-launch": "pre-launch-audit",
      readiness: "pre-launch-audit",
      cialdini: "cialdini-marketing-audit",
      marketing: "cialdini-marketing-audit",
      competitor: "competitor-deep-dive",
      competition: "competitor-deep-dive",
      docs: "docs-alignment-audit",
      "docs-alignment": "docs-alignment-audit",
      "brand-copy": "brand-copy-edit-pass",
      copy: "brand-copy-edit-pass",
      landing: "landing-page-rewrite",
      "landing-page": "landing-page-rewrite",
      propagate: "propagate-to-forgetrail",
      "skill-library": "engineering-skill-library",
      handoff: "engineering-skill-library",
    };

    const resolved = aliases[type.toLowerCase()] ?? type.replace(/\.md$/, "");
    const filename = resolved.endsWith(".md") ? resolved : `${resolved}.md`;
    const path = join(PROMPTS_DIR, filename);
    const content = readFile(path);

    if (!content) {
      const miss = `Audit "${type}" not found. Use runAudit({ type: "list" }) to see available prompts.`;
      return toolResult(format, {
        text: miss,
        json: { error: miss, type },
      });
    }

    const personaHints: Record<string, string> = {
      "black-hat-audit": "security-auditor (read-only explore subagent)",
      "pre-launch-audit": "read-only explore subagent",
      "docs-alignment-audit": "read-only explore subagent",
      "ux-cohesion-audit": "ux-cohesion-reviewer (read-only)",
    };
    const recommendedSubagentPersona =
      personaHints[filename.replace(/\.md$/, "")] ??
      "read-only explore subagent for parallel audit hosts";

    const json: Record<string, unknown> = {
      type: resolved,
      filename,
      path: `prompts/${filename}`,
      content,
      recommendedSubagentPersona,
      parallelSubagentRecommended: true,
    };

    if (format === "json" || includeMetadata) {
      if (format === "json") {
        return toolResult("json", { text: content, json });
      }
      return {
        content: [{
          type: "text" as const,
          text: `${content}\n\n---\n\nMetadata (includeMetadata):\n${JSON.stringify(json, null, 2)}`,
        }],
      };
    }
    return { content: [{ type: "text" as const, text: content }] };
  }
);

// -- Tool: getChecklist ----------------------------------------------------

server.tool(
  "getChecklist",
  "Get the ForgeTrail project checklist for a specific milestone or the full checklist. " +
    "Covers everything from pre-session-1 through post-launch.",
  {
    section: z.string().optional().describe(
      "Optional: 'before-session-1', 'session-1', 'session-2', 'features', " +
      "'strategic-review', 'refactoring', 'hardening', 'every-session', or 'full' (default)"
    ),
  },
  async ({ section }) => {
    const checklistStart = workflow.indexOf("## 6. The Checklist");
    if (checklistStart === -1) {
      return { content: [{ type: "text" as const, text: "Checklist section not found in WORKFLOW.md." }] };
    }

    const checklistEnd = workflow.indexOf("\n## ", checklistStart + 1);
    const checklist = workflow.slice(checklistStart, checklistEnd === -1 ? undefined : checklistEnd).trim();

    if (!section || section === "full") {
      return { content: [{ type: "text" as const, text: checklist }] };
    }

    const sectionMap: Record<string, string> = {
      "before-session-1": "Before Session 1",
      "session-1": "Session 1",
      "session-2": "Session 2",
      features: "Sessions 2-4",
      "strategic-review": "Mid-Project",
      refactoring: "Refactoring",
      hardening: "Pre-Launch",
      "every-session": "Every Session",
    };

    const heading = sectionMap[section.toLowerCase()] ?? section;
    const regex = new RegExp(`### ${heading}[\\s\\S]*?(?=### |$)`);
    const match = checklist.match(regex);

    if (!match) {
      return {
        content: [{
          type: "text" as const,
          text: `Section "${section}" not found. Available: ${Object.keys(sectionMap).join(", ")}`,
        }],
      };
    }

    return { content: [{ type: "text" as const, text: match[0].trim() }] };
  }
);

// -- Tool: getTrackingSchema -----------------------------------------------

server.tool(
  "getTrackingSchema",
  "Get the workflow_tracking.json schema reference (customer path: `.forgetrail/workflow_tracking.json`). Use this to understand how to " +
    "read and update the project tracking file (phases, decisions, gotchas, sessions).",
  {},
  async () => {
    if (!trackingSchema) {
      return { content: [{ type: "text" as const, text: "TRACKING_SCHEMA.md not found." }] };
    }
    return { content: [{ type: "text" as const, text: trackingSchema }] };
  }
);

// -- Tool: getAntiPatterns -------------------------------------------------

server.tool(
  "getAntiPatterns",
  "Get all documented anti-patterns from the ForgeTrail methodology. " +
    "These are common failure modes with explanations of what went wrong and how to avoid them.",
  {},
  async () => {
    const apSection = workflow.indexOf("## 5. Anti-Patterns and Pitfalls");
    if (apSection === -1) {
      return { content: [{ type: "text" as const, text: "Anti-patterns section not found." }] };
    }

    const apEnd = workflow.indexOf("\n## ", apSection + 1);
    const content = workflow.slice(apSection, apEnd === -1 ? undefined : apEnd).trim();

    return { content: [{ type: "text" as const, text: content }] };
  }
);

// -- Tool: getProgressiveDocSchedule ---------------------------------------

server.tool(
  "getProgressiveDocSchedule",
  "Returns WORKFLOW.md §1a: which ForgeTrail doc templates to create in each phase. " +
    "Phase 1 = PHASE_1_BRIEF + `.forgetrail/workflow_tracking.json` decisions; Phase 2 = merge brief into CONTEXT_PROMPT + README + TODO + `.forgetrail/IDEAS.md` + full app spine; later phases add templates when warranted.",
  {},
  async () => {
    const section = extractWorkflowSection(workflow, PROGRESSIVE_DOCS_HEADING);
    if (!section) {
      return {
        content: [{
          type: "text" as const,
          text: "Progressive documentation section not found in WORKFLOW.md (expected heading '## 1a. Progressive documentation schedule').",
        }],
      };
    }
    return { content: [{ type: "text" as const, text: section }] };
  }
);

// -- Tool: getNewProjectKickoff ---------------------------------------------

server.tool(
  "getNewProjectKickoff",
  "One-call greenfield setup: bootstrap + starter .forgetrail/workflow_tracking.json + post-bootstrap user-message guidance + optional Cursor rules " +
    "(phase status + lessons gate + lessons MCP detail). " +
    "Prefer this over calling getNewProjectBootstrap, getInitialWorkflowTracking, getPostBootstrapUserMessage, getForgeTrailCursorPhaseRule, and getForgeTrailCursorLessonsRules separately. " +
    "If your client does not list this tool, call kickoffGreenfield (identical bundle, no parameters).",
  {
    includeCursorRule: z
      .boolean()
      .optional()
      .describe("Include the Cursor `.mdc` section; omit or true for full bundle, false to save tokens when not using Cursor"),
  },
  async (args) => {
    const includeCursorRule = args.includeCursorRule !== false;
    const result = buildNewProjectKickoff(includeCursorRule);
    if (!result.ok) {
      return { content: [{ type: "text" as const, text: result.text }] };
    }
    return { content: [{ type: "text" as const, text: result.text }] };
  }
);

server.tool(
  "kickoffGreenfield",
  "Same payload as getNewProjectKickoff with includeCursorRule true, but **no parameters**—use when an MCP client omits or fails on getNewProjectKickoff.",
  {},
  async () => {
    const result = buildNewProjectKickoff(true);
    if (!result.ok) {
      return { content: [{ type: "text" as const, text: result.text }] };
    }
    return { content: [{ type: "text" as const, text: result.text }] };
  }
);

server.tool(
  "kickoffGreenfieldNoCursor",
  "Same as kickoffGreenfield but **without** the Cursor `.mdc` section (smaller payload when not using Cursor). No parameters.",
  {},
  async () => {
    const result = buildNewProjectKickoff(false);
    if (!result.ok) {
      return { content: [{ type: "text" as const, text: result.text }] };
    }
    return { content: [{ type: "text" as const, text: result.text }] };
  }
);

// -- Tool: getNewProjectBootstrap ------------------------------------------

server.tool(
  "getNewProjectBootstrap",
  "MCP-first: full instructions to start a greenfield project WITHOUT copying ForgeTrail into the repo. " +
    "Tells the agent which phases to run, which MCP tools to call for templates/checklists/scaffolding, " +
    "and what files belong in the customer project (`.forgetrail/workflow_tracking.json`, docs). " +
    "For a single bundled response, use getNewProjectKickoff or kickoffGreenfield instead.",
  {},
  async () => {
    const path = join(MCP_CONTENT_DIR, "NEW_PROJECT_BOOTSTRAP.md");
    const content = readFile(path);
    if (!content) {
      return {
        content: [{
          type: "text" as const,
          text: "NEW_PROJECT_BOOTSTRAP.md not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
        }],
      };
    }
    return { content: [{ type: "text" as const, text: content }] };
  }
);

// -- Tool: getForgeTrailLite -------------------------------------------------

server.tool(
  "getForgeTrailLite",
  "Returns the full FORGETRAIL_LITE.md portable kickoff protocol (no MCP required in the target project). " +
    "Use when the user wants the single-file Lite artifact: save to `.forgetrail/FORGETRAIL_LITE.md` or paste into chat. " +
    "Complements getNewProjectKickoff (MCP-first greenfield).",
  {},
  async () => {
    const path = join(MCP_CONTENT_DIR, "FORGETRAIL_LITE.md");
    const content = readFile(path);
    if (!content) {
      return {
        content: [{
          type: "text" as const,
          text: "FORGETRAIL_LITE.md not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
        }],
      };
    }
    return {
      content: [{
        type: "text" as const,
        text:
          "ForgeTrail Lite — portable kickoff protocol. Save to `.forgetrail/FORGETRAIL_LITE.md` in the app repo " +
          "(or paste into chat). See §1 for drop-in vs paste vs rules options.\n\n" +
          content,
      }],
    };
  }
);

// -- Tool: getForgeTrailLiteUpdates ------------------------------------------

server.tool(
  "getForgeTrailLiteUpdates",
  "Returns the FORGETRAIL_LITE_UPDATES.md starter for logging Lite protocol gaps in `.forgetrail/` (§1.6). " +
    "Optional local feedback file — merge accepted entries back into upstream FORGETRAIL_LITE.md.",
  {},
  async () => {
    const path = join(MCP_CONTENT_DIR, "FORGETRAIL_LITE_UPDATES.md");
    const content = readFile(path);
    if (!content) {
      return {
        content: [{
          type: "text" as const,
          text: "FORGETRAIL_LITE_UPDATES.md not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
        }],
      };
    }
    return {
      content: [{
        type: "text" as const,
        text:
          "Write the following to `.forgetrail/FORGETRAIL_LITE_UPDATES.md` when bootstrapping a project " +
          "that may feed protocol feedback upstream (§1.6).\n\n" +
          content,
      }],
    };
  }
);

// -- Tool: getForgeTrailCursorPhaseRule --------------------------------------

server.tool(
  "getForgeTrailCursorPhaseRule",
  "Returns the optional Cursor IDE rule (`.mdc`) so agents show ForgeTrail phase / next actions from `.forgetrail/workflow_tracking.json`. " +
    "Agent should write the output to `.cursor/rules/forgetrail-phase-status.mdc` when setting up a new project (Phase 1). Skip if not using Cursor.",
  {},
  async () => {
    const path = join(MCP_CONTENT_DIR, "cursor-rules", "forgetrail-phase-status.mdc");
    const content = readFile(path);
    if (!content) {
      return {
        content: [{
          type: "text" as const,
          text: "cursor-rules/forgetrail-phase-status.mdc not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
        }],
      };
    }
    return {
      content: [{
        type: "text" as const,
        text:
          "Write the following to `.cursor/rules/forgetrail-phase-status.mdc` (create directories if needed). " +
          "This rule is always-on (`alwaysApply: true`) and nudges the agent to append a compact phase footer from `.forgetrail/workflow_tracking.json`.\n\n" +
          content,
      }],
    };
  }
);

// -- Tool: getForgeTrailCursorLessonsRules ------------------------------------

server.tool(
  "getForgeTrailCursorLessonsRules",
  "Returns two Cursor rules: forgetrail-lessons-gate.mdc (always-on: when to call getAntiPatterns + searchLessons before large work) " +
    "and forgetrail-lessons-mcp.mdc (optional globs + tool reminders). " +
    "Bundled in getNewProjectKickoff when includeCursorRule is true; use this tool alone when adding lessons workflow to an existing project.",
  {},
  async () => {
    const gatePath = join(MCP_CONTENT_DIR, "cursor-rules", "forgetrail-lessons-gate.mdc");
    const mcpPath = join(MCP_CONTENT_DIR, "cursor-rules", "forgetrail-lessons-mcp.mdc");
    const gate = readFile(gatePath);
    const mcp = readFile(mcpPath);
    if (!gate || !mcp) {
      return {
        content: [{
          type: "text" as const,
          text:
            "cursor-rules/forgetrail-lessons-gate.mdc or forgetrail-lessons-mcp.mdc not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
        }],
      };
    }
    return {
      content: [{
        type: "text" as const,
        text:
          "Write the following two files under `.cursor/rules/` (create directories if needed). " +
          "Adjust **globs** in `forgetrail-lessons-mcp.mdc` frontmatter to match your repo.\n\n" +
          "---\n\n" +
          "## `.cursor/rules/forgetrail-lessons-gate.mdc`\n\n" +
          gate.trim() +
          "\n\n---\n\n" +
          "## `.cursor/rules/forgetrail-lessons-mcp.mdc`\n\n" +
          mcp.trim(),
      }],
    };
  }
);

// -- Tool: getScaffoldInstallParams ----------------------------------------

server.tool(
  "getScaffoldInstallParams",
  "Returns JSON defaults for scripted Phase-2 setup (PocketBase version policy, default HTTP port, one-click launchers, pnpm script names). " +
    "Resolve PocketBase latest at install unless POCKETBASE_VERSION is pinned in .env. Prefer setup.bat/setup.sh for humans; agents run setup when possible.",
  {},
  async () => {
    const path = join(MCP_CONTENT_DIR, "SCAFFOLD_INSTALL.json");
    const content = readFile(path);
    if (!content) {
      return {
        content: [{
          type: "text" as const,
          text: "SCAFFOLD_INSTALL.json not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
        }],
      };
    }
    return {
      content: [{
        type: "text" as const,
        text:
          "Use these defaults for `scripts/setup-pocketbase.mjs` / `scaffold-defaults.json` in the app repo. " +
          "Copy reference scripts from `content/scripts/` and ONE_CLICK_DEV_SETUP.md launchers. " +
          "Isolated checks: test-pocketbase, setup-ollama, test-ollama (SYSTEM_HEALTH_CHECKS.md). " +
          "Do not hardcode a stale PocketBase semver — use versionPolicy in JSON. " +
          "Ollama: non-thinking Granite 4.1 / Gemma 3 defaults unless OLLAMA_USE_THINKING=1. " +
          "Humans: setup.bat then run.bat; agents: `pnpm install && pnpm run setup:pocketbase` when possible.\n\n```json\n" +
          content.trim() +
          "\n```",
      }],
    };
  }
);

// -- Tool: getGenesisSpecPrompt ---------------------------------------------

server.tool(
  "getGenesisSpecPrompt",
  "Pre-Phase-1 helper: a copy-paste prompt to run in ANY external LLM chat (not this MCP) to produce docs/GENESIS.md " +
    "'what, not how' build spec — market/prior-art check, underlying data/file-format research, functional + " +
    "non-functional requirements, edge cases, milestones, acceptance criteria. Best for tools that wrap/extend an " +
    "existing app's data format, but generalizes. Humans without MCP: see TRY_FORGETRAIL.md. Feed the result into " +
    "ingestPlanArtifact to draft PHASE_1_BRIEF.md, or use alongside getGreenfieldIntakePrompt for delivery gaps.",
  {},
  async () => {
    const path = join(MCP_CONTENT_DIR, "GENESIS_SPEC_PROMPT.md");
    const content = readFile(path);
    if (!content) {
      return {
        content: [{
          type: "text" as const,
          text: "GENESIS_SPEC_PROMPT.md not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
        }],
      };
    }
    return { content: [{ type: "text" as const, text: content }] };
  }
);

// -- Tool: getGreenfieldIntakePrompt ---------------------------------------

server.tool(
  "getGreenfieldIntakePrompt",
  "Phase 1 helper: structured questions about exports (PDF/DOCX/PPTX, etc.), tenancy (e.g. consultants with many clients), " +
    "hybrid vs full spec, compliance tier, hero flow, and registrar/DNS/git/hosting. Complements getChecklist(before-session-1). " +
    "Agent should capture answers in PHASE_1_BRIEF.md and .forgetrail/workflow_tracking.json decisions[]. " +
    "For a pre-written portable spec instead of in-session Q&A, see getGenesisSpecPrompt.",
  {},
  async () => {
    const path = join(MCP_CONTENT_DIR, "GREENFIELD_INTAKE.md");
    const content = readFile(path);
    if (!content) {
      return {
        content: [{
          type: "text" as const,
          text: "GREENFIELD_INTAKE.md not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
        }],
      };
    }
    return { content: [{ type: "text" as const, text: content }] };
  }
);

// -- Tool: getResumeSessionInstructions ------------------------------------

server.tool(
  "getResumeSessionInstructions",
  "MCP-first: instructions for continuing work in a later session when ForgeTrail is MCP-only (no _forgetrail/ folder). " +
    "Call at the start of a session after the user describes what to focus on.",
  {},
  async () => {
    const path = join(MCP_CONTENT_DIR, "SESSION_RESUME_MCP.md");
    const content = readFile(path);
    if (!content) {
      return {
        content: [{
          type: "text" as const,
          text: "SESSION_RESUME_MCP.md not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
        }],
      };
    }
    return { content: [{ type: "text" as const, text: content }] };
  }
);

// -- Tool: getInitialWorkflowTracking --------------------------------------

server.tool(
  "getInitialWorkflowTracking",
  "Returns starter .forgetrail/workflow_tracking.json for a new repo, with exit-criteria strings rewritten for MCP " +
    "(no _forgetrail/ paths). The agent should write this to `.forgetrail/workflow_tracking.json` and fill project metadata.",
  {},
  async () => {
    const json = workflowTrackingJsonForMcp();
    if (!json) {
      return {
        content: [{
          type: "text" as const,
          text: "workflow_tracking.json not found under FORGETRAIL_ROOT.",
        }],
      };
    }
    return {
      content: [{
        type: "text" as const,
        text:
          "Write the following JSON to `.forgetrail/workflow_tracking.json` (create `.forgetrail/` if needed; adjust `project` fields). " +
          "Maintain this file for the life of the project per getTrackingSchema. " +
          "Do not paste this JSON or MCP tool names to the user; after the file exists, call **getPostBootstrapUserMessage** (or use **getNewProjectKickoff**, which bundles this) for the first user-facing reply.\n\n```json\n" +
          json.trim() +
          "\n```",
      }],
    };
  }
);

// -- Tool: getPostBootstrapUserMessage --------------------------------------

server.tool(
  "getPostBootstrapUserMessage",
  "After `.forgetrail/workflow_tracking.json` (and optional Cursor phase rule) is written: canonical guidance for a SHORT first reply to the user. " +
    "Suppresses noisy 'Completed setup' dumps (no raw JSON, no MCP tool list, no bootstrap section paste).",
  {},
  async () => {
    const path = join(MCP_CONTENT_DIR, "POST_BOOTSTRAP_USER_MESSAGE.md");
    const content = readFile(path);
    if (!content) {
      return {
        content: [{
          type: "text" as const,
          text: "POST_BOOTSTRAP_USER_MESSAGE.md not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
        }],
      };
    }
    return { content: [{ type: "text" as const, text: content }] };
  }
);

// -- Tool: getUserReplyFormat -----------------------------------------------

server.tool(
  "getUserReplyFormat",
  "How to format options and next steps for users: numbered lists for ordered pipelines, bullets for parallel items, letters for pick-one. " +
    "Baked into forgetrail-phase-status.mdc for Cursor; use this tool when the rule is not loaded.",
  {},
  async () => {
    const path = join(MCP_CONTENT_DIR, "USER_REPLY_FORMAT.md");
    const content = readFile(path);
    if (!content) {
      return {
        content: [{
          type: "text" as const,
          text: "USER_REPLY_FORMAT.md not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
        }],
      };
    }
    return { content: [{ type: "text" as const, text: content }] };
  }
);

// -- Tool: validateTracking ------------------------------------------------

server.tool(
  "validateTracking",
  "Validate a .forgetrail/workflow_tracking.json file (or supplied JSON) against the schema and ForgeTrail phase rules. Returns issues + suggested fixes. Safe to call often. Pass format=json for structured output.",
  {
    trackingJson: z.string().optional().describe("Raw JSON string of the tracking file (if not supplying path)"),
    path: z.string().optional().describe("Filesystem path to .forgetrail/workflow_tracking.json (server will attempt to read)"),
    format: z.enum(["text", "json"]).optional().describe("text (default) or json"),
  },
  async ({ trackingJson, path, format }) => {
    let jsonText = trackingJson;
    if (!jsonText && path) {
      try {
        const fs = await import("node:fs");
        jsonText = fs.readFileSync(path, "utf-8");
      } catch (e) {
        return { content: [{ type: "text" as const, text: `Could not read file at ${path}: ${e}` }] };
      }
    }
    if (!jsonText) {
      try {
        const defaultPath = join(FORGETRAIL_ROOT, "workflow_tracking.json");
        const fs = await import("node:fs");
        jsonText = fs.readFileSync(defaultPath, "utf-8");
      } catch {}
    }

    if (!jsonText) {
      return {
        content: [{
          type: "text" as const,
          text: "No tracking JSON provided and no default file found. Pass trackingJson or path.",
        }],
      };
    }

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(jsonText) as Record<string, unknown>;
    } catch (e) {
      return { content: [{ type: "text" as const, text: `Invalid JSON: ${e}` }] };
    }

    const result = validateTrackingData(data);
    const text = formatValidationResult(result);
    return toolResult(format, {
      text,
      json: {
        healthy: result.issues.length === 0,
        issueCount: result.issues.length,
        warningCount: result.warnings.length,
        issues: result.issues,
        warnings: result.warnings,
      },
    });
  }
);

// -- Tool: suggestSubagentDecomposition ------------------------------------

server.tool(
  "suggestSubagentDecomposition",
  "Given a phase and task, returns recommended subagent spawn parameters (type, capability_mode, isolation, persona hints, and prompt seeds) plus a parent synthesis step. Designed for agents like Grok that support spawn_subagent. Pass format=json for structured output.",
  {
    phase: z.string().describe("Current ForgeTrail phase (1-7 or name like 'hardening')"),
    taskDescription: z.string().describe("What the subagents should accomplish"),
    maxSubagents: z.number().optional().default(3),
    format: z.enum(["text", "json"]).optional().describe("text (default) or json"),
  },
  async ({ phase, taskDescription, maxSubagents, format }) => {
    const category = resolveSubagentPhaseCategory(phase, taskDescription);
    const examples: string[] = [];

    if (category === "audit") {
      examples.push(
        "Subagent 1 (security): subagent_type='explore', capability_mode='read-only', isolation='none', prompt='Call runAudit(\"black-hat\") and searchLessons for security issues. Output structured findings.'",
        "Subagent 2 (ux): subagent_type='explore', capability_mode='read-only', prompt='Run ux-cohesion-audit or panel-usability-audit against the current UI flows.'",
        "Subagent 3 (code-quality): subagent_type='explore', capability_mode='read-only', prompt='Audit against CODE_QUALITY template + known anti-patterns. Flag silent failures and schema drift.'"
      );
    } else if (category === "iterate") {
      examples.push(
        `Subagent 1 (research): subagent_type='explore', capability_mode='read-only', prompt='Deep research on ${taskDescription}. Return options + tradeoffs.'`,
        `Subagent 2 (spike): subagent_type='general-purpose', capability_mode='read-write', isolation='worktree', prompt='Prototype the core of ${taskDescription} in an isolated worktree.'`
      );
    } else {
      examples.push(
        `Main subagent: subagent_type='explore', capability_mode='read-only', prompt='Analyze ${taskDescription} in context of current phase ${phase}. Return clear findings and recommendations.'`
      );
    }

    const synthesis = "Parent: Collect all subagent outputs. Update .forgetrail/workflow_tracking.json (gotchas, decisions). Synthesize into the appropriate doc (BLACK_HAT_REPORT.md, etc.). Present prioritized next actions to user.";

    const text =
      `Recommended decomposition for Phase ${phase} — task: "${taskDescription}"\n\n` +
      `Max recommended subagents: ${maxSubagents}\n\n` +
      examples.slice(0, maxSubagents).join("\n\n") +
      `\n\nSynthesis step (in parent thread):\n${synthesis}\n\n` +
      "Use spawn_subagent with background:true for long tasks and retrieve results with get_command_or_subagent_output.\n" +
      "After results return, always update tracking and relevant progressive docs.";

    return toolResult(format, {
      text,
      json: {
        phase,
        taskDescription,
        maxSubagents,
        category,
        subagents: examples.slice(0, maxSubagents),
        synthesis,
      },
    });
  }
);

// -- Tool: ingestPlanArtifact ----------------------------------------------

server.tool(
  "ingestPlanArtifact",
  "Map an approved native plan artifact (plan.md, a GENESIS.md from getGenesisSpecPrompt, etc.) into a PHASE_1_BRIEF.md draft plus decisions[] entries for .forgetrail/workflow_tracking.json. Call after exit_plan_mode / user approval. Agent should review and lock the brief before Phase 2.",
  {
    planContent: z.string().describe("Full text of the approved plan.md or equivalent planning artifact"),
    projectName: z.string().optional().describe("App/project name for the brief title"),
    existingBrief: z
      .string()
      .optional()
      .describe("Current PHASE_1_BRIEF.md content if merging into an existing draft"),
    format: z.enum(["text", "json"]).optional().describe("text (default) or json"),
  },
  async ({ planContent, projectName, existingBrief, format }) => {
    const templatePath = join(DOCS_DIR, "PHASE_1_BRIEF.md");
    const fullTemplate = readFile(templatePath);
    const briefTemplateShell = fullTemplate
      ? stripForgeTrailTemplateToShell(fullTemplate)
      : "# Phase 1 architecture brief\n\n## 1. Problem and outcome\n";

    const result = ingestPlanArtifact({
      planContent,
      projectName,
      existingBrief,
      briefTemplateShell,
    });

    const text =
      "# Plan artifact → Phase 1 handoff\n\n" +
      (result.warnings.length > 0
        ? `Warnings:\n${result.warnings.map((w) => `- ${w}`).join("\n")}\n\n`
        : "") +
      `## Instructions\n\n${result.instructions}\n\n` +
      `## Section mapping (plan → brief)\n\n${Object.entries(result.sectionMapping)
        .map(([k, v]) => `- ${k} → ${v}`)
        .join("\n")}\n\n` +
      `## decisions[] (merge into .forgetrail/workflow_tracking.json)\n\n` +
      "```json\n" +
      JSON.stringify(result.trackingDecisions, null, 2) +
      "\n```\n\n" +
      `## docs/PHASE_1_BRIEF.md (review, edit, then write)\n\n` +
      "```markdown\n" +
      result.briefMarkdown +
      "\n```";

    return toolResult(format, {
      text,
      json: {
        briefMarkdown: result.briefMarkdown,
        trackingDecisions: result.trackingDecisions,
        instructions: result.instructions,
        sectionMapping: result.sectionMapping,
        warnings: result.warnings,
      },
    });
  }
);

// -- Tool: getCompanionSuggestions -----------------------------------------

const companionSituationIds = (companionCatalog?.situations.map((s) => s.id) ??
  []) as [string, ...string[]];

server.tool(
  "getCompanionSuggestions",
  "Return optional Catalyst Forge companion tools for a ForgeTrail phase or situation " +
    "(FilePress, LocalSlip, LocalHelm, practice skills, xFacts, and others). " +
    "Suggestions only: never required, never install unless the user asked. " +
    "Omit filters to list situation ids. Use format=json for structured output.",
  {
    phase: z
      .string()
      .optional()
      .describe("Phase number 1–7 or keyword (architecture, scaffolding, hardening, …)"),
    situation: (companionSituationIds.length > 0
      ? z.enum(companionSituationIds)
      : z.string()
    )
      .optional()
      .describe(
        "Situation id from companion-tools.json (e.g. markdown-site, multi-app-local, ship-label)"
      ),
    format: z
      .enum(["text", "json"])
      .optional()
      .describe("text (default) or json for structured headless output"),
  },
  async ({ phase, situation, format }) => {
    if (!companionCatalog) {
      return {
        content: [
          {
            type: "text" as const,
            text: "companion-tools.json not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
          },
        ],
      };
    }

    let phaseNum: string | undefined;
    if (phase) {
      const phaseMap: Record<string, string> = {
        architecture: "1",
        planning: "1",
        scaffolding: "2",
        scaffold: "2",
        build: "2",
        stabilization: "3",
        bugs: "3",
        "bug fixing": "3",
        features: "4",
        iteration: "4",
        "feature iteration": "4",
        refactoring: "5",
        "code health": "5",
        refactor: "5",
        strategy: "6",
        alignment: "6",
        roadmap: "6",
        strategic: "6",
        hardening: "7",
        production: "7",
        launch: "7",
        "production prep": "7",
      };
      phaseNum = phaseMap[phase.toLowerCase()] ?? phase.replace(/\D/g, "") ?? undefined;
      if (phaseNum === "") phaseNum = undefined;
    }

    const payload = formatCompanionSuggestions(companionCatalog, {
      phase: phaseNum,
      situation,
    });
    return toolResult(format, payload);
  }
);

// -- Tool: getPlanModePatterns ---------------------------------------------

server.tool(
  "getPlanModePatterns",
  "Returns guidance for using native agent plan modes as ForgeTrail Phase 1 (architecture). Covers Grok, Cursor, Claude, and generic plan-before-code flows.",
  {},
  async () => {
    const path = join(MCP_CONTENT_DIR, "PLAN_MODE_PATTERNS.md");
    const content = readFile(path);
    if (!content) {
      return {
        content: [{
          type: "text" as const,
          text: "PLAN_MODE_PATTERNS.md not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
        }],
      };
    }
    return { content: [{ type: "text" as const, text: content }] };
  }
);

// -- Tool: getAgentIntegrationGuide ----------------------------------------

server.tool(
  "getAgentIntegrationGuide",
  "Returns tailored ForgeTrail bootstrap + primitive mappings for a specific agent host (Grok, Cursor, Claude, or generic).",
  {
    agent: z
      .enum(["grok", "claude", "cursor", "generic"])
      .optional()
      .default("generic")
      .describe("Agent host: grok | claude | cursor | generic"),
  },
  async ({ agent }) => {
    const specificPath = join(MCP_CONTENT_DIR, `AGENT_INTEGRATION_${agent}.md`);
    let content = readFile(specificPath);
    if (!content && agent !== "generic") {
      const genericPath = join(MCP_CONTENT_DIR, "AGENT_INTEGRATION_generic.md");
      content = readFile(genericPath);
      if (content) {
        content =
          `No dedicated guide for "${agent}" — showing generic guide. Call getAgentIntegrationGuide with grok, cursor, or claude when applicable.\n\n---\n\n` +
          content;
      }
    }
    if (!content) {
      return {
        content: [{
          type: "text" as const,
          text: `AGENT_INTEGRATION_${agent}.md not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.`,
        }],
      };
    }
    return { content: [{ type: "text" as const, text: content }] };
  }
);

// -- Tool: getForgeTrailSkill ------------------------------------------------

server.tool(
  "getForgeTrailSkill",
  "Returns the canonical forgetrail SKILL.md for skill-capable agents (Grok ~/.grok/skills/, etc.). Copy to the host skill directory for persistent ForgeTrail discipline.",
  {
    agent: z
      .string()
      .optional()
      .describe("Optional hint (grok | claude | cursor | generic) — currently returns the same canonical skill"),
  },
  async () => {
    const path = join(MCP_CONTENT_DIR, "skills", "forgetrail", "SKILL.md");
    const content = readFile(path);
    if (!content) {
      return {
        content: [{
          type: "text" as const,
          text: "skills/forgetrail/SKILL.md not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.",
        }],
      };
    }
    return {
      content: [{
        type: "text" as const,
        text:
          "ForgeTrail skill — copy to your agent's skill directory (e.g. ~/.grok/skills/forgetrail/SKILL.md). " +
          "For Cursor, prefer getNewProjectKickoff Cursor rules unless you use global skills.\n\n" +
          content,
      }],
    };
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

/** Hints for humans (stderr only — stdout is reserved for MCP JSON-RPC). */
function printStartupHintsToStderr(): void {
  const quiet = process.env.FORGETRAIL_QUIET;
  if (quiet === "1" || quiet === "true") return;

  const lines = [
    "",
    "[ForgeTrail MCP] Server listening on stdio (JSON-RPC on stdout). Content root:",
    `  FORGETRAIL_ROOT=${FORGETRAIL_ROOT}`,
    "",
    "Cursor starts this process when MCP is configured — you do not run a separate server.",
    "Client setup JSON: forgetrail mcp build  or  forgetrail mcp cursor-config",
    "",
    "Tell your agent — new project (easiest):",
    '  "Call ForgeTrail getNewProjectKickoff or kickoffGreenfield, then set up the project per that bundle."',
    "  (Granular: getNewProjectBootstrap + getInitialWorkflowTracking + getPostBootstrapUserMessage + getForgeTrailCursorPhaseRule + getForgeTrailCursorLessonsRules.)",
    "",
    "Tell your agent — resume a session:",
    '  "Call ForgeTrail getResumeSessionInstructions and continue using .forgetrail/workflow_tracking.json."',
    "",
    "Other useful tool calls:",
    "  getForgeTrailCursorPhaseRule (Cursor: phase status rule for new projects)",
    "  getForgeTrailCursorLessonsRules (Cursor: lessons gate + MCP reminder rules)",
    "  getScaffoldInstallParams (Phase 2: PocketBase scripted install defaults)",
    "  getGenesisSpecPrompt (pre-Phase-1: copy-paste prompt for an external LLM chat to draft a GENESIS.md build spec)",
    "  getGreenfieldIntakePrompt (Phase 1: exports, tenancy, hybrid spec, hero flow, hosting)",
    '  getPhaseGuidance (phase "1"–"7" or e.g. "scaffolding")',
    "  getCompanionSuggestions (phase or situation: optional sibling tools)",
    '  getTemplate with name "list", then a template name (e.g. PHASE_1_BRIEF)',
    '  searchLessons with a keyword',
    "  validateTracking (check .forgetrail/workflow_tracking.json health)",
    "  suggestSubagentDecomposition (parallel audits/research for spawn_subagent hosts)",
    "  ingestPlanArtifact (approved plan → PHASE_1_BRIEF + decisions[])",
    "  getPlanModePatterns (native plan mode as Phase 1)",
    "  getAgentIntegrationGuide (grok | cursor | claude | generic)",
    "  getForgeTrailSkill (installable skill definition)",
    "",
    "Suppress this banner: FORGETRAIL_QUIET=1",
    "",
  ];
  console.error(lines.join("\n"));
}

printStartupHintsToStderr();

const transport = new StdioServerTransport();
await server.connect(transport);
