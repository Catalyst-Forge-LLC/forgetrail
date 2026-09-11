# Companion tools — weave Catalyst Forge siblings into ForgeTrail

**Spec kind:** Delivery  
**Status:** Draft (review before implementation)  
**Date:** 2026-09-11  
**Related:** [TODO.md](../TODO.md), [WORKFLOW.md](../WORKFLOW.md) §1b–§1e, [content/GREENFIELD_INTAKE.md](../content/GREENFIELD_INTAKE.md), [content/FORGETRAIL_LITE.md](../content/FORGETRAIL_LITE.md), [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md), [specs/completed/forgetrail-new-user-experience.md](completed/forgetrail-new-user-experience.md), [specs/canonical/forgetrail-modern-agents-evolution.md](canonical/forgetrail-modern-agents-evolution.md), [https://catalystforge.com/tools/](https://catalystforge.com/tools/)  
**Surfaces:** WORKFLOW, Lite, intake, DEPLOYMENT template, audit prompts, agent-integration guides, forgetrail skill, MCP (`getPhaseGuidance` and/or a new suggestions tool), optional site docs

---

## 1. Problem

**What is painful today:** ForgeTrail still talks as if the only optional neighbor is [gstack](https://github.com/garrytan/gstack). Since that guidance landed, Catalyst Forge has shipped a shelf of sibling tools that solve recurring jobs ForgeTrail already names: publish a Markdown site, keep local ports stable, review prose, name assumptions, reconstruct a failure, label a shipped tool, back up unpushed git, capture a chat as files.

Those siblings exist, are free, and are already used *inside this repo* (FilePress + Wrangler for forgetrail.dev; LocalBerth for the site port; xFacts labels; LocalHelm in the npm-name-hold rule). App projects that adopt ForgeTrail never hear about them at the moment the job appears. Agents invent ad-hoc static-site stacks, collide on ports, skip editorial review, or treat Ollama as a single `setup-ollama` script.

**Friction / current workaround (if any):** A human who already knows the house shelf picks tools by memory. Everyone else either overbuilds or never finds the fit. The public catalog is [catalystforge.com/tools](https://catalystforge.com/tools/) (also `/tools.md` and `/tools.json`). ForgeTrail does not map that shelf onto phases, archetypes, or intake answers.

---

## 2. Goals

1. **Suggest at the moment of need.** When a ForgeTrail situation matches a sibling, the methodology names the tool, one sentence of *why*, and a link. The agent may offer it. The user may decline. Work continues either way.
2. **Keep ForgeTrail the system of record.** Companions accelerate a job (publish, review, ports, briefing, backup). They do not replace phases, `.forgetrail/workflow_tracking.json`, `CONTEXT_PROMPT.md`, or progressive docs. Same complementary-layer rule as gstack (§1b) and subagents (§1c).
3. **Protect the front door.** The NUX prove-it path (Genesis + Lite, no extra installs) stays the first door. Companion names do not appear before Try on the README or in the post-bootstrap user message.
4. **Ship a living mapping, not a versioned brochure.** ForgeTrail owns *when and why to suggest*. The public shelf owns *what the tool is today*. Do not copy versions, marketing pages, or full install manuals into Lite.

### Non-goals

- Do **not** add sibling packages as runtime or install dependencies of `forgetrail` or `forgetrail-mcp`.
- Do **not** vendor sibling `SKILL.md` files into the ForgeTrail npm tarball in this pass.
- Do **not** require any companion for phase exit criteria, Lite kickoff, or wrap.
- Do **not** turn forgetrail.dev into a second tools catalog. The shelf stays at catalystforge.com/tools.
- Do **not** suggest personal-finance or home-media tools as part of the software lifecycle (see §4.4).
- Do **not** replace Default-A (SvelteKit + optional PocketBase) with FilePress. FilePress publishes Markdown. It is not an app framework.
- Do **not** dump the full shelf at Phase 1 kickoff, in `getPostBootstrapUserMessage`, or in Lite §4 first actions.

---

## 3. Background / current state

| Already true | Gap |
|--------------|-----|
| WORKFLOW §1b treats gstack as an optional complementary layer, phase by phase | No equivalent for house tools |
| This repo’s site is FilePress + Wrangler Pages (`site/`, `pnpm ship`) | App `DEPLOYMENT.md` still leads with droplet / DigitalOcean examples |
| Lite §4.8 and intake §8 cover local Ollama via `setup-ollama` / `test-ollama` | ollanet (hosts) and Finetuna (runtime tuner) are unnamed |
| `APP_FACTS.md`, `mcp-server/TOOL_FACTS.md`, `content/skills/forgetrail/SKILL_FACTS.md` already exist | Apps are not told when to write their own labels |
| npm-name-hold already blesses LocalHelm `publish --apply` after `auth` | LocalHelm as a *status board* is never suggested |
| `site/README.md` and `scripts/ensure-lease.mjs` still call **LocalBerth** for port 5195 | The public shelf lists **LocalSlip**, not LocalBerth |
| NUX spec forbids extra doors before Try | Any catalog work must stay below the fold / after kickoff |

Shelf snapshot used for this draft (2026-09-11, 21 tools on [catalystforge.com/tools](https://catalystforge.com/tools/)). Re-read `/tools.json` when implementing; do not treat versions in this spec as pins.

**LocalBerth vs LocalSlip:** this repo still claims `forgetrail-site` on **5195** with the `localberth` CLI. LocalSlip is the shelf’s named port registry. Implementation must confirm whether LocalSlip superseded LocalBerth, they coexist, or ForgeTrail’s own scripts should migrate. Until that is decided, *suggest LocalSlip to app users* and *leave this repo’s lease script as a separate cleanup* (see §9 Q1).

---

## 4. Core concepts / definitions

**Companion.** A sibling Catalyst Forge tool (or, later, a third-party neighbor like gstack) that ForgeTrail may *name* when a situation matches. Not a ForgeTrail feature. Not a required install.

**Situation trigger.** A concrete project fact that unlocks a suggestion: A-local static publish, two or more local apps, local Ollama chosen, Phase 6 copy pass, unclear outage, unpushed branches, Genesis chat sitting only in a website, and so on.

**Suggest, don’t install.** The agent states the fit and the opt-in. It does not run `pnpm add`, write skill files, or enroll LocalHelm projects unless the user asked.

**Shelf vs mapping.**

- **Shelf** = [catalystforge.com/tools](https://catalystforge.com/tools/) (and `/tools.json`): names, URLs, current versions, formats.
- **Mapping** = `content/COMPANION_TOOLS.md` (new): situation → tool → phase/archetype → one-line why → homepage. This is what agents read.

**Tiers** (review these; they are the main product decision):

| Tier | Meaning | Agent behavior |
|------|---------|----------------|
| **A — suggest-at-need** | High fit for common ForgeTrail jobs | Name it when the trigger is true. One sentence + link. Stop. |
| **B — mention-if-fits** | Narrow but real | Only if the user or brief already has that job. |
| **C — out of lifecycle** | Valid products, wrong methodology | Do not mention from ForgeTrail unless the user asked about that domain. |

---

## 5. Proposed approach / Design

### 5.1 Behavior

Same integration model as gstack:

- **ForgeTrail** owns *what* and *when* (phase, docs, exit criteria, memory).
- **Companions** own a *how* for a bounded job.
- After a companion run that matters, persist outcomes in tracking (`decisions[]`, `gotchas[]`, session notes) and the matching progressive doc. Example: FilePress URL into wrap / `DEPLOYMENT.md`; Cold-eye findings into pre-launch notes; Gap Last remaining questions into `gotchas[]`.

**When the agent may speak:** only after the trigger is true, and only as an optional next step, never as a blocker.

**Copy rules for suggestions** (user-facing, so no hedging *can* for shipped capability, and no em dashes):

- Do: “FilePress turns this Markdown folder into a static site. Cloudflare Pages with Wrangler is a free publish path.”
- Do: “You already have more than one local app. LocalSlip keeps named ports; LocalHelm shows status across the repos you enroll.”
- Don’t: “FilePress can generate a site if you want.”
- Don’t: mention `specs/`, MCP tool names, or the mapping file in the human-facing offer.

### 5.2 Inventory (proposed tiers)

Source: Catalyst Forge tools shelf, 2026-09-11. Homepage links are the stable pointers; npm/GitHub stay on the shelf page.

#### Tier A — suggest at need

| Trigger | Tool | Homepage | Why it belongs in ForgeTrail |
|---------|------|----------|------------------------------|
| Project needs a **Markdown site** (docs, changelog, writing, marketing pages) or a **one-shot event page** | **FilePress** | [getfilepress.com](https://getfilepress.com) | Turns a folder of Markdown into `./build/`. No admin UI, no content DB. Pair with **Wrangler → Cloudflare Pages** (free). This repo already ships that way. |
| User has or will have **two or more local apps**, or bookmarks already hit the wrong process after reboot | **LocalSlip** | [localslip.dev](https://localslip.dev) | Named port claims. Startup order stops mattering. Vite `strictPort` fails instead of silently moving. |
| Same multi-app workspace; operator wants **one board** for dirty trees, local-vs-npm versions, enrolled sites/ports | **LocalHelm** | [localhelm.dev](https://localhelm.dev) | Status is read-only. Plan / `--apply` / publish stay explicit. Already the blessed path for house `npm publish` after `auth`. |
| Intake chose **local Ollama** (runtime or seed) | **ollanet** | [ollanet.dev](https://ollanet.dev) | Discover and alias hosts the user chose. Lite’s `setup-ollama` remains the *app-repo* health script; ollanet is the *host manager*. |
| Ollama is in use and VRAM / context / GPU residency is the actual question | **Finetuna** | [finetuna.net](https://finetuna.net) | Runtime tuner (`num_ctx`, `num_batch`, `num_gpu`). Does not train weights. Optional pairing with ollanet. |
| Phase 6 copy, README, landing, changelog, or `brand-copy-edit-pass` | **Smell Check** | [smellcheck.dev](https://smellcheck.dev) | Editorial rules for wording that has earned its place. Complements existing copy audits; does not replace them. |
| Same surfaces, plus sentences that admit a second reading | **Misemphasis** | [misemphasis.com](https://misemphasis.com) | Finds the other stress a silent reader may apply. Grammar/tone stay out. |
| Docs, README, or in-app journeys after repeated edits | **Detangler** | [detangler.dev](https://detangler.dev) | Broken references, competing sources of truth, flows that no longer meet. Complements `docs-alignment-audit`. Draft skill for prose; application skill for the product. |
| Pre-launch / wrap: “can a newcomer use what we are about to ship?” | **Cold-eye** | [coldeye.dev](https://coldeye.dev) | Readiness verdict + ranked gaps. Complements `pre-launch-audit`. Not a security audit unless that was the chosen review. |
| Hard-to-undo work: delete data, pick a persistence model, rewrite history, lock a stack | **TemperPass** | [temperpass.dev](https://temperpass.dev) | Name consequential assumptions before proceeding. Fits Phase 1 lock and any destructive turn. |
| Phase 3 (or any debug) when the **cause is not yet earned** | **Gap Last** | [gaplast.dev](https://gaplast.dev) | Observations, constraints, remaining questions, then hypotheses. A hypothesis is not the established cause. Log leftovers into `gotchas[]`. |
| Shipping a tool, MCP server, agent config, or installable skill | **xFacts** (AppFacts / ToolFacts / AgentFacts / SkillFacts; ModelFacts if a local model is part of the product) | [xfacts.dev](https://xfacts.dev) | Structured labels. A validator checks shape, not truth. ForgeTrail already publishes its own. Hobby one-shots may skip. |
| Unpushed local branches/tags the operator cannot afford to lose; before rebase/rewrite | **IngotVault** | [ingotvault.dev](https://ingotvault.dev) | Mirror to a drive the operator controls. Never the default force-push. Does not replace commit discipline. |
| Genesis, plan, or a long chat that still lives only on a website | **HaulOut** | [haulout.dev](https://haulout.dev) | Export the open thread to local Markdown/JSON. Fits “keep the trail.” Tampermonkey userscript; say that up front. Not an account-wide archive. |

#### Tier B — mention if the job is already present

| Trigger | Tool | Homepage | Note |
|---------|------|----------|------|
| Phase 1 competitive/market briefing, or a handoff that must start from what is true *now* | **EmberDossier** | [emberdossier.com](https://emberdossier.com) | Format for a briefing. The agent still researches. `as_of` is a compile date, not a live feed. |
| Shipping a **Node CLI** that non-terminal operators must run | **gui4cli** | [gui4cli.dev](https://gui4cli.dev) | Desktop form over Commander/yargs. First launch pulls NW.js (~200 MB). Mention only for CLI products. |
| Product must **edit an existing Google Doc / Sheet / Slides** in place | **DocuPuncture** | [docupuncture.dev](https://docupuncture.dev) | Targeted Apps Script. Dry run first. Not for “generate a new Google file.” |
| Operator wants a **local voice journal** of sessions (audio stays on disk) | **DictaWhisper** | [dictawhisper.com](https://dictawhisper.com) | Git clone, not a one-click add-on. Only if they asked for voice capture. |

#### Tier C — do not suggest from ForgeTrail

| Tool | Homepage | Why it stays off the lifecycle |
|------|----------|--------------------------------|
| **ForeBalance** | [forebalance.app](https://forebalance.app) | Personal cash-flow forecast. Not a build tool. |
| **MediaTuna** | [mediatuna.dev](https://mediatuna.dev) | Home media archive / conversion. Not a software-methodology job. |
| **ForgeTrail** | [forgetrail.dev](https://forgetrail.dev) | Circular. |

gstack remains documented in §1b as the third-party sprint layer. Do not fold gstack into the house mapping file; cross-link both from WORKFLOW.

### 5.3 FilePress and the Default-A stack (explicit split)

| Project shape | Publish path |
|---------------|--------------|
| Interactive web app (A-local or A-persistent) | Keep Default-A. Optional **`site/`** (or a sibling docs folder) built with FilePress for marketing, docs, and changelog. Same pattern as this repo. |
| Markdown-first site, writing shelf, docs-only product, many one-shot event pages | FilePress **is** the product. Cloudflare Pages + Wrangler is the default free host. |
| A-local *app* that needs UI, client routing, and `localStorage` | Still SvelteKit + `adapter-static`. Do not scaffold FilePress as the app. |

`DEPLOYMENT.md` should list **Cloudflare Pages (static / FilePress or `adapter-static`)** as a first-class $0 row, not only a droplet table.

### 5.4 LocalHelm + LocalSlip (multi-app threshold)

Suggest the pair when **any** of these is true:

- The operator says they already run another local app.
- Phase 2 port choice collides (PocketBase 8090/8096, Vite, FilePress preview, Ollama).
- Kickoff is happening in a workspace that already has enrolled LocalHelm projects (agent sees `localhelm` on PATH or an existing config, and the user confirms).

Do not suggest on a first-ever single-app machine. One project does not need a fleet board.

LocalHelm inspection does not publish. Keep the existing npm-name-hold rule: only `localhelm publish <id> --apply` after `auth`, and only when the operator asked.

### 5.5 Skills vs CLIs

House **skills** (Smell Check, Detangler, Misemphasis, Cold-eye, TemperPass, Gap Last, EmberDossier, DocuPuncture) belong in **agent-integration guides** and the forgetrail `SKILL.md` as *optional neighbors*, not as always-on rules.

Pattern to copy from Detangler’s own shelf copy: neighbors are optional; review does not silently edit.

Do not tell every Cursor user to install all eight skills. Offer the one that matches the current phase job.

### 5.6 Where the mapping is inserted

Keep Lite thin. Put the full table in one content file and point at it.

| Surface | Change |
|---------|--------|
| **`content/COMPANION_TOOLS.md`** (new) | Canonical mapping: tiers, triggers, one-line why, homepages, “never required,” “persist outcomes in tracking.” No version numbers. Point at the shelf for current install. |
| **`WORKFLOW.md`** | New **§1f Companion tools (optional)** after §1e. Stance + 8–12 line trigger list + pointer to the mapping. Do not paste the full inventory. Phase playbooks (esp. 1, 3, 6, 7) get one-line “optional companion” notes. |
| **`content/GREENFIELD_INTAKE.md`** | After A-local / static: FilePress vs `adapter-static` split. After Ollama: ollanet / Finetuna as optional host/tuner. New short question: “Will this machine run other local apps you care about keeping on stable ports?” → LocalSlip / LocalHelm. |
| **`content/FORGETRAIL_LITE.md`** | Thin pointers only: §4.8 (ollanet/Finetuna optional), §7 A-local (FilePress for a *site*, not the app), wrap (Cold-eye / harvest), one paragraph in §2 pointing at COMPANION_TOOLS for MCP/full users. No new Lite first-action step. |
| **`docs/DEPLOYMENT.md`** | Infrastructure table: Cloudflare Pages + Wrangler as a $0 static option; FilePress for Markdown sites; note that forgetrail.dev is the worked example. |
| **`content/NEW_PROJECT_BOOTSTRAP.md`** | Tool-map row for companion suggestions. Not in the post-bootstrap *user* message. |
| **`content/AGENT_INTEGRATION_*.md`** | Short “optional house skills / CLIs” list with the trigger rule. gstack stays Claude-specific. |
| **`content/skills/forgetrail/SKILL.md`** | One rule: when a trigger in COMPANION_TOOLS matches, *offer* the companion; never block the phase on it. |
| **Audit prompts** (`brand-copy-edit-pass`, `docs-alignment-audit`, `pre-launch-audit`, `landing-page-rewrite`) | One optional line each: Smell Check / Detangler / Cold-eye as a neighbor pass. |
| **`getPhaseGuidance`** | Append a short “Optional companions” block per phase (from the mapping, not a live HTTP fetch). |
| **MCP (M2)** | Either the phase-guidance append is enough, or add **`getCompanionSuggestions`** (`phase` and/or `situation`) that returns the filtered subset. Prefer one mechanism; see §9 Q2. |
| **`site/docs/compare.md` or `about.md`** | One short “Works alongside” paragraph + link to the public shelf. Below the Try path. |
| **This repo’s LocalBerth script** | Out of the *suggestion* pass unless Q1 says migrate. Track as a follow-on if LocalSlip is the successor. |

### 5.7 MCP / data

No new tracking schema fields required. Optional later: `decisions[]` entries when the user adopts a companion (`decision: "Publish docs with FilePress on Cloudflare Pages"`).

Do **not** have the MCP server fetch `https://catalystforge.com/tools.json` at request time in v1. That adds network, failure modes, and version noise. Refresh `COMPANION_TOOLS.md` when the shelf changes (same discipline as Lite updates).

If `getCompanionSuggestions` is added, serve the markdown (or a small static JSON derived from it) from the content root, same as other `get*` tools.

### 5.8 UI / UX

No app UI. Human-facing suggestion copy is a short offer with a homepage. Agent-facing copy may name the mapping file.

Marketing site: do not add a Tools mega-nav that competes with Try.

### 5.9 Files (expected)

| New | Modified |
| --- | -------- |
| `content/COMPANION_TOOLS.md` | `WORKFLOW.md` (§1f + playbook one-liners) |
| Optional: `mcp-server` handler if Q2 chooses a dedicated tool | `content/GREENFIELD_INTAKE.md`, `content/FORGETRAIL_LITE.md`, `content/NEW_PROJECT_BOOTSTRAP.md`, `content/FORGETRAIL_LITE_UPDATES.md` (changelog row when Lite pointers land) |
| | `docs/DEPLOYMENT.md` |
| | `content/AGENT_INTEGRATION_*.md`, `content/skills/forgetrail/SKILL.md` |
| | selected `prompts/*-audit.md` / `brand-copy-edit-pass.md` |
| | `mcp-server/src/index.ts`, `mcp-server/TOOL_FACTS.md` (if phase guidance or a new tool changes) |
| | `site/docs/compare.md` or `about.md` (thin) |
| | `specs/README.md`, `TODO.md` (this draft already updates those) |

---

## 6. Edge cases and risks

- **NUX regression:** listing companions next to Genesis/Lite recreates “too many doors.” Mitigation: mapping is below-the-fold; kickoff user message stays product-only.
- **House-tool bias / looks like an upsell.** Mitigation: say they are optional OSS siblings; decline is success; no signup. ForeBalance stays out (it is not OSS and not a build tool).
- **Stale versions.** Mitigation: mapping has no `v0.x` pins; shelf is canonical for install.
- **Agents install the fleet.** Mitigation: explicit “suggest, don’t install”; forgetrail skill rule; no `pnpm add` in first-actions.
- **FilePress vs SvelteKit confusion.** Mitigation: §5.3 table in the mapping and in intake.
- **LocalBerth leftover.** Mitigation: Q1; do not tell app users to install LocalBerth if LocalSlip is the current name.
- **Lite bloat.** Mitigation: pointers only; full table lives in `content/COMPANION_TOOLS.md`.
- **gstack overlap** (review vs `/review`, deploy vs FilePress). Mitigation: gstack remains sprint execution; house tools are job-specific. An agent may use both. Persist in ForgeTrail either way.
- **HaulOut extra install** (Tampermonkey). Mitigation: mention the userscript requirement; never imply it is a one-liner.

| Risk | Mitigation |
| ---- | ---------- |
| Front door grows a catalog | NUX rule: no companions before Try; no post-bootstrap dump |
| Mapping rots when a sibling is renamed | Refresh from `/tools.json` when editing the mapping; Q1 for LocalBerth |
| Phase exit criteria quietly depend on a skill | Acceptance: no companion is required to complete a phase |
| MCP fetches the live shelf and fails offline | v1 is local content only |

---

## 7. Milestones / phasing

| Milestone | Outcome |
| --------- | ------- |
| **M1 — Mapping + WORKFLOW** | `content/COMPANION_TOOLS.md` exists with the approved tier table. WORKFLOW §1f + playbook one-liners. Intake + DEPLOYMENT + Lite thin pointers. TODO item stays open until M1 acceptance. |
| **M2 — Agent surfaces** | Phase guidance (and/or `getCompanionSuggestions`), bootstrap tool-map row, agent-integration guides, forgetrail skill rule, selected audit-prompt one-liners. TOOL_FACTS updated if a tool is added. |
| **M3 — Site mention** | Short “Works alongside” on compare/about + shelf link. Still below Try. |
| **M4 — House cleanup (optional)** | If Q1 says LocalSlip replaced LocalBerth, migrate `scripts/ensure-lease.mjs` and `site/README.md`. Separate commit is fine. |

M1 is the reviewable product. M2–M3 can follow in the same implementation pass if the tier table is approved unchanged.

---

## 8. Acceptance criteria

1. Given a greenfield kickoff, when the agent follows Lite or MCP bootstrap, then the first user-facing message still does not name companion tools, MCP internals, or the mapping file.
2. Given `content/COMPANION_TOOLS.md`, when a reader opens it, then every Tier A/B tool has a trigger, a homepage, and an explicit “optional / do not install unless asked” line, and Tier C tools are listed as out of lifecycle.
3. Given WORKFLOW §1f, when an agent reads complementary-layer guidance, then companions are described the same way as gstack: ForgeTrail keeps memory; the companion does a job; outcomes are persisted in tracking.
4. Given an A-local or Markdown-site decision in intake, when the agent offers a publish path, then FilePress + Cloudflare Pages / Wrangler is named as an option, and FilePress is not offered as a replacement for an interactive SvelteKit app.
5. Given a brief that chose local Ollama, when Phase 2 setup is discussed, then ollanet and Finetuna may be offered, and `setup-ollama` / `test-ollama` remain the in-repo health path.
6. Given a user who already runs two or more local apps, when ports or “what is dirty” come up, then LocalSlip and LocalHelm may be offered. Given a first single app, when nothing else is running, then those two are not pushed.
7. Given Phase 6 copy work or a brand-copy audit, when the prompt/playbook runs, then Smell Check and Misemphasis are optional neighbors, not required gates.
8. Given Phase 3 confusion about cause, when the playbook mentions debug method, then Gap Last may be offered; findings that matter land in `gotchas[]`.
9. Given Phase 7 / wrap / pre-launch, when readiness for a newcomer is in scope, then Cold-eye may be offered; Detangler may be offered for structural drift; xFacts may be offered when shipping a tool or skill.
10. Given TemperPass’s trigger (hard-to-undo work), when the agent is about to delete data, lock persistence, or rewrite git, then it may offer the assumption pass. The phase does not fail if the user skips it.
11. Given the README / Try path, when a stranger follows NUX, then no companion install is required to complete Genesis + Lite.
12. Given `forgetrail` / `forgetrail-mcp` package contents, when this pass ships, then no sibling tool is a new runtime dependency.

---

## 9. Open questions

| # | Question | Blocking? | Owner |
| - | -------- | --------- | ----- |
| 1 | Did **LocalSlip** replace **LocalBerth**, or do they still coexist? Should this repo’s `ensure-lease.mjs` migrate in M4? | Yes, for what we *tell app users*. No for M1 mapping if we only name LocalSlip externally. | Author |
| 2 | Is a dedicated MCP tool (`getCompanionSuggestions`) worth it, or is an “Optional companions” footer on `getPhaseGuidance` enough? | No for M1. Yes before M2 coding. | Author |
| 3 | Should **HaulOut** stay Tier A (continuity is core to ForgeTrail) or drop to B (userscript friction)? | No | Reviewer |
| 4 | Should **xFacts** be suggested for every shipped `product`, or only when the project is itself a tool/skill/MCP? | No | Reviewer |
| 5 | Any Tier A tool that should be demoted, or Tier B promoted, before M1 is written? | Yes for the mapping table | Reviewer |
| 6 | Mention **DictaWhisper** at all in ForgeTrail, or keep voice journals out until someone asks? | No | Reviewer |

---

## 10. Decisions (proposed, unlock on review)

**D1.** Companions are suggestions, never dependencies, never phase gates.

**D2.** Situation-triggered offers. No shelf dump at kickoff.

**D3.** One mapping file in `content/` is the agent source of truth. The public shelf is the human catalog and current-version source.

**D4.** FilePress is the default *Markdown site* path (with Wrangler / Cloudflare Pages). It does not replace Default-A for interactive apps.

**D5.** LocalSlip + LocalHelm are the default *multi-app workstation* pair (two or more local apps).

**D6.** Practice skills (Smell Check, Detangler, Misemphasis, Cold-eye, TemperPass, Gap Last) are the default *quality neighbors* for Align / Harden / debug. Install one for the current job, not the set.

**D7.** ForeBalance and MediaTuna stay out of the lifecycle mapping.

---

## Progress (while Partial)

_Leave empty until implementation starts (then move this file to `specs/partial/`)._

---

## Implementation summary

_Required when moving this delivery spec to `specs/completed/`. Leave empty until then._

**Implemented:**

**Verification:**
