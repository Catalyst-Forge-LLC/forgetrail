---
title: Continuity
---

This page is a labeled example. The project is fictional. It shows what persists between two ForgeTrail Lite sessions, where those files live, and how a new chat is supposed to consume them. It is not a benchmark or an adoption claim.

The full write-up lives in [`content/examples/two-session-continuity.md`](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/content/examples/two-session-continuity.md).

## What persists

ForgeTrail keeps state in the **app** repo, not in a hosted project database.

| File | Job |
| --- | --- |
| `.forgetrail/FORGETRAIL_LITE.md` | The protocol the agent is told to follow |
| `appledger/profiles/forgetrail.yaml` | Current phase and criteria |
| `appledger/records/` | Decisions, lessons, and the session handoff |
| `docs/GENESIS.md` | What to build, not how |
| `docs/PHASE_1_BRIEF.md` | Locked plan the next session must not silently reopen |

ForgeTrail instructs the agent to read the ledger, preserve approved decisions, and pause at approval gates. The agent must write the handoff. The CLI can write the Lite file, the hook scripts, and an optional Genesis stub. The agent writes the ledger, the brief, decisions, and session notes. Those updates are not automatic. Optional hooks point the session at `appledger/` and check for a session note at stop.

## Session 1, then a closed chat

Fictional weekend CLI, **desk-stamp**: stamp today's date on local markdown notes. No hosted store.

The human added Lite, pasted the [Try](/docs/try) kickoff line, approved the Phase 1 brief, and stopped before scaffold. The ledger at the end of that sitting:

```yaml
# appledger/profiles/forgetrail.yaml
phase: plan
status: in_progress
```

```yaml
# decision record
choice: TypeScript CLI, files on disk only, no hosted store
rationale: Weekend tool. A database would be a second product.
```

```yaml
# lesson record
problem: On Windows, npm 12 npx forgetrail failed to spawn the bin
resolution: Use pnpm dlx forgetrail, or copy FORGETRAIL_LITE.md by hand
```

```yaml
# session record
left_off: Phase 1 brief approved. Stack locked. Hero flow not agreed.
next_steps:
  - Agree the first stamp command, then scaffold. Do not reopen the no-database decision.
```

`appledger orient` includes the phase, each decision choice, each lesson, and the latest session time and next steps. It is a view. It does not replace the records.

## Session 2, new chat

The human opened a new agent chat in the same folder and said: follow `.forgetrail/FORGETRAIL_LITE.md` and continue from `appledger/`.

Visible consequences:

- The agent did not re-ask whether to add a database. That choice is already a decision record.
- On Windows it used `pnpm dlx` instead of `npx forgetrail`, because a lesson already recorded the spawn failure.
- It treated the Phase 1 brief as locked and asked only about the unfinished hero flow before writing application code.

## Lite, CLI, and MCP

The files above are the product. The three install paths are ways to get the protocol into the agent's hands.

| Path | Who uses it | Host needs | What it writes |
| --- | --- | --- | --- |
| **Lite** (recommended first) | Anyone with a coding agent that can read files | A new empty project folder. Node is optional. | A protocol file you copy, or the same file via the CLI. The agent then creates `appledger/`. |
| **CLI** (`forgetrail`) | People who want the installer to place files | Node.js 20+ | Lite and Cursor hooks, or the full template tree. It skips files that already exist, and it does not run the agent. |
| **MCP** (`forgetrail-mcp`) | People who want methodology tools inside Cursor or Claude | Node.js 20+, an MCP client, and `FORGETRAIL_ROOT` | Nothing in the app except what the agent writes after calling tools. The ledger still lives in `appledger/`. |

Stay on Lite for a small tool. Add MCP when you want searchable lessons and phase playbooks in the IDE. Use a full `forgetrail install` (no `--lite`) only when you want the whole template tree on disk.

Lessons in the Lite file and in MCP `searchLessons` are first-party production notes from Catalyst Forge projects. They are not independent adoption evidence. In this example, the Windows `npx` lesson is the kind of note a later session is supposed to honor.

## Start

The shortest supported first task is the [Try](/docs/try) recipe: Genesis, Lite, kickoff line, approve the Phase 1 brief. You do not have to run all seven phases.
