# ForgeTrail

**Forge the path. Keep the trail.**

A persistent development system for building software with AI agents. A structured 7-phase workflow for solo developers building non-trivial full-stack apps with coding agents. Derived from 7 sessions and ~78,000 lines of real-world app development.

---

## 1. Phase Map

These phases emerged from the actual build sequence across all sessions. They're not theoretical; each maps to specific sessions and turning points.

### Phase 1: Architecture + Planning (Session 1, Turns 1-2)

**What happens:** You describe the problem space, provide context about existing work, and ask Claude for a structural proposal before any code is written.

**Entry criteria:** You have a clear problem to solve and know your preferred tech stack.

**Exit criteria:** You've confirmed tech choices, folder structure, data model shape, and the first batch of features to build. Claude has summarized its understanding back to you, and you've corrected any misunderstandings. **`PHASE_1_BRIEF.md` is complete and locked** (see §1a), and major commitments are in **`.forgetrail/workflow_tracking.json` → `decisions[]`** so Phase 2 can start without chat context.

**What actually happened:** Session 1 opened with full context (existing job search system, 44 jobs, DOCX templates, preferred stack). Claude proposed Playwright over Puppeteer, docxtemplater for Word preservation, Kanban UI, filesystem-based storage, and an import migration path. All confirmed in a single exchange before any code was written.

**Key insight:** The single most leveraged moment in the entire project was Turn 1, where the user said "before you do anything, please summarize what you understand to be the ask and make suggestions too." This one sentence prevented days of rework.

### Phase 2: Scaffolding + Core Build (Session 1, Turns 3-7)

**What happens:** Claude builds the skeleton: project init, dependencies, backend services, API routes, frontend components, and initial data import.

**Entry criteria:** Architecture is confirmed. Tech choices are locked.

**Exit criteria:** The app runs. You can see data on screen. Core CRUD works. The happy path functions end to end, even if roughly.

**What actually happened:** In a single massive turn, Claude created the SvelteKit project, installed 9 dependencies, built 4 backend services (data, scraper, LLM, docx), 4 API routes, 5 frontend components, and imported 44 existing jobs. The app was usable within one turn.

**Key insight:** Let Claude build the entire skeleton in one pass rather than piecemeal. Provide all context upfront. The more Claude knows about the full scope, the better it designs the initial structure.

### Phase 3: Bug Fixing + Environment Stabilization (Session 1, Turns 4-11)

**What happens:** The first real test reveals environment issues, path problems, auth failures, and integration bugs. This phase is unavoidable.

**Entry criteria:** Skeleton is built and you're trying to use it.

**Exit criteria:** The app runs reliably on your machine. Environment variables resolve. APIs return real data. You can perform the core workflow without hitting infrastructure errors.

**What actually happened:** SvelteKit's `.env` system didn't populate `process.env` (required switching to `$env/dynamic/private`). The Claude API key wasn't set (required graceful degradation). File paths had Windows/Linux mismatches. Each fix was 1-2 turns but cumulatively took ~8 turns.

**Key insight:** Surface error details, not just failure counts. Session 1's import returned "0 imported, 1 error" with no detail. Once Claude added the actual error message to the API response, the path resolution bug was immediately visible. Build verbose error handling from the start.

### Phase 4: Feature Iteration + Value Delivery (Sessions 1-4)

**What happens:** You build out the features that make the app actually useful. This is the longest phase and spans multiple sessions.

**Entry criteria:** Core workflow functions. You can see your data and interact with it.

**Exit criteria:** The app delivers its core value proposition. For Exec Foundry, this meant: scrape a job, tailor a resume and cover letter, track status on a Kanban board, manage connections.

**What actually happened:** This phase covered: DOCX tailoring (Sessions 1-3, the hardest feature), file management, tag system, connections/people management, soft skills, user profiles, upload/reflow pipeline, analytics panel, preparation workflow (intersections, pitch, readiness tracking), next-action nudges, and timeline visualization.

**Key insight:** The features that took the most turns weren't the most complex conceptually. They were the ones where the integration between LLM output and structured documents (DOCX XML) was unpredictable. When you're building features that bridge AI output with structured formats, expect 3-5x the iteration.

**When a feature isn't converging:** If you've passed 5 turns on a single feature without progress, the approach is probably wrong, not the implementation. Say: "Let's take a step back. The current approach isn't working. Can you propose a fundamentally different way to do this?" This exact pattern triggered the project's biggest architectural pivot (Session 1, Turn 26: switching from LLM-driven find/replace to programmatic placeholder replacement). If you're under 3 turns, it's normal refinement. Between 3-5, add more concrete evidence (paste exact output, show the diff). Over 5, rethink the approach.

### Phase 5: Refactoring + Code Health (Sessions 2, 5)

**What happens:** Components get too large. Patterns duplicate. You pause feature work to restructure.

**Entry criteria:** You notice a file exceeding ~500 lines, or you're making the same kind of edit in multiple places.

**Exit criteria:** Shared utilities are extracted. Large components are split into manageable pieces. No duplicated patterns remain.

**What actually happened:** Session 2 extracted config.ts to eliminate hardcoded names across 10 locations. Session 5 split JobDetailPanel from 1,897 lines into a 543-line shell plus 4 tab components, extracted 3 shared utility modules (logParser, format, api), and split docx.ts into two files. Claude's approach: diagnose the real problem (coupling, not just file size), then execute in priority order.

**Key insight:** Ask Claude "do you prefer larger or smaller files?" and it will reject the premise. The real question is: "What code changes together that shouldn't?" That framing leads to better splits. Also, Claude is excellent at grep-then-verify after refactors to catch stale references.

### Phase 6: Strategic Alignment + Roadmap (Sessions 4, 7)

**What happens:** You step back from building to evaluate whether the product matches its promise. Compare implementation against brand docs, business plans, and feature specs.

**Entry criteria:** Core features work. You have brand/strategy documents.

**Exit criteria:** TODO is reorganized by strategic priority, not by recency. Features are categorized by which brand pillar they serve. You know what to build next and why.

**What actually happened:** Session 4's pivotal moment was asking Claude to review the TODO against BRAND_AND_PRODUCT.md. Claude identified the gap between brand promise ("command center," "operational drag elimination") and product reality. This reframed the entire TODO around 5 brand pillars and directly shaped the next 4 turns of feature work (readiness indicators, prep-before-write guardrails, next-action nudges, timeline).

**Key insight:** This phase should happen earlier than you think. Session 4 was the right time (after core features, before polish). The brand alignment review produced more strategic clarity than any single feature.

### Phase 7: Hardening + Production Prep (Sessions 6-7)

**What happens:** Security audit, code quality review, documentation consolidation, payment integration, field size limits, error handling, ATS compatibility, OAuth.

**Entry criteria:** Features are stable. You're thinking about other people using the app.

**Exit criteria:** CODE_QUALITY findings are triaged. Auth works. Payments work. Documentation is consolidated and current. Error messages are user-facing, not developer-facing.

**What actually happened:** Session 6 produced a 26-finding CODE_QUALITY.md, fixed PocketBase field size limits (5K default was silently truncating LLM output), fixed state propagation bugs, and added OAuth. Session 7 added Stripe billing, token usage tracking, consolidated 7 docs into 5, built a marketing landing page, and hardened fonts for ATS compatibility. Session 9 ran a comprehensive black hat security audit (prompts/black-hat-audit.md), producing a 27-finding BLACK_HAT_REPORT.md separate from CODE_QUALITY.md, implemented a full promo code system with Stripe integration, and added centralized Zod input validation across all API routes.

**Key insight:** Field size limits and silent failures are the production bugs that hurt most. In Session 6, intersections were being truncated at 5K characters with no error message. Claude's systematic audit (checking all 12 LLM functions and their output sizes) found 5 fields at risk. One question, five bugs prevented. Splitting security audit (BLACK_HAT_REPORT.md) from code quality review (CODE_QUALITY.md) is worth the extra file — they serve different purposes and audiences.

---

## 1a. Progressive documentation schedule

**Principle:** **Phase 2** still means the **full app spine** in one pass — project init, dependencies, data path, routes, components, import/migration if needed, **hero flow end-to-end**. That spine should not be deferred.

**ForgeTrail workspace:** All lifecycle/agent artifacts live in **`.forgetrail/`** at the repo root — **`.forgetrail/workflow_tracking.json`**, **`.forgetrail/IDEAS.md`**, platform rules (`AGENTS.md`, `CLAUDE.md`, optional `FORGETRAIL_LITE.md`). Product docs (`docs/PHASE_1_BRIEF.md`, `CONTEXT_PROMPT.md`, `README.md`, `TODO.md`, **`docs/FORGETRAIL_PROGRESS.md`**) stay outside `.forgetrail/`. Optionally gitignore `.forgetrail/` for a cleaner public repo or MCP-only boots (no vendored Lite). See **`FORGETRAIL_LITE.md` §1.5** and **`NEW_PROJECT_BOOTSTRAP.md`**.

**Non-technical operators:** Phase 2 should add **setup/run/status** launchers (**`ONE_CLICK_DEV_SETUP.md`**) and **test-*** launchers per dependency (**`SYSTEM_HEALTH_CHECKS.md`**). Avoid hardcoded PocketBase versions (**§4.2.2**). Local Ollama: Granite 4.1 / Gemma 3 defaults, not thinking models unless required (**§4.8**).

**Project documentation** from ForgeTrail templates is **progressive**: create files when the phase that needs them begins — not as an empty library on day one. This reduces boilerplate, token load, and stale placeholders.

| Phase | App / code | Docs to create or substantially extend (from ForgeTrail templates — or MCP `getTemplate`) |
| ----- | ---------- | ------------------------------------------------------------------------------------------- |
| **1 — Architecture** | Conversation only — no app code | **`PHASE_1_BRIEF.md`** (structured planning handoff). Log major commitments in **`.forgetrail/workflow_tracking.json`** (`decisions[]`, phase notes). |
| **2 — Scaffolding** | Entire runnable skeleton + hero flow | **`CONTEXT_PROMPT.md`** populated by **merging `PHASE_1_BRIEF.md`** into it (see CONTEXT_PROMPT template “Handoff from Phase 1”), then **`README.md`**, **`TODO.md`**, **`.forgetrail/IDEAS.md`**. **Do not** generate the rest of the `docs/` template set in Phase 2 unless the user explicitly needs a file for the spine (rare). |
| **3 — Stabilization** | Reliability, env, errors | Update **`CONTEXT_PROMPT.md`** / **`README.md`** when behavior, env, or patterns change. No new template types required. |
| **4 — Feature iteration** | Features, specs | Per complex feature: write **`specs/[feature].md`** from **`SPEC_FEATURE_TEMPLATE`** before multi-file work (lifecycle: `specs/` → `partial/` → `completed/`). Add **`TECHNICAL_REFERENCE.md`** when the API/data model surface is non-trivial; **`TEST_PLAN.md`** when manual QA paths deserve a written walkthrough; **`DESIGN_SYSTEM.md`** for layout, a11y, and repeated UI patterns as the UI grows. Optional: **`DEV_ESTIMATE.md`**. When a release adds **new user-facing capabilities** (not only refactors), extend **`TECHNICAL_REFERENCE.md` → Feature Documentation** with a stub for each area (routes, data, discovery → import parity) and add **`TEST_PLAN.md`** scenarios — don’t capture the work only as 💡 lesson callouts in **`CONTEXT_PROMPT.md`**. |
| **5 — Refactoring** | Structure, shared utilities | Update **`CONTEXT_PROMPT.md`** and **`TECHNICAL_REFERENCE.md`** to match the new shape. |
| **6 — Strategic alignment** | Roadmap vs brand | **`BRAND_AND_PRODUCT.md`**; complete or deepen **`DESIGN_SYSTEM.md`** if not already; **`MARKETING_GROWTH.md`** when go-to-market work is real. Optional: **`NAMING_EXPLORATION.md`** when naming or renaming the product. Restructure **`TODO.md`** by brand pillars. Optional: internal **`FEATURE_CATALOG.md`** (shipped capabilities vs UI entry points) and periodic **`user-facing-content-sync-audit.md`** so landing, Help, and nav stay aligned. |
| **7 — Hardening** | Production readiness | **`CODE_QUALITY.md`**, **`BLACK_HAT_REPORT.md`** (from security audit), **`DEPLOYMENT.md`**, **`BUGS.md`**; **`BUSINESS_PLAN.md`** if pursuing paid users; run docs-alignment and consolidate. |

**Agent rule:** Pull a template with **`getTemplate`** (or copy from `_forgetrail/docs/`) **when entering the work that needs it**, not earlier. Use `mode: "shell"` when you only need structure; `mode: "full"` when you need embedded lessons for that doc.

**ForgeTrail template propagation (two tracks):** When a customer app ships meaningful features or durable doc insights, run **`prompts/propagate-to-forgetrail.md`** (or the project-local mirror). Treat it as **two parallel deliverables**: **(1) Feature memory** — extend **`TECHNICAL_REFERENCE.md`** (Feature Documentation) and **`TEST_PLAN.md`** for each new **named capability** (journal **`Added`** lines are a good checklist), not only prose in **`CONTEXT_PROMPT.md`**; **(2) Pattern memory** — generalized lessons and anti-patterns in **`CONTEXT_PROMPT.md`**, **`CODE_QUALITY.md`**, and other templates as appropriate. Callouts without a feature-area home are an incomplete pass. **Append `update-log.md`** (table + Detail) after every propagation round. When a project **ends** (shipped, delivered, shelved), the **wrap protocol (§1e)** makes this harvest mandatory rather than opportunistic.

---

## 1b. Using ForgeTrail with gstack (optional)

If the project repo has [gstack](https://github.com/garrytan/gstack) installed (slash-command skills for Claude Code), ForgeTrail and gstack are **complementary layers** rather than competing systems. They solve different problems:

- **ForgeTrail** = **lifecycle methodology + project memory.** Phases, exit criteria, progressive docs, `.forgetrail/workflow_tracking.json`, business/brand strategy, lessons, and audits.
- **gstack** = **sprint execution + automation.** Slash-command skills that act as virtual team roles (engineering review, QA, security, deploy) within the current coding session.

**The integration model:** ForgeTrail owns the *what* and *when* (which phase, which docs, which exit criteria). gstack skills accelerate the *how* (build faster, review better, test more thoroughly, deploy safely). After every meaningful gstack sprint, persist outcomes in ForgeTrail's tracking system — gstack has no cross-session memory.

### Phase-by-phase integration

**Phase 1 — Plan:**
Use gstack's `/office-hours` for product framing conversations and `/plan-ceo-review` for scope validation. Capture all outputs in **`PHASE_1_BRIEF.md`** and `.forgetrail/workflow_tracking.json → decisions[]` — these are ForgeTrail artifacts that gstack doesn't produce. Example: after `/office-hours` surfaces a risk, add it to the brief's §8 (Risks & Mitigations) and log the decision in tracking.

**Phase 2 — Build:**
Use `/plan-eng-review` to validate the technical spine before committing. After building the skeleton, run `/review` on the initial commit to catch structural issues early. ForgeTrail handles the brief → `CONTEXT_PROMPT.md` merge and progressive doc creation (`README`, `TODO`, `.forgetrail/IDEAS.md`).

**Phase 3 — Stabilize:**
Use `/investigate` for systematic root-cause debugging when errors are non-obvious. Log every gotcha found in `.forgetrail/workflow_tracking.json → gotchas[]` and update `CONTEXT_PROMPT.md` — gstack fixes the bug but ForgeTrail ensures the lesson persists so the next session doesn't repeat it.

**Phase 4 — Iterate:**
This is where gstack's inner loop shines. Per feature: `/plan-eng-review` (design) → build → `/review` (code quality) → `/qa` (browser-based testing with Playwright) → `/ship` (commit + changelog). After each shipped feature, update `TODO.md` (mark done), `CONTEXT_PROMPT.md` (if patterns changed), and `.forgetrail/workflow_tracking.json` (exit criteria progress, session notes). For complex features, write a ForgeTrail `specs/[feature].md` *before* starting the gstack build cycle.

**Phase 5 — Refine:**
Use `/review` on refactor branches to verify no regressions. After refactoring, update `CONTEXT_PROMPT.md` and `TECHNICAL_REFERENCE.md` to reflect the new file structure — gstack's review catches broken imports but doesn't update your documentation.

**Phase 6 — Align:**
Use `/design-consultation` for design system decisions and `/plan-ceo-review` for scope checks against the product vision. ForgeTrail provides the `BRAND_AND_PRODUCT.md` and `MARKETING_GROWTH.md` templates and the strategic TODO restructuring — gstack has no brand/strategy tooling.

**Phase 7 — Harden:**
Run **both** ForgeTrail's `runAudit("black-hat")` and gstack's `/cso` — they're complementary. ForgeTrail's audit produces a persistent `BLACK_HAT_REPORT.md` document with categorized findings; gstack's `/cso` catches runtime exploits through active probing. Use `/qa` for full regression testing, then `/ship` → `/land-and-deploy` → `/canary` for the production deploy pipeline. Document the deploy process in ForgeTrail's `DEPLOYMENT.md` template so the next deploy doesn't depend on chat history.

### Key rule

After every gstack sprint that completes meaningful work, **update `.forgetrail/workflow_tracking.json`** (advance exit criteria, add decisions/gotchas, update session notes). gstack does persist some sprint-level artifacts — design docs from `/office-hours` live in `~/.gstack/projects/`, retro snapshots in `.context/retros/`, review gate overrides per branch, and skill usage analytics. But gstack has **no lifecycle state** (what phase are we in?), **no decision rationale log** (why did we choose PocketBase over Supabase?), **no gotcha capture** (what burned us and how did we fix it?), and **no architecture context document** (what does the file tree look like, what patterns do we use?). ForgeTrail's `.forgetrail/workflow_tracking.json` + `CONTEXT_PROMPT.md` fill exactly this gap — they are the system of record that lets the next session pick up where this one left off without replaying context from chat history.

---

## 1c. Using Subagents with Modern Agents (optional)

When the host agent supports **parallel subagents** (Grok Build `spawn_subagent`, Cursor Task/subagents, Claude agent teams, etc.), ForgeTrail and subagents are **complementary layers** — same relationship as ForgeTrail + gstack in §1b:

- **ForgeTrail** = **lifecycle methodology + project memory.** Phases, exit criteria, progressive docs, `.forgetrail/workflow_tracking.json`, audits, and lessons.
- **Subagents** = **parallel, context-isolated execution** within a phase — audits, research, spikes, and deep exploration without bloating the parent thread.

**The integration model:** ForgeTrail owns the *what* and *when* (which phase, which docs, which exit criteria). Subagents multiply throughput on the parts of ForgeTrail that are most context-heavy and parallelizable. The **parent agent** always synthesizes subagent output into ForgeTrail artifacts and updates tracking — subagents have no cross-session memory.

### Phase-by-phase integration

**Phase 1 — Plan:**
Main agent only (or one **read-only** explore subagent for competitive/market research). **Prefer native plan mode** when available (`getPlanModePatterns` via MCP) — do not spawn implementation subagents before architecture is locked.

**Phase 2 — Build:**
Main agent builds the full spine in one pass. Optional: one read-only subagent to research integration edge cases — do not split the hero-flow build across subagents unless the host explicitly supports coordinated merge.

**Phase 3 — Stabilize:**
Optional read-only explore subagent for stubborn root-cause analysis; parent logs every gotcha in `.forgetrail/workflow_tracking.json → gotchas[]` and updates `CONTEXT_PROMPT.md`.

**Phase 4 — Iterate:**
Strong fit. Call **`suggestSubagentDecomposition`** then spawn parallel explore subagents for feature research and tradeoff analysis; optional **worktree-isolated** spike for prototyping. Parent picks the approach and implements (or delegates to a single write-capable subagent).

**Phase 5 — Refine:**
Worktree-isolated subagents for exploratory refactors; parent reviews, merges, and updates `CONTEXT_PROMPT.md` + `TECHNICAL_REFERENCE.md`.

**Phase 6 — Align:**
Optional read-only subagents for market/competitor research; synthesis targets ForgeTrail templates (`BRAND_AND_PRODUCT`, strategic `TODO`).

**Phase 7 — Harden:**
Strong fit. Spawn parallel **read-only** subagents per audit type (security/black-hat, UX cohesion, code quality). Each subagent runs **`runAudit`** + **`searchLessons`** as appropriate. Parent synthesizes into `BLACK_HAT_REPORT.md`, `CODE_QUALITY.md`, triages into `TODO.md`, and updates tracking.

### Recommended pattern

1. Call **`suggestSubagentDecomposition`** with current phase + task description.
2. Spawn subagents with **`background: true`** (or equivalent) when the host supports it.
3. Parent collects outputs → progressive docs + `.forgetrail/workflow_tracking.json`.
4. Run **`validateTracking`** after synthesis.

### Concrete example (Phase 7 — Grok-style hosts)

```
Call suggestSubagentDecomposition for phase 7 and task "black-hat security audit, UX cohesion review, and code quality audit".

Spawn three read-only subagents in parallel:
1. Security: runAudit("black-hat") + searchLessons for security issues.
2. UX: ux-cohesion or panel-usability audit against current UI flows.
3. Code quality: audit against CODE_QUALITY template + getAntiPatterns.

Parent: synthesize into BLACK_HAT_REPORT.md + CODE_QUALITY.md, update tracking gotchas/decisions, present prioritized next actions.
```

Hosts differ in spawn syntax — call **`getAgentIntegrationGuide`** (`grok`, `cursor`, `claude`, or `generic`) for tailored commands.

### Key rule

After subagent results return, the **parent must** update `.forgetrail/workflow_tracking.json` (advance exit criteria, add decisions/gotchas, update session notes) and relevant progressive docs. Subagents fix or explore in isolation but **do not** replace ForgeTrail as the system of record for lifecycle state, decision rationale, or gotcha capture.

---

## 1d. Project archetypes (scaling the lifecycle down)

The 7 phases were extracted from a commercial SaaS build, and the default exit criteria assume one — payments, brand pillars, business plan, security audit. Many ForgeTrail projects are **not** that: a gift app for a birthday, an internal dashboard, a weekend tool. Forcing a one-time-use trivia game through "Payment flow works end to end" produces noise (endless `N/A` annotations) and, worse, teaches agents to rubber-stamp criteria instead of reading them.

**Fix: choose an archetype in Phase 1 and prune the tracking template at bootstrap.** The archetype is a product-shape question, same class as state persistence — ask it early, record it in **`PHASE_1_BRIEF.md`** (§1 or §3) and **`decisions[]`**, and store it as **`project.archetype`** in **`.forgetrail/workflow_tracking.json`** (see `TRACKING_SCHEMA.md`).

| Archetype | What it is | Phase adjustments |
|-----------|-----------|-------------------|
| **`product`** (default) | Something other people will use, possibly pay for | Full 7-phase lifecycle exactly as documented. When in doubt, use this. |
| **`internal-tool`** | Real recurring users, no market: team dashboards, ops tooling, personal daily-driver apps | Phases 1–5 and 7 apply. **Phase 6 (Align) is optional** — skip `BRAND_AND_PRODUCT.md` and pillar reorganization unless the tool grows a real audience. In Phase 7, drop `BUSINESS_PLAN.md`, payments, and marketing-facing criteria; keep security (it still holds real data), deployment, error handling, and docs. |
| **`one-shot`** (keepsake / event / demo) | Built for one occasion or one recipient: gift apps, event pages, conference demos, one-time tools | Phases 1–4 apply, scaled to size (Phase 1 may be one exchange; Phase 3 may be minutes). **Phases 5–7 collapse into a single "polish + ship" gate:** works on the target device (usually a phone), no dead ends in the hero flow, `prefers-reduced-motion` respected, deployed or handed off, personal/placeholder content filled. No brand doc, no business plan, no black-hat audit, no refactoring pass for a codebase with no future. What *replaces* the hardening depth is **emotional polish** — for a keepsake, the reveal moment matters more than the error format. |

**Agent duties when archetype ≠ `product`:**

1. **Prune, don't annotate.** At bootstrap (or as soon as the archetype is decided), remove non-applicable exit criteria from the tracking file's phase arrays and replace collapsed phases with the archetype's gate criteria. A criterion that survives pruning must be genuinely checkable — the goal is that every remaining item is real.
2. **Log the pruning as a decision** (`decisions[]`) so a later session knows the missing criteria were removed intentionally, not lost.
3. **Escalate on drift.** If a `one-shot` starts growing accounts, or an `internal-tool` gets external users, say so explicitly and propose re-promoting to `product` — restoring the pruned criteria for the phases still ahead. Archetypes scale the lifecycle down; they are not a permanent exemption.

For quick throwaway spikes (an experiment you may delete tomorrow), consider skipping ForgeTrail entirely — a tracking file for a two-hour prototype is overhead, not discipline. The archetypes above are for projects that will be **finished**, however small.

---

## 1e. Wrap protocol (closing a project and harvesting its lessons)

ForgeTrail's tracking schema collects `gotchas[]` and `decisions[]` all project long — but nothing consumed them systematically at the end. A small project could log two genuinely reusable gotchas and have them die in the repo because no propagation pass ever ran. The wrap protocol closes that loop: **finishing a project includes harvesting it.**

**When to run:** the project is done (shipped, delivered, handed off) or being intentionally shelved. For `one-shot` projects this is a natural, expected step — the project ends, ForgeTrail keeps the lessons. For long-lived products, run the same harvest step at major milestones (launch, ownership change) rather than waiting for a "wrap" that may never come.

**Steps:**

1. **Sweep the tracking file.** Read every `gotchas[]` and `decisions[]` entry plus `CONTEXT_PROMPT.md`'s gotcha/pattern sections. For each, ask: *is this generalizable beyond this app?* Framework traps, CLI behavior changes, and integration surprises usually are; app-specific content decisions usually are not.
2. **Run the propagation prompt** (`prompts/propagate-to-forgetrail.md`) with the harvest list as input — see its **Harvest mode** section, designed for exactly this sweep. Small projects without a product journal or full doc set use the tracking file as the primary discovery source.
3. **Close the tracking file.** Set `project.status` to `"wrapped"` (see `TRACKING_SCHEMA.md`), add a final `sessions[]` entry summarizing end state and where things live (deploy URL, handoff notes), and make a final commit. Optionally tag the repo (`v1.0`, `shipped`).
4. **Log the propagation** in ForgeTrail's `update-log.md` as usual. A wrap with zero propagable lessons is legitimate — note "wrapped, nothing to propagate" in the final session entry and skip steps 2 and 4.

**Why this is a protocol and not a suggestion:** the compounding loop (README) only compounds if lessons actually flow back. One flagship project propagating regularly plus a dozen small projects propagating never is a leak — the small projects are often where the freshest scaffolding and framework gotchas surface, because they exercise the newest tool versions.

---

## 1f. Companion tools (optional)

Catalyst Forge siblings (and Cloudflare as a default DNS/hosting suggestion) are **complementary**, same model as gstack (§1b) and subagents (§1c):

- **ForgeTrail** = lifecycle + project memory.
- **Companions** = one bounded job (publish Markdown, named ports, editorial review, labels, backup, voice journal).

They are **never required**. Decline is success. Do not dump the shelf at kickoff. Suggest when a trigger is true; persist outcomes in `.forgetrail/workflow_tracking.json`.

**Agents:** `getCompanionSuggestions` (`phase` or `situation`) plus the optional footer on `getPhaseGuidance`. Mapping: `content/COMPANION_TOOLS.md`. Shelf: [catalystforge.com/tools](https://catalystforge.com/tools/).

**Triggers (short):**

- Markdown site or docs/marketing `site/` → FilePress + Cloudflare Pages / Wrangler
- Registrar / DNS / hosting still open → Cloudflare DNS (and Pages for static); droplet only if a server is required
- Two or more local apps → LocalSlip + LocalHelm
- Local Ollama → ollanet; VRAM/context → Finetuna
- Copy / README / landing → Smell Check, Misemphasis
- Docs or journeys no longer meet → Detangler
- Cause not earned → Gap Last
- Hard-to-undo work → TemperPass
- Pre-launch newcomer check → Cold-eye
- Product going public or handed off → xFacts
- Unpushed work you cannot lose → IngotVault
- Spoken idea capture → DictaWhisper

FilePress publishes Markdown. It does not replace Default-A for an interactive app. LocalSlip/LocalHelm are for two or more local apps, not a first single project.

---

## 2. Per-Phase Playbook

### Phase 1: Architecture + Planning

**What to provide Claude:**

- Full context about the problem you're solving, including any existing work, data, or systems
- Your preferred tech stack and why
- Any constraints (no database for v1, must work offline, etc.)
- Explicit instruction: "Before you do anything, summarize what you understand and make suggestions"

**What to ask Claude to do:**

- Propose the folder structure, data model, and tech choices
- Identify the hardest integration points (in Exec Foundry: DOCX XML manipulation)
- Suggest a migration path for existing data
- Recommend what to skip for v1
- **If your agent supports a native plan mode** (Grok `/plan`, Cursor Plan mode, extended plan-before-code): use it for all Phase 1 work. Include **`getGreenfieldIntakePrompt`** questions in the plan context. Do **not** write app code or heavy docs until the user approves the plan. On approval, map the plan into **`PHASE_1_BRIEF.md`** (`getTemplate`) and log commitments in **`decisions[]`**. See **`getPlanModePatterns`** (MCP) or WORKFLOW §1c for handoff details.
- **Classify the project archetype** (`product` | `internal-tool` | `one-shot`) per **§1d** and prune the tracking template's exit criteria to match. Record it in **`PHASE_1_BRIEF.md`**, **`decisions[]`**, and **`project.archetype`** in the tracking file. Default to `product` when unsure.
- **If this is a web app**, answer the state-persistence sub-question **before** locking PocketBase + auth: *"Does any state need to outlive this browser — accounts, cross-device sync, shared data — or is state per-user local?"* If local-only → drop PocketBase + auth, target `adapter-static`, persist via `localStorage` / `IndexedDB`. If persistent → full backend stack. Record the answer in **`PHASE_1_BRIEF.md` §4 (`State persistence:`)** and **`decisions[]`**. See **ForgeTrail Lite** §7 (A-local vs A-persistent) and **GREENFIELD_INTAKE.md** §7.
- **Hosting / DNS / git (if still open):** ask registrar, DNS, git host, and production host. If the user has not already named providers, default to **GitHub** + **Cloudflare DNS** (free plan) and **Cloudflare Pages** for a static site. A DigitalOcean (or similar) origin stays valid when the app needs a server. Record in the brief and `decisions[]`.
- **Optional companions** (never required): TemperPass before hard-to-undo locks; FilePress if the product is a Markdown site; DictaWhisper if they capture ideas by voice; LocalSlip/LocalHelm if this machine already runs other local apps. Call **`getCompanionSuggestions`**. See §1f.
- **If any content is produced by an LLM** (not hand-authored, not from a conventional non-LLM API), pick one of three content-generation patterns **in Phase 1** — it drives deploy model, cost, and secret management:
  - **Runtime LLM API** — server route calls the provider per request; needs rate-limit + streaming UX. **Cloud** (OpenAI, Anthropic, …): API keys in `.env`. **Local Ollama:** `OLLAMA_BASE_URL` + `OLLAMA_MODEL`; Phase 2 **`setup:ollama`** / **`test:ollama`** (see **SYSTEM_HEALTH_CHECKS.md**, Lite §4.8) — default **Granite 4.1** / **Gemma 3**, not thinking models unless required.
  - **Build-time LLM generation** — `scripts/seed.ts` calls the provider once, writes JSON into `data/`, commits it; no runtime cost; pairs well with A-local + `adapter-static`. Seed may use cloud APIs or the same Ollama env as local dev.
  - **BYO-LLM paste** — ship a prompt in the repo; the user runs it in their own LLM chat (including a local Ollama UI) and pastes JSON into `data/seed.json`; Zod validates at app start; zero project-level keys.

  Record pattern, provider, and env vars in **`PHASE_1_BRIEF.md`** (content-generation section) and **`decisions[]`**. See **ForgeTrail Lite** §7.1 for minimal reference skeletons.

**Artifacts to create:**

- **`PHASE_1_BRIEF.md`** in `docs/` (from `_forgetrail/docs/PHASE_1_BRIEF.md` template or ForgeTrail MCP `getTemplate({ name: "PHASE_1_BRIEF" })`). Fill every section; mark **locked** when accurate.
- **`.forgetrail/workflow_tracking.json`**: append **`decisions[]`** entries for each major architectural commitment (with rationale); update **`phases["1-architecture"].notes`** with sign-off summary.

**Verify before moving on:**

- You've confirmed or rejected every architectural suggestion
- Claude has acknowledged your tech stack preferences (not just its defaults)
- The data model handles your existing data, not just new data
- **`PHASE_1_BRIEF.md` is complete and locked** — Phase 2 can start from this file + `.forgetrail/workflow_tracking.json` without the Phase 1 chat

**Example prompt (this worked):**

> "So, we worked hard to setup a system [full context of existing work]. Let's switch gears. This is calling for a webapp. I'm a SvelteKit guy. And before you do anything, please summarize what you understand to be the ask and make suggestions too."

### Phase 2: Scaffolding + Core Build

**What to provide Claude:**

- Confirmed architecture decisions from Phase 1
- Access to any existing data/templates that need importing
- **Optional — JSON from another LLM chat:** If you are generating **seed, fixture, or import data** as JSON, you can use any LLM (ChatGPT, Claude, Gemini, etc.) with a **structured prompt**, save the reply to a file in the repo (e.g. `data/seed-catalog.json`), then hand it to the coding agent. You can do this **multiple times** for different datasets or iterations. The agent should **validate** the JSON at the boundary (e.g. Zod / JSON Schema) before import — same caution as any LLM-produced structured content. A ready-to-customize prompt template lives in **ForgeTrail Lite** (`content/FORGETRAIL_LITE.md` §4.3) for copy-paste use.
- **Optional — web search for live internet data:** If the product needs **current web results** (not only static seed JSON), the human typically **signs up** for a search API, adds a key to **`.env`**, and hands off to the agent. Common developer-friendly options include **[Tavily](https://tavily.com/)** and the **[Brave Search API](https://api-dashboard.search.brave.com/)** (both offer **entry-level or free monthly credits** — verify on [Tavily pricing](https://tavily.com/pricing) and [Brave API pricing](https://api-dashboard.search.brave.com/documentation/pricing)). See **ForgeTrail Lite** §4.4; record provider and env var names in **`decisions[]`** and **`CONTEXT_PROMPT.md`**.
- **Content-generation pattern (if the Phase 1 choice applies):** scaffold whichever of the three patterns was locked — **Runtime LLM API** (server route + provider config: cloud keys or **Ollama** `OLLAMA_*` + **`setup-ollama`** / **`test-ollama`** launchers), **Build-time LLM generation** (`scripts/seed.ts` + `data/*.json` committed; seed may call Ollama or cloud), or **BYO-LLM paste** (prompt file in repo + `data/seed.json` + Zod validator). **ForgeTrail Lite** §7.1 has minimal reference skeletons (OpenAI route, Ollama route, seed script, import-time validator) to copy. Validate all LLM-produced JSON at the boundary; treat the model's output as untrusted.
- **External URL → record (if applicable):** When the hero flow imports from **listing or article URLs**, follow **ForgeTrail Lite** §7.2 — layered fetch/parse, honest failure typing when **DOM drift** empties extraction, optional single **verbatim** LLM recover behind an env gate — and mirror detail in **`docs/TECHNICAL_REFERENCE.md`** as the project grows.

**What to ask Claude to do:**

- Build the entire skeleton in one pass (project init, deps, services, routes, components)
- Include an import script for existing data
- Wire up the happy path end to end

**Artifacts to create:**

- `.env.example` with all required variables (for **PocketBase** stacks: include the **public API URL and port** — e.g. `PUBLIC_POCKETBASE_URL=…` — so local dev does not assume default **8090** when other PocketBase servers or projects are already using it; the serve script, app client, and schema tools must all agree on the same value. See **ForgeTrail Lite** §14 and **`POCKETBASE_SCHEMA_SCRIPT.md`**.)
- `.gitignore`
- **Phase 2 doc set only** (see **§1a Progressive documentation**): First read **`PHASE_1_BRIEF.md`** and **`.forgetrail/workflow_tracking.json`**. Create **`CONTEXT_PROMPT.md`** and **merge** the brief into it using the mapping in the CONTEXT_PROMPT template (“Handoff from Phase 1”). Then **`README.md`**, **`TODO.md`** (seed from brief §11), **`.forgetrail/IDEAS.md`** from `_forgetrail/docs/` templates (or ForgeTrail MCP `getTemplate` name `IDEAS`).
- **Do not** create the rest of the ForgeTrail doc templates in Phase 2 (e.g. `BRAND_AND_PRODUCT`, `CODE_QUALITY`, `DEPLOYMENT`) unless the user explicitly requires one to complete the spine.

**Verify before moving on:**

- `pnpm dev` (or `pnpm run dev`) works
- You can see your data on screen
- The core action (scrape, create, view) completes without errors

**Optional companions:** LocalSlip/LocalHelm if this machine already runs other local apps or ports collide; ollanet/Finetuna if the brief chose local Ollama; FilePress only for a Markdown `site/`, not as the app. See §1f.

**Example prompt (this worked):**

> "Let's do Playwright, and Claude, and option C for Word doc. Yes, this is a great folder structure! Love the quick filters. And definitely should import the current jobs. Make it so Claude!"

### Phase 3: Bug Fixing + Environment Stabilization

**What to provide Claude:**

- Exact error messages (copy-paste, not paraphrase)
- Your OS and package manager (e.g., "I use pnpm on Windows")
- Whether the error is silent (app appears to work but output is wrong) or loud (crash/error screen)

**What to ask Claude to do:**

- Surface actual error messages in API responses (not just status codes or counts)
- Add debug logging to the specific code path that's failing
- Build graceful degradation for optional services (e.g., app works without API key, just with reduced features)

**Artifacts to create:**

- No **new** doc files. However:
  - Update **`CONTEXT_PROMPT.md`** with any patterns, env quirks, or workarounds discovered during stabilization.
  - Update **`README.md`** if setup steps changed (new env vars, revised install, required services).
  - Add **`gotchas[]`** entries to **`.forgetrail/workflow_tracking.json`** for every surprise (env, path, auth, integration) so the same mistake is never repeated.

**Verify before moving on:**

- The core workflow completes end to end with real data
- You've tested with and without optional services (API keys, external services)
- `CONTEXT_PROMPT.md` reflects what you learned (not still the Phase 2 draft)

**Anti-pattern:** Reporting "it doesn't work" without the error message. The fix: always include the exact output.

**Optional companion:** when the cause is not yet earned, offer **Gap Last** (`getCompanionSuggestions` situation `unclear-cause`). Log remaining questions in `gotchas[]`.

### Phase 4: Feature Iteration + Value Delivery

**What to provide Claude:**

- Feature request with desired outcome, not implementation steps
- For UI features: aesthetic direction ("like Claude Desktop, warm beiges") or a reference
- For bug reports: the exact output vs. expected output, with concrete examples
- The relevant brand/spec documents if you have them

**What to ask Claude to do:**

- Plan before building for anything touching >3 files. "Give me a plan before making it."
- For complex features, write a **delivery spec** first: copy ForgeTrail **`docs/SPEC_FEATURE_TEMPLATE.md`** (MCP: `getTemplate({ name: "SPEC_FEATURE_TEMPLATE" })`) to `specs/[feature-name].md`. Fill at least problem, goals/non-goals, proposed approach (behavior + any data/API/UI that applies), edge cases, and **testable acceptance criteria**. Review the spec with the user before implementing. Specs are durable documentation and conversation anchors when context resets between sessions.
- **Spec lifecycle folders (recommended once the repo has >5 specs, or from the first multi-file feature):** split `specs/` so drafts, in-flight work, finished work, and living references do not collide.
  - `specs/` — drafts and **not-yet-started** proposals.
  - `specs/partial/` — implementation **started or phased**; not all acceptance criteria met. Move in when work starts; update links then.
  - `specs/completed/` — fully implemented, with an **Implementation summary** at the end of the file.
  - `specs/canonical/` — **living reference / methodology** documents that are *not* time-boxed. **Exempt** from `partial/` → `completed/` moves. Header: `**Spec kind:** Canonical reference` and a `Status:` line for catalog state.
  - Encode the lifecycle in `.cursor/rules/specs-and-todo.mdc` and `.cursor/rules/spec-completion.mdc` (ForgeTrail ships copies under `content/cursor-rules/`; symlink or copy into the app's `.cursor/rules/`).
- Build features with the two-tier pattern: basic version by default, advanced version when user provides additional input (e.g., shallow tailoring by default, deep tailoring when tweaks are provided)
- Use the code-owns-structure/LLM-provides-content pattern for any feature that bridges AI output with structured formats

**Artifacts to create:**

- `TODO.md` (maintained per session, carried across sessions)
- `specs/[feature].md` from **`SPEC_FEATURE_TEMPLATE`** for any complex feature (link it from TODO.md)
- **Progressive docs (§1a):** add or extend **`TECHNICAL_REFERENCE.md`**, **`TEST_PLAN.md`**, and/or **`DESIGN_SYSTEM.md`** when the feature surface warrants — not all at once at phase entry.
- Update **`CONTEXT_PROMPT.md`** when architecture or patterns change. **Do not** create `BRAND_AND_PRODUCT.md` or hardening-only docs here unless you are explicitly doing that work early.

**Verify before moving on:**

- Each feature works with real data, not just test data
- The feature handles edge cases (empty state, missing data, locked files)

**Example prompt for bug reports (this worked):**

> "This part of the cover letter isn't tailoring: [quoted the exact template block that should have been replaced]"

**Example prompt for features (this worked):**

> "Also, can you make it have a dark vs light mode toggle? Maybe have the light mode be more like a warmish-light, how the Claude Desktop is, muted beiges, etc. Execute!"

### Phase 5: Refactoring + Code Health

**What to provide Claude:**

- Permission to analyze before acting: "Can you look at the component complexity across the codebase?"
- The refactoring priorities (or ask Claude to propose them)

**What to ask Claude to do:**

- Diagnose the real problem (coupling, duplication, unrelated code changing together), not just "this file is big"
- Execute refactors in priority order, one at a time
- Grep for stale references after each refactor

**Artifacts to create:**

- Updated imports/exports after splits
- Shared utility modules (format, api helpers, parsers)
- Update **`CONTEXT_PROMPT.md`** to reflect the new file/folder structure, renamed modules, and any architectural shifts caused by the refactor (per §1a).
- Update **`TECHNICAL_REFERENCE.md`** (if it exists) so API routes, data model docs, and integration descriptions match the refactored code.

**Verify before moving on:**

- No orphaned imports or dead code
- The app still runs after each refactor (test before starting the next one)
- `CONTEXT_PROMPT.md` file tree and patterns sections match the post-refactor reality

**Example prompt (this worked):**

> "Fantastic analysis! Please do these in order."

### Phase 6: Strategic Alignment + Roadmap

**What to provide Claude:**

- Your brand document, business plan, or product vision
- The current TODO.md
- Instruction: "Review the TODO against [brand doc] and identify what's missing, what should be prioritized, and what should be deprecated"

**What to ask Claude to do:**

- Map features to brand pillars or strategic goals
- Identify the gap between brand promise and current product state
- Prioritize by impact/effort and recommend a critical path

**Artifacts to create:**

- **`BRAND_AND_PRODUCT.md`** (from template) if not already present; **`DESIGN_SYSTEM.md`** completed or deepened if the product has substantial UI
- Restructured **`TODO.md`** organized by strategic pillars (not by recency)
- Updated **`CONTEXT_PROMPT.md`** reflecting current architecture
- **`MARKETING_GROWTH.md`** when launch/growth planning is in scope
- **`NAMING_EXPLORATION.md`** (from template) when naming or renaming the product — run after BRAND_AND_PRODUCT.md exists so themes are grounded in real brand language

**Verify before moving on:**

- Every top-priority TODO maps to a concrete brand promise or user need
- You know the order you'll build things in

**Example prompt (this worked):**

> "Time to do another TODO review. What else might you suggest, or prioritize or deprecate? Also consider the BRAND_AND_PRODUCT.md file."

**Optional companions:** Smell Check and Misemphasis for copy; Detangler if docs or journeys no longer meet (`getCompanionSuggestions` phase `6`).

### Phase 7: Hardening + Production Prep

**What to provide Claude:**

- Access to the full codebase
- Any external service credentials or configuration (Stripe IDs, OAuth client IDs)
- Instruction: "Audit for production readiness"

**What to ask Claude to do:**

- Produce a CODE_QUALITY.md with categorized findings (Critical/Major/Minor)
- Run the black hat security audit prompt (`_forgetrail/prompts/black-hat-audit.md`) and save results to BLACK_HAT_REPORT.md
- Audit all LLM function calls for output size vs. field limits
- Check for silent failures (functions that catch errors and return empty results)
- Consolidate documentation (eliminate duplicates, update cross-references)
- Add all security and code quality findings to TODO.md with P0/P1/P2 priority tiers

**Artifacts to create:**

- **`CODE_QUALITY.md`** (from template or MCP `getTemplate`) with categorized findings
- **`BLACK_HAT_REPORT.md`** (from security audit prompt or MCP `runAudit({ type: "black-hat" })`)
- **`DEPLOYMENT.md`** (from template) — go-live checklist, monitoring, cost estimates
- **`BUSINESS_PLAN.md`** (from template) if pursuing paid users — pricing, metrics, unit economics
- **`BUGS.md`** (from template) if bug tracking hasn't started earlier
- Extend or complete **`TEST_PLAN.md`** (from template) if not already mature from Phase 4 — manual test walkthrough for every major feature
- Consolidated `docs/` directory — eliminate duplicates, update cross-references
- Updated `.env.example` with all production variables
- Setup/migration scripts
- All findings triaged into **`TODO.md`** with P0/P1/P2 priority tiers
- Final update to **`CONTEXT_PROMPT.md`** with production architecture state

**Verify before moving on:**

- Critical findings are fixed
- Auth flow works end to end
- Payment flow works end to end (if applicable)
- No silent failures in core workflows
- Docs alignment audit passed (MCP `runAudit({ type: "docs-alignment" })` or `_forgetrail/prompts/docs-alignment-audit.md`)

**Optional companions:** Cold-eye for newcomer readiness; xFacts label when the product goes public or changes hands; FilePress + Cloudflare Pages for a Markdown or docs site; IngotVault before a rewrite. See §1f.

---

## 3. Session Management

### Opening Prompt Structure

The best opening prompts across all 7 sessions shared this structure:

1. **State what exists.** "We have a SvelteKit app with [X features]. The codebase is at [path]."
2. **State what you want to accomplish this session.** "Today I want to [specific goals]."
3. **Provide the context documents.** "Read CONTEXT_PROMPT.md and TODO.md first."
4. **Set the working mode.** "Plan before building" or "Execute directly."

The CONTEXT_PROMPT.md file proved to be the single most important artifact for session continuity. Create it in **Phase 2 (scaffolding)** and update it every phase thereafter. It should contain: current architecture, file locations, key patterns, data model, and recent changes.

### When to Start a New Session vs. Continue

**Start a new session when:**

- You hit context limits (happened 5 times across 7 sessions, always in the longer ones)
- You're shifting phases (e.g., from feature building to refactoring)
- The TODO list has changed significantly since the session started
- Claude starts making mistakes it wasn't making earlier (sign of context degradation)

**Continue the current session when:**

- You're in the middle of a multi-file refactor
- The current task depends on context from earlier in the session
- Claude's understanding of your codebase is sharp and you don't want to re-establish it

### Context Limits: What Actually Happened

Sessions 2, 5, 6, and 7 all hit context limits, requiring mid-session summaries. The pattern:

- Sessions under 4,000 lines (Sessions 3, 4) never hit limits
- Sessions over 8,000 lines always hit at least one limit
- Each context resumption cost 2-3 turns of re-reading files to re-establish understanding

**Mitigation that worked:** CONTEXT_PROMPT.md served as a "resume point" for Claude. When context was lost, Claude could read this one file and recover most of the project understanding.

**Mitigation that would have helped:** Breaking Session 6 (27K lines) into 2-3 shorter sessions. The first context loss happened around turn 10; that was the natural session boundary.

### Context Resumption in Practice

When a session hits context limits, Claude will start producing shorter responses, forgetting earlier decisions, or re-asking questions you already answered. That's your signal to start fresh.

**The resumption prompt that worked:**

> "I'm continuing work on Exec Foundry. Please read CONTEXT_PROMPT.md and TODO.md. Last session we completed [X, Y, Z]. Today I want to focus on [A, B]. The codebase is at [path]."

**Typical cost:** 2-3 turns of Claude re-reading key files before it's back to full productivity. It will re-read CONTEXT_PROMPT.md, then the specific files relevant to your current task. This is unavoidable but much cheaper than re-explaining everything conversationally.

**What doesn't work for resumption:** Pasting a session summary into the prompt. It's too long and too noisy. CONTEXT_PROMPT.md is a curated, maintained document. A session transcript is not.

### Maintaining Continuity Across Sessions

**What worked:**

- CONTEXT_PROMPT.md (updated at end of each session with current state)
- TODO.md (carried forward, marked items complete, added new ones)
- BRAND_AND_PRODUCT.md (stable reference document that didn't need updating)
- Explicit session openers: "Read CONTEXT_PROMPT.md, then let's work on [X]"

**What was lost between sessions:**

- Claude's understanding of specific code patterns (e.g., the Svelte 5 `$effect` reactivity model had to be re-learned)
- The "why" behind architectural decisions (e.g., why programmatic placeholder replacement instead of LLM-driven find/replace)
- Aesthetic preferences (had to re-state "warm beiges, like Claude Desktop" in later sessions)

**What should be in CONTEXT_PROMPT.md:**

- Tech stack and key dependencies
- Folder structure (abbreviated)
- Data model (types, not full schemas)
- Key architectural decisions and WHY they were made (the "why" is what gets lost)
- Current feature state (what's built, what's in progress)
- Known patterns that Claude should follow (e.g., "auto-save on blur, not explicit save buttons")
- Known anti-patterns to avoid (e.g., "don't use LLM for find/replace in DOCX")

---

## 4. Prompt Patterns That Work

### Feature Building

**The "Context + Outcome + Execute" pattern:**

> "Also, can you make it have a dark vs light mode toggle? Maybe have the light mode be more like a warmish-light, how the Claude Desktop is, muted beiges, etc. Execute!"

Why it works: Gives aesthetic direction without dictating implementation. "Execute!" removes the proposal overhead.

**The "Plan First" pattern:**

> "Let's think through a plan for the upload and reflow feature."

Why it works: For features touching >3 files, planning prevents rework. Claude reads the codebase, writes a plan, you approve, then it executes.

**The "Look Everywhere" pattern:**

> "Can you please look for all the places that initWorkspace is called and move or change so that a company name can be passed in?"

Why it works: Declarative scope ("all places") with clear intent. Trusts Claude to find every instance.

### Debugging

**The "Show the Delta" pattern:**

> "This part of the cover letter isn't tailoring: [exact quoted content]. Please compare this to the template and what it made."

Why it works: Concrete evidence. Forces Claude to do a diff rather than guess.

**The "Step Back" pattern:**

> "Let's take a step back, it is removing the placeholders too early I think. It needs to actually tailor them. Please compare this to the template and what it made."

Why it works: "Take a step back" gives Claude permission to rethink the entire approach, not just patch the current one. This prompt triggered the biggest architectural pivot in the project (from LLM-driven find/replace to programmatic placeholder replacement).

**The "Paste the Error" pattern:**
Just paste the exact error message. No interpretation needed. Claude diagnosed the Svelte 5 `onerror` syntax error, the PocketBase field overflow, and the async `getActiveUserId()` bug instantly from pasted errors.

### Refactoring

**The "Diagnose Then Execute" pattern:**

> "Can you look at the component complexity across the codebase and tell me what you think?"

Followed later by:

> "Fantastic analysis! Please do these in order."

Why it works: Separates analysis from action. You review the diagnosis before committing to the refactor.

### Strategic Review

**The "Cross-Reference" pattern:**

> "Time to do another TODO review. What else might you suggest, or prioritize or deprecate? Also consider the BRAND_AND_PRODUCT.md file."

Why it works: Gives Claude two documents to cross-reference. The synthesis produces insights neither document contains alone.

### Surfacing Silent Failures

**The "What Else Could Break Like This?" pattern:**

> "What other fields should I look at?" (after discovering intersections were silently truncated at 5K chars)

Why it works: Turns a point fix into a systematic audit. Claude checked all 12 LLM functions and their output sizes, producing a table that prevented 5 future production bugs. Use this pattern whenever you fix a bug that could have a class of siblings: field size limits, missing await calls, swallowed errors in catch blocks, schema mismatches.

**The "Check for Swallowed Errors" pattern:**

> "Are there any catch blocks that return empty results instead of surfacing the error?"

This surfaced in Session 6's CODE_QUALITY audit. Functions that catch errors and return `[]` or `null` are invisible bugs. Ask Claude to grep for `catch` blocks during hardening.

### Auditing

**The "Systematic Scope" pattern:**

> "What other fields should I look at?" (after fixing one field size issue)

Why it works: Turns a point fix into a systematic review. Claude checked all 12 LLM functions and their output sizes, finding 5 at-risk fields.

---

## 5. Anti-Patterns and Pitfalls

### Anti-Pattern 1: LLM-Driven Find/Replace in Structured Documents

**What happened:** Sessions 1-2 spent ~8 turns trying to get Claude's LLM to generate find/replace pairs for DOCX files. Word's XML splits text across `<w:r>` runs, so `[Position Title]` stored as `[Position` + ` Title]` never matches the LLM's find string.

**The fix:** Code owns the template structure; LLM provides content only. The code knows where `[Position Title]` is and how to replace it. The LLM just generates what should go there.

**Reusable lesson:** When integrating LLM output with structured formats (DOCX, HTML templates, database schemas), the code should own the structure and use the LLM only for content generation.

### Anti-Pattern 2: Reporting "It Doesn't Work" Without the Error

**What happened:** Session 1, Turn 4: import returned "Imported 0 jobs. 1 errors" with no detail. It took 3 turns to surface the actual error (path resolution failure with SvelteKit's env system).

**The fix:** Build verbose error handling from the start. API responses should include actual error messages, not just counts. Claude should add this proactively.

### Anti-Pattern 3: Overly Long Sessions

**What happened:** Sessions 2 (9K lines), 5 (14K), 6 (27K), and 7 (14K) all hit context limits. Each context resumption cost 2-3 turns of re-reading.

**The fix:** Plan for ~4,000-line sessions. When you've completed a logical chunk of work, update CONTEXT_PROMPT.md and start fresh.

### Anti-Pattern 4: Vague Feature Requests

**What happened:** "The top bar is getting a bit busy. Could some things go in a menu or something? A hamburger menu? With icons?" took 3 rounds because Claude had to decide what stays and what goes.

**The fix:** Be specific about what should change: "Move dark mode toggle, expert mode toggle, and import button into a hamburger menu. Keep the add job button and search in the navbar."

### Anti-Pattern 5: Skipping the Plan Step for Multi-File Changes

**What happened:** Session 2's recommendation-to-connection rename required updates across 9 files. Without a plan, it became a multi-turn back-and-forth with migration edge cases.

**The fix:** For any change touching >3 files, always ask for a plan first. "Think this through and give me a plan before executing."

### Anti-Pattern 6: Not Testing After Refactors

**What happened:** Session 5's refactoring was done without `pnpm run build` or integration tests. All changes were syntactically valid (TypeScript checked), but runtime behavior was untested.

**The fix:** After every refactor, run the build. After every feature, manually test the happy path. Claude can't always do this in a sandboxed environment, but you should before moving on.

### Anti-Pattern 7: Letting Schema Drift From Code

**What happened:** Session 7 added `accepted` and `declined` job statuses in code, but PocketBase's schema still had the old allowlist. Celebrations fired but API updates failed silently.

**The fix:** When adding enum values, update both code AND database schema in the same pass. If using a setup script, update it simultaneously.

### Anti-Pattern 8: Claude Overreacting to Errors

**What happened:** Session 4: Playwright wasn't installed (just needed `pnpm install`). Claude removed Playwright entirely and rewrote the scraper to use fetch-only. User had to correct: "The issue was just missing pnpm install."

**The fix:** When reporting errors, state whether you want a diagnostic or a fix. "Can you see why this failed?" (diagnostic) vs. "This broke, please fix it" (fix). Claude sometimes over-corrects when given ambiguous instructions.

---

## 6. The Checklist

Print this and work through it sequentially for each new project.

### Before Session 1

- [ ] Write a problem statement (what you're building and why, in 2-3 paragraphs)
- [ ] List your tech stack preferences
- [ ] Gather any existing data, templates, or assets that need importing
- [ ] Identify the single most valuable workflow the app must support

### Session 1: Architecture + Scaffold

- [ ] Open with full context + "summarize your understanding and make suggestions before building"
- [ ] Create and complete **`PHASE_1_BRIEF.md`**; lock it before treating Phase 1 as done
- [ ] Record major decisions in **`.forgetrail/workflow_tracking.json`** (`decisions[]` + phase 1 notes)
- [ ] Confirm or reject every architectural suggestion explicitly
- [ ] Say "Make it so" only after all decisions are locked
- [ ] Verify the app runs and shows real data
- [ ] Fix environment issues (env vars, paths, package manager)
- [ ] Set up git with .gitignore and .env.example
- [ ] Test the core workflow end to end with real data
- [ ] Create initial TODO.md (flat list for now)
- [ ] **Phase 2 doc set only (§1a):** `README.md`, `CONTEXT_PROMPT.md`, `TODO.md`, `.forgetrail/IDEAS.md` from templates — **not** the full ForgeTrail docs library yet

### Session 2: Stabilize + deepen context

- [ ] Expand `CONTEXT_PROMPT.md` with stabilization learnings (env, errors, patterns)
- [ ] Add **`TECHNICAL_REFERENCE.md`**, **`TEST_PLAN.md`**, or **`DESIGN_SYSTEM.md`** only when the work warrants it (§1a — not all three by default)
- [ ] Record architectural decisions in `CONTEXT_PROMPT.md` with WHY for each

### Sessions 2-4: Feature Building

- [ ] Start each session with: "Read CONTEXT_PROMPT.md, then let's work on [specific goals]"
- [ ] For each feature: request a plan if it touches >3 files
- [ ] For each bug: provide the exact error message or exact wrong output
- [ ] After each feature: test with real data, check edge cases (empty state, missing data)
- [ ] At natural breaks: update TODO.md with completed and new items
- [ ] Dump stray ideas into `.forgetrail/IDEAS.md` (process later)
- [ ] Watch for session length; start a new session around 4K lines

### Mid-Project: Strategic Review

- [ ] Create BRAND_AND_PRODUCT.md from `_forgetrail/docs/` template
- [ ] Ask Claude to cross-reference TODO.md against the brand doc
- [ ] Reorganize TODO.md by brand value pillars, not recency
- [ ] Deprecate features that don't serve the brand promise
- [ ] Process `.forgetrail/IDEAS.md` into TODO.md (evaluate, accept, or reject each idea)

### Refactoring (When Needed)

- [ ] Ask Claude to diagnose complexity before proposing splits
- [ ] Approve the plan before executing
- [ ] Execute one refactor at a time; verify build between each
- [ ] Grep for stale references after each refactor
- [ ] Update TECHNICAL_REFERENCE.md if architecture changed

### Pre-Launch: Hardening

- [ ] Ask Claude for a CODE_QUALITY.md audit (use template from `_forgetrail/docs/`)
- [ ] Run black hat security audit (`_forgetrail/prompts/black-hat-audit.md`) → save to BLACK_HAT_REPORT.md
- [ ] Triage all findings into TODO.md with P0/P1/P2 priority
- [ ] Audit all LLM function calls for output size vs. field limits
- [ ] Check for silent failures (grep for catch blocks that swallow errors)
- [ ] Check for `as any` casts and evaluate each one
- [ ] Verify all API routes return errors in a consistent format
- [ ] Verify all user input is validated (centralized Zod schemas recommended)
- [ ] Create DEPLOYMENT.md from template (go-live checklist, monitoring, costs)
- [ ] Create BUSINESS_PLAN.md from template (if pursuing paid users)
- [ ] Consolidate documentation (eliminate duplicates, update cross-references)
- [ ] Run docs alignment audit (`_forgetrail/prompts/docs-alignment-audit.md`)
- [ ] Test auth flow end to end
- [ ] Test payment flow end to end (if applicable)
- [ ] Update CONTEXT_PROMPT.md with final architecture state

### Every Session

- [ ] Open by reading CONTEXT_PROMPT.md and TODO.md
- [ ] Use "plan first" for multi-file changes
- [ ] Use "paste the error" for debugging
- [ ] Update CONTEXT_PROMPT.md before ending (especially decisions and their WHY)
- [ ] Mark completed TODOs, add new ones
- [ ] Update .forgetrail/workflow_tracking.json with session notes, decisions, gotchas

---

## 7. Project Documentation System

Full templates for each document live in `_forgetrail/docs/` (or ForgeTrail MCP `getTemplate`). Each template includes embedded instructions, lessons learned from Exec Foundry, and structural guidance. **Introduce templates progressively** per **§1a** — do not copy the entire library at scaffold time.

### Document Inventory

| Document                   | When to Create                     | When to Update                 | Purpose                                                               |
| -------------------------- | ---------------------------------- | ------------------------------ | --------------------------------------------------------------------- |
| **PHASE_1_BRIEF.md**       | Phase 1 (end, locked)              | Rarely after Phase 2 merge     | Structured Phase 1 handoff; merged into CONTEXT_PROMPT in Phase 2.    |
| **CONTEXT_PROMPT.md**      | Phase 2 (scaffolding)              | Every session end              | Session continuity. Populate by merging PHASE_1_BRIEF first.          |
| **TODO.md**                | Phase 2 (scaffolding)              | Every session                  | Feature backlog. Reorganize by brand pillars in Phase 6.              |
| **README.md**              | Phase 2 (scaffolding)              | When setup changes             | First-time developer setup.                                           |
| **`.forgetrail/IDEAS.md`**    | Phase 2 (scaffolding)              | Anytime (process periodically) | Raw idea intake. Buffer between inspiration and backlog.              |
| **specs/[feature].md**     | Phase 4+ (complex features)        | Until implemented              | Delivery feature spec from **`SPEC_FEATURE_TEMPLATE`**. Lifecycle folders: `specs/` → `partial/` → `completed/`. |
| **TECHNICAL_REFERENCE.md** | Phase 4+ (when API/model warrants) | When features change           | How each feature works. API docs, data model, integration patterns.   |
| **TEST_PLAN.md**           | Phase 4+ (when QA paths warrant)   | When features change           | Manual test walkthrough for major features.                           |
| **AUTOMATED_TESTING.md**   | Phase 4+ (optional)                | When automation strategy shifts | Vitest / API / Playwright guidance; complements **TEST_PLAN** (not a replacement). |
| **DESIGN_SYSTEM.md**       | Phase 4+ (patterns); deepen Phase 6 | When visual patterns change   | Color system, shadows, accent hierarchy, layout patterns, typography.   |
| **BRAND_AND_PRODUCT.md**   | Phase 6 (Strategic Review)         | Rarely (stable reference)      | Who, why, and how-different. Drives feature prioritization.           |
| **MARKETING_GROWTH.md**    | Phase 6+ (when GTM is real)      | When channels/metrics change   | Scaled acquisition channels, growth metrics, budget allocation.       |
| **BUGS.md**                | Phase 7 (or when triage needs it)  | As bugs are found/triaged      | Bug intake and triage. Route to TODO.md.                              |
| **CODE_QUALITY.md**        | Phase 7 (Hardening)                | As findings are fixed          | Engineering quality audit. Type safety, error handling, consistency.  |
| **BLACK_HAT_REPORT.md**    | Phase 7 (Hardening)                | As findings are fixed          | Security vulnerability audit. Attacker-focused, exploitability-rated. |
| **DEPLOYMENT.md**          | Phase 7 (Hardening)                | When infra changes             | Go-live checklist, monitoring, cost estimates.                        |
| **BUSINESS_PLAN.md**       | Phase 7 (if pursuing paid users) | When pricing/model changes     | Market sizing, unit economics, pricing, virality.                     |
| **DEV_ESTIMATE.md**        | Phase 4+ (optional, when useful)   | When major features ship       | Codebase inventory (reproducible LOC + route-module counts), effort bands, US cost scenarios (hours × rate). |

### Document Lifecycle

**Phase 1 (Architecture):** Complete and lock **`PHASE_1_BRIEF.md`**; mirror commitments in **`.forgetrail/workflow_tracking.json`**.

**Phase 2 (Scaffold):** Full **app spine** in one pass. **Docs:** Merge brief → **`CONTEXT_PROMPT.md`**, then **`TODO.md`**, **`README.md`**, **`.forgetrail/IDEAS.md`** only (§1a). Minimal extra prose at first beyond the merge.

**Phase 3-4 (Stabilization + Features):** `CONTEXT_PROMPT.md` grows; `TODO.md` grows. Add `TECHNICAL_REFERENCE.md`, `TEST_PLAN.md`, and/or `DESIGN_SYSTEM.md` when warranted — not all at phase entry. `.forgetrail/IDEAS.md` captures stray thoughts.

**Phase 6 (Strategic Review):** Create `BRAND_AND_PRODUCT.md`. Reorganize `TODO.md` by brand pillars. Cross-reference TODO against brand doc. Process `.forgetrail/IDEAS.md` into TODO. Complete or deepen `DESIGN_SYSTEM.md`. Add `MARKETING_GROWTH.md` when growth planning is real.

**Phase 7 (Hardening):** Create `CODE_QUALITY.md`, `BLACK_HAT_REPORT.md`, `DEPLOYMENT.md`, `BUGS.md`; `BUSINESS_PLAN.md` if pursuing paid users. Finish or extend `TEST_PLAN.md` if not already mature. Optional `DEV_ESTIMATE.md`. Run pre-launch audit (see `prompts/pre-launch-audit.md`). If the app uses centralized copy modules, run **`export:copy`** + **`audit:inline-copy`** (target: 0 UI prose not in export) and **`user-facing-content-sync-audit.md`** before launch marketing. Consolidate and cross-reference all docs. Run docs alignment audit. **Optional handoff artifact:** when the project has real conventions and scars worth preserving — before a beta, an ownership change, or handing continued work to another engineer or a cheaper AI model — run **`prompts/engineering-skill-library.md`** to generate a mentoring-style skill library (architecture rationale, subsystem deep-dives, debugging playbooks, judgment frameworks) under `docs/skills/`. It captures the *why* that reference docs omit.

**Post-Launch (Growth):** Run a Cialdini marketing audit on the landing page (see `prompts/cialdini-marketing-audit.md`). Run a competitor deep dive (see `prompts/competitor-deep-dive.md`). Extend **`MARKETING_GROWTH.md`** (create in Phase 6+ if missing) for scaled acquisition, metrics, and budget. After shipping several features in a sprint, re-run the sync audit; add new panels via `*Copy.ts` in the same PR (`prompts/microcopy-centralization.md`). Feature specs (`specs/` directory) remain the primary design tool for complex features — write the spec, review it, then implement.

### Key Lessons from Exec Foundry's Documentation

**Lessons embedded in CODE_QUALITY.md template:**

- Field size limits are silent killers. PocketBase's default 5K text limit silently truncated LLM output with no error. Always check all LLM output fields against database limits.
- `as any` casts (22+ in Exec Foundry) are deferred bugs. Each one silently succeeds when schemas change.
- Error format inconsistency (some routes return `{ error }`, others `{ message }`) causes client-side handling bugs. Pick one format and enforce it.
- Empty catch blocks mask issues. Grep for them during every hardening audit.
- Auth checks must be atomic. A permission check followed by a separate data fetch can be exploited between the two calls.

**Lessons embedded in TECHNICAL_REFERENCE.md template:**

- When LLM output goes into structured formats (DOCX, database), code owns the structure, LLM provides content only.
- Style rules (voice, grammar, tone) should be injected into LLM prompts, not applied as post-processing. The model writes better when it knows the constraints upfront.
- Always validate LLM JSON responses at runtime. Missing fields propagate as incomplete objects with no error.
- File write conflicts (file open in another app) should produce versioned copies, not errors.
- Graceful degradation: the app should work without optional services (API keys, external APIs), just with reduced features.
- **Deletion and data lifecycle:** document cascade vs soft-delete per entity, fork/copy semantics, and orphan risks in the data-model section — so support and users aren’t promised “undo” you haven’t built.
- **App-owned email:** central server send path, env vars, idempotency for webhook-triggered mail, BaaS SMTP vs product mail called out explicitly.

**Lessons embedded in DEPLOYMENT.md template:**

- Security findings from CODE_QUALITY.md are launch blockers. Fix them first.
- Headless browsers (Playwright) consume 2x the expected RAM. Budget accordingly or use lighter alternatives.
- Database version-specific bugs exist. Test on a fresh install of your production DB version.
- Infrastructure-as-code (deployment configs in version control) prevents "works on my machine" failures.

### Cross-References Between Documents

The documents form an interconnected system:

```
BRAND_AND_PRODUCT.md ──→ TODO.md (organized by brand pillars)
         │                   ↑
         │              .forgetrail/IDEAS.md (raw ideas processed into TODO)
         ↓
TECHNICAL_REFERENCE.md ──→ CODE_QUALITY.md (audit against tech reference)
         │                        │
         ↓                        ↓
   DEPLOYMENT.md ←────────────────┘
         ↑
   BUSINESS_PLAN.md (pricing → payment implementation)

CONTEXT_PROMPT.md ←── synthesizes from ALL of the above
```

CONTEXT_PROMPT.md sits at the center. It's the document Claude reads first and the one that synthesizes insights from all others. Keep it updated.

---

## Appendix: Session-by-Session Summary

| Session | Lines  | Phase                          | Key Accomplishments                                                                                                         |
| ------- | ------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| 1       | 5,138  | Architecture, Build, Stabilize | Full scaffold, 44-job import, DOCX tailoring (hardest feature), tag system, dark/light mode                                 |
| 2       | 8,954  | Features, Refactor             | Connections/people management, config extraction, PRODUCTIONIZE.md, code audit                                              |
| 3       | 3,790  | Features, Rebrand              | Resume bug fixes, soft skills, user profiles, upload/reflow pipeline, Exec Foundry rebrand                               |
| 4       | 4,344  | Features, Strategy             | Indeed scraper, Kanban refactor, brand alignment review, readiness indicators, timeline, unsaved changes                    |
| 5       | 14,251 | Features, Refactor             | Analytics panel, component splits, resume transformation pipeline, Opus 4.6 integration                                     |
| 6       | 27,322 | Hardening, Features            | OAuth, multi-select filters, salary filter, code quality audit, state propagation fixes, DOCX bug fixes                     |
| 7       | 14,536 | Hardening, Launch Prep         | Stripe billing, token tracking, docs consolidation, landing page, ATS fonts, "I Landed" celebration, status model expansion |

---

_Derived from 78,335 lines of conversation across 7 sessions building Exec Foundry. Every recommendation traces to something that actually happened._
