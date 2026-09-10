---
title: Continuity
---

This page is a labeled example. The project is fictional. It shows what persists between two ForgeTrail Lite sessions, where those files live, and how a new chat is supposed to consume them. It is not a benchmark or an adoption claim.

The full write-up, including the tracking excerpt, lives in [`content/examples/two-session-continuity.md`](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/content/examples/two-session-continuity.md).

## What persists

ForgeTrail keeps state in the **app** repo, not in a hosted project database.

| File | Job |
| --- | --- |
| `.forgetrail/FORGETRAIL_LITE.md` | The protocol the agent is told to follow |
| `.forgetrail/workflow_tracking.json` | Phase, decisions, gotchas, session handoff |
| `docs/GENESIS.md` | What to build, not how |
| `docs/PHASE_1_BRIEF.md` | Locked plan the next session must not silently reopen |

The CLI can write the Lite file and an optional Genesis stub. The agent writes tracking, the brief, decisions, and session notes. Those updates are not automatic.

## Session 1, then a closed chat

Fictional weekend CLI, **desk-stamp**: stamp today's date on local markdown notes. No hosted store.

The human added Lite, pasted the [Try](/docs/try) kickoff line, approved the Phase 1 brief, and stopped before scaffold. Tracking at the end of that sitting (Lite `schemaVersion: "lite-1"`):

```json
{
  "schemaVersion": "lite-1",
  "project": {
    "name": "desk-stamp",
    "created": "2026-09-08",
    "description": "Local CLI that stamps today's date on markdown notes",
    "archetype": "one-shot",
    "status": "active"
  },
  "currentPhase": 1,
  "decisions": [
    {
      "date": "2026-09-08",
      "phase": 1,
      "decision": "TypeScript CLI, files on disk only, no hosted store",
      "why": "Weekend tool. A database would be a second product."
    }
  ],
  "gotchas": [
    {
      "date": "2026-09-08",
      "phase": 1,
      "gotcha": "On Windows, npm 12 npx forgetrail failed to spawn the bin",
      "fix": "Use pnpm dlx forgetrail, or copy FORGETRAIL_LITE.md by hand"
    }
  ],
  "sessions": [
    {
      "date": "2026-09-08",
      "phase": 1,
      "summary": "Phase 1 brief approved. Stack locked. Hero flow not agreed.",
      "nextSession": "Agree the first stamp command, then scaffold. Do not reopen the no-database decision."
    }
  ]
}
```

## Session 2, new chat

The human opened a new agent chat in the same folder and said: follow `.forgetrail/FORGETRAIL_LITE.md` and continue from tracking.

Visible consequences:

- The agent did not re-ask whether to add a database. That decision is already in `decisions[]`.
- On Windows it used `pnpm dlx` instead of `npx forgetrail`, because `gotchas[]` already recorded the spawn failure.
- It treated the Phase 1 brief as locked and asked only about the unfinished hero flow before writing application code.

## Lite, CLI, and MCP

The files above are the product. The three install paths are ways to get the protocol into the agent's hands.

| Path | Who uses it | Host needs | What it writes |
| --- | --- | --- | --- |
| **Lite** (recommended first) | Anyone with a coding agent that can read files | A new empty project folder. Node is optional. | A protocol file you copy, or the same file via the CLI. The agent then creates tracking. |
| **CLI** (`forgetrail`) | People who want the installer to place files | Node.js 20+ | Lite, or the full template tree. It does not run the agent. |
| **MCP** (`forgetrail-mcp`) | People who want methodology tools inside Cursor or Claude | Node.js 20+, an MCP client, and `FORGETRAIL_ROOT` | Nothing in the app except what the agent writes after calling tools. Tracking still lives in `.forgetrail/workflow_tracking.json`. |

Stay on Lite for a small tool. Add MCP when you want searchable lessons and phase playbooks in the IDE. Use a full `forgetrail install` (no `--lite`) only when you want the whole template tree on disk.

Lessons in the Lite file and in MCP `searchLessons` are first-party production notes from Catalyst Forge projects. They are not independent adoption evidence. In this example, the Windows `npx` gotcha is the kind of note a later session is supposed to honor.

## Start

The shortest supported first task is the [Try](/docs/try) recipe: Genesis, Lite, kickoff line, approve the Phase 1 brief. You do not have to run all seven phases.
