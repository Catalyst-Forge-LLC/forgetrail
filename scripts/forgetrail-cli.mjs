#!/usr/bin/env node

import { cwd } from "node:process";
import {
  INSTALL_FULL_HELP,
  INSTALL_LITE_HELP,
  runInstallForgetrail,
  runInstallLite,
} from "./install.mjs";
import { runMcpCommand } from "./mcp-status.mjs";

const CLI_HELP = `
ForgeTrail — bootstrap a project folder and run the MCP server

Usage:
  forgetrail install [--lite] [options]
  forgetrail workspace [dir]         Scan workspace and emit cross-repo status table
  forgetrail mcp <subcommand>        Build, status, ping, Cursor config

Global link (one-time, from your forgetrail clone):
  pnpm run link:global              # pnpm add -g . + PATH shim fix (Windows/Git Bash)

Then from any project folder:
  cd /path/to/your-app
  forgetrail install --lite
  forgetrail install

From your forgetrail clone (MCP server):
  forgetrail mcp build               Install deps + compile dist/
  forgetrail mcp status [--ping]     Static checks + optional live ping
  forgetrail mcp ping                Live ping (JSON)
  forgetrail mcp cursor-config       Print recommended .cursor/mcp.json

Install options:
  --lite             Lite protocol only (.forgetrail/FORGETRAIL_LITE.md)
  --with-genesis-stub  With --lite: also create docs/GENESIS.md stub
  --force, -f        Overwrite existing files
  --dry-run          Preview without writing
  --skip-tracking    Skip workflow_tracking.json starter
  --path, -p <dir>   Install elsewhere (default: current directory)
  --help, -h         Show help

First-time prove-it (no MCP): see TRY_FORGETRAIL.md in the ForgeTrail repo.
Run \`forgetrail mcp --help\` for all MCP subcommands.
`.trim();

function main() {
  const argv = process.argv.slice(2);

  if (argv.length === 0 || ((argv.includes("--help") || argv.includes("-h")) && argv[0] !== "install" && argv[0] !== "mcp")) {
    console.log(CLI_HELP);
    process.exit(0);
  }

  const cmd = argv[0];

  if (cmd === "mcp") {
    runMcpCommand(argv.slice(1));
    return;
  }

  if (cmd === "workspace" || cmd === "index") {
    import("./workspace-index.mjs");
    return;
  }

  if (cmd !== "install") {
    console.error(`Unknown command: ${cmd ?? "(none)"}`);
    console.error("Run forgetrail --help");
    process.exit(1);
  }

  const rest = argv.slice(1);
  const lite = rest.includes("--lite");
  const passArgv = rest.filter((a) => a !== "--lite");

  if (passArgv.includes("--help") || passArgv.includes("-h")) {
    console.log(lite ? INSTALL_LITE_HELP : INSTALL_FULL_HELP);
    process.exit(0);
  }

  console.log(`Target: ${cwd()}\n`);

  if (lite) {
    runInstallLite(passArgv, { defaultToCwd: true });
  } else {
    runInstallForgetrail(passArgv, { defaultToCwd: true });
  }
}

main();
