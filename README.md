<p align="center">
  <img src="site/static/logo.png" alt="ForgeTrail" width="180" />
</p>

# ForgeTrail

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/forgetrail.svg)](https://www.npmjs.com/package/forgetrail)
[![npm mcp](https://img.shields.io/npm/v/forgetrail-mcp.svg?label=forgetrail-mcp)](https://www.npmjs.com/package/forgetrail-mcp)

**Forge the path. Keep the trail.**

Keep project decisions, development state, and lessons in the repository so your next AI-assisted session can continue with context.

After one sitting you should have `.forgetrail/workflow_tracking.json` with the phase you are in, a decision, and a `nextSession` line. A labeled two-session walk-through is in [`content/examples/two-session-continuity.md`](content/examples/two-session-continuity.md).

**Docs:** [forgetrail.dev/docs](https://forgetrail.dev/docs) · **Site:** [forgetrail.dev](https://forgetrail.dev)

## Start with Lite

You need a new empty project folder and a coding agent that can read files. Node is optional.

1. Write `docs/GENESIS.md` (what, not how).
2. Copy [`content/FORGETRAIL_LITE.md`](content/FORGETRAIL_LITE.md) to `.forgetrail/FORGETRAIL_LITE.md`, or run `pnpm dlx forgetrail install --lite --with-genesis-stub` (Node.js 20+).
3. Paste the kickoff line from [TRY_FORGETRAIL.md](TRY_FORGETRAIL.md). Approve the Phase 1 brief before any scaffold.

The shortest supported first task is: create tracking, draft `docs/PHASE_1_BRIEF.md`, and wait for approval. You do not have to run all seven phases. Full recipe: [Try](https://forgetrail.dev/docs/try).

## Lite, CLI, and MCP

| Path | Who uses it | What it is |
| --- | --- | --- |
| **Lite** | First path | One protocol file. The agent writes tracking. |
| **CLI** (`forgetrail`) | Node.js 20+ | Installer. Writes Lite or the full template tree. Does not run the agent. |
| **MCP** (`forgetrail-mcp`) | Cursor or Claude | Methodology tools. Tracking still lives in the app repo. |

```bash
pnpm dlx forgetrail install --lite --with-genesis-stub
```

MCP: `npx -y forgetrail-mcp` with `FORGETRAIL_ROOT` set. Prefer `pnpm dlx` on Windows. Do not add `forgetrail` to an app's `dependencies`. Do not merge the two packages.

## What you get

A 7-phase playbook, a live `.forgetrail/workflow_tracking.json`, and templates pre-loaded with first-party production lessons. Each project leaves a trail of decisions, gotchas, and breadcrumbs that future work follows. Those lesson notes are not independent adoption evidence. Flags, MCP, and the phase table live in the [docs](https://forgetrail.dev/docs).

<!-- xfacts-label -->

## xFacts label

- **AppFacts:** [viewer](https://appfacts.dev/v#af1.eNp1Uk1r3DAQ_StiTg1o10mOPrUYcihJCCS3UsqsNNaqK2uENHbiLvvfi2x320tvg3hf8zRnmKC90xBxIGjhgbOjt4w-gAaZU30riYxqlDAHHx1oKIIyFmgBjfiJQEPwhmKp4C8JzZF29_vbFWhO0J4hYHQjugr4ihO-muyTaPU2J1pn0JDHKH4J8cyW9j9LTbB5tvDEloLqOAp9iHrJLGw4qE9P3csNaDhykRXYBR5tHzATXDRYSgXab2eI0MLnoYqYVSNtEk2xJ9CQ_u9RKE-UlR9SoIGioHiOcNGr6C-2G_3VHGlANWHwdsEojFbVEpWPPWWKhq6094zRBcob929qZSkFnqvRUvmV4Uh6HyhlKmVjPfhAuwMWsmrZKooaMKJbYsLlu4Yymev6_zSjIUP7pzSVMk_eUlY9Z_VOh-KFFvZh9MHW_0toTujox6peuSmmoRacKXHxwnmugiKptE3jvBzHw97w0HQoGOYiu-Wydo-PXdPXSZYbu_wGeaPbgQ) · [raw](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/APP_FACTS.md)
- **ToolFacts:** [viewer](https://toolfacts.dev/v#tf1.eNrFl8Fy2zYQhl9lhye7Iylxe-iMbq4ae9KolkdWm0Mm44HBJYUIBFgAtKrx5N37L0VKquLm0gNvHGAB_N_uYrF8yZ6z6dUoc6ribJrd-FDyKihj6ffZPT1weOaQjbKcn9n6Gt_TbKaSsruYqDXGJEyi8Q5Tbyc_Ta7eYigmlZqIEaWTeRYjazS7KGdc10qvefzjRAw3xuUYq3Q9jv1hoXHJiJyXjP9m3aT95tZrZcd18JpjhFkKysXah4S5mHLjs6-jTAfOGcuVjbI-8F-NwVA2_fQZs1wGWYuJxJYrTmGHxc47bhljMk7JabGzT97LPp9eev88K2tylcRFGtJLQTU5P3JRsE4CHFjlwsCAlIMKYznCW1yJTA0fyrTjtPVhczy8w2JsUUA743DsW9U-gSabptAwjJpQ-9aHf3Y6aFJIEJJE7I3sWFi_fUydusmX6B1dGGeNY_rtYXFHPpCvBVFZOkqjWqX1JalSGYfARsSnUqRcTvVaRabQwBLuPfihfpW9Y3mdvZv8v-Qz7xxLUpm0I-jUmykFTk1wkfxmBBK9USVTl5Qjulksb9-tltfv54_LxWI1arG2a05rDvRxsfxwM198nFQYU5EK3yAfT0Dh23txwW0DfzvNw0AvW0BCwq597q0vd1R2giA5kKLuglZY3sXs4mr88-UpSmQV9HqOYyXBB-F4aCUQXE8nlca2kgj5rJ5E-dOONrzDQeeRWGFni6wfNAjqVHruddP6PHXSqAi-kuH45gck1SkAytp1k5s0sPqIGY1vzkmJHMJGVZ3aPJLA6CaENouC_wJ9dJF7juS8lAXlWhMREnHRmEyKbIvLszjN5FpaE4dG7RF0r6e7LJUcmrA3dcxFY-3R6jzrumr60FbFQZF6579S5buaHbhghA-F6t8Q13gT71VKHIa6-x1Cf2Mk_aBpXHei9hdHAE-q3HklDr59wNFR_Oq1xCPHwzQoznZtUNAAdagAkZIntCFSDIwj0bCvyGcwd7y93-fnB6M3vigG5YBf2RWGbU5P3icUCVXjLd1Zr3JgaItS4UoUDxUQLupzr31MDw3FrAkRN-qbbmGzB7w9nDHQ6wM1hEf-NefT1qR1B8p7jiUwSPZoIZ2HOwJ2AP734e78fv2wkN_Iagl9k9o7dhIpitJOocP-r_T8pc-HQRMUvyPjwgTUcGlR5QmTPl3uWpuTqOonKdwX_h4ZbfdOsvXk5TYOS8UVgWt_xn40m5uBu422VTp2sPP3q3fSq8pvj3pC8LowC3Hy2tvvkvxRyz9DHBxItFCzF3MoKfI0o-aXEqeehkpV47J9lp-9xmnY5_uNv_4DNJk1_w) · [raw](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/mcp-server/TOOL_FACTS.md)
- **SkillFacts:** [viewer](https://skillfacts.dev/v#sf1.eNq9lN9v20YMx_-Vg_rSGJHspsA26C1LmmKo1xqzsZcoMGSZtq6W7oy7Uzyj6d-19_1lI3n65dhe1wItgqQVyePxSH4_n4LHIH51Gai0hCAOVtqswZlUFsFlsIRHKPQWDDpuUpcWe-vEHUWg8xGMlVqhaxS9jkZosS51lUVDmjn5SDGFzEBZynu9TbMcwisO3Ei1RFtWGatNaDeyoNu2ldlqDn6jsIwMhMvBXzejgsTP4TZPLYhCriDbZwWIVC1FmUrl8FdEXe3DnTabVaF3c_zM8Lp19NFqJVLLOS2-A0qhV8JAps2SLjf6EVSqMrz_U2B1Zeh_Qe7c1sbD4Vq6vFpEmS6HTSNCriwcj2-GB03bVotC2vxU0z5fBlJZZyrsj1Z2bgCbwvflgC2IA_hriy2TDtMocPQINMoSjUBFrmQBvnY04-FluDPScV6ndUEJV2AAH4Htvf_q4oeLQi-G1M9hmW1DCwZnPJx9-DCe313fzKZRSUVg8ITG8LaSS-7XZWAqdV0tuWwLqcnyMVhst6UtSQsMczRBngOFVOs1WDetFukalLvFEZQ4eEk98flngE_GQ_7rPewmRn-EzL2T2UavVt78B9iqhCnehOd-67U1eLgMFpVaFrCcp8bJFa4jbuU9mmFtMJ467qCAEp-9x04qrYC33TqpUp8Dw7GruS5hi1X2NqFrV4TyoMcDF6851Tfsi0l3eDAMw0SxEuZc77yWVywS1NeraJQEiSKNxqI7nahWobE43LVEHSR47RN4hcbCCzRRtT5j0ckzUaTOWPTFmaham5TsR4uT6m7mEIvTY0hUN4Uu5v8OAZ_Xqj9OlBBe_t-SSIhW_scTOda-v43EH4tG-2SqxR-LWvtk68Qfi077iXqufM4Ziu8gfp_4uf69tUGA_zqggDc9B0Ed-B8saK9rcNAajojQes5CIVFHSOBG3T8kylOBP1ssxIKoQKY-FmKOx0rBYD2-1fSoWFyNrn4KR7-EVyOy1REalyBHGYRp5XJtaI4Z_pX13W2e-Q6H1K0ba45L9LstxKKShZsv9qS_w63qTXq320VZ7eS58tBJPgyXRL0QU8os7ig1HuwvbqKeBP7gPxjMv2QZDG4bwAwG6H92dx3zpycNRzBqGseUccN2T5zGMfbcYU-Hnsb7DgHErj6DyJkoPNngBVdiv9B6I6h5rXq8mpg9nUh62hGsu0hMNILJitT1Gfb7zUTMUE7coGjAPXshJp599PXD2VdX0OLp3KCmTCx0fK3sfc8nDbROzphr6IvJN_FsLTyBp24kbH3vkYb2mmnefNdN5qk_seZaGgfd19CNzN8JbqfQ1gfbEdZOQe1LSHsGtHM4-xLMuDe_eqKJlmhkf0ncuqgj3jDZzg1q1sAOfXTKT-S2xzt0-Hx-HsyRwdsGW1559wwVlszDy9MIuxD__I3VIsPEYi_uDzesO3QaYBeow-Dzv2dji3E) · [raw](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/content/skills/forgetrail/SKILL_FACTS.md)

## Development

```bash
pnpm --dir mcp-server install
pnpm run mcp:build
pnpm site:dev
```

Site (FilePress + docs mount): `pnpm ship`.

Apache-2.0 · [Catalyst Forge LLC](https://catalystforge.com)
