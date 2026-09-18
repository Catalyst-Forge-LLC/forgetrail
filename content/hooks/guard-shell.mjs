#!/usr/bin/env node

/**
 * ForgeTrail Shell Guard
 * Hook event: beforeShellExecution (Cursor) / PreToolUse (Claude Code)
 * Enforces Lite §0, git commit attribution rules, pnpm consistency, and git push guards.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { execSync } from "node:child_process";

function readStdin() {
  try {
    const raw = readFileSync(0, "utf-8");
    if (raw.trim()) return JSON.parse(raw);
  } catch {}
  return {};
}

function hasPnpmLock(cwd) {
  let curr = resolve(cwd || process.cwd());
  for (let i = 0; i < 6; i++) {
    if (existsSync(join(curr, "pnpm-lock.yaml"))) return true;
    const parent = resolve(curr, "..");
    if (parent === curr) break;
    curr = parent;
  }
  return false;
}

function hasVerifyScript(cwd) {
  try {
    const pkgPath = join(cwd || process.cwd(), "package.json");
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      return Boolean(pkg.scripts && pkg.scripts.verify);
    }
  } catch {}
  return false;
}

function main() {
  const input = readStdin();
  const command = (input.command || input.tool_input?.command || "").trim();
  const cwd = input.cwd || process.cwd();

  if (!command) {
    console.log(JSON.stringify({ permission: "allow" }));
    return;
  }

  // 1. Check for prohibited git commit trailers (Lite §0 Rule 1)
  if (/\bgit\s+commit\b/.test(command)) {
    if (/\s+(--trailer\b|-c\s+trailer\.)/.test(command)) {
      console.log(
        JSON.stringify({
          permission: "deny",
          user_message:
            "ForgeTrail Lite §0: Unrequested attribution trailers (--trailer, -c trailer.*) are prohibited in commit commands.",
          agent_message:
            "Do not use --trailer or -c trailer.* in git commit commands.",
        })
      );
      return;
    }

    if (
      /(Co-Authored-By|Made-with|Signed-off-by|Change-Id):/i.test(command)
    ) {
      console.log(
        JSON.stringify({
          permission: "deny",
          user_message:
            "ForgeTrail Lite §0: Unrequested attribution trailers (Co-Authored-By, Made-with, Signed-off-by, Change-Id) are prohibited in commit messages.",
          agent_message:
            "Remove attribution trailers from commit message.",
        })
      );
      return;
    }

    // Verify-before-commit (Phase B hook, enabled when FORGETRAIL_VERIFY_ON_COMMIT=1 or package.json has verify)
    if (
      process.env.FORGETRAIL_VERIFY_ON_COMMIT === "1" &&
      hasVerifyScript(cwd)
    ) {
      try {
        execSync("pnpm run verify", { cwd, stdio: "pipe" });
      } catch (err) {
        console.log(
          JSON.stringify({
            permission: "deny",
            user_message:
              "ForgeTrail Verification: 'pnpm run verify' failed. Code checks must pass before committing.",
            agent_message:
              "Pre-commit verification failed. Run pnpm verify and fix errors before committing.",
          })
        );
        return;
      }
    }
  }

  // 2. Check for git push (Do not push unless explicitly requested by user)
  if (/\bgit\s+push\b/.test(command)) {
    if (/\s+(-f|--force|--force-with-lease)\b/.test(command)) {
      console.log(
        JSON.stringify({
          permission: "ask",
          user_message:
            "ForgeTrail Safety: Force-pushing to remote can overwrite git history. Please confirm if you wish to proceed.",
          agent_message:
            "Force-push requires explicit user confirmation.",
        })
      );
      return;
    }

    console.log(
      JSON.stringify({
        permission: "ask",
        user_message:
          "ForgeTrail Safety: git push requires explicit user approval per project rules. Would you like to push?",
        agent_message:
          "git push requires explicit user approval per project rules.",
      })
    );
    return;
  }

  // 3. Check for npm/yarn when pnpm-lock exists (Lite §0 Rule 3)
  if (/\b(npm\s+(i|install|add)|yarn(\s+add|\s+install)?)\b/.test(command)) {
    if (hasPnpmLock(cwd)) {
      console.log(
        JSON.stringify({
          permission: "deny",
          user_message:
            "ForgeTrail Lite §0: This repository uses pnpm (pnpm-lock.yaml detected). Do not run npm or yarn install.",
          agent_message:
            "Package manager is locked to pnpm. Run pnpm instead.",
        })
      );
      return;
    }
  }

  // 4. Check for destructive git operations
  if (/\bgit\s+(reset\s+--hard|clean\s+-[a-zA-Z]*f)/.test(command)) {
    console.log(
      JSON.stringify({
        permission: "ask",
        user_message:
          "ForgeTrail Safety: Destructive git operation (" +
          command +
          ") will permanently discard uncommitted changes. Confirm?",
        agent_message: "Destructive git operation requires user approval.",
      })
    );
    return;
  }

  // 5. Check for dangerous rm -rf outside build/temp
  if (/\brm\s+-[a-zA-Z]*r[a-zA-Z]*f?\s+/.test(command)) {
    const isSafe =
      /\b(temp|build|\.svelte-kit|\.turbo|dist|\.wrangler|node_modules)[/\\]?/.test(
        command
      );
    if (!isSafe) {
      console.log(
        JSON.stringify({
          permission: "ask",
          user_message:
            "ForgeTrail Safety: Recursive file deletion outside temporary/build directories. Confirm?",
          agent_message:
            "Dangerous recursive deletion requires user approval.",
        })
      );
      return;
    }
  }

  console.log(JSON.stringify({ permission: "allow" }));
}

main();
