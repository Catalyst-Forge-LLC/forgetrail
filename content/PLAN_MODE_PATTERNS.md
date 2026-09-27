# Using Native Plan Modes with ForgeTrail

When your host agent supports a first-class plan mode (Grok Build `/plan` + enter/exit_plan_mode, or equivalents), use it as the implementation of ForgeTrail **Phase 1 (Architecture + Planning)**.

## Recommended Flow

1. At the very beginning of a greenfield project (or when starting Phase 1), call the agent's native plan entry point with rich context:
   - The full project description, existing work, constraints, and preferred stack.
   - The questions from `getGreenfieldIntakePrompt` (exports, tenancy, hero flow, state persistence choice, content-generation pattern, compliance).
   - Explicit instruction: "Work entirely inside plan mode. Do not write any files or code yet. Produce a complete architectural proposal with folder structure, data model, tech choices, hardest integration points, and v1 scope. Include rationale and alternatives."

2. Collaborate inside the plan artifact until architecture decisions are locked and the user has reviewed/approved them.

3. On user approval (the agent's `exit_plan_mode` or equivalent):
   - Immediately call `getTemplate({ name: "PHASE_1_BRIEF", mode: "full" })`.
   - Map/synthesize the approved plan content into the brief template (especially sections on architecture, data model, state persistence, content generation, and v1 scope).
   - Write each major decision as a decision record in `appledger/`. Do not write `.forgetrail/workflow_tracking.json`.
   - Optionally call `ingestPlanArtifact` with the full approved plan text to produce a `PHASE_1_BRIEF.md` draft and decision records (review and lock before Phase 2).

4. The approved `docs/PHASE_1_BRIEF.md` and those decision records become the handoff so Phase 2 can begin "cold" without replaying the entire planning conversation.

## Grok Build Specifics

- Enter with `/plan` or Shift+Tab (cycles to Plan mode).
- The generated `plan.md` lives in the session directory.
- Use `exit_plan_mode` (via tool or UI) only after the user explicitly approves the plan.
- After exit, read the plan artifact and perform the mapping above.

## Cross-Agent Equivalents

- Claude: Extended "think step-by-step + produce plan artifact + ask for review before any code".
- Cursor: Composer planning mode or explicit "plan first" with file output.
- Generic agents: Instruct them to produce a standalone `plan.md` file first, then treat approval as the Phase 1 gate.

## Artifacts That Must Result from Phase 1 (Plan or Not)

- `docs/PHASE_1_BRIEF.md` (locked)
- `appledger/` with the `plan` phase in progress and those decision records. Do not create `.forgetrail/workflow_tracking.json`.
- (Later) `CONTEXT_PROMPT.md` will merge the brief in Phase 2

Never proceed to scaffolding until the user confirms the plan/brief is locked.

See `getPhaseGuidance("1")` and `getGreenfieldIntakePrompt` for the detailed playbook and questions.