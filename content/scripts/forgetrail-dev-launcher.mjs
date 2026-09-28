#!/usr/bin/env node
/**
 * Reference dev launcher — copy to app repo scripts/forgetrail-dev-launcher.mjs
 * Wire repo-root setup.bat / run.bat / status.bat (Windows) and setup.sh / run.sh / status.sh (Mac/Linux).
 *
 * Commands: setup | run | status
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const trackingPath = join(repoRoot, ".forgetrail", "workflow_tracking.json");
const progressPath = join(repoRoot, "docs", "FORGETRAIL_PROGRESS.md");
const isWin = process.platform === "win32";

const PHASE_LABELS = {
  // Display names — see TRACKING_SCHEMA.md "Phase ID vocabulary (Lite vs MCP)"
  "1": "Plan",
  "2": "Build",
  "3": "Stabilize",
  "4": "Iterate",
  "5": "Refine",
  "6": "Align",
  "7": "Harden",
  "1-architecture": "Plan",
  "2-scaffolding": "Build",
  "3-stabilization": "Stabilize",
  "4-feature-iteration": "Iterate",
  "5-refactoring": "Refine",
  "6-strategic-review": "Align",
  "7-hardening": "Harden",
};

/** Lite schema: exitCriteria { key: boolean }. MCP schema: exitCriteriaMet / exitCriteriaRemaining arrays. */
function getExitCriteriaStatus(phaseBlock) {
  if (!phaseBlock) return { met: [], remaining: [] };

  if (Array.isArray(phaseBlock.exitCriteriaMet) || Array.isArray(phaseBlock.exitCriteriaRemaining)) {
    return {
      met: Array.isArray(phaseBlock.exitCriteriaMet) ? phaseBlock.exitCriteriaMet : [],
      remaining: Array.isArray(phaseBlock.exitCriteriaRemaining) ? phaseBlock.exitCriteriaRemaining : [],
    };
  }

  const criteria = phaseBlock.exitCriteria;
  if (criteria && typeof criteria === "object" && !Array.isArray(criteria)) {
    const met = [];
    const remaining = [];
    for (const [key, value] of Object.entries(criteria)) {
      if (value) met.push(key);
      else remaining.push(key);
    }
    return { met, remaining };
  }

  return { met: [], remaining: [] };
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit", cwd: repoRoot, shell: isWin, ...opts });
    p.on("error", reject);
    p.on("exit", (c) => (c === 0 ? resolve() : reject(new Error(`${cmd} exited ${c}`))));
  });
}

function hasScript(name) {
  try {
    const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
    return Boolean(pkg.scripts?.[name]);
  } catch {
    return false;
  }
}

async function cmdSetup() {
  console.log("=== ForgeTrail setup (first time or refresh) ===\n");
  if (!existsSync(join(repoRoot, "node_modules"))) {
    console.log("Installing dependencies…");
    await run("pnpm", ["install"]);
  }
  if (hasScript("setup:pocketbase")) {
    await run("pnpm", ["run", "setup:pocketbase"]);
  } else if (existsSync(join(repoRoot, "scripts", "setup-pocketbase.mjs"))) {
    await run("node", ["scripts/setup-pocketbase.mjs"]);
  }
  if (hasScript("pocketbase:schema")) {
    console.log("\nApplying PocketBase schema (needs PocketBase running + .env admin creds)…");
    console.log("(If this fails, run setup again after starting PocketBase once.)\n");
    try {
      await run("pnpm", ["run", "pocketbase:schema"]);
    } catch {
      console.log("Schema step skipped or failed — you can run: pnpm run pocketbase:schema");
    }
  }
  if (hasScript("env:check")) await run("pnpm", ["run", "env:check"]);
  console.log("\nSetup pass complete. Next: double-click run.bat (or pnpm run dev).");
}

async function pbHealth() {
  const env = {};
  const envPath = join(repoRoot, ".env");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*PUBLIC_POCKETBASE_URL\s*=\s*(.+)/);
      if (m) {
        try {
          const u = new URL(m[1].trim());
          const res = await fetch(`${u.origin}/api/health`, { signal: AbortSignal.timeout(2000) });
          return res.ok;
        } catch {
          return false;
        }
      }
    }
  }
  return false;
}

async function cmdRun() {
  console.log("=== Starting dev environment ===\n");
  if (!(await pbHealth()) && hasScript("pocketbase")) {
    console.log("Starting PocketBase in the background…");
    const child = spawn("pnpm", ["run", "pocketbase"], {
      cwd: repoRoot,
      detached: true,
      stdio: "ignore",
      shell: isWin,
    });
    child.unref();
    await new Promise((r) => setTimeout(r, 2500));
  }
  if (!hasScript("dev")) {
    console.error("No pnpm run dev script — check README.md");
    process.exit(1);
  }
  console.log("Starting app (Ctrl+C to stop)…\n");
  await run("pnpm", ["run", "dev"]);
}

function renderProgress() {
  if (!existsSync(trackingPath)) {
    return {
      text: "Phase state: appledger/profiles/forgetrail.yaml.",
      md: null,
    };
  }
  const t = JSON.parse(readFileSync(trackingPath, "utf8"));
  const record = typeof t.record === "string" ? t.record.replaceAll("\\", "/") : "";
  if (t.status === "pointer" && record.includes("appledger")) {
    return {
      text: "workflow_tracking.json is a pointer to appledger/. Read appledger/profiles/forgetrail.yaml.",
      md: null,
    };
  }
  const phase = t.currentPhase ?? "?";
  const phaseId = String(phase);
  const phaseBlock = t.phases?.[phaseId];
  const label = PHASE_LABELS[phaseId] || phaseBlock?.name || `Phase ${phase}`;
  const status = phaseBlock?.status || "unknown";
  const { met, remaining } = getExitCriteriaStatus(phaseBlock);
  const lines = [
    `ForgeTrail phase: ${label} (${phaseId}) — ${status}`,
    "",
    met.length ? "Done (this phase):" : "",
    ...met.map((k) => `  ✓ ${k}`),
    met.length ? "" : "",
    remaining.length ? "Still open:" : "Exit criteria for this phase look complete (confirm before advancing):",
    ...remaining.map((k) => `  - ${k}`),
  ];
  if (t.sessions?.length) {
    const last = t.sessions[t.sessions.length - 1];
    lines.push("", `Last session: ${last.date} — ${last.summary || "(no summary)"}`);
  }
  const md = [
    "# ForgeTrail progress",
    "",
    "_Human-readable snapshot read from a legacy workflow_tracking.json. After migrate, the source of truth is `appledger/profiles/forgetrail.yaml`._",
    "",
    `**Current phase:** ${label} (\`${phaseId}\`) — **${status}**`,
    "",
    "## What's done (this phase)",
    "",
    ...(met.length ? met.map((k) => `- [x] ${k}`) : ["- _(none marked met yet)_"]),
    "",
    "## Still to do (this phase)",
    "",
    ...(remaining.length ? remaining.map((k) => `- [ ] ${k}`) : ["- _(none listed — verify before advancing)_"]),
    "",
    "## Refresh",
    "",
    "Double-click **status.bat** (Windows) or run **./status.sh** / **pnpm run forgetrail:status** anytime.",
    "",
  ].join("\n");
  return { text: lines.join("\n"), md };
}

function cmdStatus() {
  const { text, md } = renderProgress();
  console.log(text);
  if (md) {
    mkdirSync(join(repoRoot, "docs"), { recursive: true });
    writeFileSync(progressPath, md, "utf8");
    console.log(`\nWrote ${progressPath}`);
  }
}

const cmd = process.argv[2];
if (cmd === "setup") cmdSetup().catch((e) => { console.error(e.message || e); process.exit(1); });
else if (cmd === "run") cmdRun().catch((e) => { console.error(e.message || e); process.exit(1); });
else if (cmd === "status") cmdStatus();
else {
  console.log("Usage: node scripts/forgetrail-dev-launcher.mjs setup|run|status");
  process.exit(1);
}
