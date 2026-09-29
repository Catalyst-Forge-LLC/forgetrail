---
title: MCP
---

The MCP server exposes methodology to Cursor, Claude Desktop, Claude Code, Windsurf, and other MCP clients without copying ForgeTrail into the app repo.

Installer and MCP bins are on npm. This is a channel, not a library.

## Cursor

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

`forgetrail-mcp` 0.4.2 and later depends on `forgetrail` and reads the methodology from that package. `FORGETRAIL_ROOT` is optional. Set it only to use a clone or another copy that contains `WORKFLOW.md` and `content/`. `forgetrail mcp cursor-config` prints this block from an npm install.

Check with `ping`. If it reports `content missing`, the server did not find the methodology. Every other tool then returns an error rather than an answer about phases or lessons.

From a clone instead: `pnpm run mcp:build`, then `forgetrail mcp cursor-config`. That prints a `node …/mcp-server/dist/index.js` config for the clone.

## First chats

- Kickoff: *Call `getNewProjectKickoff` and set up the project.*
- Resume: *Call `getResumeSessionInstructions`.*
- Existing Genesis: call `ingestPlanArtifact` before locking Phase 1.
- Companions: call `getCompanionSuggestions` when a job matches. Never required.

The app repo keeps **your code**, **your docs**, and **`appledger/`**.

## Full tool list

See [mcp-server/README.md](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/mcp-server/README.md).
