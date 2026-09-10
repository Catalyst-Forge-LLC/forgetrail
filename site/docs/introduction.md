---
title: Introduction
---

**ForgeTrail** keeps project decisions, development state, and lessons in the repository so the next AI-assisted session can continue with context.

**Forge the path. Keep the trail.**

Most AI coding sessions forget everything when you close the tab. ForgeTrail keeps the phase you are in, the decisions you made, and the gotchas you hit inside the app repo.

It is not a library, a SaaS, or a plugin. It is a methodology encoded into files your agent reads, follows, and updates. Distilled from Catalyst Forge production work.

## The persisted outcome

After a first sitting you should see:

- `.forgetrail/FORGETRAIL_LITE.md` (or MCP tools serving the same protocol)
- `.forgetrail/workflow_tracking.json`
- `docs/GENESIS.md` and, once drafted, `docs/PHASE_1_BRIEF.md`

The installer can place the Lite file. The agent writes tracking, the brief, decisions, and session notes. Those updates are not automatic. Empty tracking after a busy session is a protocol miss.

A labeled two-session walk-through, including a `lite-1` excerpt, is on [Continuity](/docs/continuity).

## The problem those files solve

- **Context evaporates between sessions.** Every new chat starts from zero unless the repo holds the trail.
- **No structure, no momentum.** Features land in random order. Hardening gets skipped.
- **You manage the AI instead of building.** Re-explaining architecture eats the session.
- **Decisions get lost and mistakes repeat.** A gotcha from session 3 returns in session 6 if nobody wrote it down.

## Three paths, one trail

| Path | Who uses it | Host needs | What runs |
| --- | --- | --- | --- |
| **Lite** | First-time and small-project users | A coding agent that can read files. Node is optional. | You copy or install one protocol file. The agent follows it and writes tracking. |
| **CLI** (`forgetrail`) | People who want files placed by a command | Node.js 20+ | An installer. Lite, or the full template tree. It does not run the agent. |
| **MCP** (`forgetrail-mcp`) | People who want methodology tools in the IDE | Node.js 20+, an MCP client, `FORGETRAIL_ROOT` | Tools for kickoff, resume, and lessons. The app still owns `.forgetrail/workflow_tracking.json`. |

Recommended first path: [Try](/docs/try). Stay on Lite until you want IDE tools or a vendored template tree.

Do not add `forgetrail` to an app's `dependencies`. Do not merge `forgetrail` and `forgetrail-mcp`.

## Two surfaces

| Surface | What it is |
| --- | --- |
| [forgetrail.dev](https://forgetrail.dev) | Product story: home, Try, About |
| [forgetrail.dev/docs](https://forgetrail.dev/docs) | This guide: install, CLI, MCP, phases, continuity |

GitHub remains the source of truth for methodology files.

## Next

- [Try](/docs/try): Genesis plus Lite, no MCP required
- [Continuity](/docs/continuity): two sessions, one tracking file
- [Install](/docs/install): npm, pnpm dlx, or a checkout
- [MCP](/docs/mcp): always-current tools in the IDE
