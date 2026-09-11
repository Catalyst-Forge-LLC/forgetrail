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
      "args": ["-y", "forgetrail-mcp"],
      "env": {
        "FORGETRAIL_ROOT": "/absolute/path/to/forgetrail"
      }
    }
  }
}
```

`FORGETRAIL_ROOT` must contain `WORKFLOW.md` and `content/`. Point it at a clone or at an installed `forgetrail` package. Omit it only when `forgetrail` is resolvable next to the MCP package.

From a clone instead: `pnpm run mcp:build`, then `forgetrail mcp cursor-config`.

## First chats

- Kickoff: *Call `getNewProjectKickoff` and set up the project.*
- Resume: *Call `getResumeSessionInstructions`.*
- Existing Genesis: call `ingestPlanArtifact` before locking Phase 1.
- Companions: call `getCompanionSuggestions` when a job matches. Never required.

The app repo keeps **your code**, **your docs**, and **`.forgetrail/workflow_tracking.json`**.

## Full tool list

See [mcp-server/README.md](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/mcp-server/README.md).
