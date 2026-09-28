#!/usr/bin/env node

import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

export const FORGETRAIL_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const MCP_SERVER_DIR = join(FORGETRAIL_ROOT, "mcp-server");
export const MCP_ENTRY = join(MCP_SERVER_DIR, "dist", "index.js");
export const WORKFLOW_PATH = join(FORGETRAIL_ROOT, "WORKFLOW.md");

export function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return null;
  }
}

export function normalizePath(p) {
  if (!p || typeof p !== "string") return "";
  return resolve(p.replace(/\//g, "\\").replace(/\\/g, "/").replace(/^([A-Za-z]):/, (_, d) => `${d.toUpperCase()}:`));
}

/** Find .cursor/mcp.json starting at dir, walking up to root. */
export function findCursorMcpJson(startDir = process.cwd()) {
  let dir = resolve(startDir);
  for (;;) {
    const candidate = join(dir, ".cursor", "mcp.json");
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return join(FORGETRAIL_ROOT, ".cursor", "mcp.json");
}

export function analyzeCursorMcpConfig(mcpJsonPath) {
  const issues = [];
  const notes = [];
  if (!existsSync(mcpJsonPath)) {
    return {
      path: mcpJsonPath,
      found: false,
      issues: ["No .cursor/mcp.json found (checked cwd ancestors and forgetrail root)."],
      notes: [
        "Create .cursor/mcp.json with a forgetrail server entry pointing at mcp-server/dist/index.js.",
        "See mcp-server/README.md or run: forgetrail mcp cursor-config",
      ],
    };
  }

  const raw = readJson(mcpJsonPath);
  if (!raw?.mcpServers) {
    return { path: mcpJsonPath, found: true, issues: ["Invalid mcp.json: missing mcpServers."], notes: [] };
  }

  const forgetrail =
    raw.mcpServers.forgetrail ??
    raw.mcpServers["forgetrail-mcp"] ??
    Object.entries(raw.mcpServers).find(([k]) => /forgetrail/i.test(k))?.[1];

  if (!forgetrail) {
    issues.push('No "forgetrail" entry under mcpServers.');
    notes.push('Add a server named "forgetrail" (Cursor shows this name in MCP settings).');
    return { path: mcpJsonPath, found: true, issues, notes, config: raw };
  }

  const args = forgetrail.args ?? [];
  const entryArg = args.find((a) => typeof a === "string" && a.endsWith("index.js"));
  if (!entryArg) {
    issues.push("forgetrail MCP args should include mcp-server/dist/index.js");
  } else if (!existsSync(entryArg)) {
    issues.push(`Configured server path does not exist: ${entryArg}`);
    notes.push("Run: forgetrail mcp build");
  } else if (normalizePath(entryArg) !== normalizePath(MCP_ENTRY)) {
    notes.push(`Configured entry: ${entryArg}`);
    notes.push(`This repo build:   ${MCP_ENTRY}`);
  }

  if (forgetrail.command && forgetrail.command !== "node") {
    notes.push(`command is "${forgetrail.command}" (node is typical).`);
  }

  const envRoot = forgetrail.env?.FORGETRAIL_ROOT;
  if (envRoot && normalizePath(envRoot) !== normalizePath(FORGETRAIL_ROOT)) {
    notes.push(`FORGETRAIL_ROOT in mcp.json: ${envRoot}`);
  } else if (!envRoot) {
    notes.push(
      "Optional: set env.FORGETRAIL_ROOT in mcp.json if the server lives outside the default parent-of-mcp-server layout."
    );
  }

  return { path: mcpJsonPath, found: true, issues, notes, config: raw, entryArg };
}

export function staticMcpChecks() {
  const issues = [];
  const notes = [];

  if (!existsSync(WORKFLOW_PATH)) {
    issues.push(`WORKFLOW.md missing at ${WORKFLOW_PATH}`);
  }

  if (!existsSync(join(MCP_SERVER_DIR, "node_modules"))) {
    issues.push("mcp-server/node_modules missing — run: forgetrail mcp build");
  }

  if (!existsSync(MCP_ENTRY)) {
    issues.push("mcp-server/dist/index.js missing — run: forgetrail mcp build");
  }

  const pkg = readJson(join(MCP_SERVER_DIR, "package.json"));
  if (pkg?.version) {
    notes.push(`forgetrail-mcp package version: ${pkg.version}`);
  }

  notes.push(`FORGETRAIL_ROOT (default): ${FORGETRAIL_ROOT}`);

  return { issues, notes };
}

export function posixPath(p) {
  return p.replace(/\\/g, "/");
}

/** True when this CLI runs from a clone that has mcp-server/ (the npm package does not ship it). */
export function isClone() {
  return existsSync(join(MCP_SERVER_DIR, "package.json"));
}

/** pnpm dlx and npx unpack into a cache that can be removed, so its path is not a stable FORGETRAIL_ROOT. */
export function isTemporaryInstall(p = FORGETRAIL_ROOT) {
  return /[\\/](dlx|_npx)[\\/]/i.test(p);
}

export function mcpClientConfigObject() {
  if (existsSync(MCP_ENTRY)) {
    return {
      mcpServers: {
        forgetrail: {
          command: "node",
          args: [posixPath(MCP_ENTRY)],
          env: { FORGETRAIL_ROOT: posixPath(FORGETRAIL_ROOT) },
        },
      },
    };
  }
  const server = { command: "npx", args: ["-y", "forgetrail-mcp"] };
  if (!isTemporaryInstall()) server.env = { FORGETRAIL_ROOT: posixPath(FORGETRAIL_ROOT) };
  return { mcpServers: { forgetrail: server } };
}

/** Copy-paste MCP client setup — shown after `forgetrail mcp build`. */
export function printMcpClientSetupBanner({ showBuildComplete = true } = {}) {
  const fromClone = existsSync(MCP_ENTRY);

  if (showBuildComplete) {
    console.log("\n✓ Build complete.\n");
  }

  console.log("Connect ForgeTrail MCP (Cursor starts the server for you — no `mcp dev` needed):\n");
  console.log("  Cursor — project .cursor/mcp.json or Settings → MCP → add server:");
  console.log(JSON.stringify(mcpClientConfigObject(), null, 2));
  console.log("");
  if (!fromClone) {
    if (isTemporaryInstall()) {
      console.log("  This forgetrail copy is in a temporary pnpm dlx or npx cache, so FORGETRAIL_ROOT is not set.");
      console.log("  forgetrail-mcp finds the forgetrail package it depends on. For a fixed path: pnpm add -g forgetrail, then rerun this command.");
    } else {
      console.log(`  FORGETRAIL_ROOT is this installed forgetrail package: ${posixPath(FORGETRAIL_ROOT)}`);
    }
    console.log("");
  }
  console.log("  Claude Desktop — %APPDATA%\\Claude\\claude_desktop_config.json (same mcpServers block)");
  console.log(
    fromClone
      ? `  Claude Code — claude mcp add forgetrail node ${posixPath(MCP_ENTRY)}`
      : "  Claude Code — claude mcp add forgetrail -- npx -y forgetrail-mcp"
  );
  console.log("");
  console.log("  Then reload MCP in Cursor (Settings → MCP) or restart Cursor.");
  console.log("  Verify: forgetrail mcp ping   |   Reprint: forgetrail mcp cursor-config");
  console.log("");
  console.log('  First agent prompt: "Call ForgeTrail getNewProjectKickoff and set up the project."');
  console.log("");
}

export function runMcpBuild() {
  console.log("Building ForgeTrail MCP server...\n");
  const install = spawnSync("pnpm", ["install"], { cwd: MCP_SERVER_DIR, stdio: "inherit", shell: true });
  if (install.status !== 0) {
    process.exit(install.status ?? 1);
  }
  const build = spawnSync("pnpm", ["run", "build"], { cwd: MCP_SERVER_DIR, stdio: "inherit", shell: true });
  if (build.status !== 0) {
    process.exit(build.status ?? 1);
  }
  printMcpClientSetupBanner();
}

export function printCursorConfigTemplate() {
  printMcpClientSetupBanner({ showBuildComplete: false });
}
