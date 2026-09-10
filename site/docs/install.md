---
title: Install
---

The first useful outcome is files in your app folder, especially `.forgetrail/workflow_tracking.json`. See [Continuity](/docs/continuity) before you pick an installer.

Requires **Node.js 20+** for the CLI and MCP. The [Try](/docs/try) path does not require Node. Copy Lite by hand if you want zero install.

## CLI

Prefer `pnpm dlx` on Windows (npm 12 `npx forgetrail` may fail to spawn the bin).

```bash
pnpm dlx forgetrail@0.3.0 install --lite --with-genesis-stub
```

or:

```bash
npx forgetrail install --lite --with-genesis-stub
```

Global:

```bash
pnpm add -g forgetrail
forgetrail install --lite
```

That writes `.forgetrail/FORGETRAIL_LITE.md` into the **current app folder**. Use a new empty project. Do not run it inside a clone of this methodology repo.

## MCP

```json
{
  "mcpServers": {
    "forgetrail": {
      "command": "npx",
      "args": ["-y", "forgetrail-mcp"],
      "env": {
        "FORGETRAIL_ROOT": "/absolute/path/to/forgetrail"
      }
    }
  }
}
```

`FORGETRAIL_ROOT` must point at a tree that contains `WORKFLOW.md` and `content/` (a clone, or the installed `forgetrail` package). Omit it only when `forgetrail` is resolvable next to the MCP package. Details: [MCP](/docs/mcp).

## From a checkout

```bash
pnpm --dir mcp-server install
pnpm run mcp:build
```

Site (FilePress + this docs mount): `pnpm site:dev`. Redeploy: `pnpm ship`.

## Site and docs

This documentation is [forgetrail.dev/docs](https://forgetrail.dev/docs). Product pages live on FilePress; these docs are a path mount at `/docs`.
