#!/usr/bin/env node

/**
 * ForgeTrail Workspace Index
 * Scans directories across a workspace and emits a cross-repo status table.
 * Reports: repo, phase, archetype, last session, open exit criteria, and hooks status.
 */

import { readdirSync, existsSync, readFileSync, statSync } from "node:fs";
import { resolve, join, basename } from "node:path";

function findTracking(dir) {
  const p1 = join(dir, ".forgetrail", "workflow_tracking.json");
  if (existsSync(p1)) return p1;
  const p2 = join(dir, "workflow_tracking.json");
  if (existsSync(p2)) return p2;
  return null;
}

function hasHooks(dir) {
  const cursorHooks = existsSync(join(dir, ".cursor", "hooks.json"));
  const forgetrailHooks = existsSync(join(dir, ".forgetrail", "hooks", "guard-shell.mjs"));
  if (cursorHooks && forgetrailHooks) return "installed";
  if (cursorHooks || forgetrailHooks) return "partial";
  return "none";
}

function scanWorkspace(workspaceRoot) {
  const entries = readdirSync(workspaceRoot);
  const rows = [];

  for (const entry of entries) {
    if (entry.startsWith(".") || entry.startsWith("__")) continue;
    const fullPath = join(workspaceRoot, entry);
    try {
      if (!statSync(fullPath).isDirectory()) continue;
    } catch {
      continue;
    }

    const trackingPath = findTracking(fullPath);
    const hooksStatus = hasHooks(fullPath);

    if (!trackingPath && hooksStatus === "none") {
      continue;
    }

    let projectName = entry;
    let phase = "-";
    let archetype = "product";
    let lastSession = "-";
    let openCriteriaCount = 0;

    if (trackingPath) {
      try {
        const tracking = JSON.parse(readFileSync(trackingPath, "utf-8"));
        projectName = tracking.project?.name || entry;
        phase = String(tracking.currentPhase || "-");
        archetype = tracking.project?.archetype || "product";

        if (Array.isArray(tracking.sessions) && tracking.sessions.length > 0) {
          const s = tracking.sessions[tracking.sessions.length - 1];
          const date = s.date || s.timestamp?.slice(0, 10) || "";
          const note = s.leftOff ? ` (${s.leftOff.slice(0, 30)}...)` : "";
          lastSession = date ? `${date}${note}` : "-";
        }

        const isLite = tracking.schemaVersion === "lite-1";
        if (isLite) {
          const pObj = tracking.phases?.[phase];
          if (pObj?.exitCriteria) {
            openCriteriaCount = Object.values(pObj.exitCriteria).filter((v) => !v).length;
          }
        } else {
          const pObj = tracking.phases?.[phase];
          if (Array.isArray(pObj?.exitCriteriaRemaining)) {
            openCriteriaCount = pObj.exitCriteriaRemaining.length;
          }
        }
      } catch {}
    }

    rows.push({
      repo: entry,
      name: projectName,
      phase,
      archetype,
      openCriteriaCount,
      lastSession,
      hooks: hooksStatus,
    });
  }

  return rows;
}

function main() {
  const argv = process.argv.slice(2);
  const jsonMode = argv.includes("--json");
  const filtered = argv.filter((a) => a !== "workspace" && a !== "index" && !a.startsWith("-"));
  const workspaceArg = filtered[0] || resolve(process.cwd(), "..");
  const workspaceRoot = resolve(workspaceArg);

  const rows = scanWorkspace(workspaceRoot);

  if (jsonMode) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }

  console.log(`\n# ForgeTrail Workspace Index (${workspaceRoot})\n`);
  if (rows.length === 0) {
    console.log("No ForgeTrail repositories found.");
    return;
  }

  console.log("| Repo | Project Name | Phase | Archetype | Open Criteria | Last Session | Hooks |");
  console.log("|---|---|---|---|---|---|---|");

  for (const r of rows) {
    console.log(
      `| \`${r.repo}\` | ${r.name} | ${r.phase} | ${r.archetype} | ${r.openCriteriaCount} | ${r.lastSession} | ${r.hooks} |`
    );
  }
  console.log(`\nTotal tracked projects: ${rows.length}\n`);
}

main();
