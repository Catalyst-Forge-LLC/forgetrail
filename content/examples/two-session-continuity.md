# Two-session continuity (illustrative)

This is a labeled example. The project is fictional. It shows how ForgeTrail Lite state survives a closed chat, and how the next session is supposed to consume it.

Nothing here is a benchmark, an adoption claim, or a client record. The record shape matches `appledger/` records.

## The job

Build a local CLI, **desk-stamp**, that stamps today's date on markdown notes in the current folder. Weekend tool. No hosted database.

## Session 1 (human + coding agent)

The human created an empty folder, wrote `docs/GENESIS.md`, and added Lite by copying [`content/FORGETRAIL_LITE.md`](../FORGETRAIL_LITE.md) to `.forgetrail/FORGETRAIL_LITE.md`. No Node was required for that copy.

The human pasted the kickoff line from [TRY_FORGETRAIL.md](../../TRY_FORGETRAIL.md). The **agent** (not the CLI) then:

1. Created `appledger/` with a manifest, a ForgeTrail profile, an application record, and a session record.
2. Drafted `docs/PHASE_1_BRIEF.md`.
3. Recorded one decision and one lesson.
4. Stopped after the human approved the brief. No application scaffold yet.

The CLI, if used instead of a hand copy, writes the Lite file, hook scripts, and an optional Genesis stub. It does not write a tracking JSON file and it does not fill in the phase, decisions, or session. Those writes depend on the agent following the protocol.

### What was left unfinished

The `plan` phase is `in_progress`. The brief is approved and the stack is locked. The first stamp command is not agreed. The next session still has to agree that command, then scaffold.

### Persisted excerpt

Labeled excerpt at the end of session 1. Fields match ledger records. This is not a complete file.

```yaml
phase: plan
status: in_progress
choice: TypeScript CLI, files on disk only, no hosted store
rationale: Weekend tool. A database would be a second product.
problem: On Windows, npm 12 npx forgetrail failed to spawn the bin
resolution: Use pnpm dlx forgetrail, or copy FORGETRAIL_LITE.md by hand
left_off: Phase 1 brief approved. Stack locked. Hero flow not agreed.
next_steps:
  - Agree the first stamp command, then scaffold. Do not reopen the no-database decision.
```

`appledger orient` prints the phase, decision choices, lessons, and the latest session time and next steps. The view can omit a fact that was stored only inside an older session body.

## Session 2 (new chat, same folder)

The human opened a new agent chat in the same folder and said: follow `.forgetrail/FORGETRAIL_LITE.md` and continue from `appledger/`.

The agent read the profile and the latest session first. Visible consequences:

- It did not re-ask whether to add a database. That choice is already a decision record.
- It used `pnpm dlx` on Windows instead of `npx forgetrail`, because a lesson already recorded the spawn failure.
- It treated `docs/PHASE_1_BRIEF.md` as locked and asked only about the unfinished hero flow, the first stamp command, before writing application code.

That is the trail: a phase, a decision, a lesson, and a next step. The next chat does not have to reconstruct them from memory.

## What persists, and who writes it

| Artifact | Who writes it | Automatic? |
| --- | --- | --- |
| `.forgetrail/FORGETRAIL_LITE.md` | Human copy, or `forgetrail install --lite` | The file copy is automatic once you run install. Following it is not. |
| `docs/GENESIS.md` | Human, or `--with-genesis-stub` plus later edits | Stub only if you asked the CLI for it. |
| `appledger/` | The agent, on first kickoff and after substantive work. The installer does not write it. | No. An empty ledger after a busy session is a protocol miss. |
| `docs/PHASE_1_BRIEF.md` | The agent, then the human approves | No. |
| Decision, lesson, and session records | The agent | No. The protocol tells the agent to write them. The host does not enforce the prose. |

MCP tools can hand the agent the same protocol and a lessons search. They do not replace the files in the app repo.

An existing writable `.forgetrail/workflow_tracking.json` is legacy. `appledger migrate preview` writes nothing. `apply` imports decisions, sessions, resolved gotchas as lessons, unresolved gotchas as open questions, and `IDEAS.md` / `BUGS.md` from the repository root and from `.forgetrail/`, then replaces the file with a pointer. The `appledger` package is not a published npm release. Use the [repository](https://github.com/Catalyst-Forge-LLC/appledger).

## Catalog excerpt

Keep project decisions, development state, and lessons in the repository so the next session can continue. After one sitting you should see `appledger/` with a phase, a decision, and a session next step. Full walk-through: this file, and the [continuity](https://forgetrail.dev/docs/continuity) page. The live site still shows the previous pages until it is redeployed.
