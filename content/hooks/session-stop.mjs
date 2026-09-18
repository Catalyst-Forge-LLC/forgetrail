#!/usr/bin/env node

/**
 * ForgeTrail Session Stop Check
 * Hook event: stop (Cursor)
 * Prompts a reminder if a session concluded without updating sessions[] in tracking.
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
    const sessions = tracking.sessions;

    const today = new Date().toISOString().slice(0, 10);
    const hasTodaySession =
      Array.isArray(sessions) &&
      sessions.some((s) => s.date === today || (s.timestamp && s.timestamp.startsWith(today)));

    if (!hasTodaySession) {
      console.log(
        JSON.stringify({
          followup_message:
            "ForgeTrail Reminder: Update .forgetrail/workflow_tracking.json (sessions[], decisions[], gotchas[]) with what was accomplished before ending.",
        })
      );
      return;
    }
  } catch {}

  console.log(JSON.stringify({}));
}

main();
