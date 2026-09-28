---
title: Install
---

The first useful outcome is files in your app folder. The protocol is `.forgetrail/FORGETRAIL_LITE.md`. Project state belongs in `appledger/`. A new install does not write `.forgetrail/workflow_tracking.json`. See [Continuity](/docs/continuity) before you pick an installer.

Requires **Node.js 20+** for the CLI and MCP. The [Try](/docs/try) path does not require Node. Copy Lite by hand if you want zero install.

## CLI

```bash
pnpm dlx forgetrail install --lite --with-genesis-stub
```

`npx forgetrail install --lite --with-genesis-stub` works on macOS and Linux. On Windows, npm 12 `npx forgetrail` may fail to spawn the bin, so use `pnpm dlx`.

Global:

```bash
pnpm add -g forgetrail
forgetrail install --lite
```

That writes into the **current app folder**: `.forgetrail/FORGETRAIL_LITE.md`, hook scripts in `.forgetrail/hooks/`, and `.cursor/hooks.json`. It does not write a tracking JSON file. `--skip-tracking` is accepted and ignored. Existing files are skipped unless you pass `--force`. Preview with `--dry-run`. Use a new empty project. Do not run it inside a clone of this methodology repo.

Then create the ledger. The agent can run these:

```bash
pnpm dlx appledger init --name "Your app name"
pnpm dlx appledger check
```

`init` writes `appledger/` (manifest, profile, application record, session record) and does not overwrite existing files. Global: `pnpm add -g appledger`. If a project already has a writable `.forgetrail/workflow_tracking.json`, `appledger migrate preview` then `apply` replaces that file with a pointer. The `appledger` CLI is [on npm](https://www.npmjs.com/package/appledger). Source: [appledger repository](https://github.com/Catalyst-Forge-LLC/appledger).

## MCP

```json
{
  "mcpServers": {
    "forgetrail": {
      "command": "npx",
      "args": ["-y", "forgetrail-mcp"]
    }
  }
}
```

`forgetrail-mcp` 0.4.2 and later installs `forgetrail` as a dependency and reads the methodology from it, so `FORGETRAIL_ROOT` is optional. Set it only to use a clone or another copy. The folder must contain `WORKFLOW.md` and `content/`. `forgetrail mcp cursor-config` prints this block. Call `ping` to confirm: it reports `content missing` when the server cannot find the methodology, and the other tools then return an error instead of an answer. Details: [MCP](/docs/mcp).

## From a checkout

```bash
pnpm --dir mcp-server install
pnpm run mcp:build
```

Site (FilePress + this docs mount): `pnpm site:dev`. Redeploy: `pnpm ship`.

## Site and docs

This documentation is [forgetrail.dev/docs](https://forgetrail.dev/docs). Product pages live on FilePress; these docs are a path mount at `/docs`.
