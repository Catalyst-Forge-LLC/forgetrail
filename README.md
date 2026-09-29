<p align="center">
  <img src="site/static/logo.png" alt="ForgeTrail" width="180" />
</p>

# ForgeTrail

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/forgetrail.svg)](https://www.npmjs.com/package/forgetrail)
[![npm mcp](https://img.shields.io/npm/v/forgetrail-mcp.svg?label=forgetrail-mcp)](https://www.npmjs.com/package/forgetrail-mcp)

**Forge the path. Keep the trail.**

ForgeTrail gives your next coding session a place to start. It keeps the phase, decisions, and handoff in your repository so an agent can read them when you resume. Start with Lite for a small project. You do not have to run all seven phases to try the method.

ForgeTrail instructs the agent to read the ledger, preserve approved decisions, and pause at approval gates. The agent must write the handoff. Those updates are not automatic. Optional hooks enforce the checks documented for their supported host.

In session one, the agent drafts a Phase 1 brief, you approve it, and the agent logs the stack decision and a note for next time. In session two, a fresh chat reads that record, skips the settled questions, finishes the open Phase 1 item, and asks to move into Phase 2 with that phase's guidance. The record is the [AppLedger](https://appledger.dev) ledger in `appledger/`: the phase in `profiles/forgetrail.yaml`, plus decision, lesson, and session records. `pnpm dlx appledger init` creates it. Labeled walk-through: [`content/examples/two-session-continuity.md`](content/examples/two-session-continuity.md).

**Docs:** [forgetrail.dev/docs](https://forgetrail.dev/docs) · **Site:** [forgetrail.dev](https://forgetrail.dev)

## Start with Lite

You need a new empty project folder and a coding agent that can read files. Node is optional.

1. Write `docs/GENESIS.md` (what, not how).
2. Copy [`content/FORGETRAIL_LITE.md`](content/FORGETRAIL_LITE.md) to `.forgetrail/FORGETRAIL_LITE.md`, or run `pnpm dlx forgetrail install --lite --with-genesis-stub` (Node.js 20+).
3. Paste the kickoff line from [TRY_FORGETRAIL.md](TRY_FORGETRAIL.md). Approve the Phase 1 brief before any scaffold.

The shortest supported first task is: create `appledger/`, draft `docs/PHASE_1_BRIEF.md`, and wait for approval. You do not have to run all seven phases. Full recipe: [Try](https://forgetrail.dev/docs/try).

## Lite, CLI, and MCP

| Path | Who uses it | What it is |
| --- | --- | --- |
| **Lite** | First path | One protocol file. The agent writes `appledger/`. |
| **CLI** (`forgetrail`) | Node.js 20+ | Installer. Writes Lite and Cursor hooks, or the full template tree. Skips files that already exist. Does not run the agent. |
| **MCP** (`forgetrail-mcp`) | Cursor or Claude | Phase guidance, templates, and lessons search. The ledger still lives in the app repo. |

```bash
pnpm dlx forgetrail install --lite --with-genesis-stub
pnpm dlx appledger init --name "Your app name"
```

MCP: `npx -y forgetrail-mcp` (0.4.2 or later finds the methodology without `FORGETRAIL_ROOT`). Prefer `pnpm dlx` on Windows. Do not add `forgetrail` to an app's `dependencies`. Do not merge the two packages.

## What you get

A 7-phase playbook, a ledger in `appledger/`, and templates pre-loaded with first-party production lessons. Each project leaves decisions, lessons, and a session handoff that future work follows. Those lesson notes are not independent adoption evidence.

Optional hooks in [`content/hooks/`](content/hooks/README.md) load the current phase at session start in Cursor or Claude Code, check ledger edits, and check for a session note at session stop. The agent still does the writing. Flags, MCP, and the phase table live in the [docs](https://forgetrail.dev/docs).

<!-- xfacts-label -->

## xFacts label

- **AppFacts:** [viewer](https://appfacts.dev/v#af1.eNp1Uk1r3DAQ_StiTg1o10mOPrUYcihJCCS3UsqsNNaqK2uENHbiLvvfi2x320tvg3hf8zRnmKC90xBxIGjhgbOjt4w-gAaZU30riYxqlDAHHx1oKIIyFmgBjfiJQEPwhmKp4C8JzZF29_vbFWhO0J4hYHQjugr4ihO-muyTaPU2J1pn0JDHKH4J8cyW9j9LTbB5tvDEloLqOAp9iHrJLGw4qE9P3csNaDhykRXYBR5tHzATXDRYSgXab2eI0MLnoYqYVSNtEk2xJ9CQ_u9RKE-UlR9SoIGioHiOcNGr6C-2G_3VHGlANWHwdsEojFbVEpWPPWWKhq6094zRBcob929qZSkFnqvRUvmV4Uh6HyhlKmVjPfhAuwMWsmrZKooaMKJbYsLlu4Yymev6_zSjIUP7pzSVMk_eUlY9Z_VOh-KFFvZh9MHW_0toTujox6peuSmmoRacKXHxwnmugiKptE3jvBzHw97w0HQoGOYiu-Wydo-PXdPXSZYbu_wGeaPbgQ) · [raw](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/APP_FACTS.md)
- **ToolFacts:** [viewer](https://toolfacts.dev/v#tf1.eNrFl01vGzcQhv_KgKekWCmOW_Rjb66bBEGc2HBc5BAEAU3O7jLictjhrFTV8H8vZndlq2qaSw-6CSuS8z6cT96ZtamfVybZHk1tXhK3eMM2RHh7fgXvkdfIpjIe1xgpI5vanFuxcVsExsWmMmvkEiiZ2pwsf1h-bypTxMpQTG2sk7DWNTE4TEVNnGXrOlycLk9MZVYheVOb3uVF2dniIUlQNXcG_0Q3yHR2JGfjIjM5LMVURtimkonF1KaID2TuK-MYPSYJNhbdz_jHEBi9qT9-uq8Mtqx76zsjGLFH4a2pTaKEI2KRkKxaK_N6IdJzPt7trmdtY_BW9IbcKqRWUYPHz9g06ESBGa1XBrSuU0NNiFi2RbBXmY4y6t8JZUO8ejQ-Y2ExdWNjwfvKBI99JsEkphYesDJ54EzjHZ5HW0potmBBz2kibT7LrGn5pVACtbuEM8gUkiBDKGCdwyzo9fOGg9jbiODJDT0mGReAo9TE4GRp7qsH6PxV0Fn410HnP_83JqWEGkFBtuA6dKsaGGXgVIBWFWTrVrZFmAOwgpeX169e3Fyfvb74fH15eVOBTR42HUqHDB8ur9-8vLj8sOw9bGyBhobk90FblKvOFnw1BG-Tw-NAX4-A0KN05ClSu4V2FgQNMViYk3F0W1bB8OT54qen-ygFLbvuAkvRaD4Kx_tRAkiHsFdV4igJvBV7q8pvt7DC7Yb40BM32Odo5bhOsPvSH1JFZmnQMPX6uTz7btn_A4CHdDb4IEdWX4QHJwOjB6tyIDP1WcY4Use4gXmMIqYv6ASeeMICiQSKs2lcokJKtg4hSMHYPD3w07mmZQzl2Kg7BLfTMydLr0aFEsLM3AwxPq46jLq5iL53Hfb2qEiqdYZaMDpiD4wNMiaHS7jpECK21m1hV_ihdDajFnIl70PLYzOrRn9aSLiZusIB8lmScGVFkI9VKWbgXX5psCYJizyLmtJMr2OvJh7Wbaaxt4c1_kZOveeHeNzasemC6xTqoV4UEALHqKUjJFANU_0-gHmHm6vJ8W-CW1HTHJWjZcTUBIwebomkCNsM2W4jWT_lWM4RfYv8DEIKOnuFv8bIG7svZf1pI5wPXIiBh4hlH3g1Mb56MHOkdmV7BFvga_cPmyAdhOTi4HHiuB4igp4xQiaCbNn2KMjfhntH0_7jQv5L1khIg4xptucpKDp_UfrPCP11FxJHjdG351eLJnARCGnqeTrFa7oVsazVby-Kd51ih-wob7V87rX6kITGq2DMdMD-uOwiHHk8GWerx5H34vXNCx1u9VE0Dvezm5VYyFH8JsnvWV825ehAqgWGSczkPuSxzkRqW_XTjgZam4u5_1SZFhOyFX3n3RndaGpzenL64-Lkl8Xpz-ZhAenztbPJL-wgHelY9GR840FIa0xCvJ2aTaM3I3ozi95lGJ-1OvgY4SG5yZIi3P8NruJhFA) · [raw](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/mcp-server/TOOL_FACTS.md)
- **SkillFacts:** [viewer](https://skillfacts.dev/v#sf1.eNqdUsFu2zAM_RWDZzvutsMA3YpsHYYFa7HkVhSFItM2F1kSSMpdUOTfB9kb1gK7bDeBenzv8ZHPMIN5U0OwE4KBPvKAypY81NDhjD4mZDCwtWr9WbS6KQioYUYWigEMXG3eba6gBlGrWcCAdUpzwXhyGKTwXifrRmzeLsAThQ4MuMwSuZET-aKWMqe4gD-GPrLDSkdc5Q7FUPW-SaMVrDz16M7OY2VDV02WgloKlU3JYzcgt5WVpVfOojhVsa8YXeSuiHCcMdjgEMwzSMxcXjCqJjFtO5CO-bhxcWp_D9wsDprdbtu-CifloycZ_xbOpQYKopydUgzyyGjduOiN6D0YwB_JkyOFGgLqU-QTGKApecJisiePq3cwwGi75olJF16N0RfCHhmDww7M_T-bb48-HtuSWzu51AjyjNwebm93jzfX28N-MxUTA-pdiftTpm7Jaylt45RsoBj2eRhQlvmgBs7hOnfLQIKW3bhDkfVrtp46q2WH7kRhKJC1d5-PdsCgH9DFKUWhwrbKHHBK3uov0a_4dMfxOzr9Qu4U-34tf0PJE-5Ryh1-fhE4PNRwzKHz2D1aVuqtUwFz_1ADDowiZReKHidUPoOBEAMu9y5Kwa4c5v7hUsMYJ0x2eHkjf4LcdDiX4XExHxeq_7gk5Ryc1bJM5YyXn2iPRHc) · [raw](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/content/skills/forgetrail/SKILL_FACTS.md)

## Development

```bash
pnpm --dir mcp-server install
pnpm run mcp:build
pnpm site:dev
```

Site (FilePress + docs mount): `pnpm ship`.

Apache-2.0 · [Catalyst Forge LLC](https://catalystforge.com)

[See the rest of the Catalyst Forge shelf.](https://catalystforge.com/tools/)
