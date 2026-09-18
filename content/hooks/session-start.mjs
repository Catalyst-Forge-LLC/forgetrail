#!/usr/bin/env node

/**
 * ForgeTrail Session Start Context Injector
 * Hook event: sessionStart (Cursor)
 * Injects live ForgeTrail phase status and open exit criteria into session context.
 * Retires static phase-status rules on hosts with hook support.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

function findTrackingFile(startDir) {
  let curr = resolve(startDir || process.cwd());
  for (let i = 0; i < 6; i++) {
    const candidate1 = join(curr, ".forgetrail", "workflow_tracking.json");
    if (existsSync(candidate1)) return candidate1;
    const candidate2 = join(curr, "workflow_tracking.json");
    if (existsSync(candidate2)) return candidate2;
    const parent = resolve(curr, "..");
    if (parent === curr) break;
    curr = parent;
  }
  return null;
}

function main() {
  const trackingPath = findTrackingFile(process.cwd());

  if (!trackingPath) {
    console.log(JSON.stringify({}));
    return;
  }

  try {
    const tracking = JSON.parse(readFileSync(trackingPath, "utf-8"));
    const projectName = tracking.project?.name || "App";
    const phase = tracking.currentPhase || "1";
    const isLite = tracking.schemaVersion === "lite-1";

    let remaining = [];
    if (isLite) {
      const phaseObj = tracking.phases?.[String(phase)];
      if (phaseObj?.exitCriteria) {
        remaining = Object.entries(phaseObj.exitCriteria)
          .filter(([_, met]) => !met)
          .map(([flag]) => flag);
      }
    } else {
      const phaseObj = tracking.phases?.[phase];
      if (Array.isArray(phaseObj?.exitCriteriaRemaining)) {
        remaining = phaseObj.exitCriteriaRemaining;
      }
    }

    let lastLeftOff = "";
    if (Array.isArray(tracking.sessions) && tracking.sessions.length > 0) {
      const lastSession = tracking.sessions[tracking.sessions.length - 1];
      lastLeftOff = lastSession.leftOff || lastSession.notes || "";
    }

    const lines = [
      `=== ForgeTrail Context (${projectName}) ===`,
      `Current Phase: ${phase} (${isLite ? "Lite schema" : "MCP schema"})`,
    ];

    if (lastLeftOff) {
      lines.push(`Last Session Left Off: ${lastLeftOff}`);
    }

    if (remaining.length > 0) {
      lines.push("Open Exit Criteria for Current Phase:");
      for (const item of remaining.slice(0, 5)) {
        lines.push(`  - ${item}`);
      }
      if (remaining.length > 5) {
        lines.push(`  ...and ${remaining.length - 5} more`);
      }
    }

    lines.push("========================================");

    console.log(
      JSON.stringify({
        additional_context: lines.join("\n"),
      })
    );
  } catch {
    console.log(JSON.stringify({}));
  }
}

main();
