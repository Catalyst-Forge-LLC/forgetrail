#!/usr/bin/env node

import { cwd } from "node:process";
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const FORGETRAIL_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function parseInstallArgs(argv) {
  const args = {
    target: process.env.FORGETRAIL_TARGET?.trim() || "",
    force: false,
    dryRun: false,
    skipTracking: false,
    withGenesisStub: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--path" || arg === "-p") {
      args.target = argv[++i]?.trim() ?? "";
    } else if (arg === "--force" || arg === "-f") {
      args.force = true;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--skip-tracking") {
      args.skipTracking = true;
    } else if (arg === "--with-genesis-stub") {
      args.withGenesisStub = true;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (!arg.startsWith("-") && !args.target) {
      args.target = arg.trim();
    }
  }

  return args;
}

export function resolveTarget(target, { defaultToCwd = false } = {}) {
  const raw = target?.trim() || (defaultToCwd ? cwd() : "");
  if (!raw) {
    console.error("Missing target directory.");
    console.error("Usage: forgetrail install   (from project folder after pnpm run link:global)");
    console.error("   or: pnpm run install:forgetrail -- --path <project-root>");
    console.error("   or: FORGETRAIL_TARGET=<project-root> pnpm run install:forgetrail");
    process.exit(1);
  }

  const resolved = resolve(raw);
  if (!existsSync(resolved)) {
    console.error(`Target does not exist: ${resolved}`);
    process.exit(1);
  }
  if (!statSync(resolved).isDirectory()) {
    console.error(`Target is not a directory: ${resolved}`);
    process.exit(1);
  }
  return resolved;
}

/** @deprecated use resolveTarget */
export function requireTarget(target, opts) {
  return resolveTarget(target, opts);
}

export function ensureDir(path, dryRun) {
  if (existsSync(path)) return;
  if (dryRun) {
    console.log(`[dry-run] mkdir ${path}`);
    return;
  }
  mkdirSync(path, { recursive: true });
}

export function copyPath(from, to, { force = false, dryRun = false } = {}) {
  if (!existsSync(from)) {
    throw new Error(`Missing source: ${from}`);
  }
  if (existsSync(to) && !force) {
    console.log(`  skip (exists): ${to}`);
    return false;
  }
  if (dryRun) {
    console.log(`[dry-run] copy ${from} -> ${to}`);
    return true;
  }
  ensureDir(dirname(to), dryRun);
  cpSync(from, to, { recursive: true, force: true });
  console.log(`  wrote ${to}`);
  return true;
}

/** MCP-only content — not needed for offline template-in-repo. */
export const MCP_ONLY_CONTENT = new Set([
  "AGENT_INTEGRATION_claude.md",
  "AGENT_INTEGRATION_cursor.md",
  "AGENT_INTEGRATION_generic.md",
  "AGENT_INTEGRATION_grok.md",
  "PLAN_MODE_PATTERNS.md",
  "NEW_PROJECT_BOOTSTRAP.md",
  "SESSION_RESUME_MCP.md",
  "KICKOFF_WITHOUT_MCP.md",
  "POST_BOOTSTRAP_USER_MESSAGE.md",
]);

export function copyContentDir(fromDir, toDir, opts) {
  ensureDir(toDir, opts.dryRun);
  for (const name of readdirSync(fromDir)) {
    if (name === "skills") continue;
    if (name === "LITE_WORKFLOW_TRACKING.json") continue;
    if (MCP_ONLY_CONTENT.has(name)) continue;
    copyPath(join(fromDir, name), join(toDir, name), opts);
  }
}
