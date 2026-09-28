#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  MCP_SERVER_DIR,
  analyzeCursorMcpConfig,
  findCursorMcpJson,
  isClone,
  staticMcpChecks,
  printCursorConfigTemplate,
  runMcpBuild,
} from "./mcp-lib.mjs";

const HELP = `
ForgeTrail MCP — build, status, and Cursor setup helpers

Usage:
  forgetrail mcp build              Install deps + compile mcp-server/dist/
  forgetrail mcp status [--ping]    Static checks + optional live ping tool call
  forgetrail mcp ping               Live ping only (JSON)
  forgetrail mcp cursor-config      Print recommended .cursor/mcp.json
  forgetrail mcp dev                Run server on stdio (blocks; for debugging)
  forgetrail mcp inspector          Open MCP Inspector in browser

Note: Cursor starts the MCP server itself. You usually do not run \`mcp dev\`
for normal use — run \`mcp build\` once, then enable MCP in Cursor settings.
`.trim();

function runLivePing() {
  const pingScript = join(MCP_SERVER_DIR, "scripts", "mcp-ping.mjs");
  if (!existsSync(pingScript)) {
    console.error("Missing mcp-server/scripts/mcp-ping.mjs");
    process.exit(1);
  }
  const r = spawnSync(process.execPath, [pingScript], {
    cwd: MCP_SERVER_DIR,
    stdio: "inherit",
    env: process.env,
    shell: false,
  });
  process.exit(r.status ?? 1);
}

function runDev() {
  console.log("Starting ForgeTrail MCP on stdio (Ctrl+C to stop)...\n");
  const r = spawnSync("pnpm", ["run", "dev"], {
    cwd: MCP_SERVER_DIR,
    stdio: "inherit",
    shell: true,
  });
  process.exit(r.status ?? 0);
}

function runInspector() {
  if (!existsSync(join(MCP_SERVER_DIR, "dist", "index.js"))) {
    console.error("Build first: forgetrail mcp build");
    process.exit(1);
  }
  console.log("Opening MCP Inspector (browser)...\n");
  const r = spawnSync(
    "npx",
    ["@modelcontextprotocol/inspector", "node", "dist/index.js"],
    { cwd: MCP_SERVER_DIR, stdio: "inherit", shell: true }
  );
  process.exit(r.status ?? 0);
}

function runStatus({ withPing = false }) {
  console.log("ForgeTrail MCP status\n");

  const staticResult = staticMcpChecks();
  console.log("## Server files");
  if (staticResult.notes.length) {
    for (const n of staticResult.notes) console.log(`  ${n}`);
  }
  if (staticResult.issues.length) {
    for (const i of staticResult.issues) console.log(`  ✗ ${i}`);
  } else {
    console.log("  ✓ dist/build looks ready");
  }

  const mcpPath = findCursorMcpJson();
  const cursor = analyzeCursorMcpConfig(mcpPath);
  console.log("\n## Cursor MCP config");
  console.log(`  Path: ${cursor.path}`);
  if (cursor.found && cursor.issues.length === 0) {
    console.log("  ✓ forgetrail server entry looks valid");
  }
  for (const i of cursor.issues) console.log(`  ✗ ${i}`);
  for (const n of cursor.notes) console.log(`  · ${n}`);

  console.log("\n## Cursor checklist");
  console.log("  1. Settings → MCP → forgetrail should show connected (green).");
  console.log("  2. In Agent chat, ask: Call ForgeTrail ping");
  console.log("  3. If tools are missing, reload MCP or restart Cursor.");

  const failed = staticResult.issues.length + cursor.issues.length;

  if (withPing) {
    console.log("\n## Live ping\n");
    runLivePing();
    return;
  }

  if (failed > 0) {
    console.log("\nFix issues above, then: forgetrail mcp status --ping");
    process.exit(1);
  }

  console.log("\nRun live JSON-RPC ping: forgetrail mcp ping");
}

export function runMcpCommand(argv) {
  const cmd = argv[0];
  const rest = argv.slice(1);

  if (!cmd || cmd === "--help" || cmd === "-h") {
    console.log(HELP);
    return;
  }

  if (cmd !== "cursor-config" && !isClone()) {
    console.error(`forgetrail mcp ${cmd} runs from a ForgeTrail clone. This npm install does not include mcp-server/.`);
    console.error("Use the published server instead: forgetrail mcp cursor-config prints a config that starts forgetrail-mcp.");
    process.exit(1);
  }

  switch (cmd) {
    case "build":
      runMcpBuild();
      break;
    case "status":
      runStatus({ withPing: rest.includes("--ping") });
      break;
    case "ping":
      runLivePing();
      break;
    case "cursor-config":
      printCursorConfigTemplate();
      break;
    case "dev":
      runDev();
      break;
    case "inspector":
      runInspector();
      break;
    default:
      console.error(`Unknown mcp subcommand: ${cmd}`);
      console.error("Run: forgetrail mcp --help");
      process.exit(1);
  }
}

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  runMcpCommand(process.argv.slice(2));
}
