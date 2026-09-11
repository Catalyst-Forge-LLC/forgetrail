# ForgeTrail — Resume session (MCP-first)

The user is **continuing** a project that uses ForgeTrail via the **MCP server** only. There is **no** `_forgetrail/` folder in the repo.

---

## Before doing anything else

1. Read **`.forgetrail/workflow_tracking.json`** — current phase, exit criteria, notes, decisions.
2. If **`currentPhase`** is **`1-architecture`**, read **`docs/PHASE_1_BRIEF.md`** and continue planning toward a locked brief. Otherwise read **`CONTEXT_PROMPT.md`**. If Phase 2+ but CONTEXT is missing and **`PHASE_1_BRIEF.md`** exists, **merge the brief into CONTEXT** first (see CONTEXT_PROMPT template).
3. Call **`getPhaseGuidance`** for the phase matching `.forgetrail/workflow_tracking.json` → `currentPhase` (e.g. `4` for feature iteration, or keyword `features`). When a companion trigger is true, call **`getCompanionSuggestions`** for that phase or situation. Do not install unless the user asked.
4. If you need checklist context, call **`getChecklist`** (e.g. `every-session` or `full`).
5. If unsure how to update tracking fields, call **`getTrackingSchema`**.

Do **not** require `_forgetrail/WORKFLOW.md` or `_forgetrail/TRACKING_SCHEMA.md` on disk — use the MCP tools above.

---

## Rules for this session

- When exit criteria for the current phase appear met, say so explicitly and **wait for user confirmation** before advancing `currentPhase`.
- After work, **update `.forgetrail/workflow_tracking.json`** (criteria, `decisions`, `gotchas`, `sessions`) per **`getTrackingSchema`**.
- Keep **`CONTEXT_PROMPT.md`** the source of truth for architecture; edit it when decisions change.
- If stuck after **~5 turns** on one issue, propose a **fundamentally different approach**.
- If the repo has **gstack** installed, use its skills for sprint execution (build/review/qa/ship) within ForgeTrail phases — see **WORKFLOW.md §1b** or call **`getPhaseGuidance`** for phase-specific gstack integration. After each gstack sprint, update `.forgetrail/workflow_tracking.json`.

---

## User fill-in (optional)

**Last session we completed:** _______________

**Today I want to focus on:** _______________

**New context since last session:** _______________
