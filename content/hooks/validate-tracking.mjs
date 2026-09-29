#!/usr/bin/env node

/**
 * ForgeTrail Tracking Validator Hook
 * Hook event: afterFileEdit (Cursor) / PostToolUse (Claude Code)
 * Automatically validates .forgetrail/workflow_tracking.json upon edit.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { validateTrackingData, formatValidationResult } from "./validate-tracking-core.mjs";
import { runAppledger } from "./appledger-bin.mjs";

function ledgerRoot(filePath) {
  if (!filePath) return null;
  const abs = resolve(filePath).replaceAll("\\", "/");
  const at = abs.toLowerCase().lastIndexOf("/appledger/");
  if (at === -1) return null;
  return abs.slice(0, at);
}

function readStdin() {
  try {
    const raw = readFileSync(0, "utf-8");
    if (raw.trim()) return JSON.parse(raw);
  } catch {}
  return {};
}

function main() {
  const payload = readStdin();
  const filePath =
    payload.path ||
    payload.file_path ||
    payload.target_file ||
    payload.input?.path ||
    payload.tool_input?.path ||
    "";

  const ledger = ledgerRoot(filePath);
  if (ledger) {
    const check = runAppledger(["check", "--root", ledger], ledger);
    const noisy = !check.absent && (check.status !== 0 || /warning|error/i.test(check.text));
    if (noisy && check.text) {
      console.log(
        JSON.stringify({
          additional_context: `=== ForgeTrail ledger check ===\n${check.text}\n================================`,
        })
      );
      return;
    }
    console.log(JSON.stringify({}));
    return;
  }

  if (!filePath.endsWith("workflow_tracking.json")) {
    console.log(JSON.stringify({}));
    return;
  }

  if (!existsSync(filePath)) {
    console.log(JSON.stringify({}));
    return;
  }

  try {
    const content = JSON.parse(readFileSync(filePath, "utf-8"));
    const result = validateTrackingData(content);

    if (result.issues.length > 0 || result.warnings.length > 0) {
      const formatted = formatValidationResult(result);
      console.log(
        JSON.stringify({
          additional_context: `=== ForgeTrail Tracking Validation Notice ===\n${formatted}\n=============================================`,
        })
      );
      return;
    }
  } catch (err) {
    console.log(
      JSON.stringify({
        additional_context: `ForgeTrail Tracking Syntax Error: Failed to parse ${filePath} as valid JSON: ${err.message}`,
      })
    );
    return;
  }

  console.log(JSON.stringify({}));
}

main();
