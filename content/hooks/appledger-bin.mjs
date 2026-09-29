/**
 * Find and run the appledger CLI from PATH.
 * A missing command is absent, not a failure. Hooks keep their previous text in that case.
 */

import { spawnSync } from "node:child_process";

export function findAppledger() {
  const finder = process.platform === "win32" ? "where.exe" : "which";
  const found = spawnSync(finder, ["appledger"], { encoding: "utf8", windowsHide: true });
  if (found.status !== 0) return null;
  const line = found.stdout
    .split(/\r?\n/)
    .map((item) => item.trim())
    .find(Boolean);
  return line || null;
}

export function runAppledger(args, cwd) {
  const bin = findAppledger();
  if (!bin) return { absent: true, status: null, text: "" };
  const script = /\.(cmd|bat)$/i.test(bin);
  const result = spawnSync(bin, args, {
    cwd,
    encoding: "utf8",
    timeout: 20_000,
    windowsHide: true,
    shell: script,
  });
  if (result.error?.code === "ENOENT") return { absent: true, status: null, text: "" };
  const text = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
  return { absent: false, status: result.status, text };
}
