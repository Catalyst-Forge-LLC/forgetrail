# Greenfield kickoff when ForgeTrail MCP tools are not callable

Some Cursor sessions **do not expose MCP tools** to the agent (or only a subset), even if ForgeTrail shows **connected** in MCP settings. That is a **client/session bridge** limitation—not proof that `getNewProjectKickoff` is undefined in the server.

**Verify the server (in a chat that can call MCP):** invoke tool **`ping`**. Check **`forgetrail-mcp version`** is **≥ 0.2.1** (kickoff tools registered with correct names) or **≥ 0.2.2** (clearer `ping` text). **`ping` does not run `tools/list`**—it only confirms this process, version, and paths; the kickoff tool names in the response are a static hint, not proof your client exposes them.

**If you must replicate the kickoff bundle from this repo** (same sources as `buildNewProjectKickoff` in `mcp-server/src/index.ts`), read and apply in order:

1. `content/NEW_PROJECT_BOOTSTRAP.md` — methodology and next steps  
2. If `appledger` is installed, run **`appledger init`** in the customer repo (pass **`--name`** when the name is known). Otherwise create the manifest, `profiles/forgetrail.yaml`, an application record, and a session record by hand.  
3. `content/POST_BOOTSTRAP_USER_MESSAGE.md` — how the first user-facing reply should read  
4. `content/cursor-rules/forgetrail-phase-status.mdc` — write to `.cursor/rules/forgetrail-phase-status.mdc` in the customer repo (Cursor only)  
5. `content/cursor-rules/forgetrail-lessons-gate.mdc` and `forgetrail-lessons-mcp.mdc` — write to `.cursor/rules/` (lessons + anti-patterns gate before large work)  
6. `content/USER_REPLY_FORMAT.md` — numbered vs bullet vs letter lists (also summarized inside the phase `.mdc` rule)

**Prefer:** switch to a Cursor mode that exposes ForgeTrail MCP to the agent, or call **`kickoffGreenfield`** (no parameters) if **`getNewProjectKickoff`** does not appear in the tool list.
