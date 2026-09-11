# ForgeTrail Integration Guide for Grok Build

Grok Build (the agentic TUI/CLI from xAI) has excellent native primitives that map extremely well to ForgeTrail. Treat ForgeTrail as the **lifecycle + persistent memory layer** and Grok primitives as the **execution engine**.

## Key Grok Primitives and ForgeTrail Mapping

| Grok Primitive              | ForgeTrail Phase(s)          | How to Use |
|-----------------------------|----------------------------|------------|
| `/plan` + enter/exit_plan_mode + plan.md | Phase 1 (Architecture)    | Use native plan mode for all Phase 1 work. On approval, export to `PHASE_1_BRIEF.md` + `decisions[]`. See `PLAN_MODE_PATTERNS.md`. |
| `spawn_subagent` (explore/plan/general, capability_mode, isolation: worktree, background, resume_from, personas) | All phases, especially 4, 5, 7 | Use for parallel audits (black-hat, UX, code quality), research, stabilize debugging, and exploratory spikes. Call `suggestSubagentDecomposition` first. Prefer read-only for analysis subagents. |
| `todo_write` + TODO panel   | All phases                 | Mirror open exit criteria and next actions from `.forgetrail/workflow_tracking.json`. Use as the visible "what's next" while tracking.json is the durable record. |
| Skills (`/create-skill`, SKILL.md) | All sessions             | Install the `forgetrail` skill (see `SKILL.md` in content/skills/forgetrail). It keeps phase discipline, tracking rules, and subagent patterns always active. |
| Native MCP (search_tool + use_tool) | Methodology delivery    | Register the ForgeTrail MCP server. Tools appear as `forgetrail__*`. Use `getNewProjectKickoff`, `getPhaseGuidance`, `getCompanionSuggestions`, `runAudit`, `searchLessons`, `validateTracking`, etc. |
| Headless (`grok -p ... --output-format json`) | Automation / CI       | Call kickoff/resume tools and have the agent produce structured phase state. Add exit-criteria validation in pipelines. |
| `docx` / `pptx` / `xlsx` skills + image/video gen | Phase 1 intake, Phase 6/7 deliverables | Use for exports (PDF/DOCX/PPTX), landing pages, brand assets, and marketing materials called out in greenfield intake. |
| Sessions + memory + AGENTS.md | Cross-session continuity | `.forgetrail/workflow_tracking.json` + `CONTEXT_PROMPT.md` are the ForgeTrail equivalents. Update them at session end. |

## Recommended Session Openers in Grok

For a new project:
```
Call ForgeTrail getNewProjectKickoff (includeCursorRule false), write the tracking file, then start Phase 1 using native /plan mode. Read the generated plan on approval and produce PHASE_1_BRIEF.md + decisions.
```

For resuming:
```
Call ForgeTrail getResumeSessionInstructions. Read .forgetrail/workflow_tracking.json and CONTEXT_PROMPT.md. Continue from current phase.
```

## Subagent Patterns (Grok-specific)

Example for Phase 7 Hardening:
```
Use suggestSubagentDecomposition for "black-hat security audit, UX cohesion review, and code quality audit of the current codebase".

Then spawn three subagents in parallel:
1. subagent_type: "explore", capability_mode: "read-only", persona: security-auditor, prompt: "Run the black-hat audit prompt from runAudit and searchLessons for security issues."
2. Similar for ux-cohesion and code-quality.

Main thread: synthesize results into BLACK_HAT_REPORT.md + CODE_QUALITY.md, update tracking gotchas/decisions, and present prioritized TODO items to user.
```

Use `background: true` for long-running subagents and retrieve with `get_command_or_subagent_output`.

## Tracking Sync

After meaningful work (especially subagent results or feature completion):
- Update `.forgetrail/workflow_tracking.json` (exit criteria, decisions, gotchas, sessions).
- Use `todo_write` to surface the next 3–5 open items from the tracking file.
- Update `CONTEXT_PROMPT.md` when patterns or architecture change.

## Skills Usage

Install the forgetrail skill (copy from content/skills/forgetrail/SKILL.md to ~/.grok/skills/forgetrail/SKILL.md).

Then simply say things like:
- "/forgetrail kickoff new project"
- "Use forgetrail discipline for this feature"

The skill will remind you of phases, tracking, subagents, etc.

Optional house neighbors (one per current job, never required): Smell Check, Detangler, Misemphasis, Cold-eye, TemperPass, Gap Last. Call **`getCompanionSuggestions`** when a trigger matches.

## Headless / Automation Tips

```bash
grok -p "Call ForgeTrail getNewProjectKickoff and set up the project per the bundle. Then begin Phase 1." --output-format json --always-approve
```

Parse the JSON and continue sessions with `--resume` or named `--session-id`.

## Dogfooding ForgeTrail on ForgeTrail

Use this very repo as a test case. Run a full cycle or slices with Grok Build + the local MCP server registered. Capture results back into `specs/canonical/forgetrail-modern-agents-evolution.md`.

## Registration (local dev)

```bash
grok mcp add forgetrail -- node "Z:\workspace\forgetrail\mcp-server\dist\index.js" --env FORGETRAIL_ROOT="Z:\workspace\forgetrail"
```

Or via `~/.grok/config.toml` under `[mcp_servers.forgetrail]`.

After registration, tools are discoverable via the normal MCP search/use flow in Grok.
