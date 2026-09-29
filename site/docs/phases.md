---
title: Phases
---

ForgeTrail encodes a seven-phase sequence. Each phase has entry and exit criteria. The agent tracks progress, proposes when to advance, and waits for your call.

| Phase | Name | What happens |
| --- | --- | --- |
| 1 | **Plan** | Lock architecture in `PHASE_1_BRIEF.md` before code |
| 2 | **Build** | Full runnable spine in one pass |
| 3 | **Stabilize** | Env, paths, auth: make the foundation solid |
| 4 | **Iterate** | Feature by feature with real data |
| 5 | **Refine** | Systematic cleanup before complexity owns you |
| 6 | **Align** | Cut what does not serve the product vision |
| 7 | **Harden** | Security, performance, production docs |

Phases 4 and 5 often alternate. Full playbooks: [WORKFLOW.md](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/WORKFLOW.md). Docs arrive progressively (brief first; no empty boilerplate on day one).

## What stays in the repo

Phase state lives in `appledger/profiles/forgetrail.yaml`. Decisions, lessons, and the session handoff are records in `appledger/`, not a chat transcript. The next session reads that ledger and continues.

Product story: [forgetrail.dev](/).
