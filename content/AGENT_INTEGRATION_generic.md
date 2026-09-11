# ForgeTrail Integration Guide (generic agents)

Use this when no agent-specific guide is available. ForgeTrail is **agent-agnostic** — the lifecycle, tracking file, and MCP tools work with any capable coding agent.

## Core integration model

| Layer | Responsibility |
|-------|----------------|
| **ForgeTrail** | 7-phase lifecycle, `.forgetrail/workflow_tracking.json`, progressive docs, audits, lessons |
| **Host agent** | Tool use, file edits, terminal, optional subagents/plan modes |

ForgeTrail owns **what** and **when**. The host agent owns **execution**.

## Session openers

**New project:**
```
Call ForgeTrail getNewProjectKickoff, write .forgetrail/workflow_tracking.json, then getPhaseGuidance("1").
Lock architecture in docs/PHASE_1_BRIEF.md before any app code.
```

**Resume:**
```
Call getResumeSessionInstructions. Read .forgetrail/workflow_tracking.json and CONTEXT_PROMPT.md.
Continue from currentPhase.
```

## When the host supports subagents

1. Call **`suggestSubagentDecomposition`** with phase + task.
2. Spawn parallel workers for audits (Phase 7), research (Phase 4), or spikes (Phase 5).
3. Parent synthesizes into ForgeTrail docs and updates tracking.

Prefer **read-only** subagents for analysis; parent or a single write-capable worker for implementation.

## When the host supports plan mode

Use native plan mode for **Phase 1** only. On approval, export to `PHASE_1_BRIEF.md` + `decisions[]`. See **`getPlanModePatterns`**.

## Persistent discipline

- Install **`.cursor/rules/`** from kickoff (Cursor), or copy **`getForgeTrailSkill`** output to your agent's skill directory (Grok, etc.).
- Call **`validateTracking`** after substantive work.
- Call **`getAntiPatterns`** + **`searchLessons`** before large feature work.
- When a job matches (Markdown site, two or more local apps, copy review, shipped label), call **`getCompanionSuggestions`**. Offer one neighbor. Do not install unless the user asked.

## MCP registration

Point `FORGETRAIL_ROOT` at the ForgeTrail repo root. Run `mcp-server/dist/index.js` via stdio. Tools include `getPhaseGuidance`, `getCompanionSuggestions`, `getTemplate`, `runAudit`, `validateTracking`, `suggestSubagentDecomposition`, and `getAgentIntegrationGuide`.

Call **`getAgentIntegrationGuide({ agent: "grok" })`** (or `cursor`, `claude`) when using a supported host for tailored syntax.
