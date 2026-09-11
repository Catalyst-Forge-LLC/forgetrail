# ForgeTrail MCP Server

A local MCP server that exposes the ForgeTrail methodology to any MCP-compatible AI agent — Cursor, Claude Desktop, Claude Code, Windsurf, etc.

## Setup

**No MCP yet?** Prove ForgeTrail with Genesis + Lite first: see repo-root **[TRY_FORGETRAIL.md](../TRY_FORGETRAIL.md)**.

From npm (no clone required for the bin):

```bash
npx -y forgetrail-mcp
```

Set `FORGETRAIL_ROOT` to a `forgetrail` install (`npx` / `pnpm add -g forgetrail`, or `node_modules/forgetrail`), or install `forgetrail` beside this package so it can find `WORKFLOW.md`.

From the **ForgeTrail repo root** (local clone):

```bash
pnpm run mcp:build              # install deps + compile dist/ + print Cursor MCP config
pnpm run mcp:status             # dist/, content/, Cursor mcp.json
pnpm run mcp:ping               # live JSON-RPC ping tool call
forgetrail mcp cursor-config      # reprint .cursor/mcp.json template
```

Or manually:

```bash
cd mcp-server
pnpm install
pnpm run build
```

If the app already has **`docs/GENESIS.md`**, after MCP is connected call **`ingestPlanArtifact`** (or tell the agent to) before locking Phase 1. To draft a Genesis file, call **`getGenesisSpecPrompt`** or follow TRY_FORGETRAIL.md.

## Tools exposed

| Tool | Description |
|---|---|
| `ping` | **Connectivity check:** returns `ok`, package version, `FORGETRAIL_ROOT`, and whether `WORKFLOW.md` is readable — use to verify the client reaches ForgeTrail |
| `getNewProjectKickoff` | **One-call greenfield setup:** bootstrap + starter `.forgetrail/workflow_tracking.json` + post-bootstrap user-message guidance + optional Cursor rule (`includeCursorRule: false` if not using Cursor) |
| `kickoffGreenfield` | Same as `getNewProjectKickoff` with Cursor rule included; **no parameters** (use if the client mishandles optional args) |
| `kickoffGreenfieldNoCursor` | Same bundle **without** the Cursor `.mdc` section; **no parameters** |
| `getProgressiveDocSchedule` | WORKFLOW §1a: Phase 1 = PHASE_1_BRIEF + tracking; Phase 2 = merge brief → CONTEXT_PROMPT + README + TODO + IDEAS + spine; rest later |
| `getNewProjectBootstrap` | **MCP-first onboarding:** same as kickoff bundle’s methodology section alone; maps phases to MCP tools |
| `getForgeTrailLite` | **Portable Lite protocol:** full `FORGETRAIL_LITE.md` for drop-in / paste bootstrap (no MCP required in the app repo) |
| `getForgeTrailLiteUpdates` | Starter `.forgetrail/FORGETRAIL_LITE_UPDATES.md` for local Lite protocol feedback (§1.6) |
| `getGenesisSpecPrompt` | **Pre-Phase-1:** copy-paste prompt for an external LLM chat; save as **`docs/GENESIS.md`**. Humans: **TRY_FORGETRAIL.md**. Feed into `ingestPlanArtifact` |
| `getGreenfieldIntakePrompt` | **Phase 1:** exports (PDF/DOCX/PPTX, etc.), tenancy, hybrid vs full spec, compliance, hero flow, registrar/DNS/git/hosting — complements `getChecklist(before-session-1)` |
| `getForgeTrailCursorPhaseRule` | **Cursor:** optional `.cursor/rules/forgetrail-phase-status.mdc` — agents show phase / next actions from `.forgetrail/workflow_tracking.json` |
| `getForgeTrailCursorLessonsRules` | **Cursor:** `.cursor/rules/forgetrail-lessons-gate.mdc` + `forgetrail-lessons-mcp.mdc` — when to call `getAntiPatterns` / `searchLessons` before large work (also bundled in `getNewProjectKickoff`) |
| `getScaffoldInstallParams` | **Phase 2:** PocketBase (**latest** unless pinned), one-click launchers, **isolated** `test:pocketbase` / `setup:ollama` / `test:ollama` — **SYSTEM_HEALTH_CHECKS.md**, `scripts/*.mjs` |
| `getInitialWorkflowTracking` | Starter `.forgetrail/workflow_tracking.json` text (exit criteria rewritten for MCP; write to `.forgetrail/workflow_tracking.json`) |
| `getPostBootstrapUserMessage` | **After tracking exists:** how the first reply to the user should read—short; no tool/JSON dump |
| `getUserReplyFormat` | **Lists and choices:** numbers vs bullets vs letters when presenting options (matches Cursor `forgetrail-phase-status.mdc`) |
| `getResumeSessionInstructions` | **MCP-first resume:** session-start steps when ForgeTrail is only on MCP |
| `getPhaseGuidance` | Phase-specific guidance (1-7): entry/exit criteria, playbook, prompt patterns, optional companions footer |
| `getCompanionSuggestions` | Optional sibling tools for a phase or situation (FilePress, LocalSlip, skills, xFacts). Never required |
| `searchLessons` | Keyword search across the full lesson database (71+ lessons, anti-patterns, insights) |
| `getTemplate` | Doc template from `docs/*.md` (includes **`SPEC_FEATURE_TEMPLATE`**, `PHASE_1_BRIEF`, …). `mode: "shell"` strips 💡/📝/🔧 blockquote callouts. Default: `FORGETRAIL_TEMPLATE_DEFAULT_MODE` or `shell` |
| `runAudit` | Get a structured audit prompt (security, pre-launch, marketing, competitor, docs, copy) |
| `getChecklist` | Project checklist by milestone or in full |
| `getTrackingSchema` | The `workflow_tracking.json` schema reference (live file: `.forgetrail/workflow_tracking.json`) |
| `getAntiPatterns` | All documented failure modes and how to avoid them |

## Environment

| Variable | Purpose |
|----------|---------|
| `FORGETRAIL_ROOT` | Path to ForgeTrail repo root if not next to `mcp-server/` |
| `FORGETRAIL_TEMPLATE_DEFAULT_MODE` | `full` or `shell` — default when `getTemplate` omits `mode` (unset = `shell`) |
| `FORGETRAIL_QUIET` | Set to `1` or `true` to hide the stderr startup banner (hints for Cursor / first prompts) |

On startup, the server prints a short **stderr** banner with agent prompt hints (client setup JSON is printed by **`pnpm run mcp:build`**). **Do not** log to stdout — MCP uses stdout only for JSON-RPC.

## Configure in Cursor

Add to your Cursor MCP settings (`.cursor/mcp.json` in the project root, or globally).

From npm:

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

`FORGETRAIL_ROOT` must point at a tree that contains `WORKFLOW.md` and `content/` (a clone, or the installed `forgetrail` package). Omit it only when `forgetrail` is resolvable next to the MCP package.

From a local clone:

```json
{
  "mcpServers": {
    "forgetrail": {
      "command": "node",
      "args": ["Z:/workspace/forgetrail/mcp-server/dist/index.js"],
      "env": {
        "FORGETRAIL_ROOT": "Z:/workspace/forgetrail"
      }
    }
  }
}
```

Run `forgetrail mcp cursor-config` from your clone for paths filled in automatically.

## Configure in Claude Desktop

Add to `claude_desktop_config.json` (on Windows: `%APPDATA%\Claude\claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "forgetrail": {
      "command": "node",
      "args": ["Z:/workspace/forgetrail/mcp-server/dist/index.js"]
    }
  }
}
```

## Configure in Claude Code

```bash
claude mcp add forgetrail node Z:/workspace/forgetrail/mcp-server/dist/index.js
```

## Custom ForgeTrail location

If your ForgeTrail repo lives somewhere other than the parent of `mcp-server/`, set `FORGETRAIL_ROOT`:

```json
{
  "mcpServers": {
    "forgetrail": {
      "command": "node",
      "args": ["/path/to/forgetrail/mcp-server/dist/index.js"],
      "env": {
        "FORGETRAIL_ROOT": "/path/to/forgetrail"
      }
    }
  }
}
```

## gstack compatibility

ForgeTrail works alongside [gstack](https://github.com/garrytan/gstack) (Garry Tan's Claude Code slash-command skills). ForgeTrail provides the lifecycle methodology and project memory; gstack provides sprint execution, browser testing, and deploy automation. The bootstrap and resume tools include gstack integration guidance when applicable. See WORKFLOW.md §1b for the full integration guide.

Optional Catalyst Forge companions (FilePress, LocalSlip, LocalHelm, practice skills, xFacts) are suggested at the moment of need via `getCompanionSuggestions`. See WORKFLOW.md §1f. None are required.

## Development

```bash
pnpm run dev    # runs via tsx (no build step)
pnpm run build  # compiles to dist/
pnpm start      # runs compiled version
```

## Testing

1. **Rebuild after changes:** `pnpm run mcp:build` (repo root) or `pnpm run build` in `mcp-server/` — Cursor loads `dist/index.js` from `mcp.json`.
2. **CLI ping (no Cursor):** `pnpm run mcp:ping` or `forgetrail mcp ping` — spawns the server and calls the **`ping`** tool; expect JSON with `ok: true`, version, and `FORGETRAIL_ROOT`.
3. **Full status:** `pnpm run mcp:status -- --ping` — static file checks, Cursor config review, and live ping.
4. **In Cursor:** Open **MCP** settings, confirm **forgetrail** is green; use **agent/chat** with *“Call the ForgeTrail `ping` tool”*. If `ping` returns version + `FORGETRAIL_ROOT` + `WORKFLOW.md: readable`, the server and content paths are good.
5. **MCP Inspector:** `pnpm run mcp:inspector` or `forgetrail mcp inspector` — browser UI to invoke **`ping`** without Cursor.

## Troubleshooting

| Symptom | What to check |
|--------|----------------|
| **Cursor shows ForgeTrail connected (green) but the coding agent cannot invoke ForgeTrail tools** | Cursor may expose only **some** MCP servers to the **agent/composer** tool bridge; the full server list in MCP settings can still differ. Try the same request in a chat mode that uses MCP tools directly, update Cursor, or use the **template-in-repo** path (`_forgetrail/` + `INITIAL_PROMPT.md`) so methodology is on disk. You can also paste outputs from running the server tools via another MCP client (e.g. Claude Desktop) or copy content from this repo (`.forgetrail/workflow_tracking.json`, `content/NEW_PROJECT_BOOTSTRAP.md`). |
| **Agent says it will “replicate” kickoff from the repo** | That is normal when MCP tools are not visible in **that** session. See **`content/KICKOFF_WITHOUT_MCP.md`** for the same file order as `getNewProjectKickoff`, or call **`ping`** where tools work to confirm **`forgetrail-mcp` ≥ 0.2.1** (version/path check; `ping` does not replace **`tools/list`**). |
| **`getNewProjectKickoff` / `kickoffGreenfield` not found; agent falls back to reading files** | Call **`ping`**. If **`forgetrail-mcp version`** is **below 0.2.1**, rebuild `mcp-server` (`pnpm run build`) and restart MCP / Cursor — older builds omitted the `server.tool("name", …)` name for kickoff/bootstrap. **`ping` text lists expected tool names but does not enumerate the live tool list**; if the version is new but the client still hides tools, it is a client/session bridge issue—see **`KICKOFF_WITHOUT_MCP.md`**. |
| **`NEW_PROJECT_BOOTSTRAP.md` / templates not found** | Set **`FORGETRAIL_ROOT`** to your ForgeTrail repo root in `mcp.json` `env` (see [Custom ForgeTrail location](#custom-forgetrail-location)). |
| **Server fails to start** | Run `pnpm install` and `pnpm run build` in `mcp-server/`; ensure **`args`** points at **`mcp-server/dist/index.js`** (not `src/`). |
| **Strange JSON-RPC errors** | Anything that writes to **stdout** besides MCP JSON-RPC breaks the protocol. The server logs hints to **stderr** only; do not wrap `node` in a script that prints to stdout. |

**Note:** Another MCP server showing **Errored** (e.g. `browsermcp`) does not mean ForgeTrail failed; fix or disable the broken server separately.
