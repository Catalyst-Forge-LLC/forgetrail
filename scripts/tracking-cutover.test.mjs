import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, utimesSync, chmodSync } from "node:fs";
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
  assert.match(result.issues.join("\n"), /Legacy migration is retired/);
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
    assert.match(result.stdout, /pnpm dlx appledger init --name/);
    assert.match(result.stdout, /pnpm dlx appledger check/);
  }
});

test("Lite step 4 runs appledger init and check", () => {
  const lite = readFileSync(join(root, "content", "FORGETRAIL_LITE.md"), "utf8");
  const step = lite.split("\n").find((line) => line.startsWith("4. **Create `appledger/`**"));
  assert.ok(step);
  assert.match(step, /pnpm dlx appledger init --name/);
  assert.match(step, /appledger check/);
  assert.match(step, /examples\/minimal\/appledger/);
});

test("cursor-config from an npm install starts forgetrail-mcp, not a missing dist file", async () => {
  const { mcpClientConfigObject, isTemporaryInstall } = await import("./mcp-lib.mjs");
  const server = mcpClientConfigObject().mcpServers.forgetrail;
  const hasDist = spawnSync(process.execPath, ["-e", "process.exit(require('node:fs').existsSync(process.argv[1]) ? 0 : 1)", join(root, "mcp-server", "dist", "index.js")]).status === 0;
  if (hasDist) {
    assert.equal(server.command, "node");
  } else {
    assert.deepEqual([server.command, ...server.args], ["npx", "-y", "forgetrail-mcp"]);
  }
  assert.equal(isTemporaryInstall("C:/Users/u/AppData/Local/pnpm-cache/dlx/abc/node_modules/forgetrail"), true);
  assert.equal(isTemporaryInstall("/home/u/.npm/_npx/abc/node_modules/forgetrail"), true);
  assert.equal(isTemporaryInstall("C:/Users/u/AppData/Local/pnpm/global/5/node_modules/forgetrail"), false);
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

function stubAppledger(dir, line) {
  const stub = join(dir, "bin");
  mkdirSync(stub, { recursive: true });
  if (process.platform === "win32") {
    writeFileSync(join(stub, "appledger.cmd"), `@echo off\r\necho ${line}\r\n`);
  } else {
    const file = join(stub, "appledger");
    writeFileSync(file, `#!/bin/sh\necho ${line}\n`);
    chmodSync(file, 0o755);
  }
  const system = process.env.SystemRoot ? `${process.env.SystemRoot}\\System32` : "/usr/bin";
  const sep = process.platform === "win32" ? ";" : ":";
  return { PATH: [stub, system, process.env.PATH].filter(Boolean).join(sep) };
}

function runHook(script, dir, { input, env } = {}) {
  return spawnSync(process.execPath, [join(root, "content", "hooks", script)], {
    cwd: dir,
    input,
    encoding: "utf8",
    env: env ? { ...process.env, ...env } : process.env,
  });
}

test("session start includes orient when appledger is on PATH", () => {
  const dir = mkdtempSync(join(tmpdir(), "ft-orient-"));
  mkdirSync(join(dir, "appledger"), { recursive: true });
  writeFileSync(join(dir, "appledger", "manifest.yaml"), "format: appledger\n");
  const result = runHook("session-start.mjs", dir, { env: stubAppledger(dir, "STUB-ORIENT") });
  assert.equal(result.status, 0, result.stderr);
  assert.match(JSON.parse(result.stdout).additional_context, /STUB-ORIENT/);
});

test("session start keeps the ledger text when appledger is absent", () => {
  const dir = mkdtempSync(join(tmpdir(), "ft-noap-"));
  mkdirSync(join(dir, "appledger"), { recursive: true });
  writeFileSync(join(dir, "appledger", "manifest.yaml"), "format: appledger\n");
  const system = process.env.SystemRoot ? `${process.env.SystemRoot}\\System32` : "/usr/bin";
  const result = runHook("session-start.mjs", dir, { env: { PATH: system } });
  assert.equal(result.status, 0, result.stderr);
  const text = JSON.parse(result.stdout).additional_context;
  assert.match(text, /Project record: appledger/);
  assert.doesNotMatch(text, /STUB-ORIENT/);
});

test("an edit under appledger/ runs check and reports a warning", () => {
  const dir = mkdtempSync(join(tmpdir(), "ft-check-"));
  mkdirSync(join(dir, "appledger"), { recursive: true });
  const manifest = join(dir, "appledger", "manifest.yaml");
  writeFileSync(manifest, "format: appledger\n");
  const warned = runHook("validate-tracking.mjs", dir, {
    input: JSON.stringify({ path: manifest }),
    env: stubAppledger(dir, "warning missing_source example"),
  });
  assert.equal(warned.status, 0, warned.stderr);
  assert.match(JSON.parse(warned.stdout).additional_context, /warning missing_source example/);
  const clean = runHook("validate-tracking.mjs", dir, {
    input: JSON.stringify({ path: manifest }),
    env: stubAppledger(join(dir, "clean"), "ok ledger"),
  });
  assert.equal(clean.status, 0, clean.stderr);
  assert.deepEqual(JSON.parse(clean.stdout), {});
});

test("Lite and workflow instructions name the ledger", () => {
  const lite = readFileSync(join(root, "content", "FORGETRAIL_LITE.md"), "utf8");
  const legacyAt = lite.indexOf("## 11. AppLedger record");
  const resumeAt = lite.indexOf("## 12. `AGENTS.md`");
  assert.ok(legacyAt > 0 && resumeAt > legacyAt);
  const instructional = `${lite.slice(0, legacyAt)}\n${lite.slice(resumeAt)}`;
  assert.doesNotMatch(lite, /"schemaVersion": "lite-1"/);
  assert.match(instructional, /ForgeTrail Lite v2\.2\.2/);
  for (const line of instructional.split("\n")) {
    if (!line.includes("workflow_tracking.json")) continue;
    assert.match(line, /legacy/, line);
  }
  const workflow = readFileSync(join(root, "WORKFLOW.md"), "utf8");
  assert.match(workflow, /not_applicable/);
  assert.match(workflow, /data\.companion_outcomes/);
  assert.doesNotMatch(workflow, /Where this file names that JSON/);
  for (const line of workflow.split("\n")) {
    if (!line.includes("workflow_tracking.json")) continue;
    assert.match(line, /legacy/, line);
  }
});

test("fresh-project instructions do not name the tracking file", () => {
  const files = [
    "INITIAL_PROMPT.md",
    "CONTINUATION_PROMPT.md",
    "content/AGENT_INTEGRATION_claude.md",
    "content/AGENT_INTEGRATION_cursor.md",
    "content/AGENT_INTEGRATION_generic.md",
    "content/AGENT_INTEGRATION_grok.md",
    "content/COMPANION_TOOLS.md",
    "content/FORGETRAIL_PROGRESS.md",
    "content/GENESIS_SPEC_PROMPT.md",
    "content/GENESIS_STUB.md",
    "content/GREENFIELD_INTAKE.md",
    "content/KICKOFF_WITHOUT_MCP.md",
    "content/NEW_PROJECT_BOOTSTRAP.md",
    "content/PLAN_MODE_PATTERNS.md",
    "content/POCKETBASE_SCHEMA_SCRIPT.md",
    "content/POST_BOOTSTRAP_USER_MESSAGE.md",
    "content/SESSION_RESUME_MCP.md",
    "content/companion-tools.json",
    "content/cursor-rules/forgetrail-phase-status.mdc",
    "content/skills/forgetrail/SKILL.md",
    "docs/PHASE_1_BRIEF.md",
    "docs/SPEC_FEATURE_TEMPLATE.md",
  ];
  for (const file of files) {
    for (const line of readFileSync(join(root, file), "utf8").split("\n")) {
      if (!line.includes("workflow_tracking.json")) continue;
      assert.match(line, /legacy|exists|validateTracking/, `${file}: ${line}`);
    }
  }
});

function stopHook(dir, input) {
  const result = spawnSync(process.execPath, [join(root, "content", "hooks", "session-stop.mjs")], {
    cwd: dir,
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test("session stop reminds only after work newer than the session record", () => {
  const dir = mkdtempSync(join(tmpdir(), "ft-stop-"));
  mkdirSync(join(dir, "appledger", "records", "session"), { recursive: true });
  writeFileSync(join(dir, "appledger", "manifest.yaml"), "format: appledger\n");
  const session = join(dir, "appledger", "records", "session", "session-1.md");
  writeFileSync(session, "session\n");
  spawnSync("git", ["init", "-q"], { cwd: dir });
  const old = new Date(Date.now() - 60_000);
  utimesSync(session, old, old);
  assert.deepEqual(stopHook(dir, { status: "completed", loop_count: 0 }), {});
  writeFileSync(join(dir, "app.ts"), "export {};\n");
  const reminder = stopHook(dir, { status: "completed", loop_count: 0 });
  assert.match(reminder.followup_message, /session record/);
  assert.doesNotMatch(reminder.followup_message, /workflow_tracking/);
  assert.deepEqual(stopHook(dir, { status: "completed", loop_count: 1 }), {});
  writeFileSync(session, "session updated\n");
  assert.deepEqual(stopHook(dir, { status: "completed", loop_count: 0 }), {});
});

test("kickoff names appledger init and does not require the tracking file", () => {
  const kickoff = readFileSync(join(root, "mcp-server", "src", "index.ts"), "utf8");
  assert.match(kickoff, /z\.union\(\[z\.string\(\), z\.number\(\)\]\)/);
  assert.match(kickoff, /appledger init/);
  assert.doesNotMatch(kickoff, /no separate init command/);
  const plan = readFileSync(join(root, "content", "PLAN_MODE_PATTERNS.md"), "utf8");
  assert.match(plan, /decision record/);
  assert.doesNotMatch(plan, /decisions\[\]/);
  assert.doesNotMatch(plan, /workflow_tracking/);
  const genesis = readFileSync(join(root, "content", "GENESIS_STUB.md"), "utf8");
  assert.match(genesis, /appledger init/);
  assert.doesNotMatch(genesis, /Create `\.forgetrail\/workflow_tracking\.json`/);
  const intake = readFileSync(join(root, "content", "GREENFIELD_INTAKE.md"), "utf8");
  assert.doesNotMatch(intake, /tracking file/);
  assert.doesNotMatch(intake, /decisions\[\]/);
  assert.match(intake, /archetype/);
});
