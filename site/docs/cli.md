---
title: CLI
---

The `forgetrail` package is an **installer**. It writes methodology files into an app folder. It is not something the app imports.

```bash
forgetrail install [--lite] [options]
forgetrail mcp <subcommand>
```

## Install options

| Flag | Meaning |
| --- | --- |
| `--lite` | Lite protocol only (`.forgetrail/FORGETRAIL_LITE.md`) |
| `--with-genesis-stub` | With `--lite`: also create `docs/GENESIS.md` stub |
| `--force`, `-f` | Overwrite existing files |
| `--dry-run` | Preview without writing |
| `--path`, `-p <dir>` | Install elsewhere (default: current directory) |

Examples:

```bash
pnpm dlx forgetrail install --lite --with-genesis-stub
pnpm dlx forgetrail install
pnpm dlx forgetrail install --lite --dry-run
```

From a clone: `pnpm run link:global`, then the same commands. Or copy the repo into the app as `_forgetrail/` and use [INITIAL_PROMPT.md](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/INITIAL_PROMPT.md).

## MCP helpers (clone)

```bash
forgetrail mcp build
forgetrail mcp status --ping
forgetrail mcp ping
forgetrail mcp cursor-config
```

## One-off on Windows

Prefer `pnpm dlx forgetrail` over npm 12 `npx forgetrail`. The latter may fail to spawn the bin.
