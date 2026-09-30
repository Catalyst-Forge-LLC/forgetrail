#!/usr/bin/env node
/**
 * Reference dev launcher — copy to app repo scripts/forgetrail-dev-launcher.mjs
 * Wire repo-root setup.bat / run.bat / status.bat (Windows) and setup.sh / run.sh / status.sh (Mac/Linux).
 *
 * Commands: setup | run | status
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const trackingPath = join(repoRoot, ".forgetrail", "workflow_tracking.json");
const isWin = process.platform === "win32";

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
  if (!existsSync(trackingPath)) return 'Phase state: appledger/profiles/forgetrail.yaml.';
  try {
    const tracking = JSON.parse(readFileSync(trackingPath, 'utf8'));
    if (tracking.status === 'pointer') return 'Project state: appledger/profiles/forgetrail.yaml.';
  } catch {}
  return 'Legacy tracking conflict. Preserve the file. Current migration is retired; use historical recovery in an isolated copy. Project state belongs in appledger/.';
}

function cmdStatus() {
  console.log(renderProgress());
}

const cmd = process.argv[2];
if (cmd === "setup") cmdSetup().catch((e) => { console.error(e.message || e); process.exit(1); });
else if (cmd === "run") cmdRun().catch((e) => { console.error(e.message || e); process.exit(1); });
else if (cmd === "status") cmdStatus();
else {
  console.log("Usage: node scripts/forgetrail-dev-launcher.mjs setup|run|status");
  process.exit(1);
}
