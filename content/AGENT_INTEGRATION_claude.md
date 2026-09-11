# ForgeTrail Integration Guide for Claude Code / Claude agents

Claude-based coding agents integrate with ForgeTrail through MCP, extended planning discipline, and optional parallel workers (where the host exposes them).

## Primitives → ForgeTrail

| Capability | ForgeTrail use |
|------------|--------------|
| ForgeTrail MCP | `getNewProjectKickoff`, `getPhaseGuidance`, `getCompanionSuggestions`, `runAudit`, `searchLessons`, `validateTracking` |
| Extended planning / "plan before code" | Phase 1 — produce a reviewable plan artifact; lock `PHASE_1_BRIEF.md` before scaffolding (`getPlanModePatterns`) |
| gstack slash commands (optional) | Sprint execution inside phases — see WORKFLOW §1b; persist outcomes in tracking |
| Subagents / agent teams (when available) | Parallel audits and research — `suggestSubagentDecomposition` |
| Project `CLAUDE.md` / `AGENTS.md` | Trailer-ban + methodology pointers from kickoff `.forgetrail/` copies |

## Session openers

**New project:**
```
Call ForgeTrail getNewProjectKickoff, write .forgetrail/workflow_tracking.json, getGreenfieldIntakePrompt, getPhaseGuidance("1").
No app code until PHASE_1_BRIEF.md is locked.
```

**Resume:**
```
getResumeSessionInstructions → read tracking + CONTEXT_PROMPT → continue current phase.
```

## gstack + ForgeTrail

If [gstack](https://github.com/garrytan/gstack) is installed, use WORKFLOW §1b: gstack for inner-loop build/review/QA/ship; ForgeTrail for phase state and durable docs. After every gstack sprint, update tracking.

Optional house neighbors (one per current job, never required): Smell Check, Detangler, Misemphasis, Cold-eye, TemperPass, Gap Last. Call **`getCompanionSuggestions`** when a trigger matches.

## Subagents

Call **`suggestSubagentDecomposition`** before spawning workers. Phase 7: parallel security, UX, and code-quality analysis; parent writes audit docs. Phase 4: parallel research subagents; parent picks approach and implements.

## Tracking

Run **`validateTracking`** after sessions. Log decisions with rationale in Phase 1 for cold-start Phase 2.
