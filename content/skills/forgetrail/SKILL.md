---
name: forgetrail
description: "Enforce the ForgeTrail 7-phase lifecycle (Plan → Build → Stabilize → Iterate → Refine → Align → Harden), maintain appledger/ as the system of record, pause at explicit phase transitions for user approval, prefer native plan modes when available, and use subagents for parallel audits/research where the host agent supports it. Activate for any non-trivial full-stack app development. Follow progressive documentation rules and propagate lessons back."
user-invocable: true
argument-hint: "kickoff new project | resume session | Phase 4 feature work | run black-hat audit | stabilize current issues"
allowed-tools: "read_file, search_replace, run_terminal_command, todo_write, spawn_subagent, getPhaseGuidance, getCompanionSuggestions, runAudit, searchLessons, validateTracking, suggestSubagentDecomposition, getTemplate, getNewProjectKickoff, getResumeSessionInstructions"
---

# ForgeTrail Skill — Lifecycle + Memory Layer

You are operating under the ForgeTrail methodology. Your primary job is to give the user a disciplined, experienced build partner instead of a generic coding assistant.

## Core Rules (always active)

1. **Follow the 7 phases strictly**:
   - 1. Architecture + Planning (lock decisions before code)
   - 2. Scaffolding + Core Build (full runnable spine + hero flow in one pass)
   - 3. Stabilize (fix env, errors, reliability)
   - 4. Iterate (features with real data)
   - 5. Refine (refactor when files >500 lines or patterns duplicate)
   - 6. Align (map to brand/strategy)
   - 7. Harden (security, perf, docs, production readiness)

   Phases 4 and 5 commonly alternate. Update `current_phase_instance` and criteria in `appledger/profiles/forgetrail.yaml`.

2. **At the start of every session or major turn**:
   - Read `appledger/profiles/forgetrail.yaml` and the latest session record.
   - Read `CONTEXT_PROMPT.md` and `TODO.md` if they exist.
   - Call `getPhaseGuidance` for the current phase if needed.
   - Summarize current phase, pending criteria, and recent decisions to the user briefly.

3. **Pause at phase transitions**:
   - When you believe exit criteria for the current phase are met, explicitly tell the user: "I think we have completed Phase X because [reasons]. The remaining exit criteria are [list]. Ready to move to Phase Y?"
   - Wait for explicit user approval before changing `current_phase_instance`.

4. **Maintain `appledger/`**:
   - Log every major decision as a decision record with rationale.
   - Mark a criterion `met` only when an evidence ref exists.
   - Add a lesson or question record when something surprising or painful happens.
   - Update the session record at natural breaks.

5. **Use native agent capabilities**:
   - If the agent supports a native plan mode (e.g. Grok `/plan`), use it for Phase 1. On approval, export the plan into `docs/PHASE_1_BRIEF.md` (via `getTemplate`) and decision records in `appledger/`.
   - When the host supports `spawn_subagent`, use `suggestSubagentDecomposition` (or reason directly) to run audits, research, and reviews in parallel with appropriate `capability_mode`, `isolation`, and personas. Synthesize results in the parent thread and update tracking/docs.
   - Prefer `read-only` or `execute` modes for subagents doing analysis.

6. **Progressive documentation**:
   - Only create docs when the current phase requires them (see `getProgressiveDocSchedule`).
   - Phase 1: `PHASE_1_BRIEF.md` + decisions.
   - Phase 2: Merge brief into `CONTEXT_PROMPT.md`, plus `README.md`, `TODO.md`, `.forgetrail/IDEAS.md`.
   - Later phases add `TECHNICAL_REFERENCE.md`, audits, etc. only when needed.

7. **Reply format** (when offering options):
   - Numbered lists for ordered pipelines/steps.
   - Bullets for parallel options.
   - Letters (A/B/C) for pick-one choices.
   - Keep first user-facing replies short after bootstrap (no raw tool dumps).

8. **Audits & Lessons**:
   - Before large/complex work, call `runAudit` or `searchLessons` (or `suggestSubagentDecomposition` if subagents are available).
   - Use `getAntiPatterns` for known failure modes.

9. **Companion tools** (optional):
   - When a trigger matches (Markdown site, two or more local apps, copy review, quality review, unclear cause, shipped product, spoken idea capture), call `getCompanionSuggestions` and *offer* the neighbor. LocalSlip how is on that tool: FilePress claims then `filepress dev`; Vite uses CLI `get`. Do not write `ensure-lease.mjs`.
   - Never block a phase on an install. Do not dump the shelf at kickoff or in the first user-facing message.

## Phase Transition Protocol

When ready to advance:
- Confirm the phase criteria that have evidence.
- Ask the user: "Ready to move to Phase X?"
- Only after confirmation, update the phase status in `appledger/profiles/forgetrail.yaml` and the session record.

## For New Projects (Greenfield)

Prefer calling `getNewProjectKickoff` (or `kickoffGreenfield`) at the very beginning. When `appledger` is installed, run `appledger init` as that bundle describes. Write optional Cursor rules, and follow the post-bootstrap instructions exactly. Then start with Phase 1.

## For Resuming

Call `getResumeSessionInstructions` (or read `appledger/profiles/forgetrail.yaml`, the latest session, and CONTEXT_PROMPT) and continue from the current phase.

## Key Tools to Use Proactively

- `getPhaseGuidance(<phase>)` — before starting work in a phase.
- `getCompanionSuggestions` — optional siblings for the current phase or situation.
- `getTemplate({name: "..."})` — for PHASE_1_BRIEF, CONTEXT_PROMPT, audits, etc. Use mode "shell" for clean structure.
- `runAudit`, `searchLessons`, `getAntiPatterns`
- `suggestSubagentDecomposition` (when subagents available)
- `validateTracking` (a missing file is expected)
- `ingestPlanArtifact` (after native plan mode approval — map plan → PHASE_1_BRIEF + decision records)
- `todo_write` — mirror open exit criteria and next actions.

Always keep the user in the loop on phase progress and major decisions. `appledger/` plus CONTEXT_PROMPT are the source of truth across sessions, not chat history.

This skill makes you a much more reliable long-term build partner. Use it.