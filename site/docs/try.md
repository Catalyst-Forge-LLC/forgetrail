---
title: Try
---

Prove ForgeTrail in one sitting: write a **what, not how** spec, drop it next to **ForgeTrail Lite**, and let your coding agent forge the path and keep the trail.

**You need:** any LLM chat and any coding agent that reads files.

**You do not need:** Node, MCP, or `forgetrail` on PATH.

**Important:** Use a **new empty project folder**. Do not run this inside a clone of the ForgeTrail methodology repo.

## Recipe

1. Copy the [Genesis prompt](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/content/GENESIS_SPEC_PROMPT.md) into ChatGPT, Claude, Grok, or a local Ollama UI.
2. Save the result as `docs/GENESIS.md` in a new empty folder.
3. Add Lite: save [FORGETRAIL_LITE.md](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/content/FORGETRAIL_LITE.md) as `.forgetrail/FORGETRAIL_LITE.md`, or `pnpm dlx forgetrail install --lite --with-genesis-stub`.
4. Paste this kickoff line into your coding agent:

> Follow `.forgetrail/FORGETRAIL_LITE.md` as the project protocol. Treat `docs/GENESIS.md` as the product spec (what, not how). Create `.forgetrail/workflow_tracking.json` and draft `docs/PHASE_1_BRIEF.md` from the Genesis file, asking me only about gaps. Do not scaffold application code until I explicitly approve the Phase 1 brief.

5. Approve the Phase 1 brief before any app scaffold.

## What “it worked” looks like

- `.forgetrail/FORGETRAIL_LITE.md` is present
- `docs/GENESIS.md` is present
- `.forgetrail/workflow_tracking.json` exists
- `docs/PHASE_1_BRIEF.md` is drafted (or clearly in progress)
- The agent asked for approval before scaffolding

Stuck? Open a [Try ForgeTrail checklist](https://github.com/Catalyst-Forge-LLC/forgetrail/issues/new?template=try-forgetrail-checklist.md) issue.

The same recipe lives in [TRY_FORGETRAIL.md](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/TRY_FORGETRAIL.md) on GitHub. Short kickoff: [Try](/try). What the next session reads: [Continuity](/docs/continuity).

Required on this path: the Lite file, a Genesis spec or the §5 intake, tracking, and a Phase 1 brief you approve. Situational: Node (only if you use the CLI), MCP, and a full template tree.

The CLI can place the Lite file. The agent creates `.forgetrail/workflow_tracking.json`. That write is not automatic.

## Graduation

1. Stay on Lite for small tools. Enough for many projects.
2. Add [MCP](/docs/mcp) when you live in Cursor or Claude and want tools in the IDE.
3. Full `_forgetrail/` only when you need vendored templates: `pnpm dlx forgetrail install`.

Lite, CLI, and MCP compared: [Introduction](/docs).
