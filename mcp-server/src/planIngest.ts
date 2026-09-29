/**
 * Rule-based mapping from native plan artifacts (plan.md, etc.) to
 * PHASE_1_BRIEF.md sections and appledger decision records.
 */

export type TrackingDecision = {
  id: string;
  timestamp: string;
  phase: "1-architecture";
  decision: string;
  rationale: string;
  alternatives_considered: string[];
  status: "active";
};

export type PlanIngestResult = {
  briefMarkdown: string;
  trackingDecisions: TrackingDecision[];
  instructions: string;
  sectionMapping: Record<string, string>;
  warnings: string[];
};

type BriefSectionKey =
  | "1-problem"
  | "2-users"
  | "3-constraints"
  | "4-stack"
  | "5-data"
  | "6-integrations"
  | "6a-content"
  | "7-risks"
  | "8-decisions"
  | "9-open"
  | "10-out-of-scope"
  | "11-features"
  | "unmapped";

const BRIEF_SECTION_HEADINGS: Record<BriefSectionKey, string> = {
  "1-problem": "## 1. Problem and outcome",
  "2-users": "## 2. Users and hero flow",
  "3-constraints": "## 3. Constraints",
  "4-stack": "## 4. Stack and tooling",
  "5-data": "## 5. Data model (sketch)",
  "6-integrations": "## 6. Integrations and external systems",
  "6a-content": "## 6a. Content-generation pattern",
  "7-risks": "## 7. Hardest problems and risks",
  "8-decisions": "## 8. Architectural decisions (numbered)",
  "9-open": "## 9. Open questions",
  "10-out-of-scope": "## 10. Explicitly out of scope (v1)",
  "11-features": "## 11. First feature batch",
  "unmapped": "",
};

const PLAN_KEYWORD_RULES: { key: BriefSectionKey; keywords: string[] }[] = [
  { key: "1-problem", keywords: ["problem", "outcome", "goal", "vision", "summary", "overview", "what we are building", "done looks"] },
  { key: "2-users", keywords: ["user", "hero", "workflow", "audience", "persona", "journey"] },
  { key: "3-constraints", keywords: ["constraint", "requirement", "non-goal", "assumption", "boundary"] },
  { key: "4-stack", keywords: ["stack", "framework", "tooling", "technology", "architecture overview", "folder structure", "tech"] },
  { key: "5-data", keywords: ["data model", "entity", "schema", "database", "migration", "storage", "file format", "data format", "domain concept", "domain model", "serialization", "background"] },
  { key: "6-integrations", keywords: ["integration", "api", "external", "payment", "email", "webhook", "third party"] },
  { key: "6a-content", keywords: ["content generation", "llm", "ollama", "openai", "seed", "byo"] },
  { key: "7-risks", keywords: ["risk", "hardest", "challenge", "mitigation", "pitfall", "edge case"] },
  { key: "8-decisions", keywords: ["decision", "architectural", "chosen", "rationale", "alternative"] },
  { key: "9-open", keywords: ["open question", "unresolved", "defer", "todo", "unknown"] },
  { key: "10-out-of-scope", keywords: ["out of scope", "not in v1", "defer to v2", "won't", "wont", "non-goal"] },
  { key: "11-features", keywords: ["feature", "first batch", "milestone", "roadmap", "v1 scope", "backlog", "functional requirement"] },
];

function normalizeHeading(heading: string): string {
  return heading.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

/** Split plan markdown into sections by # / ## headings. */
export function extractPlanSections(planContent: string): Map<string, string> {
  const sections = new Map<string, string>();
  const lines = planContent.split("\n");
  let currentHeading = "introduction";
  let buffer: string[] = [];

  const flush = () => {
    const body = buffer.join("\n").trim();
    if (body) {
      const existing = sections.get(currentHeading) ?? "";
      sections.set(currentHeading, existing ? `${existing}\n\n${body}` : body);
    }
    buffer = [];
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h1 = line.match(/^#\s+(.+)$/);
    if (h2 || h1) {
      flush();
      currentHeading = normalizeHeading(h2?.[1] ?? h1?.[1] ?? currentHeading);
    } else {
      buffer.push(line);
    }
  }
  flush();

  if (sections.size === 0 && planContent.trim()) {
    sections.set("introduction", planContent.trim());
  }

  return sections;
}

function scoreHeadingForBrief(heading: string): BriefSectionKey {
  const norm = normalizeHeading(heading);
  let best: BriefSectionKey = "unmapped";
  let bestScore = 0;

  for (const rule of PLAN_KEYWORD_RULES) {
    for (const kw of rule.keywords) {
      // Normalize keywords the same way headings are normalized (strips
      // punctuation like hyphens/apostrophes to spaces) so e.g. "non-goal"
      // still matches a heading's normalized "non goal".
      const normKw = normalizeHeading(kw);
      if (normKw && norm.includes(normKw)) {
        const score = normKw.length;
        if (score > bestScore) {
          bestScore = score;
          best = rule.key;
        }
      }
    }
  }

  return bestScore > 0 ? best : "unmapped";
}

function mapPlanSectionsToBrief(planSections: Map<string, string>): Record<BriefSectionKey, string[]> {
  const mapped: Record<BriefSectionKey, string[]> = {
    "1-problem": [],
    "2-users": [],
    "3-constraints": [],
    "4-stack": [],
    "5-data": [],
    "6-integrations": [],
    "6a-content": [],
    "7-risks": [],
    "8-decisions": [],
    "9-open": [],
    "10-out-of-scope": [],
    "11-features": [],
    unmapped: [],
  };

  for (const [heading, body] of planSections.entries()) {
    const key = scoreHeadingForBrief(heading);
    mapped[key].push(body);
  }

  return mapped;
}

function extractDecisionsFromText(text: string, timestamp: string): TrackingDecision[] {
  const decisions: TrackingDecision[] = [];
  const seen = new Set<string>();

  const numbered = text.matchAll(
    /(?:^|\n)\s*\*{0,2}D(\d+)\.{0,2}\*{0,2}\s*([\s\S]*?)(?=\n\s*\*{0,2}D\d+\.|$)/gi
  );
  for (const m of numbered) {
    const num = m[1];
    const body = m[2].trim().replace(/\n+/g, " ").trim();
    if (!body || seen.has(`d${num}`)) continue;
    seen.add(`d${num}`);
    const { decision, rationale, alternatives } = splitDecisionBody(body);
    decisions.push({
      id: `d${num}`,
      timestamp,
      phase: "1-architecture",
      decision,
      rationale,
      alternatives_considered: alternatives,
      status: "active",
    });
  }

  const bulletDecisions = text.matchAll(
    /(?:^|\n)\s*[-*]\s*\*{0,2}(?:Decision|Choose|Chose|Selected)\*{0,2}[:\s]+([^\n]+)(?:\n\s*[-*]\s*\*{0,2}(?:Rationale|Why|Reason)\*{0,2}[:\s]+([^\n]+))?/gi
  );
  let autoId = 1;
  for (const m of bulletDecisions) {
    const id = `d-auto${autoId}`;
    if (seen.has(id)) continue;
    seen.add(id);
    decisions.push({
      id,
      timestamp,
      phase: "1-architecture",
      decision: m[1].trim(),
      rationale: (m[2]?.trim() ?? "Captured from approved plan artifact."),
      alternatives_considered: [],
      status: "active",
    });
    autoId++;
  }

  return decisions;
}

function splitDecisionBody(body: string): {
  decision: string;
  rationale: string;
  alternatives: string[];
} {
  const rationaleMatch = body.match(/\b(?:rationale|why|reason)\s*[:\-]\s*(.+)/i);
  const altMatch = body.match(/\b(?:alternatives?|rejected|considered)\s*[:\-]\s*(.+)/i);

  let decision = body;
  let rationale = "Captured from approved plan artifact.";
  let alternatives: string[] = [];

  if (rationaleMatch) {
    decision = body.slice(0, rationaleMatch.index).trim().replace(/[.\s]+$/, "");
    rationale = rationaleMatch[1].trim();
  }
  if (altMatch) {
    alternatives = altMatch[1]
      .split(/[,;]|\band\b/i)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (!decision) decision = body.slice(0, 200);

  return { decision, rationale, alternatives };
}

function injectAfterHeading(markdown: string, heading: string, injection: string): string {
  const idx = markdown.indexOf(heading);
  if (idx === -1) return markdown;

  const afterHeading = idx + heading.length;
  const rest = markdown.slice(afterHeading);
  const nextSection = rest.search(/\n##\s+/);
  const insertAt = nextSection === -1 ? markdown.length : afterHeading + nextSection;

  const block = `\n\n_From approved plan artifact — review and edit:_\n\n${injection.trim()}\n`;
  return markdown.slice(0, insertAt) + block + markdown.slice(insertAt);
}

function buildBriefMarkdown(
  templateShell: string,
  mapped: Record<BriefSectionKey, string[]>,
  projectName?: string,
  existingBrief?: string
): string {
  let brief = (existingBrief?.trim() ? existingBrief : templateShell).trim();

  if (projectName) {
    brief = brief.replace(/\[App Name\]/g, projectName);
    if (brief.startsWith("# ")) {
      brief = brief.replace(/^#\s+.+$/m, `# ${projectName} — Phase 1 architecture brief`);
    }
  }

  brief = brief.replace(
    "**Status:** `[draft | locked]`",
    "**Status:** `draft` (mapped from approved plan — review and lock when accurate)"
  );
  brief = brief.replace(
    "**Last updated:** `[ISO date]`",
    `**Last updated:** ${new Date().toISOString().slice(0, 10)}`
  );

  for (const [key, chunks] of Object.entries(mapped) as [BriefSectionKey, string[]][]) {
    if (key === "unmapped" || chunks.length === 0) continue;
    const heading = BRIEF_SECTION_HEADINGS[key];
    if (!heading) continue;
    brief = injectAfterHeading(brief, heading, chunks.join("\n\n---\n\n"));
  }

  return brief;
}

export function ingestPlanArtifact(args: {
  planContent: string;
  projectName?: string;
  existingBrief?: string;
  briefTemplateShell: string;
}): PlanIngestResult {
  const warnings: string[] = [];
  const timestamp = new Date().toISOString();
  const planSections = extractPlanSections(args.planContent);
  const mapped = mapPlanSectionsToBrief(planSections);

  if (mapped.unmapped.length > 0) {
    warnings.push(
      "Some plan sections did not map cleanly to PHASE_1_BRIEF headings — review unmapped content in the brief footer."
    );
  }

  const decisionsFromPlan = extractDecisionsFromText(args.planContent, timestamp);
  const decisionsFromSection8 = extractDecisionsFromText(
    mapped["8-decisions"].join("\n"),
    timestamp
  );

  const decisionMap = new Map<string, TrackingDecision>();
  for (const d of [...decisionsFromPlan, ...decisionsFromSection8]) {
    decisionMap.set(d.id, d);
  }
  const trackingDecisions = [...decisionMap.values()];

  if (trackingDecisions.length === 0 && mapped["4-stack"].length > 0) {
    warnings.push(
      "No explicit D# decisions found — add appledger decision records manually for major stack commitments."
    );
  }

  let briefMarkdown = buildBriefMarkdown(
    args.briefTemplateShell,
    mapped,
    args.projectName,
    args.existingBrief
  );

  if (mapped.unmapped.length > 0) {
    briefMarkdown +=
      "\n\n---\n\n## Plan sections not auto-mapped\n\n" +
      mapped.unmapped.join("\n\n---\n\n");
  }

  const sectionMapping: Record<string, string> = {};
  for (const [heading] of planSections.entries()) {
    const key = scoreHeadingForBrief(heading);
    if (key !== "unmapped") {
      sectionMapping[heading] = BRIEF_SECTION_HEADINGS[key].replace("## ", "");
    } else {
      sectionMapping[heading] = "footer / manual review";
    }
  }

  const instructions =
    "1. Review `briefMarkdown` — edit every section; remove '_From approved plan artifact_' blocks after merging.\n" +
    "2. Write `docs/PHASE_1_BRIEF.md` and mark **locked** when accurate.\n" +
    "3. Write each `trackingDecisions` entry as an appledger decision record.\n" +
    "4. Record the sign-off on the plan phase in `appledger/profiles/forgetrail.yaml` or a session record. Run `appledger check` when the CLI is installed.\n" +
    "5. Phase 2: merge brief into CONTEXT_PROMPT per template handoff table.";

  return {
    briefMarkdown,
    trackingDecisions,
    instructions,
    sectionMapping,
    warnings,
  };
}
