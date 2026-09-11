---
title: Repo layout
---

## After Phase 2 (typical app)

```
my-app/
  .forgetrail/
    workflow_tracking.json
    FORGETRAIL_LITE.md
    IDEAS.md
  CONTEXT_PROMPT.md
  docs/
    GENESIS.md
    PHASE_1_BRIEF.md
  README.md
  TODO.md
  src/
```

Later phases add docs only when needed (`TECHNICAL_REFERENCE`, `DESIGN_SYSTEM`, `BRAND_AND_PRODUCT`, hardening docs).

## What's in the methodology repo

```
forgetrail/
  RESUME.md                 Resume this methodology repo (not an app)
  TRY_FORGETRAIL.md         Human prove-it path
  WORKFLOW.md               7-phase lifecycle
  INITIAL_PROMPT.md         App starter (do not use on this repo)
  CONTINUATION_PROMPT.md    App resume (do not use on this repo)
  site/                     forgetrail.dev (FilePress + /docs mount)
  content/FORGETRAIL_LITE.md
  docs/                     Phase templates for apps
  mcp-server/
```

Doc templates use `[BRACKETED]` placeholders. MCP serves **shell** or **full** mode. Methodology is stack-agnostic; embedded lessons lean SvelteKit + PocketBase + common LLM providers.

## Prerequisites

- **Try:** any LLM chat + any file-reading coding agent. No Node required.
- **MCP / CLI:** Node.js 20+.
- **Lite greenfield (when the agent scaffolds):** Git, Node.js 20+, npm, pnpm (Lite §4.1).
- **gstack (optional):** [gstack](https://github.com/garrytan/gstack) for sprint skills inside ForgeTrail phases.
- **Companions (optional):** [Catalyst Forge tools](https://catalystforge.com/tools/) suggested at the moment of need (FilePress, LocalSlip, LocalHelm, practice skills). Never required to start.
