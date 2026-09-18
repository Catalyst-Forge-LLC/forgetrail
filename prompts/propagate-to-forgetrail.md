# Propagate to ForgeTrail

Run this prompt after implementing a new feature, pattern, plan, or significant enhancement in your app. It generalizes **both** durable **feature shapes** (what to document in **`TECHNICAL_REFERENCE.md`**, **`TEST_PLAN.md`**, brand/design templates) **and** reusable **lessons** (callouts in templates), then updates ForgeTrail so future projects start with that guidance.

**Any ForgeTrail project is a valid source** — not just the flagship app that seeded these templates. A weekend one-shot with two gotchas in its tracking file propagates the same way a mature SaaS does; small projects often exercise the newest tool versions and surface the freshest scaffolding lessons. If your project has only a handful of docs (Lite bootstrap, `one-shot` archetype), skip the doc-inventory ceremony and use **Harvest mode** below.

### Harvest mode (small projects and project wrap)

Use this when the source project is **small** (no product journal, minimal doc set) or you are running the **wrap protocol** (WORKFLOW.md §1e) at project end. The primary discovery source is the **tracking file**, not the doc tree:

1. **Read `.forgetrail/workflow_tracking.json`** — every `gotchas[]` entry and every `decisions[]` entry — plus `CONTEXT_PROMPT.md`'s gotcha/pattern sections and any `FORGETRAIL_LITE_UPDATES.md`.
2. **Classify each entry:** *generalizable* (framework traps, CLI behavior changes, scaffolding surprises, integration lessons — anything a different project on the same stack could hit) vs *app-specific* (content decisions, domain rules). Only the first group propagates.
3. **For each generalizable entry**, run the normal Step 2 dedupe (grep ForgeTrail for existing coverage) and Step 3 mapping (which template gets it). Tracking-file gotchas usually land as **pattern memory** (`CONTEXT_PROMPT.md` callouts, `FORGETRAIL_LITE.md` scaffolding notes); occasionally a decision reveals a **feature shape** worth a stub.
4. **Zero-yield is fine.** If nothing generalizes, say so and skip the update-log entry — do not pad.

Harvest mode replaces the Discovery scan and Journal-driven sections for these projects; everything from Step 2 onward applies unchanged.

### What “propagation” means (read this first)

Propagation is **two parallel deliverables**. Skipping either one is an **incomplete** pass:

1. **Feature memory — what shipped** — When your journal shows **`Added`** (or you ship a user-named capability), a greenfield project using ForgeTrail should already see **where to document it**: a **Feature Documentation** (or equivalent) home in **`TECHNICAL_REFERENCE.md`**, **manual coverage** in **`TEST_PLAN.md`**, and **positioning / IA** updates in **`BRAND_AND_PRODUCT.md`** or **`DESIGN_SYSTEM.md`** when the product map changes. Use **stubs, headings, and “document routes, collections, edge cases”** guidance—not only a paragraph in **`CONTEXT_PROMPT.md`**.

2. **Pattern memory — what we learned** — Gotchas, invariants, and anti-patterns belong in **`CONTEXT_PROMPT.md`**, **`CODE_QUALITY.md`**, and other templates using blockquote callouts (`> 💡 **Lesson learned:**`, `> 🔧 **Guidance:**`, `> 📝 **Example:**`). This is the familiar “lesson” track.

**Rule of thumb:** If a user could name the feature in one short phrase (“calendar download,” “export my data,” “variants tab”), ForgeTrail should **name that capability outside CONTEXT** somewhere—at least as a bracketed subsection—so the next app documents it by default.

**Periodic / backlog review:** When catching up on **`docs/PRODUCT_JOURNAL.md`** (or your git-derived changelog), work **back through weeks or months** if needed: older **`Added`** lines often never got a **TECH_REF / TEST_PLAN** home because only lessons were propagated. Treat those lines as a **backlog of feature stubs** to add in one pass.

### Journal-driven propagation (new and materially improved features)

Your app's **`docs/PRODUCT_JOURNAL.md`** is a primary backlog for **ForgeTrail feature-area stubs**, not optional color.

When you run a **periodic** propagation (catch-up after a sprint, or anytime **Added** / **Improved** work piled up):

1. **Pick a time window** — e.g. **last 10–14 calendar days** of journal sections, **and/or** every journal date **after** the latest **propagation** entry in **`update-log.md`** (if dated).
2. **Walk every bullet** tagged **Added**, **Improved**, or **Fixed** when that fix **changes behavior, data, or contracts** (not typo-only). **Improved** often means **new routes, merge rules, or persistence** — it needs a **TECH_REF / TEST_PLAN** home, not only a lesson.
3. **For each substantive bullet, run Step 3 twice:** (A) **Feature memory** — add or extend a **`### [Capability]`** in **`TECHNICAL_REFERENCE.md`**, **`TEST_PLAN.md`**, or brand/design docs. (B) **Pattern memory** — **`CONTEXT_PROMPT.md`**, **`CODE_QUALITY.md`**, etc.
4. **Dedupe** with grep on ForgeTrail; extend existing subsections when keywords already exist.
5. **Journal rows that cite new `specs/`** — read those specs; propagate durable decisions.
6. **`Sounds product-specific`** — Before skipping a journal bullet because it uses your **marketing name** for a feature, ask whether the **shape** is common across SaaS. If yes, add a **`[BRACKETED]` stub** (not your codename): **persistent AI dock/rail** → **`TECHNICAL_REFERENCE` → Persistent contextual assistant** + **`CONTEXT_PROMPT`** + **`TEST_PLAN` §7.5**; **multi-tab lenses on one record** → **`TECHNICAL_REFERENCE` → Companion lenses** + **`TEST_PLAN` §7.6**; **portfolio / professional URLs** → **`TECHNICAL_REFERENCE` → User-visible external identity URLs** + **`TEST_PLAN` §1.8**; **dense admin grids with expand + billing links** → **`DESIGN_SYSTEM` → Admin master–detail tables** + **`TEST_PLAN` §7.7**.

---

## Context

**Your app** is the live project. Its docs are the source of truth — **whichever of these exist**. A full Phase-7 product will have most of them; a Lite or `one-shot` project may have only `CONTEXT_PROMPT.md`, `README.md`, `TODO.md`, and the tracking file (use **Harvest mode** above in that case). Treat this list as a menu, not a requirement:

- `CONTEXT_PROMPT.md`
- `docs/PHASE_1_BRIEF.md` (if you improved the Phase 1 handoff template)
- `docs/BUSINESS_PLAN.md`
- `docs/TECHNICAL_REFERENCE.md`
- `docs/CODE_QUALITY.md`
- `docs/BLACK_HAT_REPORT.md`
- `docs/BRAND_AND_PRODUCT.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/SPEC_UI_CHROME_NAV_TEMPLATE.md` (optional; copy/fill when nav chrome rules solidify — propagate lessons into templates, not verbatim)
- `docs/DEPLOYMENT.md`
- `docs/TEST_PLAN.md`
- `docs/AUTOMATED_TESTING.md` (optional: Vitest / API / Playwright strategy — pairs with **TEST_PLAN**)
- `docs/DEV_ESTIMATE.md`
- `docs/MARKETING_GROWTH.md`
- `docs/BUGS.md`
- `docs/TODO.md`
- `docs/IDEAS.md`
- `specs/` (feature specifications — check for recently created/updated specs)
- `prompts/` (reusable prompts — check for new prompts worth generalizing)
- Optional **generated or synced** docs worth propagating when their workflow changes — e.g. `docs/COMPETITIVE_LANDSCAPE.md` (mirror of a `specs/` competitive analysis + sync script), `docs/PRODUCT_JOURNAL.md` (git-derived changelog + LLM/heuristic tooling)
- Optional **`docs/FEATURE_CATALOG.md`** (or equivalent) — internal inventory of shipped capabilities vs UI entry points; pairs with **`user-facing-content-sync-audit.md`** when checking landing/help/tour parity
- Optional **`prompts/microcopy-centralization.md`** — phased inline→module migration, export/inline/duplication audits (when the app adopts `$lib/content/*Copy.ts`)
- Optional **launch / research / checklist** docs if your app maintains them (e.g. `docs/NPS.md`, `docs/MARKETING_LAUNCH.md`, `docs/LAUNCH_CHECKLIST.md`) — propagate copy and methodology lessons into ForgeTrail **MARKETING_GROWTH**, **BRAND_AND_PRODUCT**, or **TEST_PLAN** / **pre-launch-audit** as appropriate

### When to run this prompt (propagation triggers)

Run after meaningful implementation work **and** after substantive **documentation** changes — or at least **skim Steps 2–3** when a trigger fires so you don’t skip a small template touch. Non-exhaustive triggers:

| Trigger | Why |
| -------- | --- |
| **`docs/BRAND_AND_PRODUCT.md` updated** | Positioning, promise, voice, or copy-lesson edits usually map to ForgeTrail `docs/BRAND_AND_PRODUCT.md` and may require `CONTEXT_PROMPT.md` / `pre-launch-audit.md` updates. **Treat this file as a first-class propagation signal**, not only code changes. |
| **Landing or public marketing copy changed** | Align in-app story surfaces (About, Help) per *Keep in-app marketing surfaces aligned with the public landing*. |
| **New or updated `specs/`** | Extract reusable architecture, data, and UX patterns. |
| **Spec lifecycle folder conventions changed** | New/renamed spec folders (e.g. `specs/partial/`, `specs/completed/`, `specs/canonical/` for living references) or changes to when a spec moves between them → **WORKFLOW.md** spec-lifecycle subsection and, if the app codifies it, `.cursor/rules/specs-and-todo.mdc` + `.cursor/rules/spec-completion.mdc` guidance. |
| **New or updated project `prompts/`** | Generalize methodologies into `prompts/` here when they apply beyond one app. |
| **Skill library / handoff docs created or updated** (`docs/skills/` or similar) | Generalizable judgment, debugging playbooks, and anti-patterns → **CONTEXT_PROMPT** / **CODE_QUALITY** / **TECHNICAL_REFERENCE** lessons; the capture methodology lives in **`prompts/engineering-skill-library.md`**. |
| **Competitive intelligence** (e.g. paid-ad screenshot reviews, landscape specs) | See `docs/MARKETING_GROWTH.md` → *Competitive intelligence: paid social screenshots* and `docs/BRAND_AND_PRODUCT.md` → *Don't echo competitor ad tropes*. |
| **Product journal / changelog automation** | Changes to git→journal scripts, LLM vs heuristic defaults, or append semantics → **CONTEXT_PROMPT** (tooling) and optionally **TECHNICAL_REFERENCE** (pipelines). |
| **Major feature or integration** | Use the Step 3 mapping table (TECH_REF, CONTEXT_PROMPT, etc.). |
| **Published repo / ForgeTrail workspace layout** (secrets in tracking; **`.forgetrail/`** gitignore vs commit; GH007 push failures; MCP vs Lite vendoring) | **`content/FORGETRAIL_LITE.md`** §1.5–§1.6, §4.1.1, §13; **`cursor-rules/forgetrail-*.mdc`**; **`forgetrail-workspace-README.md`**; **`NEW_PROJECT_BOOTSTRAP.md`**. |
| **Lite monorepo env / pnpm native builds / API+UI workspace** (dotenv at Node entry, Vite `loadEnv` merge, `onlyBuiltDependencies`, port health-check) | **`content/FORGETRAIL_LITE.md`** §4.1, §4.2.1, §4.2 step 10, §13–§14 |
| **PocketBase bootstrap / non-technical local dev** (hardcoded PB semver pain, command-dump onboarding, need setup/run/status launchers) | **`FORGETRAIL_LITE.md`** §4.2.2, §4.5–§4.6; **`ONE_CLICK_DEV_SETUP.md`**, **`FORGETRAIL_PROGRESS.md`**, **`scripts/setup-pocketbase.mjs`**, **`scripts/forgetrail-dev-launcher.mjs`**, **`SCAFFOLD_INSTALL.json`**; **`POCKETBASE_SCHEMA_SCRIPT.md`**, **`DEV_AUTOMATION_SCRIPTS.md`**, **`NEW_PROJECT_BOOTSTRAP.md`** |
| **Isolated service health checks / local Ollama** (test PB without app; install Ollama + VRAM model + completion test; avoid thinking models by default) | **`SYSTEM_HEALTH_CHECKS.md`**, **`FORGETRAIL_LITE.md`** §4.7–§4.8; **`scripts/test-pocketbase.mjs`**, **`scripts/setup-ollama.mjs`**, **`scripts/test-ollama.mjs`**, **`SCAFFOLD_INSTALL.json`** `systemHealthChecks` |
| **URL / listing import pipeline** (fetch + HTML parse, refresh-from-source, optional LLM-assisted recover when selectors drift) | `docs/TECHNICAL_REFERENCE.md` (*URL import* — paywalls, **markup drift / optional recover**); `docs/CONTEXT_PROMPT.md`; `docs/TEST_PLAN.md` §2a; **`content/FORGETRAIL_LITE.md` §7.2**; partial spec stub under **`specs/partial/`** when shipped behavior needs follow-up. |
| **A week+ of shipping without running this prompt** | Use **Journal-driven propagation**: sweep **`docs/PRODUCT_JOURNAL.md`** (e.g. last 10–14 days) so **Added** / **Improved** items get **`TECHNICAL_REFERENCE` / `TEST_PLAN`** stubs, not only **CONTEXT_PROMPT** lessons. |
| **Project wrap — the source project is finished, delivered, or shelved** | Run **Harvest mode** (top of this prompt) as part of the wrap protocol (**WORKFLOW.md §1e**): sweep the tracking file's `gotchas[]` + `decisions[]` before the project goes quiet. Small projects count. |
| **CI/CD, Node/`engines`, or package-manager pins changed** | Keep workflow, container, and `package.json` in sync — lessons for **DEPLOYMENT.md**, **TECHNICAL_REFERENCE.md**, **CONTEXT_PROMPT.md**. |
| **Deploy scripts, systemd units, or process stop/restart behavior** | `TimeoutStopSec`, blue-green `systemctl stop`, and graceful-shutdown tradeoffs affect **wall-clock deploy time** as well as request safety — **DEPLOYMENT.md** (and **CONTEXT_PROMPT** if it changes operator expectations). |
| **New scripts, hooks, or dev-tooling** | Journal/lint/build wrappers → **CONTEXT_PROMPT** (tooling) or **TECHNICAL_REFERENCE** (pipelines). |
| **`.cursor/rules/` git / commit policy** | e.g. `git-user-commits.mdc`, `commit-messages.mdc` — keep **this repo’s** `.cursor/rules/` aligned with your app when you propagate workflow changes: **end of each request**, stage only paths from that request and **commit** with message from **`git diff --staged`** (multi-line body by default); push remains explicit-only. |
| **Microcopy centralization completed or copy-module pattern adopted** | **`prompts/microcopy-centralization.md`**, **`docs/TECHNICAL_REFERENCE.md`** § User-facing copy, **`docs/CODE_QUALITY.md`** audit checklist, **`docs/BRAND_AND_PRODUCT.md`** duplication policy, **`docs/CONTEXT_PROMPT.md`**, **`content/cursor-rules/writing-voice.mdc`**, **`content/cursor-rules/user-facing-content.mdc`** — generalize patterns only, not app-specific strings. |
| **Assertive product voice / hedging *can* removed from capability copy** | **`.cursor/rules/user-facing-content.mdc`** (Assertive capability copy), **`docs/BRAND_AND_PRODUCT.md`** (We say / We don't say table), **`docs/CONTEXT_PROMPT.md`**, **`docs/CODE_QUALITY.md`** pre-launch grep, **`docs/TEST_PLAN.md`** §4.5; MCP **`cursor-rules/`** mirror. |
| **Brand theme / positioning spine crystallized** (voice rule file, banned framings, signature-line system, origin-narrative constraints) | **`docs/BRAND_AND_PRODUCT.md`** → *Positioning spine (theme lock)* + *Long-form origin narrative (constraints file)*; **`docs/CONTEXT_PROMPT.md`** pattern + anti-pattern; **`content/cursor-rules/writing-voice.mdc`** template. |
| **Structured eligibility or requirement fit** (education, clearance, license, work auth — taxonomy + extraction + badges + filters + LLM context) | **`docs/TECHNICAL_REFERENCE.md`** → *[Structured eligibility / requirement fit]* stub; **`docs/TEST_PLAN.md`** §4.6; **`docs/BRAND_AND_PRODUCT.md`** one-line declare-once lesson; do **not** copy domain-specific enums/regex. |
| **App-owned transactional email or documented deletion lifecycle** | Central outbound module (BaaS/auth SMTP vs product mail), env vars, webhook idempotency, DNS/SPF/DKIM; **TECHNICAL_REFERENCE** data-model subsection for cascade vs soft delete and orphan risks — also **DEPLOYMENT**, **TEST_PLAN**, **CONTEXT_PROMPT**, **pre-launch-audit**, **WORKFLOW** cross-checks. |
| **`docs/DEV_ESTIMATE.md` materially updated** | Inventory methodology (LOC, route modules), hour bands, or US cost scenarios → align ForgeTrail **`docs/DEV_ESTIMATE.md`** generalized placeholders and guidance. |

### Discovery scan — where to look for propagation candidates

Do **not** rely only on the immediate trigger. Skim **multiple signal sources** so cross-cutting lessons from the same sprint (e.g. export pipeline + CI + lint) are not missed.

| Source | What to extract |
|--------|-----------------|
| **`.forgetrail/workflow_tracking.json`** (`gotchas[]`, `decisions[]`) | Framework traps, CLI/scaffolding surprises, and integration lessons logged during the build — the primary source for small projects (see **Harvest mode**), and an easy-to-miss one for large projects where docs lag the tracking file. |
| **`git log` / recent commits** | Subjects and paths; cluster related work; compare to the last `update-log.md` propagation date. |
| **`docs/PRODUCT_JOURNAL.md`** (or git-derived changelog) | Day-level themes across UX, infra, and docs. Map **`Added`** / major **`Improved`** items to Step 3: new **feature-area** stubs in **`TECHNICAL_REFERENCE.md`**, **`TEST_PLAN.md`** checks, **`BRAND_AND_PRODUCT.md`** / **`DESIGN_SYSTEM.md`** when IA or positioning changes—not only **`CONTEXT_PROMPT.md`** bullets. |
| **Recently touched `specs/`** | Durable architecture and copy decisions, including WIP specs. |
| **Project `prompts/`** | Candidates to generalize into this repo’s `prompts/`. |
| **`.github/workflows/`** | Node/pnpm pins, build, deploy → **DEPLOYMENT.md**, **CONTEXT_PROMPT.md**. |
| **`package.json`** | `engines`, `packageManager`, scripts → **WORKFLOW.md** / **CODE_QUALITY** cues. |
| **`scripts/`** | Automation and document pipelines → **TECHNICAL_REFERENCE** or **CONTEXT_PROMPT**. |
| **`.cursor/rules/` or `AGENTS.md`** | Conventions worth a template *principle*, not a verbatim copy. |
| **`TODO.md` / backlog** | Recently finished work may encode undocumented patterns. |
| **Shared app libraries** (server helpers, `*Utils.ts`, entitlements) | Reusable patterns for **CONTEXT_PROMPT** / **TECHNICAL_REFERENCE**. |
| **Progressive import (stub + finalize) from the browser** | Separate requests: defensive JSON, **GET-by-id reconciliation** when finalize misbehaves, **failure callbacks** on every entry surface; terminal-state polling for phases after import → **TECHNICAL_REFERENCE** (URL import: client reconciliation), **CONTEXT_PROMPT**, **TEST_PLAN** §2a. |
| **Workflow enums / board columns vs stored status** | Normalize legacy or empty values at the mapper so rows are not invisible to filters while dedupe still applies → **TECHNICAL_REFERENCE** (stored workflow enums), **CONTEXT_PROMPT**. |
| **Parallel BaaS / SDK reads in list routes** (e.g. `Promise.all` + per-row `getList` on one client) | Auto-cancellation / aborted requests → empty nested payloads; **CONTEXT_PROMPT**, **TECHNICAL_REFERENCE**, **TEST_PLAN** §8.6. |
| **Journal lines that “sound branded”** | Map to generic shapes per **Journal-driven propagation** §6 (assistant rail, multi-lens detail, profile URLs, admin master–detail) → **TECHNICAL_REFERENCE**, **DESIGN_SYSTEM**, **TEST_PLAN**. |
| **Tests / E2E** | New coverage categories → **TEST_PLAN.md** or **CODE_QUALITY.md**. |
| **Marketing / landing routes** | Copy and SEO → **BRAND_AND_PRODUCT.md**, **DESIGN_SYSTEM.md**, `pre-launch-audit.md`. |
| **Outbound email + delete semantics** | Provider HTTP API from server, idempotent webhook/cron sends, deliverability DNS; hard vs soft delete, cascade gaps, and “what support can restore” → **TECHNICAL_REFERENCE** + **TEST_PLAN** manual checks. |

**Cadence:** For a **periodic** pass, run this table **top to bottom** with a **time window** (e.g. last 48–72 hours, or since the last row in **`update-log.md`**).

**ForgeTrail** is the reusable template framework at `_forgetrail/` (or wherever you've placed it). Its doc templates are what new projects start from:

- `update-log.md` (repo root — **append after each propagation pass**; see Step 7)
- `docs/CONTEXT_PROMPT.md`
- `docs/PHASE_1_BRIEF.md`
- `docs/BUSINESS_PLAN.md`
- `docs/TECHNICAL_REFERENCE.md`
- `docs/CODE_QUALITY.md`
- `docs/BLACK_HAT_REPORT.md`
- `docs/BRAND_AND_PRODUCT.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/SPEC_UI_CHROME_NAV_TEMPLATE.md`
- `docs/DEPLOYMENT.md`
- `docs/TEST_PLAN.md`
- `docs/AUTOMATED_TESTING.md` (optional: Vitest / API / Playwright strategy — pairs with **TEST_PLAN**)
- `docs/DEV_ESTIMATE.md`
- `docs/MARKETING_GROWTH.md`
- `docs/BUGS.md`
- `docs/TODO.md`
- `docs/IDEAS.md`
- `docs/NAMING_EXPLORATION.md`
- `docs/README.md` (app template)
- `README.md` (root)
- `INITIAL_PROMPT.md`
- `CONTINUATION_PROMPT.md`
- `WORKFLOW.md`
- `TRACKING_SCHEMA.md`
- `prompts/` (reusable prompt library — includes `personal-beta-outreach.md`, `user-facing-content-sync-audit.md`, `microcopy-centralization.md`, `engineering-skill-library.md`)
- `mcp-server/` — MCP packaging: `README.md`, `content/` (kickoff/bootstrap, greenfield intake, scaffold JSON, post-bootstrap messaging, Cursor rule fragments), **`content/FORGETRAIL_LITE.md`** (portable kickoff — when propagation touches **URL import / scrape**, **markup drift**, **LLM verbatim recover fallback**, or **failure-copy vs wrong-URL** UX, update **§7.2** and bump the Lite **version** in header, footer, and the §12 `AGENTS.md` snippet), `src/index.ts` (e.g. `getNewProjectKickoff`, `getGreenfieldIntakePrompt`)

## What I just built/changed

[DESCRIBE THE FEATURE, PATTERN, OR ENHANCEMENT HERE. Be specific: what problem it solves, what the implementation approach was, and what you learned. Include file names if helpful.]

If this prompt is being run inside a conversation where changes were just made, use the conversation history and summary as the source of truth — you don't need a manual description. Read the relevant source files and specs to fill in gaps.

**Periodic review:** Use **Journal-driven propagation** (journal window + **Added** / **Improved** / substantive **Fixed**) alongside theme-based skim. **Improved** bullets often imply **expanded product surface** deserving a ForgeTrail stub, not just a tweak note.

## Instructions

You are propagating from a live app into ForgeTrail templates **on both tracks**: **(A)** **feature documentation**—where a new capability lives in **`TECHNICAL_REFERENCE.md`**, **`TEST_PLAN.md`**, brand/design docs—and **(B)** **lessons**—patterns and anti-patterns in **`CONTEXT_PROMPT.md`** and elsewhere. ForgeTrail is NOT a copy of any specific app; extract **generalized** guidance for future projects.

**Generalization first (applies to every Lesson learned callout you add under Step 4 rules 2–7):** State the **abstract principle**—what category of mistake, what invariant to preserve, why future projects should care. *Then* add brief illustrations (e.g. consolidating duplicated **numeric literals**, **magic strings**, or **user-facing copy** that must stay aligned with server rules). **Do not** lead with those examples: opening lines like “centralize the `10` in trial length” or “move rate limits to a file” teach the trivia before the rule. Examples belong in the second half of a callout, in a `📝 **Example:**` block, or as `[BRACKETED]` placeholders—not as the headline.

### Step 1: Understand what changed

Complete the **Discovery scan** subsection above unless the run is narrowly scoped to a **single** known artifact.

**If the run is periodic or catch-up:** complete **Journal-driven propagation** (journal time window + substantive bullets) **before** relying only on `git log` or chat context.

Then read the feature/change description (or the conversation history) and the relevant app source files and docs to fully understand:

- What was built and why
- What architectural decisions were made (and the reasoning)
- What didn't work before the current approach was chosen
- What gotchas or debugging insights came up

### Step 2: Check for existing coverage

Before writing anything, search ForgeTrail's docs and prompts for each pattern you plan to add. Grep for relevant keywords. If a lesson is already captured (even approximately), skip it. Patterns that appear in multiple ForgeTrail files from different angles (e.g., a design pattern in DESIGN_SYSTEM.md and its anti-pattern in CONTEXT_PROMPT.md) are intentional and fine — but don't duplicate the same lesson in the same framing.

### Step 3: Identify which ForgeTrail templates need updates

For **each** journal **`Added`** line, substantive **`Improved`** line (expanded capability — not polish-only), or **`Fixed`** line that changes user-visible contracts, walk this step **twice**: first ask “Where does this feature get a documented home?” (`TECHNICAL_REFERENCE` feature area, `TEST_PLAN`, `BRAND_AND_PRODUCT`, `DESIGN_SYSTEM`), then ask “What lessons or anti-patterns apply?” (`CONTEXT_PROMPT`, `CODE_QUALITY`, callouts). Doing only the second pass misses propagation’s purpose.

Map the change to ForgeTrail docs. Not every change touches every file. Use this guide:

| If the change involves...                        | Update these ForgeTrail templates                                    |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| A new business metric, pricing, or growth plan   | `docs/BUSINESS_PLAN.md`                                            |
| A new API route, data model, or integration      | `docs/TECHNICAL_REFERENCE.md`                                      |
| A new UI pattern or architectural decision       | `docs/CONTEXT_PROMPT.md` (Critical Patterns or Patterns to Follow) |
| A framework/library gotcha or debugging lesson   | `docs/CONTEXT_PROMPT.md` (Critical Patterns)                       |
| A deployment or infrastructure change            | `docs/DEPLOYMENT.md`                                               |
| A code quality finding or security pattern       | `docs/CODE_QUALITY.md`                                             |
| A security vulnerability pattern or audit lesson | `docs/BLACK_HAT_REPORT.md`                                        |
| A brand/voice/UX principle or copy lesson        | `docs/BRAND_AND_PRODUCT.md`                                        |
| A visual design pattern or design system insight | `docs/DESIGN_SYSTEM.md`                                            |
| An accessibility or a11y pattern                 | `docs/DESIGN_SYSTEM.md` (Accessibility Patterns)                   |
| A landing page UX, copy, or conversion pattern   | `docs/BRAND_AND_PRODUCT.md` + `docs/DESIGN_SYSTEM.md`             |
| An SEO, structured data, or indexing pattern      | `prompts/pre-launch-audit.md` (SEO section)                        |
| A marketing/persuasion strategy                  | `docs/MARKETING_GROWTH.md`                                         |
| A bug triage workflow improvement                | `docs/BUGS.md`                                                     |
| A new testing strategy or test category          | `docs/TEST_PLAN.md` and/or `docs/AUTOMATED_TESTING.md`              |
| **External URL import / scrape** (deterministic HTML parsers, markup drift, optional last-resort structured LLM recover, per-stage diagnostics) | `docs/TECHNICAL_REFERENCE.md` (*URL import* subsections), `docs/CONTEXT_PROMPT.md`, `docs/TEST_PLAN.md` §2a, **`content/FORGETRAIL_LITE.md` §7.2**, optional **`specs/partial/`** |
| Persistent **assistant / copilot** (dock or rail), streaming, optional record binding | `docs/TECHNICAL_REFERENCE.md`, `docs/CONTEXT_PROMPT.md`, `docs/TEST_PLAN.md` (§7.5) |
| **Multi-lens / multi-tab** persisted outputs on **one primary entity**      | `docs/TECHNICAL_REFERENCE.md`, `docs/CONTEXT_PROMPT.md`, `docs/TEST_PLAN.md` (§7.6) |
| **Structured eligibility / requirement fit** (posting requirement vs user profile) | `docs/TECHNICAL_REFERENCE.md` (*Structured eligibility* stub), `docs/TEST_PLAN.md` (§4.6), `docs/BRAND_AND_PRODUCT.md` (assertive voice / declare-once) |
| User or contact **external identity URLs** (profiles, portfolios)           | `docs/TECHNICAL_REFERENCE.md`, `docs/CONTEXT_PROMPT.md`, `docs/TEST_PLAN.md` (§1.8) |
| **Admin/support** dense tables + row expansion + PSP deeplink columns       | `docs/DESIGN_SYSTEM.md`, `docs/TECHNICAL_REFERENCE.md` (if dedicated routes), `docs/TEST_PLAN.md` (§7.7) |
| A development cost/effort estimate               | `docs/DEV_ESTIMATE.md`                                             |
| A growth channel, marketing strategy, or metric  | `docs/MARKETING_GROWTH.md`                                         |
| A workflow or phase change                       | `WORKFLOW.md` or `TRACKING_SCHEMA.md`                              |
| A new doc convention or project setup step       | `INITIAL_PROMPT.md` or `docs/README.md`                            |
| A reusable prompt or audit methodology           | `prompts/` (add as a new generalized file)                         |
| Propagation / ForgeTrail changelog entry           | `update-log.md` (append; see Step 7)                               |
| A new document type worth templating             | `docs/` (add as a new template file)                               |
| A spec pattern worth reusing                     | `docs/CONTEXT_PROMPT.md` or relevant template                      |

**Also check:**

- Are there new specs in the app's `specs/` directory? Specs often contain reusable architectural patterns, data models, and UX decisions worth extracting.
- Are there new prompts in the app's `prompts/` directory that would benefit other projects if generalized?
- Do any **existing** ForgeTrail prompts need updates? (e.g., `pre-launch-audit.md` may need new checklist items based on what you found.) Don't just add new prompts — enhance existing ones.
- Has a new document type emerged that ForgeTrail doesn't yet have as a template? Check `docs/` for the current inventory.

### Step 4: Write the ForgeTrail updates

Follow these rules strictly:

1. **Generalize, don't copy.** Replace app-specific details with `[BRACKETED]` placeholders or generic descriptions. ForgeTrail templates are starting points — they should describe _what_ to build and _why_, not any specific app's exact implementation.

1b. **Feature-area stubs are allowed to be “thin.”** A new **`### [Capability]`** in **`TECHNICAL_REFERENCE.md`** may be mostly **Guidance** callouts (`> ... **Guidance:**`) (“document routes, collections, edge cases”) with bracketed placeholders. Not every feature needs a long **Lesson learned** callout; it **does** need a **named place** future projects will fill.

2. **Principle before examples.** In each new lesson, the first sentences establish the **reusable rule** (single source of truth, no silent drift between layers, etc.). **Examples**—such as shared constants for limits, one milliseconds-per-day helper, or deduplicating copy that mirrors enforcement—come **after** that framing. Never open with literals, paths, or product-specific nouns; those illustrate the pattern, they don't define it.

3. **Use blockquote callouts for lessons.** ForgeTrail templates use blockquote callouts (`> 💡 **Lesson learned:**`) for implementation wisdom. New lessons use this format. Three callout types: `> 💡 **Lesson learned:**` for hard-won wisdom, `> 📝 **Example:**` for concrete samples (use this when you need a specific number, filename, or stack detail), `> 🔧 **Guidance:**` for template instructions.

4. **Preserve the existing structure.** Don't reorganize sections or rename headings. Add content within the existing framework. If no appropriate section exists, add a new subsection at the logical location.

5. **Include the WHY.** Every lesson must explain _why_ the approach works, not just _what_ to do. The "why" is what prevents future Claude sessions from undoing intentional decisions.

6. **Include anti-patterns when relevant.** If you tried something that didn't work before arriving at the current approach, capture that as a "don't do this" note. These are often more valuable than the positive patterns.

7. **Keep it concise.** A lesson should be 3-8 lines. If it needs more, it probably belongs in a dedicated doc in the future app, not in the ForgeTrail template.

### Step 5: Verify consistency

After making edits, do a quick cross-check:

- If you added something to `BUSINESS_PLAN.md`, does `TECHNICAL_REFERENCE.md` need a corresponding implementation section?
- If you added a pattern to `CONTEXT_PROMPT.md`, is there a matching anti-pattern to capture?
- If you added a design or a11y pattern to `DESIGN_SYSTEM.md`, does `pre-launch-audit.md` need a matching checklist item?
- If you added a copy/messaging lesson to `BRAND_AND_PRODUCT.md`, is there a corresponding anti-pattern for `CONTEXT_PROMPT.md`?
- If the change affects the development workflow, does `WORKFLOW.md` or `TRACKING_SCHEMA.md` need a phase update?
- If you added a new doc template, does `README.md` list it?

**File inventory parity check:** List the actual files in both repos (`docs/`, `prompts/`, root `*.md`) and compare against what this prompt's Context section claims. If any files exist that aren't listed (new docs added since the last propagation, renamed files, merged files), update the Context section in **both copies** of this prompt (the app's version and ForgeTrail's). Also flag any listed files that no longer exist or have been archived.

**Onboarding doc freshness check:** Review ForgeTrail's human-facing and agent-facing onboarding docs for staleness caused by the changes you just propagated:

- `README.md` — Does the file tree match what's actually in the repo (including `update-log.md` and new prompts)? Does the "Topics covered" section reflect newly added content? Are all prompts described in the Prompts section? Are session counts or other specific numbers still accurate?
- `INITIAL_PROMPT.md` — Does the doc template list (Phase 2 and later phases) include all current templates? Are scope descriptions still accurate for templates whose content has expanded? Do path conventions (`_forgetrail/`, etc.) match the README's setup instructions?
- `CONTINUATION_PROMPT.md` — Same path convention check.

Update any that are out of sync. These docs are the first thing a human or agent reads — stale information here propagates confusion into every project that starts from ForgeTrail.

**ForgeTrail Lite parity:** When the propagation adds or changes **external URL → structured record** behavior (layered fetch/parse, **empty extract vs bad URL**, optional **last-resort** small-model recover from stripped HTML, env opt-out, diagnostics without full HTML in analytics), update **`content/FORGETRAIL_LITE.md`** (**§7.2**; bump **v1.x** if the section changed materially) and cross-check **`README.md`**, **`WORKFLOW.md`**, and **`INITIAL_PROMPT.md`** for citations — Lite-only projects may never open full **`docs/TECHNICAL_REFERENCE.md`**.

**Triplicate optional sections:** When **§4.3**, **§4.4**, or **§7.1** (or **§7.2**) in **`FORGETRAIL_LITE.md`** change, sync the matching optional blocks in **`README.md`** and **`WORKFLOW.md`** in the same pass — see **`update-log.md`** (FORGETRAIL_LITE release checklist, item 3).

### Step 6: Second-pass completeness review

After the initial propagation, review the full list of changes one more time. It's common to miss patterns on the first pass — especially:

- **Copy/content lessons** that feel app-specific but are actually generalizable (e.g., "don't overstate security claims" applies to any SaaS).
- **Debugging detours** where something didn't work and you pivoted (e.g., `<link rel="modulepreload">` doesn't work for bundled deps).
- **User corrections** during the conversation that reveal a general principle (e.g., user correcting a security overclaim → lesson about precision in marketing copy).
- **Discovery scan gaps:** Compare **`git log`** to the product journal / changelog for the same window — CI-only, dependency, or script commits may not appear as user-facing bullets but still warrant template updates.
- **Journal backlog:** Scroll **`docs/PRODUCT_JOURNAL.md`** (or your changelog) to **older `##` days** (weeks or months). For each **`Added`** line, ask whether ForgeTrail already has a **feature stub** or **TEST_PLAN** section; if not, add a generalized stub in this pass or list it explicitly as still missing.
- **Branded-but-generic shapes:** Re-read bullets that mention **marketing names**. If **Journal-driven propagation** §6 fits (persistent assistant rail, multi-lens detail, identity URLs, admin master–detail), ensure **`TECH_REF`**, **`CONTEXT_PROMPT`**, **`DESIGN_SYSTEM`**, **`TEST_PLAN`** got the generalized stub—not only **`CODE_QUALITY`** or lessons.

Report any additional items found in the second pass.

### Step 7: Report what you changed and log it

1. List each ForgeTrail file you updated, what section you edited, and a one-line summary of what was added. Format:

```
- docs/BUSINESS_PLAN.md > [Section] — [what was added]
- docs/CONTEXT_PROMPT.md > Critical Patterns — [what was added]
```

2. **Append to `update-log.md`** (repo root): add a row to the table (ISO date + short summary) and a **Detail** subsection with bullets for files/sections touched. This keeps an auditable history of template evolution.

## Constraints

- Write only to **this ForgeTrail repo** (templates under `docs/`, `prompts/`, and root guides). Do not change a customer application's source or product docs during propagation.
- You may edit **`prompts/propagate-to-forgetrail.md`** itself when updating triggers or the Context inventory (Step 5). If the customer keeps a project-local copy of this prompt, they should mirror trigger/inventory changes there.
- Do NOT add `[PLACEHOLDER]` sections that are already filled in with app-specific content — keep them as templates.
- Do NOT remove existing ForgeTrail content. Only add or expand.
- If a lesson is already captured in ForgeTrail (even approximately), skip it. Check before writing (Step 2).
- If you're unsure whether something is reusable or app-specific, err on the side of including it. It's easy to remove later, hard to reconstruct.
- **Incomplete propagation:** Adding only `💡`/`🔧` (or other) **lesson-style callouts** **without** a **feature-area home** in **`TECHNICAL_REFERENCE.md`** or **`TEST_PLAN.md`** (when the source app gained a **new named capability**) is not enough—go back and add the stub or checklist.
