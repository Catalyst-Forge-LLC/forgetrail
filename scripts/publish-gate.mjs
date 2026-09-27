#!/usr/bin/env node

/**
 * Pre-publish checks. Does not log in or publish.
 * Run from the repo root: pnpm run pack:check
 */

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { FORGETRAIL_ROOT, MCP_ENTRY, MCP_SERVER_DIR } from "./mcp-lib.mjs";

const ROOT_PKG = join(FORGETRAIL_ROOT, "package.json");
const MCP_PKG = join(MCP_SERVER_DIR, "package.json");

function fail(msg) {
  console.error(`publish-gate: ${msg}`);
  process.exit(1);
}

function readPkg(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    fail(`could not read ${path}`);
  }
}

function requireFields(pkg, label, fields) {
  for (const field of fields) {
    if (!pkg[field]) fail(`${label} is missing "${field}"`);
  }
  if (pkg.private === true) fail(`${label} is private: true (unset it to publish)`);
}

function mustExist(path, label) {
  if (!existsSync(path)) fail(`missing ${label}: ${path}`);
}

const root = readPkg(ROOT_PKG);
const mcp = readPkg(MCP_PKG);

requireFields(root, "forgetrail", [
  "name",
  "version",
  "license",
  "bin",
  "files",
  "repository",
  "homepage",
]);
requireFields(mcp, "forgetrail-mcp", [
  "name",
  "version",
  "license",
  "bin",
  "files",
  "repository",
]);

if (root.name !== "forgetrail") fail(`root package name is "${root.name}", expected forgetrail`);
if (mcp.name !== "forgetrail-mcp") fail(`mcp package name is "${mcp.name}", expected forgetrail-mcp`);

mustExist(join(FORGETRAIL_ROOT, "LICENSE"), "LICENSE");
mustExist(join(FORGETRAIL_ROOT, "README.md"), "README.md");
mustExist(join(FORGETRAIL_ROOT, "WORKFLOW.md"), "WORKFLOW.md");
mustExist(join(FORGETRAIL_ROOT, "content", "FORGETRAIL_LITE.md"), "Lite");
mustExist(join(FORGETRAIL_ROOT, "scripts", "forgetrail-cli.mjs"), "CLI");

const build = spawnSync("pnpm", ["run", "build"], {
  cwd: MCP_SERVER_DIR,
  stdio: "inherit",
  shell: true,
});
if (build.status !== 0) fail("mcp-server build failed");
mustExist(MCP_ENTRY, "mcp-server/dist/index.js");

const pack = spawnSync("pnpm", ["pack", "--dry-run", "--json"], {
  cwd: FORGETRAIL_ROOT,
  encoding: "utf8",
  shell: true,
});
if (pack.status !== 0) {
  console.error(pack.stderr);
  fail("pnpm pack --dry-run failed for forgetrail");
}

const packed = pack.stdout ?? "";
const banned = ["site/", "specs/", ".cursor/", "mcp-server/src/", "mcp-server/node_modules/"];
for (const needle of banned) {
  if (packed.includes(needle)) fail(`tarball must not include ${needle}`);
}
for (const needed of ["WORKFLOW.md", "README.md", "LICENSE", "content/FORGETRAIL_LITE.md", "scripts/forgetrail-cli.mjs"]) {
  if (!packed.includes(needed)) fail(`tarball is missing ${needed}`);
}

console.log("\n✓ forgetrail pack check passed");
console.log(`  forgetrail@${root.version}`);
console.log(`  forgetrail-mcp@${mcp.version} (build ok at ${MCP_ENTRY})`);
console.log("\nPublish (you run these, from a clean tree, after pushing if the tarball should match GitHub):");
console.log("  pnpm publish --dry-run --access public");
console.log("  pnpm publish --access public");
console.log("  cd mcp-server");
console.log("  pnpm publish --access public");
console.log("  cd ..");
console.log("Do not use pnpm --dir mcp-server publish. npm 12 treats leftover --dir as an extra package spec.");

const here = fileURLToPath(import.meta.url);
if (resolve(process.argv[1] ?? "") === resolve(here)) {
  // ran as CLI; work already done above
}
