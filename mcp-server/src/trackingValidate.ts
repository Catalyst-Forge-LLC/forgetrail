/** Structural validation for .forgetrail/workflow_tracking.json (MCP full + Lite shapes). */

const VALID_MCP_PHASES = [
  "1-architecture",
  "2-scaffolding",
  "3-stabilization",
  "4-feature-iteration",
  "5-refactoring",
  "6-strategic-review",
  "7-hardening",
] as const;

const VALID_LITE_PHASES = ["1", "2", "3", "4", "5", "6", "7"];

const VALID_GOTCHA_CATEGORIES = new Set([
  "environment",
  "integration",
  "data-model",
  "ui",
  "performance",
  "ai-output",
  "security",
  "tooling",
  "other",
]);

const VALID_DECISION_STATUS = new Set(["active", "superseded", "revisit"]);

const VALID_PHASE_STATUS = new Set([
  "not_started",
  "pending",
  "in_progress",
  "completed",
  "revisiting",
]);

export type TrackingValidationResult = {
  issues: string[];
  warnings: string[];
};

function isLiteSchema(data: Record<string, unknown>): boolean {
  return data.schemaVersion === "lite-1";
}

export function validateTrackingData(data: Record<string, unknown>): TrackingValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  const project = data.project as Record<string, unknown> | undefined;
  if (!project || typeof project !== "object") {
    issues.push("Missing top-level project object.");
  } else if (!project.name || typeof project.name !== "string" || !project.name.trim()) {
    issues.push("project.name is missing or empty.");
  }

  if (!data.currentPhase) {
    issues.push("Missing currentPhase.");
  }

  const lite = isLiteSchema(data);
  const currentPhase = data.currentPhase;

  if (currentPhase) {
    if (lite) {
      const phaseStr = String(currentPhase);
      if (!VALID_LITE_PHASES.includes(phaseStr)) {
        issues.push(
          `Lite schema currentPhase "${phaseStr}" is not a valid phase number (1–7).`
        );
      }
    } else if (
      typeof currentPhase === "string" &&
      !VALID_MCP_PHASES.includes(currentPhase as typeof VALID_MCP_PHASES[number])
    ) {
      issues.push(
        `currentPhase "${currentPhase}" is not a recognized MCP phase id (e.g. "1-architecture").`
      );
    }
  }

  const phases = data.phases;
  if (!phases || typeof phases !== "object") {
    issues.push("Missing phases object.");
    return { issues, warnings };
  }

  const phaseKeys = Object.keys(phases as Record<string, unknown>);
  if (phaseKeys.length === 0) {
    issues.push("No phases defined in tracking.");
  }

  if (!lite && currentPhase && typeof currentPhase === "string" && !phaseKeys.includes(currentPhase)) {
    issues.push(`currentPhase "${currentPhase}" is not a key in phases.`);
  }

  for (const [key, rawPhase] of Object.entries(phases as Record<string, unknown>)) {
    if (!rawPhase || typeof rawPhase !== "object") {
      issues.push(`phases["${key}"] is not an object.`);
      continue;
    }
    const phase = rawPhase as Record<string, unknown>;

    if (phase.status && !VALID_PHASE_STATUS.has(String(phase.status))) {
      warnings.push(
        `phases["${key}"].status "${phase.status}" is not a standard value (not_started | in_progress | completed | revisiting).`
      );
    }

    if (lite) {
      if (phase.exitCriteria !== undefined && typeof phase.exitCriteria !== "object") {
        issues.push(`phases["${key}"].exitCriteria should be an object of boolean flags (Lite schema).`);
      }
    } else {
      if (phase.exitCriteriaMet !== undefined && !Array.isArray(phase.exitCriteriaMet)) {
        issues.push(`phases["${key}"].exitCriteriaMet should be an array.`);
      }
      if (phase.exitCriteriaRemaining !== undefined && !Array.isArray(phase.exitCriteriaRemaining)) {
        issues.push(`phases["${key}"].exitCriteriaRemaining should be an array.`);
      }
      const met = (phase.exitCriteriaMet as string[] | undefined) ?? [];
      const remaining = (phase.exitCriteriaRemaining as string[] | undefined) ?? [];
      const overlap = met.filter((item) => remaining.includes(item));
      if (overlap.length > 0) {
        warnings.push(
          `phases["${key}"] has exit criteria in both Met and Remaining: ${overlap.slice(0, 3).join("; ")}${overlap.length > 3 ? "…" : ""}`
        );
      }
    }

    const subagentRuns = phase.subagentRuns;
    if (subagentRuns !== undefined && !Array.isArray(subagentRuns)) {
      issues.push(`phases["${key}"].subagentRuns should be an array when present.`);
    }
  }

  const decisions = data.decisions;
  if (decisions !== undefined) {
    if (!Array.isArray(decisions)) {
      issues.push("decisions should be an array.");
    } else {
      const seenIds = new Set<string>();
      for (let i = 0; i < decisions.length; i++) {
        const d = decisions[i] as Record<string, unknown>;
        if (!d || typeof d !== "object") {
          issues.push(`decisions[${i}] is not an object.`);
          continue;
        }
        if (!d.decision || typeof d.decision !== "string") {
          issues.push(`decisions[${i}] missing decision text.`);
        }
        if (!d.rationale || typeof d.rationale !== "string") {
          warnings.push(`decisions[${i}] missing rationale (recommended for Phase 1 handoff).`);
        }
        if (d.id && typeof d.id === "string") {
          if (seenIds.has(d.id)) {
            issues.push(`Duplicate decisions id "${d.id}".`);
          }
          seenIds.add(d.id);
        }
        if (d.status && !VALID_DECISION_STATUS.has(String(d.status))) {
          warnings.push(`decisions[${i}].status "${d.status}" is not standard (active | superseded | revisit).`);
        }
        if (
          d.alternatives_considered !== undefined &&
          !Array.isArray(d.alternatives_considered)
        ) {
          warnings.push(`decisions[${i}].alternatives_considered should be an array when present.`);
        }
      }
    }
  }

  const gotchas = data.gotchas;
  if (gotchas !== undefined) {
    if (!Array.isArray(gotchas)) {
      issues.push("gotchas should be an array.");
    } else {
      for (let i = 0; i < gotchas.length; i++) {
        const g = gotchas[i] as Record<string, unknown>;
        if (!g || typeof g !== "object") {
          issues.push(`gotchas[${i}] is not an object.`);
          continue;
        }
        if (!g.issue || typeof g.issue !== "string") {
          warnings.push(`gotchas[${i}] missing issue description.`);
        }
        if (!g.resolution || typeof g.resolution !== "string") {
          warnings.push(`gotchas[${i}] missing resolution.`);
        }
        if (g.category && !VALID_GOTCHA_CATEGORIES.has(String(g.category))) {
          warnings.push(
            `gotchas[${i}].category "${g.category}" is not a standard category (environment, integration, …).`
          );
        }
      }
    }
  }

  const sessions = data.sessions;
  if (sessions !== undefined && !Array.isArray(sessions)) {
    issues.push("sessions should be an array when present.");
  }

  const agentContext = data.agentContext;
  if (agentContext !== undefined) {
    if (typeof agentContext !== "object") {
      issues.push("agentContext should be an object when present.");
    } else {
      const ac = agentContext as Record<string, unknown>;
      if (ac.supportsSubagents !== undefined && typeof ac.supportsSubagents !== "boolean") {
        warnings.push("agentContext.supportsSubagents should be a boolean when present.");
      }
      if (ac.supportsPlanMode !== undefined && typeof ac.supportsPlanMode !== "boolean") {
        warnings.push("agentContext.supportsPlanMode should be a boolean when present.");
      }
    }
  }

  return { issues, warnings };
}

export function formatValidationResult(result: TrackingValidationResult): string {
  const { issues, warnings } = result;

  if (issues.length === 0 && warnings.length === 0) {
    return (
      "Tracking file looks structurally healthy.\n\n" +
      "Recommended next steps:\n" +
      "- Confirm exit criteria are being actively moved from Remaining → Met.\n" +
      "- Ensure major decisions have rationale + alternatives_considered.\n" +
      "- Add gotchas when surprises occur.\n" +
      "- Call validateTracking after substantive session work.\n\n" +
      "Call getTrackingSchema for the full expected shape."
    );
  }

  const parts: string[] = [];

  if (issues.length > 0) {
    parts.push("Issues (fix these):\n" + issues.map((i) => `- ${i}`).join("\n"));
  }
  if (warnings.length > 0) {
    parts.push("Warnings (recommended fixes):\n" + warnings.map((w) => `- ${w}`).join("\n"));
  }

  parts.push(
    "Suggested actions:\n" +
      "- Use getTrackingSchema() for the canonical shape.\n" +
      "- Populate decisions[] with rationale when locking Phase 1.\n" +
      "- Keep exitCriteriaMet/Remaining in sync with actual progress."
  );

  return parts.join("\n\n");
}
