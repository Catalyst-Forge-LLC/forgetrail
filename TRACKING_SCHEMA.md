# Project record

Phase, decisions, sessions, and gotchas live in **`appledger/`**.

- **`appledger/profiles/forgetrail.yaml`** holds the current phase instance and criteria. Phase ids are `plan`, `build`, `stabilize`, `iterate`, `refine`, `align`, and `harden`.
- Decision records, session records, and lesson or question records live under **`appledger/records/`**.
- Do **not** create or update **`.forgetrail/workflow_tracking.json`**. `.forgetrail/` is hooks and host integration.
- If that JSON file already exists and its `status` is not `pointer`, run **`appledger migrate preview`**, then apply once. Do not keep a second decision log.
- A file with `"status": "pointer"` and `"record": "appledger/"` is a leftover pointer. Do not add decisions, sessions, or phase status to it.

`getInitialWorkflowTracking` does not return a starter JSON file. `validateTracking` classifies an existing file. It does not accept a legacy document as healthy writable state.

The rest of this file describes the **legacy** Lite and full JSON shapes so an existing file can be recognized and migrated. It is not a template to copy into a new project.

## Legacy phase id vocabulary (Lite vs full)

Both legacy schemas describe the same seven lifecycle phases. **`scripts/forgetrail-dev-launcher.mjs`** can still read either shape. New work uses the profile ids in the table's display-name column.


| # | Lite `currentPhase` | MCP `currentPhase` | Display name |
|---|---------------------|--------------------|--------------|
| 1 | `1` | `1-architecture` | Plan |
| 2 | `2` | `2-scaffolding` | Build |
| 3 | `3` | `3-stabilization` | Stabilize |
| 4 | `4` | `4-feature-iteration` | Iterate |
| 5 | `5` | `5-refactoring` | Refine |
| 6 | `6` | `6-strategic-review` | Align |
| 7 | `7` | `7-hardening` | Harden |

**Lite (`schemaVersion: "lite-1"`):** numeric `currentPhase`; each phase has **`exitCriteria`** as `{ "flagName": true/false }`. The old copy block is **`FORGETRAIL_LITE.md`** §11. Do not write it into a project.

**Full / MCP:** string `currentPhase`; each phase has **`exitCriteriaMet`** and **`exitCriteriaRemaining`** string arrays. The old sample remains at repo-root **`workflow_tracking.json`** for migration only. `getInitialWorkflowTracking` does not return it.

## Top-Level Fields

### `project`

Static metadata. Set once at project creation (except `status`, which flips at wrap).

```json
{
  "name": "My App",
  "created": "2026-03-12",
  "description": "One-sentence description",
  "archetype": "product",
  "status": "active"
}
```

- **`archetype`** — `product` (default) | `internal-tool` | `one-shot`. Set during Phase 1 per **WORKFLOW.md §1d**. When the archetype is not `product`, **prune** non-applicable exit criteria from the phase arrays at bootstrap (e.g. drop payments/business-plan criteria for an internal tool; collapse phases 5–7 into a single polish-and-ship gate for a one-shot). Log the pruning in `decisions[]` so the removal reads as intentional. Do **not** leave inapplicable criteria in place and mark them "N/A" one by one — prune once instead.
- **`status`** — `active` (default) | `wrapped`. Set to `wrapped` when the project is finished or shelved, after running the **wrap protocol** (WORKFLOW.md §1e): sweep `gotchas[]` + `decisions[]` for generalizable lessons, run the propagation prompt (Harvest mode), add a final `sessions[]` entry with end state and handoff pointers.

### `currentPhase`

String. One of: `1-architecture`, `2-scaffolding`, `3-stabilization`, `4-feature-iteration`, `5-refactoring`, `6-strategic-review`, `7-hardening`.

Note: Phases 4 and 5 can alternate. A project might go 4 -> 5 -> 4 -> 6 -> 4 -> 7. The tracking file reflects reality, not a strict linear path.

### `phases`

Each phase has:

- `status`: `not_started` | `in_progress` | `completed` | `revisiting` (for phases you return to)
- `startedAt` / `completedAt`: ISO timestamps
- `exitCriteriaMet`: Array of strings (criteria that have been satisfied)
- `exitCriteriaRemaining`: Array of strings (criteria not yet met)
- `notes`: Array of `{ timestamp, text }` objects for anything worth recording during this phase

When Claude believes exit criteria are met, it moves items from `exitCriteriaRemaining` to `exitCriteriaMet` and proposes the phase transition.

### `decisions`

Architectural and design decisions with rationale. **Start logging in Phase 1** alongside **`docs/PHASE_1_BRIEF.md`** so Phase 2 can begin without the Phase 1 chat. After Phase 2, this array stays aligned with **Key Architectural Decisions** in `CONTEXT_PROMPT.md` (which should be populated by merging the brief).

```json
{
  "id": "d1",
  "timestamp": "2026-03-12T10:30:00",
  "phase": "1-architecture",
  "session": 1,
  "decision": "Use PocketBase instead of filesystem storage",
  "rationale": "Need multi-user support and real-time sync. Filesystem won't scale.",
  "alternatives_considered": ["SQLite", "Supabase", "No database"],
  "status": "active"
}
```

`status` can be `active`, `superseded` (replaced by a later decision), or `revisit` (flagged for reconsideration). If superseded, add `superseded_by` field with the ID of the replacement decision.

### `gotchas`

Issues, surprises, or traps encountered during development. These persist across sessions so the same mistake isn't repeated.

```json
{
  "timestamp": "2026-03-12T14:00:00",
  "phase": "3-stabilization",
  "session": 1,
  "issue": "SvelteKit .env doesn't populate process.env",
  "resolution": "Use $env/dynamic/private instead",
  "category": "environment"
}
```

Categories: `environment`, `integration`, `data-model`, `ui`, `performance`, `ai-output`, `security`, `tooling`, `other`.

### `sessions`

Log of each session with what was accomplished and where it left off.

```json
{
  "session": 1,
  "date": "2026-03-12",
  "phasesWorked": ["1-architecture", "2-scaffolding"],
  "accomplished": ["Confirmed tech stack", "Built full skeleton", "Imported 44 existing jobs"],
  "leftOff": "App runs but env vars need fixing. Phase 3 next.",
  "contextLimitHit": false,
  "approximateLines": 3500
}
```

## Update Rules for Claude

1. **After completing a task:** Update the relevant phase's `notes` and move any satisfied exit criteria.
2. **After making a decision:** Add to `decisions` array with full rationale.
3. **After hitting a gotcha:** Add to `gotchas` array immediately so it's captured.
4. **At session end:** Add a session entry to `sessions` array.
5. **At phase transition:** Update `currentPhase`, set `completedAt` on the old phase, `startedAt` on the new one.
6. **When revisiting a phase:** Set status to `revisiting`, don't overwrite the original `completedAt`.

## Custom Extensions

Projects may add custom fields to phases as needed. For example, `4-feature-iteration` has an `iterations` array for tracking feature-by-feature progress:

```json
{
  "feature": "DOCX tailoring",
  "status": "complete",
  "turnsSpent": 8,
  "approach": "Programmatic placeholder replacement",
  "notes": "LLM find/replace failed due to Word XML run splitting. Pivoted in turn 6."
}
```

Add whatever fields make sense for your project. The schema is a starting point, not a cage.

### `agentContext` (optional, top-level)

Record which agent stack drives the project and what native primitives are available:

```json
{
  "primaryAgent": "cursor-agent",
  "supportsSubagents": true,
  "supportsPlanMode": true,
  "lastSessionId": "optional-host-session-id"
}
```

### `subagentRuns` (optional, per phase)

Optional array under a phase object to log parallel subagent work (especially Phase 4, 5, 7):

```json
{
  "id": "sa-7-security",
  "description": "Black-hat audit via read-only subagent",
  "outcome": "12 findings; 2 critical — synthesized into BLACK_HAT_REPORT.md"
}
```
