# ForgeTrail Integration Guide for Cursor

Cursor agents (Composer, Agent mode) map well to ForgeTrail via MCP, **Cursor rules**, optional **subagents** (Task tool), and **Plan mode**.

## Primitives → ForgeTrail

| Cursor capability | ForgeTrail use |
|-------------------|--------------|
| ForgeTrail MCP tools | Methodology delivery — `getNewProjectKickoff`, `getPhaseGuidance`, `getCompanionSuggestions`, `runAudit`, `validateTracking`, etc. |
| `.cursor/rules/*.mdc` | Persistent phase + lessons discipline from kickoff (`forgetrail-phase-status`, `forgetrail-lessons-gate`, `forgetrail-lessons-mcp`) |
| Plan mode (`SwitchMode` / plan) | Phase 1 architecture — explore before edits; export to `PHASE_1_BRIEF.md` on approval (`getPlanModePatterns`) |
| Task / subagents (`explore`, `generalPurpose`, `shell`) | Parallel audits (Phase 7), research (Phase 4), spikes (Phase 5) — call `suggestSubagentDecomposition` first |
| TodoWrite | Mirror open exit criteria from tracking (visible next actions) |

## Recommended session openers

**New project:**
```
Call ForgeTrail getNewProjectKickoff (includeCursorRule true), write .forgetrail/ and .cursor/rules/, then getPhaseGuidance("1").
Use plan mode for Phase 1 if available. Lock PHASE_1_BRIEF.md before scaffolding.
```

**Resume:**
```
Call getResumeSessionInstructions. Read .forgetrail/workflow_tracking.json and CONTEXT_PROMPT.md.
```

## Subagent patterns

**Phase 7 example:**
```
Call suggestSubagentDecomposition for phase 7 and task "black-hat, UX cohesion, code quality audits".

Launch parallel explore subagents (readonly) for each audit type using runAudit + searchLessons.
Parent synthesizes BLACK_HAT_REPORT.md and CODE_QUALITY.md, updates tracking gotchas/decisions.
```

Use `run_in_background` for long subagents when appropriate.

## Tracking sync

After subagent or feature work:
- Update `.forgetrail/workflow_tracking.json` (exit criteria, decisions, gotchas, sessions).
- Run **`validateTracking`**.
- Update `CONTEXT_PROMPT.md` when architecture or patterns change.

## Skills alternative

Cursor users typically rely on **rules** from kickoff rather than Grok-style skills. Optional: add **`getForgeTrailSkill`** content as a global Cursor skill if your workflow supports it.

Optional house neighbors (one per current job, never required): Smell Check, Detangler, Misemphasis, Cold-eye, TemperPass, Gap Last. Call **`getCompanionSuggestions`** when a trigger matches. Do not install the set.

## MCP setup

Register the ForgeTrail MCP server in Cursor settings with `FORGETRAIL_ROOT` pointing at the ForgeTrail repo. Reconnect after server updates so new tools appear.
