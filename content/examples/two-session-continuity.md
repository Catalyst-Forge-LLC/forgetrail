# Two-session continuity (illustrative)

This is a labeled example. The project is fictional. It shows how ForgeTrail Lite state survives a closed chat, and how the next session is supposed to consume it. File names match ForgeTrail `0.4.6` / Lite `schemaVersion: "lite-1"`.

Nothing here is a benchmark, an adoption claim, or a client record.

## The job

Build a local CLI, **desk-stamp**, that stamps today's date on markdown notes in the current folder. Weekend tool. No hosted database.

## Session 1 (human + coding agent)

The human created an empty folder, wrote `docs/GENESIS.md`, and added Lite by copying [`content/FORGETRAIL_LITE.md`](../FORGETRAIL_LITE.md) to `.forgetrail/FORGETRAIL_LITE.md`. No Node was required for that copy.

The human pasted the kickoff line from [TRY_FORGETRAIL.md](../../TRY_FORGETRAIL.md). The **agent** (not the CLI) then:

1. Created `.forgetrail/workflow_tracking.json` from the Lite starter in `FORGETRAIL_LITE.md` §11.
2. Drafted `docs/PHASE_1_BRIEF.md`.
3. Logged one decision and one gotcha.
4. Stopped after the human approved the brief. No application scaffold yet.

The CLI, if used instead of a hand copy, only writes the Lite file and an optional Genesis stub. It does not update tracking, decisions, or sessions. Those writes depend on the agent following the protocol.

### What was left unfinished

Phase 1 exit criteria `phase1BriefLocked` and `stackLocked` are true. `heroFlowAgreed` is still false. `currentPhase` is still `1`. The next session still has to agree the first stamp command, then scaffold.

### Persisted excerpt

Labeled excerpt of `.forgetrail/workflow_tracking.json` at the end of session 1. Shape matches the Lite starter, not the MCP string-phase starter.

```json
{
  "schemaVersion": "lite-1",
  "project": {
    "name": "desk-stamp",
    "created": "2026-09-08",
    "description": "Local CLI that stamps today's date on markdown notes",
    "sourceControl": "git",
    "archetype": "one-shot",
    "status": "active"
  },
  "currentPhase": 1,
  "phases": {
    "1": {
      "name": "Plan",
      "status": "in_progress",
      "exitCriteria": {
        "phase1BriefLocked": true,
        "stackLocked": true,
        "heroFlowAgreed": false,
        "v1ScopeAgreed": false
      }
    }
  },
  "decisions": [
    {
      "date": "2026-09-08",
      "phase": 1,
      "decision": "TypeScript CLI, files on disk only, no hosted store",
      "why": "Weekend tool. A database would be a second product.",
      "alternatives": ["Python script", "SQLite index"]
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
      "summary": "Genesis plus Lite in place. Phase 1 brief drafted and approved. Stack locked. Hero flow not agreed.",
      "nextSession": "Agree the first stamp command, then scaffold the CLI. Do not reopen the no-database decision."
    }
  ]
}
```

## Session 2 (new chat, same repo)

The human opened a new agent chat in the same folder and said: follow `.forgetrail/FORGETRAIL_LITE.md` and continue from tracking.

The agent read `.forgetrail/workflow_tracking.json` first. Visible consequences:

- It did not re-ask whether to add a database. That decision is already in `decisions[]`.
- It used `pnpm dlx` on Windows instead of `npx forgetrail`, because `gotchas[]` already recorded the spawn failure.
- It treated `docs/PHASE_1_BRIEF.md` as locked and asked only about the unfinished hero flow, the first stamp command, before writing application code.

That is the trail: phase flags, a decision, a gotcha, and a `nextSession` line. The next chat does not have to reconstruct them from memory.

## What persists, and who writes it

| Artifact | Who writes it | Automatic? |
| --- | --- | --- |
| `.forgetrail/FORGETRAIL_LITE.md` | Human copy, or `forgetrail install --lite` | The file copy is automatic once you run install. Following it is not. |
| `docs/GENESIS.md` | Human, or `--with-genesis-stub` plus later edits | Stub only if you asked the CLI for it. |
| `.forgetrail/workflow_tracking.json` | The agent, on first kickoff and after substantive work | No. Empty tracking after a busy session is a protocol miss. |
| `docs/PHASE_1_BRIEF.md` | The agent, then the human approves | No. |
| `decisions[]`, `gotchas[]`, `sessions[]` | The agent | No. The protocol tells the agent to append. The host does not enforce it. |

MCP tools can hand the agent the same protocol and a lessons search. They do not replace the files in the app repo.

## Catalog excerpt

Keep project decisions, development state, and lessons in the repository so the next session can continue. After one sitting you should see `.forgetrail/workflow_tracking.json` with a phase, a decision, and a `nextSession` line. Full walk-through: this file, and the [continuity](https://forgetrail.dev/docs/continuity) page.
