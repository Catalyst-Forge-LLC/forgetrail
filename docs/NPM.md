# Publishing ForgeTrail to npm

You run `pnpm publish`. The gate does not log in or publish.

**Name hold (any new unscoped package):** do not publish the app repo. Prepare `0.0.0` in a throwaway folder (`package.json` + one-line README, description `Name hold.`, no homepage). **You** run `npm publish`. Agents never publish. Rule: `content/cursor-rules/npm-name-hold.mdc`. First real release bumps.

---

Two public unscoped packages:

| Package | This tree | On npm until you publish | From | What it is |
| --- | --- | --- | --- | --- |
| [`forgetrail`](https://www.npmjs.com/package/forgetrail) | 0.5.8 | 0.5.7 | repo root | CLI + Lite + templates. `pnpm dlx forgetrail install --lite` |
| [`forgetrail-mcp`](https://www.npmjs.com/package/forgetrail-mcp) | 0.4.4 | 0.4.3 | `mcp-server/` | MCP bin. Depends on `forgetrail` for content. `pnpm dlx forgetrail-mcp` |

These are **installer and MCP channels**, not a library. App repos should not add `forgetrail` to `dependencies`.

The registry versions above were checked on 2026-09-30. The new tree versions are prepared and unpublished. `getCompanionSuggestions` reads its text from the installed `forgetrail`. `pnpm run pack:check` is the gate. It does not publish.

## September ecosystem release

The CLI release removes writable legacy tracking templates and structural compatibility readers, preserves ledger pointer/conflict diagnosis, and clarifies when an agent creates AGENTS.md. AppLedger remains the application record; its completed one-time migration is retired separately.

Publish CLI `0.5.8` first. Before publishing MCP `0.4.4`, update its dependency and lockfile to require the new content:

```powershell
Set-Location Z:\workspace\forgetrail\mcp-server
pnpm add "forgetrail@^0.5.8"
pnpm build
```

Review and commit those files, then test the packaged MCP against that dependency. This update is pending until CLI `0.5.8` exists in the registry; the currently installed/locked dependency is still `0.5.2`. Do not publish the MCP preparation unchanged. Preserve independent package versions.

---

## Once (this machine)

```bash
pnpm login
pnpm whoami
```

Use an npm account that can publish **unscoped** public packages.

---

## First publish (paste in order)

From the repo root, on `main`, **clean working tree** (pnpm refuses `publish` if git is dirty). Push first if you want the published tarball to match GitHub.

```bash
# 1. Gate (rebuilds mcp-server/dist)
pnpm run pack:check

# 2. CLI + methodology
pnpm publish --dry-run --access public
pnpm publish --access public

# 3. MCP server — cd in. Do not use `pnpm --dir mcp-server publish`.
# npm 12 treats leftover `--dir` tokens as extra package-specs and exits EUSAGE.
cd mcp-server
pnpm publish --access public
cd ..
```

`prepublishOnly` on the root re-runs the pack check. It refuses `private: true` and a tarball that includes `site/` or `specs/`.

The `Debugger listening` line on MCP `prepack` is Cursor attaching to a one-line `node -e`. It is harmless. Do not let it rewrite the publish command.

---

## After publish (verify)

```bash
# Prefer pnpm dlx. npm 12 `npx forgetrail --help` on Windows failed to spawn the bin.
pnpm dlx forgetrail@<version> --help
pnpm dlx forgetrail@<version> install --lite --dry-run

# MCP starts and reads content from its forgetrail dependency. ping should not say "content missing".
pnpm dlx forgetrail-mcp@0.4.3
```

Optional Cursor MCP (content from a `forgetrail` install, or set the path):

```json
{
  "mcpServers": {
    "forgetrail": {
      "command": "npx",
      "args": ["-y", "forgetrail-mcp"],
      "env": {
        "FORGETRAIL_ROOT": "/path/to/node_modules/forgetrail"
      }
    }
  }
}
```

If `forgetrail` is installed in the same tree, `forgetrail-mcp` finds `WORKFLOW.md` without `FORGETRAIL_ROOT`.

Registry pages to confirm:

- https://www.npmjs.com/package/forgetrail
- https://www.npmjs.com/package/forgetrail-mcp

---

## Later releases

1. Bump `version` in `package.json` and/or `mcp-server/package.json` (independent versions are OK).
2. Repeat the three publish blocks above.
3. GitHub `main` stays canonical. npm versions are snapshots.

---

## Do not publish

- `site/` (FilePress marketing app)
- `specs/` (methodology-repo meta-specs)
- `.cursor/`
