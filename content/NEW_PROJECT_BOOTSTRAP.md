# ForgeTrail — New project bootstrap (MCP-first)

Use this when **ForgeTrail is available via the MCP server** (recommended). The customer repo should **not** contain a copied `_forgetrail/` methodology tree — templates, audits, phase playbooks, and lessons are retrieved through MCP tools from the open-source ForgeTrail install. Only **project-local state** (chiefly **`.forgetrail/workflow_tracking.json`**) lives in the app repo.

---

## Your job as the agent

1. Follow the **7-phase lifecycle** (Plan → Build → Stabilize → Iterate → Refine → Align → Harden).
2. **Pause at phase transitions** for explicit user approval before advancing.
3. **Persist ForgeTrail state in `.forgetrail/`** at the repo root — **same folder for MCP greenfield and Lite file bootstrap.** Write **`.forgetrail/workflow_tracking.json`** first; add **`.forgetrail/AGENTS.md`**, **`.forgetrail/CLAUDE.md`**, and **`.forgetrail/cursor/rules/`** (symlink `.mdc` files into **`.cursor/rules/`**). Product docs (**`docs/`**, **`CONTEXT_PROMPT.md`**, **`README.md`**, **`TODO.md`**) stay at repo root. **Optionally gitignore `.forgetrail/`** if you want a cleaner public history or use MCP-only without a vendored Lite file (see **`FORGETRAIL_LITE.md` §1.5**). For **Cursor**, add **`.cursor/rules/forgetrail-phase-status.mdc`** from **`getNewProjectKickoff`** (bundled) or **`getForgeTrailCursorPhaseRule`** — it reads **`.forgetrail/workflow_tracking.json`**. Also add **`forgetrail-lessons-gate.mdc`** and **`forgetrail-lessons-mcp.mdc`** from the same bundle or **`getForgeTrailCursorLessonsRules`** so agents call **`getAntiPatterns`** + **`searchLessons`** before substantial feature work.
4. **Pull methodology on demand** via ForgeTrail MCP tools (below). Do not ask the user to paste entire ForgeTrail files.
5. **User-facing replies:** After bootstrap files exist, **`getPostBootstrapUserMessage`** defines the **first** reply—plain language only: what you did, what happens next, and a **concrete “reply with”** (problem, audience, hero workflow, constraints, v1 scope). **No** MCP/tool names, methodology jargon, ForgeTrail footers, file inventories, or “reference only” tracking dumps unless the user asks for internals.
6. **Lists and choices:** When offering several next steps or options, follow **`USER_REPLY_FORMAT.md`** (ForgeTrail): **numbers** for ordered pipelines, **bullets** for parallel items, **letters** for pick-one / “which first—A/B/C?”—never hide multiple paths in one long sentence.

---

## Greenfield git (no `.git` yet is normal)

On a **new project folder**, commands like `git status`, `git log`, or `git rev-parse` may fail with **`fatal: not a git repository`**. **That is expected—not a setup failure.** Do **not** stop kickoff, panic, or ask the user to run `git init` manually.

**You** initialize git after bootstrap files exist (unless the user chose **no-git mode** — see **`FORGETRAIL_LITE.md` §4.1**):

1. Write kickoff artifacts first: **`.forgetrail/workflow_tracking.json`**, guardrails, optional Cursor rules.
2. Check with `git rev-parse --is-inside-work-tree`. If it returns false or errors, run **`git init -b main`** at the repo root (or `git init` + `git branch -m main` on older Git). **Never** re-init an existing repo.
3. Write a **minimal** `.gitignore` now — at least `node_modules/`, `.env`, `.DS_Store`. Add `.forgetrail/` **only** if you chose the gitignore branch in **`FORGETRAIL_LITE.md` §1.5** (default MCP greenfield: **commit `.forgetrail/`**).
4. Make a **first commit** when steps 1–3 are done so the user has a clean baseline (plain `-m` or `-F`; no attribution trailers — see Rules below). Skip if the repo already had history; skip entirely in no-git mode.

Do **not** treat an early missing-repo git error as blocking. Prefer **`git rev-parse --is-inside-work-tree`** over blind `git status` when you only need to know whether init is required.

---

## Progressive scaffolding (important)

- **Phase 1:** Create and lock **`docs/PHASE_1_BRIEF.md`** (`getTemplate({ name: "PHASE_1_BRIEF" })`). Log major commitments in **`.forgetrail/workflow_tracking.json` → `decisions[]`**. If the host supports **native plan mode**, use **`getPlanModePatterns`** and WORKFLOW §1c — plan first, export to the brief on approval (no app code during planning).
- **App/code:** Phase 2 still means the **full runnable spine** in one pass: init, deps, data path, routes, components, hero flow **end-to-end**. Do **not** defer that spine.
- **Project archetype (Phase 1):** classify the project as **`product`** (default), **`internal-tool`**, or **`one-shot`** (gift / event / demo) — often inferable from the problem statement; confirm rather than interrogate. Record in **`PHASE_1_BRIEF.md`**, **`decisions[]`**, and **`project.archetype`** in the tracking file, then **prune** the non-applicable exit criteria from the tracking template (internal tools: Phase 6 optional, no payments/business-plan rows; one-shots: phases 5–7 collapse into one polish-and-ship gate). Log the pruning as a decision. See **WORKFLOW §1d** and **`GREENFIELD_INTAKE.md`** §0.
- **Web-app sub-question (Phase 1, when app type = web app):** before locking PocketBase + auth, ask *"Does any state need to outlive the browser — accounts, cross-device sync, shared data — or is every user's state private and fine in `localStorage`?"* If local-only → **drop PocketBase and auth**, `adapter-static` becomes viable, no deploy-time secrets; persist via `localStorage` / `IndexedDB`. If persistent → the full Default-A stack applies. Record the choice in `decisions[]` and in **`PHASE_1_BRIEF.md` §4 (`State persistence:` row)**. See **`FORGETRAIL_LITE.md` §7** (A-local vs A-persistent) and **`GREENFIELD_INTAKE.md`** §7.
- **Initial data (optional):** The user may create **JSON files** for seed, fixtures, or imports by using **any** LLM chat (including **local Ollama**) with the copy-paste prompt in **`FORGETRAIL_LITE.md` §4.3** (structured JSON only; save to `data/` or `fixtures/`). The agent **validates** shape before import; the user can repeat for multiple datasets. Not a replacement for the Phase 1 brief — only for bulk structured content.
- **Web search (optional):** If v1 needs **live internet search**, the user can sign up for **[Tavily](https://tavily.com/)** and/or the **[Brave Search API](https://api-dashboard.search.brave.com/)** (free or entry-level credits per vendor terms), add keys to **`.env`**, and the agent wires **server-side** clients. See **`FORGETRAIL_LITE.md` §4.4** and **`GREENFIELD_INTAKE.md`** §6.
- **Content-generation pattern (optional, if content is LLM-produced):** if any v1 content is produced by an LLM rather than hand-authored or pulled from a non-LLM API, pick **one** of three patterns up front — it drives deploy model, cost, and secret management:
  - **Runtime LLM API** — server route per request; rate limits + streaming UX. **Cloud** keys in `.env`, or **local Ollama** (`OLLAMA_BASE_URL`, `OLLAMA_MODEL`) with Phase 2 **`setup-ollama`** / **`test-ollama`** (Lite §4.8; Granite 4.1 / Gemma 3 defaults).
  - **Build-time LLM generation** — `pnpm run seed` once → JSON in `data/`; zero runtime LLM cost; seed may use cloud or Ollama.
  - **BYO-LLM paste** — prompt in repo; user runs any LLM (including Ollama UI); pastes JSON; Zod at import; zero project API keys.

  Record pattern, provider, and env vars in `decisions[]` and **`PHASE_1_BRIEF.md`** (content-generation section / §6a in full template). See **`FORGETRAIL_LITE.md` §7.1** (OpenAI, Ollama, seed, BYO skeletons).
- **Phase 2 stack-conditional deps:** At Phase 2 entry, run **`FORGETRAIL_LITE.md` §4.1.2** — PocketBase/Ollama health scripts, `.env` keys, Playwright install, native `node-gyp` tooling, etc., **only for what the locked brief requires** (not universal preflight).
- **Documentation:** Do **not** generate every ForgeTrail template at once. Phase 2 creates **`CONTEXT_PROMPT.md`** (by **merging the brief** into it — see CONTEXT_PROMPT template), plus **`README.md`**, **`TODO.md`**, **`.forgetrail/IDEAS.md`**. Add `TECHNICAL_REFERENCE`, `TEST_PLAN`, `DESIGN_SYSTEM`, `BRAND_AND_PRODUCT`, hardening docs, etc. **in the phase that needs them**.

Call **`getProgressiveDocSchedule`** for the canonical phase → doc matrix (WORKFLOW §1a).

---

## First actions (in order)

0. **Pre-written spec or idea only:**
   - If **`docs/GENESIS.md`** already exists (Try path / human brought a what-not-how spec), call **`ingestPlanArtifact`** with that file’s contents as `planContent`, review the draft brief, then continue intake for gaps only (`getGreenfieldIntakePrompt`). Do **not** re-run a full blank Genesis prompt unless the user asks.
   - If the user only has an **idea** (no file yet), especially one that wraps an existing app’s data/file format, offer **`getGenesisSpecPrompt`**: they paste it into an **external** LLM chat, save the result as **`docs/GENESIS.md`**, then you ingest as above. Humans without MCP can follow repo-root **`TRY_FORGETRAIL.md`** instead.
   - Skip this step if the user wants straight Lite/MCP intake questions with no Genesis file.
1. Call **`getNewProjectKickoff`** (`includeCursorRule: false` if not using **Cursor**). It bundles this document, starter **`.forgetrail/workflow_tracking.json`**, post-bootstrap user-message guidance, and optionally the Cursor rules (phase status + lessons gate + lessons MCP detail)—**or** call **`getNewProjectBootstrap`**, **`getInitialWorkflowTracking`**, **`getPostBootstrapUserMessage`**, **`getForgeTrailCursorPhaseRule`**, and **`getForgeTrailCursorLessonsRules`** separately if you need only one piece. Create **`.forgetrail/`**, write files there; the **next message to the user** follows **`getPostBootstrapUserMessage`** (product-facing, no methodology leak).
2. **Initialize git if needed** (see **Greenfield git** above): after bootstrap files exist, `git init -b main` when `git rev-parse --is-inside-work-tree` fails; minimal `.gitignore`; optional first commit. Do not ask the user to run `git init`.
3. Call **`getProgressiveDocSchedule`** and keep it in mind for every phase transition.
4. Call **`getChecklist`** with section `before-session-1` — complete those items with the user (problem statement, stack, assets, hero flow).
5. Call **`getGreenfieldIntakePrompt`** — product/delivery questions: exports (PDF / DOCX / PPTX, etc.), tenancy (e.g. consultants × clients), hybrid vs full spec, compliance tier (even if “none yet”), hero flow, and registrar/DNS/git/hosting if still open. Capture answers in **`PHASE_1_BRIEF.md`** and **`decisions[]`**. If using native plan mode, include these questions in the plan context (`getPlanModePatterns`). When a companion trigger is true later, call **`getCompanionSuggestions`**. Do not name companions in the first user-facing message.
6. Call **`getTrackingSchema`** — you will maintain **`.forgetrail/workflow_tracking.json`** accordingly. Optionally call **`getAgentIntegrationGuide`** for your host (`grok`, `cursor`, `claude`, `generic`) and **`getForgeTrailSkill`** if the agent supports persistent skills.
7. Call **`getPhaseGuidance`** with phase `1` (architecture). Summarize understanding and propose structure, data model, integrations, and v1 scope **before** writing app code.
8. During Phase 1, create **`docs/PHASE_1_BRIEF.md`** from **`getTemplate({ name: "PHASE_1_BRIEF" })`**, fill every section, and **lock** it; mirror major decisions in **`.forgetrail/workflow_tracking.json`**.
9. After architecture is confirmed and the brief is locked, call **`getPhaseGuidance`** with phase `2` (scaffolding). Read the brief + **`.forgetrail/workflow_tracking.json`**, **merge the brief into `CONTEXT_PROMPT.md`**, then execute a **single-pass app skeleton** and the rest of the Phase 2 doc set (`README`, `TODO`, `.forgetrail/IDEAS.md`).

---

## MCP tool map (what to call when)

| Need | MCP tool |
|------|-----------|
| **Pre-Phase-1 build spec (external LLM chat)** | **`getGenesisSpecPrompt`** → user saves **`docs/GENESIS.md`**; or human recipe **`TRY_FORGETRAIL.md`** (no MCP) |
| **Feature delivery SPEC template (Phase 4+)** | **`getTemplate({ name: "SPEC_FEATURE_TEMPLATE" })`** → write `specs/[feature].md`; lifecycle in WORKFLOW Phase 4 |
| **Approved Genesis / plan → brief + decisions** | **`ingestPlanArtifact`** — after plan approval or when `docs/GENESIS.md` exists |
| **One-call greenfield setup** (bootstrap + tracking JSON + post-bootstrap guidance + optional Cursor rules) | **`getNewProjectKickoff`** — prefer over calling the granular tools separately |
| **Which docs in which phase** | **`getProgressiveDocSchedule`** (WORKFLOW §1a) |
| Phase playbooks, entry/exit criteria, patterns | `getPhaseGuidance` (phases 1–7 or keywords like `scaffolding`, `hardening`) |
| Milestone checklists | `getChecklist` (`before-session-1`, `session-1`, `session-2`, `full`, …) |
| **Exports, multi-tenant, hybrid spec, compliance, hero flow, hosting** (Phase 1) | **`getGreenfieldIntakePrompt`** — use with `before-session-1` so delivery shape is captured early |
| How to update tracking | `getTrackingSchema` |
| Doc structure vs full lessons | `getTemplate` — `mode: "shell"` for placeholders/headings only (💡📝🔧 blockquotes stripped from single-source `docs/*.md`); `mode: "full"` when you need every example and lesson. Use `name: "list"` to discover template names |
| Security, pre-launch, marketing, docs audits | `runAudit` — use `type: "list"` for available prompts |
| Keyword search across lesson callouts | `searchLessons` |
| Consolidated anti-patterns | `getAntiPatterns` |
| **Native plan mode as Phase 1** | **`getPlanModePatterns`** — use before scaffolding when the host supports plan-before-code |
| **Agent-specific integration** (Grok, Cursor, Claude) | **`getAgentIntegrationGuide`** — primitive mappings and session openers |
| **Installable forgetrail skill** (Grok etc.) | **`getForgeTrailSkill`** — copy to host skill directory |
| **Tracking file health check** | **`validateTracking`** — after substantive work or phase transitions |
| **Optional companion tools** (FilePress, LocalSlip, skills, xFacts, …) | **`getCompanionSuggestions`** — `phase` or `situation`; never required; not in the first user-facing message (WORKFLOW §1f) |
| **Parallel subagent recommendations** | **`suggestSubagentDecomposition`** — before spawning audits/research (WORKFLOW §1c) |
| **Starter tracking file** for a greenfield repo | `getInitialWorkflowTracking` — write the returned JSON to **`.forgetrail/workflow_tracking.json`** |
| **First reply to the human** after tracking exists (short; no tool dump) | **`getPostBootstrapUserMessage`** |
| **Numbered vs bullet vs letter lists** when offering options | **`getUserReplyFormat`** — also in Cursor **`forgetrail-phase-status.mdc`** |
| **Cursor IDE:** phase / next-action footers from tracking | **`getForgeTrailCursorPhaseRule`** — write to `.cursor/rules/forgetrail-phase-status.mdc` (reads **`.forgetrail/workflow_tracking.json`**; Phase 1; optional if not using Cursor) |
| **Cursor IDE:** lessons gate (`getAntiPatterns` + `searchLessons` before large work) | **`getForgeTrailCursorLessonsRules`** — writes `forgetrail-lessons-gate.mdc` + `forgetrail-lessons-mcp.mdc` (also in **`getNewProjectKickoff`**) |
| **Phase 2:** PocketBase scripted install defaults (port, version, dirs) + optional **schema-from-.env** pattern | **`getScaffoldInstallParams`** — keep app `scaffold-defaults.json` in sync; see **`schemaAutomation`** in the JSON and **`POCKETBASE_SCHEMA_SCRIPT.md`** in ForgeTrail |
| **Phase 2+:** repeatable dev scripts (env check, codegen, seed, E2E browsers, git hooks) | **`DEV_AUTOMATION_SCRIPTS.md`** in ForgeTrail; **`devAutomation`** in **`getScaffoldInstallParams`** JSON |

---

## Files to create in the **customer repo** (no `_forgetrail/`)

**Immediately (greenfield):**

- **`.forgetrail/`** — create the directory. Write **`.forgetrail/workflow_tracking.json`** inside it (output from **`getInitialWorkflowTracking`**), then fill `project.name`, `project.created`, `project.description`, and update phases as you work. Add **`.forgetrail/`** to **`.gitignore`** if the repo may be published.
- **`docs/GENESIS.md`** (optional but preferred on the Try path) — what-not-how product spec from **`getGenesisSpecPrompt`** / **`TRY_FORGETRAIL.md`**. If present at kickoff, ingest with **`ingestPlanArtifact`** before locking the brief.
- **Git repo** — if `git rev-parse --is-inside-work-tree` fails, **`git init -b main`** after bootstrap files exist (see **Greenfield git**). A failed early `git status` on an empty folder is **not** an error. Add minimal **`.gitignore`** and an optional first commit before Phase 1 intake.
- **Trailer-ban guardrails — create unconditionally, regardless of current agent.** Users switch tools mid-project. Write **`AGENTS.md`**, **`CLAUDE.md`**, and **`.forgetrail/cursor/rules/forgetrail-no-trailer.mdc`** under **`.forgetrail/`**; **symlink or copy** the `.mdc` into **`.cursor/rules/`**. Core text: no unrequested attribution in commit messages. **`git commit --trailer`** is normal on **Git 2.32+**; pre-2.32 may need a shell hop if the wrapper injects `--trailer` — see **`FORGETRAIL_LITE.md` §4.2 step 3, §8.9, §12.5**.
- **Cursor users:** `.cursor/rules/forgetrail-phase-status.mdc` — from **`getForgeTrailCursorPhaseRule`**. **`forgetrail-lessons-gate.mdc`** + **`forgetrail-lessons-mcp.mdc`** — from **`getForgeTrailCursorLessonsRules`** or **`getNewProjectKickoff`** (lessons workflow before substantial changes).

**End of Phase 1 (before scaffolding):**

- **`docs/PHASE_1_BRIEF.md`** — complete and locked; **`.forgetrail/workflow_tracking.json`** — `decisions[]` + phase 1 notes updated.

**During Phase 2 (scaffolding), after architecture lock:**

- `.env.example`, `.gitignore`
- **Scripted local services (recommended):** call **`getScaffoldInstallParams`** and align app install scripts with the returned JSON. **Never hardcode a stale PocketBase semver** — install scripts resolve **`POCKETBASE_VERSION=latest`** from GitHub at setup time (§**FORGETRAIL_LITE.md** §4.2.2, **`ONE_CLICK_DEV_SETUP.md`**). Create **setup.bat** / **setup.sh**, **run.bat** / **run.sh**, **status.bat** / **status.sh**, plus **test-pocketbase.bat** (§4.7, **`SYSTEM_HEALTH_CHECKS.md`**) so non-technical users are not given a wall of terminal commands. If the brief uses **local Ollama**, add **setup-ollama.bat** / **test-ollama.bat** (§4.8 — Granite 4.1 / Gemma 3, not thinking models by default). The agent runs first-time setup when possible; launchers are for repeat use. PocketBase lands in **`./pocketbase/`**, data in **`pb_data`**, port explicit in **`.env`** (default **8096** in reference defaults — change if **8090** or another project is already listening).
- **PocketBase collections:** prefer a **schema script** (admin auth from **`POCKETBASE_ADMIN_EMAIL` / `POCKETBASE_ADMIN_PASSWORD`** in `.env`) that idempotently creates/updates collections per **`docs/pocketbase-setup.md`** — see **`POCKETBASE_SCHEMA_SCRIPT.md`** (ForgeTrail) and **`schemaAutomation`** in **`getScaffoldInstallParams`** output — instead of manual Admin UI steps for each collection.
- **Dev automation (recommended):** add **`pnpm`** scripts for anything you’d otherwise ask the user to do repeatedly: **env validation** (`env:check`), **generated types** (`gen:types`), **seed data** (`db:seed`), **Playwright browser install** (`test:e2e:install`), **git hooks** (`prepare` + Husky). See **`DEV_AUTOMATION_SCRIPTS.md`** (ForgeTrail) and **`devAutomation`** in **`getScaffoldInstallParams`** — no cloud “infrastructure as code” required; these run on the developer machine.
- App skeleton per confirmed stack (full spine + hero flow). **SvelteKit:** if using `sv create`, pass **fully non-interactive** flags (e.g. `tailwindcss="plugins:none"` so Tailwind plugin prompts do not appear). **Target a new path** (e.g. `app/` or `web/`) that **does not exist yet** — **not** `.` — if the repo root already has files; otherwise `sv` may prompt **`Directory not empty. Continue?`** and **hang** the agent (no reliable auto-answer). See **ForgeTrail Lite** §4.2 step 10. Interactive CLIs **hang** when the agent holds a read-only terminal — see Svelte CLI `sv create --help` (“skip prompts”). Do not re-run `sv create` in an already-initialized app folder.
- **`CONTEXT_PROMPT.md`** — create from **`getTemplate`**, then **merge** `PHASE_1_BRIEF.md` per the template’s “Handoff from Phase 1” table; use **`mode: "full"`** when you need embedded patterns/anti-patterns after the merge.
- **`README.md`**, **`TODO.md`** (seed from brief §11), **`.forgetrail/IDEAS.md`** via **`getTemplate`** — do **not** add the rest of the template library here unless the user explicitly needs a file to complete the spine
- **`getTemplate({ name: "README", mode: "shell" })`** (or default shell) for structure; **`mode: "full"`** when lessons in that template are needed

**Phases 3–7:**

- Follow **`getProgressiveDocSchedule`**: e.g. `TECHNICAL_REFERENCE` / `TEST_PLAN` / `DESIGN_SYSTEM` in Phase 4+ as warranted; `BRAND_AND_PRODUCT` and pillar TODO in Phase 6; `CODE_QUALITY`, `BLACK_HAT_REPORT`, `DEPLOYMENT`, `BUGS`, etc. in Phase 7.

**Never required in the customer repo:**

- A copy of the full ForgeTrail tree (`_forgetrail/`, internal `WORKFLOW.md` mirror, etc.)

---

## Rules (same as methodology, MCP-adjusted)

- At **each session start**, read the repo’s `.forgetrail/workflow_tracking.json` and `CONTEXT_PROMPT.md` (if present). Use **`getPhaseGuidance`** for the **current** phase from `.forgetrail/workflow_tracking.json` → `currentPhase`.
- When exit criteria for a phase appear satisfied, **state that explicitly** and **wait for user confirmation** before treating the next phase as active; update `currentPhase` only after approval.
- After substantive work, **update `.forgetrail/workflow_tracking.json`**: exit criteria, `decisions`, `gotchas`, `sessions` per **`getTrackingSchema`**. Run **`validateTracking`** to catch structural drift.
- If a problem does not converge after **~5 turns**, propose a **different approach**, not more patches.
- **When the project ends** (shipped, delivered, shelved), run the **wrap protocol** (WORKFLOW §1e): sweep `gotchas[]` + `decisions[]` for generalizable lessons, run the propagation prompt in **Harvest mode**, set `project.status` to `"wrapped"`, and add a final `sessions[]` entry with end state and handoff pointers.
- **Git commits:** `git commit -F <file>` or plain `-m`; no unrequested attribution trailers. **Git 2.32.0+** supports `--trailer` — focus on message policy, not Git version anxiety. **Pre-2.32 only:** `unknown option 'trailer'` → `bash -c "git commit -F …"` or upgrade Git. See **`FORGETRAIL_LITE.md` §8.9** and **`.cursor/rules/commit-messages.mdc`**.

---

## Default stack hint (override per user)

ForgeTrail’s reference implementation used **SvelteKit (Svelte 5), TypeScript, Tailwind, PocketBase, pnpm** — but the methodology is **stack-agnostic**. Lock the stack in Phase 1 with the user; do not silently substitute your own defaults.

---

## Using ForgeTrail with gstack

If the user has [gstack](https://github.com/garrytan/gstack) installed (Claude Code slash-command skills), ForgeTrail and gstack are **complementary** — ForgeTrail provides the lifecycle methodology, project memory, and business/brand layer; gstack provides sprint execution, browser-based QA, and deploy automation. Use both:

**ForgeTrail owns the lifecycle.** Phase transitions, exit criteria, `.forgetrail/workflow_tracking.json`, progressive docs, lessons, and audits all come from ForgeTrail MCP.

**gstack owns the sprint inner loop.** Within a ForgeTrail phase, use gstack skills for the build → review → test → ship cycle:

| ForgeTrail phase | gstack skills to use | How they connect |
|---------------|---------------------|------------------|
| **Phase 1** (Plan) | `/office-hours` for product framing, `/plan-ceo-review` for scope | Capture outputs in **`PHASE_1_BRIEF.md`** and **`.forgetrail/workflow_tracking.json` → `decisions[]`** — gstack doesn't persist these, ForgeTrail does. |
| **Phase 2** (Build) | `/plan-eng-review` for technical spine review | After building the skeleton, run `/review` on the initial commit. Merge the brief into `CONTEXT_PROMPT.md` per ForgeTrail's template. |
| **Phase 3** (Stabilize) | `/investigate` for systematic root-cause debugging | Log every gotcha in **`.forgetrail/workflow_tracking.json` → `gotchas[]`** and update `CONTEXT_PROMPT.md` — gstack fixes bugs but doesn't persist lessons. |
| **Phase 4** (Iterate) | `/plan-eng-review` per feature → build → `/review` → `/qa` → `/ship` | After each `/ship`, update **`TODO.md`** (mark done), **`CONTEXT_PROMPT.md`** (if patterns changed), and **`.forgetrail/workflow_tracking.json`** (exit criteria, session notes). |
| **Phase 5** (Refine) | `/review` on refactor branches | Update `CONTEXT_PROMPT.md` and `TECHNICAL_REFERENCE.md` to match the new structure. |
| **Phase 6** (Align) | `/design-consultation` for design system, `/plan-ceo-review` for scope check | Create **`BRAND_AND_PRODUCT.md`** and restructure **`TODO.md`** via ForgeTrail templates — gstack doesn't have brand/strategy tooling. |
| **Phase 7** (Harden) | `/cso` for security audit, `/qa` for full regression, `/ship` + `/land-and-deploy` + `/canary` for production | ForgeTrail's `runAudit("black-hat")` and gstack's `/cso` are complementary — run both. ForgeTrail produces **`BLACK_HAT_REPORT.md`** and **`CODE_QUALITY.md`** as persistent docs; gstack's `/cso` catches runtime exploits. Use `/land-and-deploy` → `/canary` for the actual deploy pipeline, then fill ForgeTrail's **`DEPLOYMENT.md`** to document the process. |

**Key rule:** After every gstack sprint that completes meaningful work, **update `.forgetrail/workflow_tracking.json`** (move exit criteria, add decisions/gotchas, update session notes). gstack persists some sprint artifacts (design docs from `/office-hours` in `~/.gstack/projects/`, retro snapshots in `.context/retros/`, review overrides, skill analytics), but it has **no lifecycle state, no decision rationale log, and no architecture context document**. ForgeTrail's `.forgetrail/workflow_tracking.json` + `CONTEXT_PROMPT.md` are the system of record for what phase you're in, what's been decided and why, what gotchas have been hit, and what the architecture looks like — none of which gstack tracks.

---

## IP / distribution note

This bootstrap is designed for **MCP delivery**: deep methodology stays in the ForgeTrail distribution or hosted MCP; the customer repository holds **their** app, **their** filled docs, and **their** tracking file — not a vendored copy of ForgeTrail itself.
