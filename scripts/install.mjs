#!/usr/bin/env node

/**
 * Shared install logic — full template-in-repo and Lite bootstrap.
 */

import { join } from "node:path";
import {
  FORGETRAIL_ROOT,
  copyContentDir,
  copyPath,
  ensureDir,
  parseInstallArgs,
  resolveTarget,
} from "./install-lib.mjs";

const ROOT_FILES = [
  "WORKFLOW.md",
  "TRACKING_SCHEMA.md",
  "INITIAL_PROMPT.md",
  "CONTINUATION_PROMPT.md",
  "LICENSE",
];

const LITE_FILES = [
  ["FORGETRAIL_LITE.md", "FORGETRAIL_LITE.md"],
  ["forgetrail-workspace-README.md", "README.md"],
  ["FORGETRAIL_LITE_UPDATES.md", "FORGETRAIL_LITE_UPDATES.md"],
];

const LITE_CURSOR_RULES = [
  "forgetrail-updates-log.mdc",
  "specs-and-todo.mdc",
  "spec-completion.mdc",
];

const HOOK_FILES = [
  "guard-shell.mjs",
  "guard-edit.mjs",
  "session-start.mjs",
  "appledger-bin.mjs",
  "validate-tracking.mjs",
  "validate-tracking-core.mjs",
  "session-stop.mjs",
  "cursor-hooks.json",
  "claude-settings-hooks.json",
  "README.md",
];

export function runInstallForgetrail(rawArgv, { defaultToCwd = false } = {}) {
  const args = parseInstallArgs(rawArgv);
  if (args.help) return { help: INSTALL_FULL_HELP };

  const target = resolveTarget(args.target, { defaultToCwd });
  const opts = { force: args.force, dryRun: args.dryRun };
  const forgetrailDir = join(target, "_forgetrail");
  const contentSrc = join(FORGETRAIL_ROOT, "content");
  const contentDest = join(forgetrailDir, "content");

  console.log(`ForgeTrail full install → ${forgetrailDir}`);
  if (args.dryRun) console.log("(dry run)\n");

  ensureDir(forgetrailDir, args.dryRun);

  for (const file of ROOT_FILES) {
    copyPath(join(FORGETRAIL_ROOT, file), join(forgetrailDir, file), opts);
  }

  copyPath(join(FORGETRAIL_ROOT, "docs"), join(forgetrailDir, "docs"), opts);
  copyPath(join(FORGETRAIL_ROOT, "prompts"), join(forgetrailDir, "prompts"), opts);
  copyContentDir(contentSrc, contentDest, opts);

  const hooksSrc = join(FORGETRAIL_ROOT, "content", "hooks");
  const hooksDest = join(target, ".forgetrail", "hooks");
  ensureDir(hooksDest, args.dryRun);
  for (const hookFile of HOOK_FILES) {
    copyPath(join(hooksSrc, hookFile), join(hooksDest, hookFile), opts);
  }
  const cursorDir = join(target, ".cursor");
  ensureDir(cursorDir, args.dryRun);
  copyPath(
    join(hooksSrc, "cursor-hooks.json"),
    join(cursorDir, "hooks.json"),
    opts
  );

  console.log("\nDone.");
  console.log("  Methodology:  _forgetrail/WORKFLOW.md");
  console.log("  First chat:   _forgetrail/INITIAL_PROMPT.md");
  console.log("  Project record: appledger/");
  console.log("  Hooks:        .forgetrail/hooks/ (enforced via .cursor/hooks.json)");
  printLedgerNext();
  return { target, mode: "full" };
}

export function runInstallLite(rawArgv, { defaultToCwd = false } = {}) {
  const args = parseInstallArgs(rawArgv);
  if (args.help) return { help: INSTALL_LITE_HELP };

  const target = resolveTarget(args.target, { defaultToCwd });
  const opts = { force: args.force, dryRun: args.dryRun };
  const contentDir = join(FORGETRAIL_ROOT, "content");
  const forgetrailDir = join(target, ".forgetrail");

  console.log(`ForgeTrail Lite install → ${forgetrailDir}`);
  if (args.dryRun) console.log("(dry run)\n");

  ensureDir(forgetrailDir, args.dryRun);
  ensureDir(join(forgetrailDir, "cursor", "rules"), args.dryRun);

  for (const [src, dest] of LITE_FILES) {
    copyPath(join(contentDir, src), join(forgetrailDir, dest), opts);
  }

  for (const rule of LITE_CURSOR_RULES) {
    copyPath(
      join(contentDir, "cursor-rules", rule),
      join(forgetrailDir, "cursor", "rules", rule),
      opts
    );
  }

  const hooksSrc = join(contentDir, "hooks");
  const hooksDest = join(forgetrailDir, "hooks");
  ensureDir(hooksDest, args.dryRun);
  for (const hookFile of HOOK_FILES) {
    copyPath(join(hooksSrc, hookFile), join(hooksDest, hookFile), opts);
  }

  const cursorDir = join(target, ".cursor");
  ensureDir(cursorDir, args.dryRun);
  copyPath(
    join(hooksSrc, "cursor-hooks.json"),
    join(cursorDir, "hooks.json"),
    opts
  );

  if (args.withGenesisStub) {
    const genesisDest = join(target, "docs", "GENESIS.md");
    ensureDir(join(target, "docs"), args.dryRun);
    copyPath(join(contentDir, "GENESIS_STUB.md"), genesisDest, opts);
  }

  console.log("\nDone.");
  console.log("  Protocol:  .forgetrail/FORGETRAIL_LITE.md");
  console.log("  Project record: appledger/ (a tracking JSON file is not installed)");
  console.log("  Hooks:     .forgetrail/hooks/ (enforced via .cursor/hooks.json)");
  if (args.withGenesisStub) {
    console.log("  Genesis:   docs/GENESIS.md (stub — replace with your spec)");
  }
  printLedgerNext();
  return { target, mode: "lite", withGenesisStub: !!args.withGenesisStub };
}

function printLedgerNext() {
  console.log("\nNext, create the ledger in the app folder (the agent can run these):");
  console.log('  pnpm dlx appledger init --name "Your app name"');
  console.log("  pnpm dlx appledger check");
  console.log("Then paste the kickoff line from https://forgetrail.dev/docs/try");
}

export const INSTALL_FULL_HELP = `
ForgeTrail template-in-repo install (offline / no MCP server required)

Usage:
  forgetrail install [options]          (from your project folder, after global link)
  pnpm run install:forgetrail -- [options]

Options:
  --path, -p <dir>   Target project root (default: current directory for \`forgetrail\` CLI)
  --force, -f        Overwrite existing files
  --skip-tracking    Accepted and ignored. A tracking JSON file is not installed.
  --dry-run          Print actions only

Installs:
  <target>/_forgetrail/   WORKFLOW, templates, prompts, content/ (curated)
  <target>/.forgetrail/   hooks only. Project state belongs in appledger/.
`.trim();

export const INSTALL_LITE_HELP = `
ForgeTrail Lite install (portable protocol, no MCP)

Usage:
  forgetrail install --lite [options]
  pnpm run install:lite -- [options]

Options:
  --path, -p <dir>        Target project root (default: current directory for \`forgetrail\` CLI)
  --force, -f             Overwrite existing files
  --skip-tracking         Accepted and ignored. A tracking JSON file is not installed.
  --with-genesis-stub     Also create docs/GENESIS.md stub (for the Try path)
  --dry-run               Print actions only

Installs into <target>/.forgetrail/ (FORGETRAIL_LITE.md, cursor rules, hooks). Project state belongs in appledger/.
With --with-genesis-stub, also writes docs/GENESIS.md from content/GENESIS_STUB.md.
See TRY_FORGETRAIL.md in the ForgeTrail repo for the no-MCP prove-it recipe.
`.trim();
