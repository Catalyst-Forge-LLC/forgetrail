> **App projects only.** Paste this file into a coding-agent chat to **resume an app** that already uses ForgeTrail.
> If you are working in the **ForgeTrail methodology repo** itself, stop and read `RESUME.md` (and `TODO.md`). Do not follow the steps below here.

## Instructions

I'm continuing work on [APP NAME]. You are following ForgeTrail, a structured phase-based development workflow. Your job is to track progress and pause at phase transitions for my approval before advancing.

### MCP-first (no `_forgetrail/` in this repo)

**Before doing anything else:**

1. Call ForgeTrail MCP **`getResumeSessionInstructions`** and follow it.
2. Read **`appledger/profiles/forgetrail.yaml`** and the latest session record. If the phase is **plan**, read **`docs/PHASE_1_BRIEF.md`**. Otherwise read **`CONTEXT_PROMPT.md`** (if a later phase is current but CONTEXT is missing and the brief exists, **merge the brief into CONTEXT** first per the CONTEXT_PROMPT template).
3. Use **`getPhaseGuidance`** for the current phase. If a legacy `.forgetrail/workflow_tracking.json` exists and is not a pointer, run **`appledger migrate preview`** and then apply.

### Local `_forgetrail/` folder

> **Path note:** ForgeTrail files live in `_forgetrail/` by default. If the folder is elsewhere (e.g., a sibling `forgetrail/` directory), adjust paths accordingly.

**Before doing anything else:**

1. Read **`appledger/profiles/forgetrail.yaml`** and the latest session record to see where we left off.
2. Read `_forgetrail/WORKFLOW.md` for the full phase map, playbooks, and patterns.
3. Read `_forgetrail/TRACKING_SCHEMA.md` for where project state lives. The legacy JSON shape in that file is for migration only.
4. Read `CONTEXT_PROMPT.md` for the current architecture and project state — or **`docs/PHASE_1_BRIEF.md`** if still in Phase 1; if Phase 2+ and CONTEXT is empty but the brief exists, merge brief → CONTEXT first.

**Rules for this session:**

- When you believe a phase's exit criteria are met, tell me explicitly: "I think we've completed [Phase X]. The exit criteria are met because [reasons]. Ready to move to [Phase Y]?" Wait for my confirmation.
- After completing work, update **`appledger/`**: move satisfied criteria only when evidence exists, add decision records (with rationale), log lessons or questions, and update the session record.
- Keep `CONTEXT_PROMPT.md` updated as the source of truth for project architecture.
- If something isn't working after 5 turns, propose a fundamentally different approach rather than continuing to patch.

---

## Session Context

**Last session we completed:** _______________

**Today I want to focus on:** _______________

**Any new context or changes since last session:** _______________
