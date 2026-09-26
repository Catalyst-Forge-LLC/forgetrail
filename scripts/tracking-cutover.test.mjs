import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import { validateTrackingData } from "../content/hooks/validate-tracking-core.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("a pointer is not a second decision log", () => {
  const result = validateTrackingData({
    record: "appledger/",
    status: "pointer",
    note: "Decisions live in appledger/.",
  });
  assert.equal(result.issues.length, 0);
  assert.match(result.warnings.join("\n"), /pointer to appledger/);
});

test("a legacy tracking document is a conflict", () => {
  const result = validateTrackingData({
    project: { name: "Notes", description: "Find notes" },
    currentPhase: "4-feature-iteration",
    phases: { "4-feature-iteration": { status: "in_progress", exitCriteriaRemaining: ["Edge cases"] } },
    decisions: [{ decision: "Use local files" }],
    sessions: [],
  });
  assert.match(result.issues.join("\n"), /not the system of record/);
  assert.match(result.issues.join("\n"), /appledger migrate preview/);
});

test("install does not create workflow_tracking.json", () => {
  for (const args of [
    ["install", "--lite", "--dry-run"],
    ["install", "--dry-run"],
  ]) {
    const dir = mkdtempSync(join(tmpdir(), "ft-cutover-"));
    const result = spawnSync(process.execPath, ["scripts/forgetrail-cli.mjs", ...args, "--path", dir], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.doesNotMatch(result.stdout, /\\workflow_tracking\.json/);
    assert.match(result.stdout, /Project record: appledger/);
  }
});

test("session start warns on a legacy file and does not quote it as the live phase", () => {
  const dir = mkdtempSync(join(tmpdir(), "ft-session-"));
  mkdirSync(join(dir, ".forgetrail"), { recursive: true });
  writeFileSync(
    join(dir, ".forgetrail", "workflow_tracking.json"),
    JSON.stringify({
      project: { name: "Notes" },
      currentPhase: "4-feature-iteration",
      phases: {},
      decisions: [{ decision: "Keep the old log" }],
    })
  );
  const result = spawnSync(process.execPath, [join(root, "content", "hooks", "session-start.mjs")], {
    cwd: dir,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.match(payload.additional_context, /not the system of record/);
  assert.doesNotMatch(payload.additional_context, /Current Phase: 4-feature-iteration/);
});
