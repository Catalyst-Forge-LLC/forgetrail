> **App projects only.** Paste this file into a coding-agent chat to **start an app** that uses ForgeTrail.
> If you are working in the **ForgeTrail methodology repo** itself, stop and read `RESUME.md` (and `TODO.md`). Do not follow the steps below here.

## Instructions

You are helping me build a full-stack web application. I use ForgeTrail, a structured phase-based development workflow refined across multiple projects. Your job is to follow this workflow, track progress, and pause at phase transitions for my approval before advancing.

---

### MCP-first (recommended — no `_forgetrail/` copy in this repo)

If **ForgeTrail is connected as an MCP server**, do **not** require a local `_forgetrail/` folder. Methodology, templates, and audits stay in the MCP server (open-source ForgeTrail install); persist only **`.forgetrail/workflow_tracking.json`** and optional Cursor rules in this repo.

**Before doing anything else:**

0. If **`docs/GENESIS.md`** exists, call **`ingestPlanArtifact`** with its contents and review the draft brief before scaffolding. If the user only has an idea, offer **`getGenesisSpecPrompt`** (they save as `docs/GENESIS.md`) or point them at **TRY_FORGETRAIL.md** when MCP is not the entry path.
1. Call the ForgeTrail MCP tool **`getNewProjectKickoff`** (set **`includeCursorRule`** to **false** if not using Cursor). Write **`.forgetrail/workflow_tracking.json`** and the Cursor rule when included; keep the **first reply to the user** short per the bundle’s post-bootstrap section (no MCP tool list or raw JSON dump). **Alternatively:** call **`getNewProjectBootstrap`**, **`getInitialWorkflowTracking`**, **`getPostBootstrapUserMessage`**, and **`getForgeTrailCursorPhaseRule`** separately.
2. In Phase 1, call **`getGreenfieldIntakePrompt`** alongside **`getChecklist`** (`before-session-1`) so exports (PDF / DOCX / PPTX, etc.), tenancy (e.g. consultants × clients), hybrid vs full spec, compliance tier, and hero flow are captured early in **`PHASE_1_BRIEF.md`** and **`decisions[]`** (skip questions already answered in Genesis).
3. Use **`getProgressiveDocSchedule`**, **`getPhaseGuidance`**, **`getChecklist`**, **`getTemplate`** (include **`PHASE_1_BRIEF`** in Phase 1; use `mode: "shell"` or `full` as needed), **`getTrackingSchema`**, **`runAudit`**, **`searchLessons`**, and **`getAntiPatterns`** as that bootstrap describes.
4. We're starting with Phase 1 (Architecture + Planning).

**Replies to me:** When presenting several options or a default order of work, follow ForgeTrail **`USER_REPLY_FORMAT.md`** (or MCP **`getUserReplyFormat`**): **numbered** lists for pipelines, **bullets** for parallel items, **letters** for pick-one—don’t bury multiple paths in one long sentence.

**Phase 2 scaffolding (when you reach it):** If the stack includes **scripted PocketBase setup**, call **`getScaffoldInstallParams`** and align **`scripts/scaffold-defaults.json`** with the returned JSON — then have the user run **`pnpm install && pnpm run setup:pocketbase`** (or **`pnpm run bootstrap`**) **in the terminal** instead of generating many small files in the IDE. Put the **PocketBase HTTP port and public URL in `.env` / `.env.example`** (e.g. `PUBLIC_POCKETBASE_URL=http://127.0.0.1:8096`); the user may have **other PocketBase processes** (other projects) already on the default **8090**, so a fixed port in env keeps the `serve` script, the SvelteKit client, and schema scripts in sync. Prefer a **`pocketbase:schema`** (or similar) script that applies collections using **`POCKETBASE_ADMIN_EMAIL` / `POCKETBASE_ADMIN_PASSWORD`** from `.env` (see ForgeTrail **`POCKETBASE_SCHEMA_SCRIPT.md`** via the scaffold JSON **`schemaAutomation`** block) instead of manual Admin UI for each collection. For **repeatable dev setup** (env check, codegen, seed, E2E browsers, git hooks), follow ForgeTrail **`DEV_AUTOMATION_SCRIPTS.md`** and the **`devAutomation`** block in the same **`getScaffoldInstallParams`** output.

**Optional — JSON seed/fixture data from any LLM:** The user can generate structured JSON in **another** LLM chat (or the same one), save it under e.g. `data/` or `fixtures/`, and ask you to validate and import. Use the copy-paste prompt in **`content/FORGETRAIL_LITE.md` §4.3** (template-in-repo: `_forgetrail/content/FORGETRAIL_LITE.md`); **validate** all such JSON at the boundary before writing to a DB.

**Optional — web search (live data):** If the app needs **up-to-date web search**, the user can sign up for **[Tavily](https://tavily.com/)** and/or the **[Brave Search API](https://api-dashboard.search.brave.com/)** (free or entry-level credits — see vendor pricing), add the key to **`.env`**, and ask you to wire **server-side** calls only. **`FORGETRAIL_LITE.md` §4.4** has the full note; log provider choice in **`decisions[]`**.

**Phase 1 — project archetype:** classify the project as **`product`** (default — full 7-phase lifecycle), **`internal-tool`** (Phase 6 optional; Phase 7 drops payments/business-plan/marketing criteria), or **`one-shot`** (gift / event / demo — phases 5–7 collapse into one polish-and-ship gate). Infer from my description and confirm rather than interrogate. Record in **`PHASE_1_BRIEF.md`**, **`decisions[]`**, and **`project.archetype`** in the tracking file; **prune** the non-applicable exit criteria from the tracking template and log the pruning as a decision. See **WORKFLOW.md §1d**. When the project **ends**, run the **wrap protocol** (WORKFLOW.md §1e): harvest `gotchas[]` + `decisions[]` for generalizable lessons, propagate them, set `project.status` to `"wrapped"`.

**Phase 1 — state persistence (web apps):** before locking PocketBase + auth, ask me *"Does any state need to outlive this browser — accounts, cross-device sync, shared data — or is per-user state fine in `localStorage`?"* If **local-only**: drop PocketBase + auth, target `adapter-static`, no deploy-time secrets. If **persistent**: full Default-A stack. Record the answer in **`PHASE_1_BRIEF.md` §4 (`State persistence:`)** and **`decisions[]`**. See **`FORGETRAIL_LITE.md` §7** (A-local vs A-persistent).

**Phase 1 — content-generation pattern (only if content is LLM-produced):** if any v1 content is produced by an LLM (rather than hand-authored or from a conventional non-LLM API), pick **one** of three patterns **before scaffolding** — it drives deploy model, cost, and secret management:

- **Runtime LLM API** — server route calls the provider per request; rate limits + streaming UX; requires server runtime. **Cloud** (OpenAI, Anthropic, …): API key in `.env`. **Local Ollama:** `OLLAMA_BASE_URL` + `OLLAMA_MODEL` — Phase 2 adds **`setup-ollama`** / **`test-ollama`** (see **`SYSTEM_HEALTH_CHECKS.md`**, **`FORGETRAIL_LITE.md` §4.8**); default Granite 4.1 / Gemma 3, not thinking models unless I explicitly need them.
- **Build-time LLM generation** — `pnpm run seed` calls the provider once, writes JSON into `data/`, commits it; zero runtime LLM cost; pairs with `adapter-static`. Seed may use cloud APIs or the same Ollama env.
- **BYO-LLM paste** — prompt in the repo; I run it in any LLM chat (including local Ollama) and paste JSON into `data/seed.json`; Zod validates at app start; zero project-level API keys.

Record pattern, provider (e.g. `ollama/ibm/granite4.1:8b`), env var names, paths, and validator in **`PHASE_1_BRIEF.md`** (content-generation section) and **`decisions[]`**. See **`FORGETRAIL_LITE.md` §7.1** for OpenAI, Ollama, seed, and BYO skeletons.

**External listing/article URLs (if the hero flow imports from pasted URLs):** follow **`FORGETRAIL_LITE.md` §7.2** — layered fetch and parse, **don’t blame users** for correct URLs when selectors rot, optional **single** structured **verbatim** recover from stripped page text (env-gated). Expand into **`docs/TECHNICAL_REFERENCE.md`** using the ForgeTrail template subsection on deterministic extractors vs markup drift.

**Git commits:** use `git commit -F <file>` or plain `-m` at natural stopping points with concise summaries. Verify checks pass before committing.

Skip the **“copy-paste paths”** section below unless we are using a **local** ForgeTrail folder.

---

### Local `_forgetrail/` folder (template-in-repo mode)

> **Path note:** ForgeTrail files live in `_forgetrail/` by default. If you placed the folder elsewhere (e.g., a sibling `forgetrail/` directory), adjust paths accordingly.

**Before doing anything else:**

1. Read `_forgetrail/WORKFLOW.md` to understand the full phase map, playbooks, and patterns.
2. Read `_forgetrail/TRACKING_SCHEMA.md` to understand the tracking file structure before updating it.
3. Read **`.forgetrail/workflow_tracking.json`** to see current project state.
4. If using **Cursor**, copy **`_forgetrail/content/cursor-rules/forgetrail-phase-status.mdc`** to **`.cursor/rules/forgetrail-phase-status.mdc`** (create folders if needed) so agents surface phase / next actions from `.forgetrail/workflow_tracking.json`.
5. We're starting with Phase 1 (Architecture + Planning).

**Rules for every session:**

- At the start of each session, read `.forgetrail/workflow_tracking.json` and `CONTEXT_PROMPT.md` (if it exists).
- When you believe a phase's exit criteria are met, tell me explicitly: "I think we've completed [Phase X]. The exit criteria are met because [reasons]. Ready to move to [Phase Y]?" Wait for my confirmation.
- After completing work, update `.forgetrail/workflow_tracking.json` following the structure in `TRACKING_SCHEMA.md`: move satisfied exit criteria, add decisions to the `decisions` array (with rationale), log issues to the `gotchas` array, and add session notes.
- During Phase 1, create and lock **`docs/PHASE_1_BRIEF.md`**; mirror major decisions in **`decisions[]`**.
- When we create `CONTEXT_PROMPT.md` (Phase 2), **merge `PHASE_1_BRIEF.md` into it** first (see template), then keep it updated as the source of truth.
- If something isn't working after 5 turns, propose a fundamentally different approach rather than continuing to patch.

---

## About This Project

### What I'm Building

**App name:** **\*\***\_\_\_**\*\***

**One-sentence description:** **\*\***\_\_\_**\*\***

**The problem it solves:** **\*\***\_\_\_**\*\***

**Who it's for:** **\*\***\_\_\_**\*\***

**The single most important workflow it must support (the "hero flow"):**

---

### What Exists Already

_Delete any that don't apply._

- **Existing data/content that needs importing:** **\*\***\_\_\_**\*\***
- **Existing templates or assets:** **\*\***\_\_\_**\*\***
- **Existing systems this replaces or integrates with:** **\*\***\_\_\_**\*\***
- **Nothing. Greenfield project.**

### Tech Stack

_These are my defaults. Use them unless the project specifically demands something else, and if so, explain why._

**Framework:** SvelteKit (Svelte 5)

**Language:** TypeScript (strict, no implicit any)

**Package manager:** pnpm

**Styling:** Tailwind CSS

**Icons:** Iconify (@iconify/svelte) with Lucide icon set. No emoji in UI.

**Database/Authentication/File Storage:** PocketBase

**AI/LLM integration:** Claude API via @anthropic-ai/sdk _(or note deviation)_

**Deployment:** DigitalOcean + GitHub Actions + Caddy reverse proxy

**Deviations from defaults (if any):**

---

**Additional dependencies or constraints:**

---

### Code Conventions

_These apply to every project. Claude should follow these without being reminded._

- Create a `config.ts` to centralize all hardcoded values (app name, file conventions, brand colors, etc.). One edit, one place.
- Consolidate shared constants (status color maps, enums) into type files with both Tailwind classes and hex values. Import everywhere, duplicate nowhere.
- Custom SVG favicon, never emoji.
- API error responses must include actual error details (paths, messages, context), not just status codes or counts.
- Server modules in `src/lib/server/`, API routes in `src/routes/api/`, components in `src/lib/components/`, types in `src/lib/types/`.

### Aesthetic Direction

_Defaults below. Override per-project as needed._

- Dark theme by default, with light mode toggle
- Clean, functional UI. No component library; build custom with Tailwind.
- Empty states should have personality, not just "No items found."

**Additional aesthetic notes for this project:**

---

### V1 Scope Boundaries

**Must have for v1:**

- ***
- ***
- ***

**Explicitly NOT in v1:**

- ***
- ***

**Constraints:**

---

---

## First Session: What Should Happen

Phase 1 (Architecture + Planning):

- Summarize your understanding of the project and make suggestions before building anything.
- Propose: folder structure, data model, tech choices, migration path for existing data (if any).
- Identify the hardest integration points.
- Recommend what to skip for v1.
- Wait for my confirmation on every architectural decision.
- Create **`docs/PHASE_1_BRIEF.md`** from the ForgeTrail template (`_forgetrail/docs/` or MCP **`getTemplate("PHASE_1_BRIEF")`**). Fill and **lock** it before we exit Phase 1.
- Record major commitments in **`.forgetrail/workflow_tracking.json`** → **`decisions[]`** (and phase notes) so the next session does not depend on chat history.

Phase 2 (Scaffolding + Core Build):

- Only after I've confirmed the architecture and the brief is locked.
- Read **`PHASE_1_BRIEF.md`** and **`.forgetrail/workflow_tracking.json`** first.
- Build the **entire app skeleton in one pass**: project init, dependencies, services, routes, components — **do not defer the runnable spine or hero flow**.
- Include an import script if there's existing data.
- Wire up the hero flow end to end.
- Create `.env.example`, `.gitignore`.
- **Documentation (progressive — see WORKFLOW.md §1a or ForgeTrail MCP `getProgressiveDocSchedule`):** In Phase 2, create **only** these four from ForgeTrail templates — **either** copy from `_forgetrail/docs/` **or** use MCP **`getTemplate`** (`CONTEXT_PROMPT`, `README`, `TODO`, `IDEAS`):
  - `CONTEXT_PROMPT.md` — **merge content from `PHASE_1_BRIEF.md`** into the appropriate sections using the “Handoff from Phase 1” table in the template, then add patterns as needed.
  - `README.md` (setup instructions)
  - `TODO.md` (initial backlog; seed from brief §11)
  - `.forgetrail/IDEAS.md` (parking lot — capture ideas here instead of cluttering the backlog)
- **Do not** create the rest of the ForgeTrail doc library in Phase 2 (e.g. `BRAND_AND_PRODUCT`, `CODE_QUALITY`, `DEPLOYMENT`) unless I explicitly need one to finish the spine. Add other templates **in later phases** when that work starts (`TECHNICAL_REFERENCE`, `TEST_PLAN`, `DESIGN_SYSTEM` in Phase 4+ as warranted; brand/strategy docs in Phase 6; hardening docs in Phase 7). Phase 6 may add an optional internal **`FEATURE_CATALOG.md`** and periodic **`user-facing-content-sync-audit`** when the product map is large.
- Reusable audit prompts: `_forgetrail/prompts/` **or** ForgeTrail MCP **`runAudit`** (security, pre-launch, docs alignment, user-facing content sync, brand copy, landing page, Cialdini, competitor, propagate-to-forgetrail, engineering-skill-library).

Then pause and ask if I want to continue to Phase 3 (Bug Fixing + Environment Stabilization).

---

## Phase Transition Reference

Quick reference for when you're deciding whether to approve a phase transition:

| From              | To                | You should feel...                                                         |
| ----------------- | ----------------- | -------------------------------------------------------------------------- |
| Architecture      | Scaffolding       | Confident in tech choices, data model, and folder structure                |
| Scaffolding       | Stabilization     | App runs, shows real data, hero flow works roughly                         |
| Stabilization     | Feature Iteration | Core workflow completes without infrastructure errors                      |
| Feature Iteration | Strategic Review  | Core features are functionally complete, TODO has 20+ items                |
| Feature Iteration | Refactoring       | A file exceeds ~500 lines, or you're editing the same pattern in 3+ places |
| Refactoring       | Feature Iteration | Build passes, no stale references, shared utilities extracted              |
| Strategic Review  | Feature Iteration | TODO is reorganized by priority, you know what to build next               |
| Any phase         | Hardening         | Features are stable, you're thinking about other people using it           |

**Note:** Phases 4 (Feature Iteration) and 5 (Refactoring) commonly alternate. A typical path: 4 -> 5 -> 4 -> 6 -> 4 -> 7. This is normal, not a sign of problems.
