# Local ForgeTrail workspace (`.forgetrail/`)

This folder holds **ForgeTrail host artifacts** — protocol, platform rules, and hooks. Project phase, decisions, and sessions live in **`appledger/`**, not in this folder. ForgeTrail upstream is **Apache 2.0**; you may commit this folder or **gitignore** it for a slimmer public app repo. Never commit secrets here. Do not add `workflow_tracking.json`.

Used for **both** ForgeTrail Lite file bootstrap and **MCP greenfield** kickoff.

## Contents

| File | Purpose |
|------|---------|
| `hooks/` | Host safety hooks. They do not store project phase or decisions |
| `FORGETRAIL_LITE.md` | Full Lite kickoff protocol (Lite file bootstrap only) |
| `FORGETRAIL_LITE_UPDATES.md` | Optional local feedback log (§1.6) — merge accepted items upstream |
| `AGENTS.md` | Created by the agent in the first kickoff session from Lite §12; absent immediately after installation. Cite or symlink it for your IDE after creation |
| `CLAUDE.md` | Claude Code instructions |
| `IDEAS.md` | Backlog parking lot |
| `cursor/rules/*.mdc` | Cursor rule snippets (updates-log, …) |

## Wire up Cursor (one-time)

From the **repo root**:

**Git Bash / WSL:**

```bash
mkdir -p .cursor/rules
ln -sf ../../.forgetrail/cursor/rules/forgetrail-updates-log.mdc .cursor/rules/
```

**Windows cmd (junction):**

```bat
mkdir .cursor\rules 2>nul
mklink .cursor\rules\forgetrail-updates-log.mdc ..\.forgetrail\cursor\rules\forgetrail-updates-log.mdc
```

After the first kickoff creates `.forgetrail/AGENTS.md` from Lite §12, optionally symlink it → `AGENTS.md` at repo root if a tool requires root placement (also gitignore root copies if you symlink).

## Recovering after clone

If `.forgetrail/` was gitignored, it is not in git. Reinstall ForgeTrail, copy its host artifacts from upstream Catalyst Forge (`content/`), or restore them from backup. Restore any project-specific agent instructions from backup or recreate them during kickoff. The existing **`appledger/`** remains the authoritative project record; restoring host artifacts does not replace it. For a new empty project, use **`appledger init`**. MCP **`getInitialWorkflowTracking`** returns ledger guidance, not a tracking file or a replacement ledger.
