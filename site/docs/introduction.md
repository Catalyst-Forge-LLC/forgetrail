---
title: Introduction
---

**ForgeTrail** is a development system for building software with AI agents. It guides you from a project idea through a working core, subsequent improvements, and release preparation. Each phase has guidance, exit criteria, and a review checkpoint.

**Forge the path. Keep the trail.**

The full path is Plan, Build spine, Stabilize, Iterate, Refine, Align, and Harden. Lite concentrates on planning and the first runnable workflow; use the parts appropriate to the project.

ForgeTrail uses [AppLedger](https://appledger.dev) to keep the project's purpose, phase, decisions, evidence, lessons, and handoffs in the repository. Later sessions can read the record and continue from approved decisions. AppLedger is also usable independently.

The method is encoded in files your coding agent reads, follows, and updates. The installer places those files; it does not build the application or run an agent for you.

## The persisted outcome

After a first sitting you should see:

- `.forgetrail/FORGETRAIL_LITE.md` (or MCP tools serving the same protocol)
- `appledger/` with a profile and a session record
- `docs/GENESIS.md` and, once drafted, `docs/PHASE_1_BRIEF.md`

The installer can place the Lite file and hooks. The agent writes the ledger, the brief, decision records, and the session. Those updates are not automatic. An empty ledger after a busy session is a protocol miss.

A labeled two-session walk-through is on [Continuity](/docs/continuity).

## The problem those files solve

- **Context can be lost between sessions.** A new chat can read the project record instead of relying on an earlier conversation.
- **No structure, no momentum.** Features land in random order. Hardening gets skipped.
- **You manage the AI instead of building.** Re-explaining architecture eats the session.
- **Decisions get lost and mistakes repeat.** A gotcha from session 3 returns in session 6 if nobody wrote it down.

## Three paths, one trail

| Path | Who uses it | Host needs | What runs |
| --- | --- | --- | --- |
| **Lite** | First-time and small-project users | A coding agent that can read files. Node is optional. | You copy or install one protocol file. The agent follows it and writes `appledger/`. |
| **CLI** (`forgetrail`) | People who want files placed by a command | Node.js 20+ | An installer. Lite, or the full template tree. It does not run the agent. |
| **MCP** (`forgetrail-mcp`) | People who want methodology tools in the IDE | Node.js 20+ and an MCP client | Tools for kickoff, resume, and lessons. The app still owns `appledger/`. |

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
- [Continuity](/docs/continuity): two sessions, one ledger
- [Install](/docs/install): npm, pnpm dlx, or a checkout
- [MCP](/docs/mcp): always-current tools in the IDE
