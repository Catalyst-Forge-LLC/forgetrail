# ForgeTrail update log

Chronological record of meaningful changes to **this** ForgeTrail repository: propagation passes from live apps, new prompt templates, methodology edits, and doc inventory updates.

**Archive:** Entries before **2026-05-26** (the first open-source release) live in [update-log-archive.md](update-log-archive.md) — private-era development and propagation from real apps, kept for maintainer context and provenance. For the first open-source release, see the git tag or initial commit on [GitHub](https://github.com/Catalyst-Forge-LLC/forgetrail).

**Archiving convention:** This file stays readable, not exhaustive. When it grows past roughly **30 table rows** (or a year boundary rolls over), move the oldest rows **and their Detail sections together** into the archive file (or a new `update-log-<year>.md`), oldest-first, and keep a one-line pointer here. The full history remains greppable across the archive files; this file is the recent, high-signal view a new reader actually opens.

After each run of **`prompts/propagate-to-forgetrail.md`**, append a row to the table and a short detail section below.

**What belongs in the summary column:** The *generalized* outcome (e.g. “propagate prompt: principle-first lessons, examples secondary”), not a dump of app-specific literals. Use the Detail section for file-level bullets; frame those bullets as *what template behavior changed*, not as a copy-paste of example numbers or strings from the source app.

**FORGETRAIL_LITE release checklist** (when editing `content/FORGETRAIL_LITE.md`):

1. **Version strings** — bump every `v#.#.#` in the file: header block (~line 3), `AGENTS.md` snippet in §12, footer. Canonical source is the header; keep all three in sync.
2. **`schemaVersion`** in §11 starter JSON — bump only when `workflow_tracking.json` shape changes (e.g. `lite-1` → `lite-2`).
3. **Cross-doc sync (triplicate optional sections)** — if these Lite sections change materially, mirror the same guidance in **`README.md`** and **`WORKFLOW.md`**:
   - **§4.3** — LLM-generated JSON seed/fixture prompt
   - **§4.4** — Tavily / Brave web search onboarding
   - **§7.1** — runtime / build-time / BYO-LLM content patterns (+ §7.2 URL import when applicable)
   README anchors: "Optional: LLM-generated JSON", "Optional: web search APIs", "Optional: LLM-backed content", "Listing / article URL import".
4. **Append this log** — table row + Detail when the Lite edit ships.

| Date (ISO) | Summary |
|------------|---------|
| 2026-09-11 | **Companion tools:** situation-triggered sibling suggestions (FilePress, LocalSlip/LocalHelm, practice skills, xFacts, DictaWhisper, Cloudflare DNS default). Mapping + JSON, WORKFLOW §1f, intake/Lite v2.0.1/DEPLOYMENT, MCP `getCompanionSuggestions` + phase-guidance footer, site About/compare mention. Port script uses LocalSlip. |
| 2026-08-24 | **npm name hold:** first unscoped publish is `0.0.0` from a throwaway stub folder, not the app repo. Cursor rule `npm-name-hold.mdc`; CONTEXT_PROMPT pattern + anti-pattern; `docs/NPM.md` pointer. Source: LaunchCampaign. |
| 2026-08-23 | **Positioning spine / theme-lock methodology (Exec Foundry origin-story passes):** BRAND_AND_PRODUCT gains *Positioning spine (theme lock)* (person-transformation ban for expert audiences, assure-not-guarantee, signature fast-read check, reality-check-as-terrain, staccato/vague-noun register rules) and *Long-form origin narrative (constraints file)*. CONTEXT_PROMPT pattern + anti-pattern. New `content/cursor-rules/writing-voice.mdc` template. Propagate-prompt trigger row (both copies). |
| 2026-08-23 | **Site slim:** FilePress pages match ollanet (home + Try + About). Detail lives in `/docs`. How it works stays as a stub. Live `/docs` still needs `pnpm ship`. |
| 2026-08-20 | **`/docs` mount:** FilePress path mount (LocalBerth/ollanet shell). Root README trimmed to install + docs link. |
| 2026-08-20 | **npm published:** `forgetrail@0.3.0` and `forgetrail-mcp@0.2.2` on the registry. forgetrail.dev is live. Try/README treat `pnpm dlx` / `npx` as the optional shortcut. |
| 2026-08-19 | **npm-ready:** `forgetrail` and `forgetrail-mcp` are public packages (names free). `pnpm run pack:check` / `docs/NPM.md`. GitHub slug `Catalyst-Forge-LLC/forgetrail`. Marketing site in `site/` (FilePress + Wrangler). |
| 2026-08-15 | **Rename: ForgeKit → ForgeTrail.** Product name, identifiers, and copy now use ForgeTrail / forgetrail (domain: forgetrail.dev). Workspace `.forgetrail/`, Lite `FORGETRAIL_LITE.md` v2.0.0, CLI `forgetrail`, MCP tools `getForgeTrail*`. Copy guide: `docs/FORGETRAIL_RENAME.md`. Tagline: Forge the path. Keep the trail. GitHub slug `Catalyst-Forge-LLC/forge-kit` unchanged. |
| 2026-07-30 | **Fix-efficacy pass for security re-audits, plus SSRF depth rows (Exec Foundry sweep):** **black-hat-audit** gains **AREA 0** — treat every previously "remediated" defense as unverified, enumerate bypass inputs, and name the known failure modes (exact match where a range is meant, missing host normalization, dead guard branches, escape scheme mismatched to the downstream parser, chained `.replace()` sanitizers, guarded helper with unguarded call sites, check-then-use gaps). RULES now require a regression test that fails against pre-fix code. **CODE_QUALITY** — four checklist rows (numeric address ranges, tested guards, SDK-matched escaping, single-pass sanitizers) + lesson. |
| 2026-07-29 | **URL host matching + SSRF hygiene (Exec Foundry CodeQL pass):** **CODE_QUALITY** checklist + lesson (`hostMatchesDomain`, scheme allowlist, workflow `permissions`, no client stacks). **CONTEXT_PROMPT** pattern + anti-pattern. Cursor rule **`url-host-matching.mdc`** (+ `content/cursor-rules/` mirror). |
| 2026-07-16 | **Feature SPEC template (full + Lite):** New **`docs/SPEC_FEATURE_TEMPLATE.md`** (delivery skeleton modeled on ForgeTrail NUX + Exec Foundry specs). **WORKFLOW** Phase 4 + §1a + doc inventory point at it; MCP `getTemplate({ name: "SPEC_FEATURE_TEMPLATE" })`. **FORGETRAIL_LITE v1.5.0** — new **§3.1** Lite-cut skeleton + lifecycle folders. Cursor rules **`specs-and-todo.mdc`** + **`spec-completion.mdc`** (content/ + forgetrail `.cursor/rules/`; Lite install copies them). **product-feedback-to-spec** expands to full template when needed. |
| 2026-07-06 | **Lifecycle scaling + lesson harvest (from a one-shot keepsake build):** Project **archetypes** (`product` / `internal-tool` / `one-shot`) chosen in Phase 1 prune tracking exit criteria at bootstrap (**WORKFLOW §1d**, TRACKING_SCHEMA, both starter JSONs, GREENFIELD_INTAKE §0, brief templates, bootstrap/INITIAL_PROMPT). **Wrap protocol** (**WORKFLOW §1e**) — finishing a project includes sweeping `gotchas[]`/`decisions[]` and propagating; `project.status: wrapped`. **Propagate prompt** genericized to any source project + new **Harvest mode** (tracking file as primary discovery source; both copies). **FORGETRAIL_LITE v1.4.0** — archetype + wrap in §3/§5/§6/§11; `sv` CLI ~v0.16 may emit no `svelte.config.js` (§4.2 A.2). **CONTEXT_PROMPT** — Svelte 5 `state_referenced_locally` prop-init gotcha + `sv` config-layout gotcha. **update-log** — archiving convention; pre-OSS entries moved to `update-log-archive.md`. |
| 2026-07-06 | **README positioning: compounding loop + framework comparison.** Intro now leads with the cross-project propagation loop (update-log as auditable history) as the differentiator; new *How ForgeTrail compares* section (GitHub Spec Kit, BMAD-Method, OpenSpec, per-project retro/memory loops) with honest complementarity notes; Origin updated to reflect ~a dozen projects bootstrapped since Exec Foundry. |
| 2026-07-05 | **Engineering skill library (Exec Foundry):** New **`prompts/engineering-skill-library.md`** — capture a principal-engineer handoff / skill library (audit-first, subsystem deep-dives, debugging playbooks, judgment frameworks) from a mature codebase. **TECHNICAL_REFERENCE** — prompt-injection fencing lesson + new *Model selection and the provider choke point* subsection (tier by output value, one `callLLM` entry point, multi-block responses, thinking-off for JSON, blank env var). **CONTEXT_PROMPT** — new *LLM provider integration* pattern group. **CODE_QUALITY** — injection-guard + LLM response-handling checklist rows. **WORKFLOW** Phase 7 handoff artifact; README prompt tree; INITIAL_PROMPT runAudit list; MCP aliases (`skill-library`, `handoff`); propagate prompts — trigger row + inventory (both copies). |
| 2026-07-04 | **Panel side-tab navigation model (Exec Foundry):** **DESIGN_SYSTEM** new *Panel navigation model (side-tab rail)* under Layout Patterns (persistent header → responsive rail → single scroll → one pane; ≥3-section threshold; master-detail exception; shared `PanelShell` + `PanelSideNav` primitives). **CONTEXT_PROMPT** — Framework gotcha (Svelte markup imbalance degrades a component's prop types → errors surface in the *consumer*; use `build` for the real message); Patterns to Follow (extract one panel shell + section-rail primitive; keep a panel mounted off-screen via `dockHidden` for background work; sync active section in URL); Anti-Patterns (no nested double-scroll in a panel body; don't reinvent panel chrome per component). |
| 2026-06-26 | **Assertive product voice + structured eligibility fit (Exec Foundry):** **user-facing-content.mdc** Assertive capability copy; **BRAND_AND_PRODUCT** We say/We don't say table; **CONTEXT_PROMPT** assertive voice + async callback snapshot patterns; **TECHNICAL_REFERENCE** *[Structured eligibility / requirement fit]* stub; **TEST_PLAN** §4.5–4.6; **CODE_QUALITY** pre-launch grep; propagate prompt triggers + Step 3 mapping; MCP **cursor-rules/** mirror. |
| 2026-06-15 | **Microcopy centralization propagation (Exec Foundry):** New **`prompts/microcopy-centralization.md`**; **TECHNICAL_REFERENCE** § User-facing copy; **CODE_QUALITY** + **TEST_PLAN** audit hooks; **BRAND_AND_PRODUCT** duplication policy; **CONTEXT_PROMPT** patterns/anti-patterns; **WORKFLOW** Phase 7 + post-launch cadence; **`.cursor/rules/user-facing-content.mdc`** + **`us-english.mdc`** (+ MCP **`cursor-rules/`** mirrors); propagate prompt trigger + Context inventory. |
| 2026-06-10 | **Anti-self-importance and position-of-strength tone controls:** TECHNICAL_REFERENCE (new tone controls subsection); CONTEXT_PROMPT Patterns to Follow (anti-self-importance & posture rules); BRAND_AND_PRODUCT (grandiose & striving register prevention); TEST_PLAN (anti-self-importance & position-of-strength checks). Source: Exec Foundry cover letter anti-self-importance pass. |
| 2026-06-10 | **Factual grounding and veracity check safety nets:** TECHNICAL_REFERENCE (new veracity pass subsection); CONTEXT_PROMPT Patterns to Follow (grounding text in prompt); BRAND_AND_PRODUCT (veracity pass lesson); DESIGN_SYSTEM (VeracityCard visual spec); TEST_PLAN (grounding & veracity test cases). Source: Exec Foundry cover letter grounding and veracity pass. |
| 2026-06-04 | **LLM JSON parse hardening (verbatim upload):** TECH_REF Output Validation lesson + guidance (`parseJsonFromLlmOutput`, `sanitizeJsonControlChars`, prompt escape rule, Support ID); CONTEXT_PROMPT integration pattern; CODE_QUALITY audit item #5; TEST_PLAN resume/cover upload checklist. Source: Exec Foundry onboarding upload fix + PostHog `Bad control character in string literal`. |
| 2026-06-01 | **Loved-tier UX patterns:** modal focus trap + return focus; board "Start here" recommendation strip; first-artifact orientation overlay; AI section lifecycle vocabulary + stale banner. DESIGN_SYSTEM, CONTEXT_PROMPT, TECHNICAL_REFERENCE (AI lifecycle stub), TEST_PLAN §7.4c–f. |
| 2026-06-01 | **Prelaunch review — low polish:** TRACKING_SCHEMA phase ID map (Lite vs MCP); WORKFLOW agent-agnostic intro; Lite maintainer triplicate-sync note; propagate prompt + update-log cross-doc anchors; §15 decisions[] shape. Completes prelaunch review spec. |
| 2026-06-01 | **Prelaunch review — medium fixes:** FORGETRAIL_LITE §4 reading order + map; §8 rule 5/6 notation (vs §8.9 subsection); `.forgetrail/` git policy (H1 status launcher + H2 commit/gitignore from prior commit); MCP `getForgeTrailLite` + `getForgeTrailLiteUpdates`; Lite release checklist in update-log; unified `decisions[]` example shape. |
| 2026-05-29 | **Cohesion-tier UX patterns:** minimal global keyboard set + **safe-Esc layering** + help overlay; **first-load skeletons** (shape over spinner); **canonical empty-state component** with `wrapper`/`centered`/`hero` variants; **unified three-phase save acknowledgement** (`Saving…`/`Saved`/`error`) bubbled from child components to one indicator; **dismissible per-user first-run hints**. DESIGN_SYSTEM sections + CONTEXT_PROMPT pattern/anti-patterns + TEST_PLAN checks. |
| 2026-05-29 | **New prompt: UX Cohesion Audit** — whole-app, cross-cutting read of where a product confuses, blocks, distracts, or fails to delight; two-lens method (cross-cutting "feels like N apps" themes + surface-by-surface), Step 0 corpus read to point at owned specs instead of re-speccing, Critical/High/Medium/Low + effort with delight first-class. Complements `panel-usability-audit.md` (single surface) and `pre-launch-audit.md` (launch readiness). README prompt tree updated (also added previously-missing `panel-usability-audit.md`). |
| 2026-05-26 | **Cover letter templates:** drop mailed-letter `[City, State]` guidance — **BRAND_AND_PRODUCT**, **TECHNICAL_REFERENCE** (tailoring), **CONTEXT_PROMPT** voice rules. |
| 2026-05-26 | **Public repo polish:** `forgetrail.html` OSS CTAs (GitHub/MCP); archived `specs/forgetrail-as-product.md`; removed internal product `.docx`; update-log intro for pre-OSS entries. |
| 2026-05-26 | **Open source (Apache 2.0):** `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`; README license/support; reframe closed-distribution wording in **FORGETRAIL_LITE v1.3.0**, **NEW_PROJECT_BOOTSTRAP**, **WORKFLOW**, **INITIAL_PROMPT**, **forgetrail-workspace-README**; `mcp-server/package.json` license field; public repo published with clean history. |

---

## Detail

### 2026-09-11 — Companion tools

Situation-triggered suggestions for Catalyst Forge siblings. Mapping: `content/COMPANION_TOOLS.md` + `content/companion-tools.json`. WORKFLOW §1f. Intake adds registrar/DNS/git/hosting and optional workstation/voice-journal questions. Lite v2.0.1 thin pointers. DEPLOYMENT defaults to Cloudflare DNS/Pages when unspecified. MCP: `getCompanionSuggestions` plus a `getPhaseGuidance` footer. Site About/compare mention the shelf below Try. `scripts/ensure-lease.mjs` calls LocalSlip. Spec: `specs/partial/companion-tools.md`.

### 2026-08-24 — npm name hold (LaunchCampaign)

Source: reserving `launch-campaign` without shipping the campaign CLI or dogfood plans.

- `content/cursor-rules/npm-name-hold.mdc` (+ app `.cursor/rules/` and user-level `~/.cursor/rules/` copies) — throwaway `0.0.0` stub: `package.json` + one-line README, no homepage/bin/deps; first real release bumps.
- `docs/CONTEXT_PROMPT.md` — pattern + anti-pattern (do not publish the app repo to stake a name).
- `docs/NPM.md` — pointer at the top so ForgeTrail's own publish doc does not get used as the name-hold recipe.

### 2026-08-23 — Positioning spine / theme-lock methodology (Exec Foundry)

Source: Exec Foundry's six-pass origin-story refinement plus a site-wide copy audit, which converged on a positioning spine ("what's missing is never the person; it is the tooling available to them") and codified it as an always-apply Cursor rule. Generalized here:

- `docs/BRAND_AND_PRODUCT.md` > Copy & Messaging Lessons — new **Positioning spine (theme lock)** subsection: converge drifting copy on one spine sentence and codify as an agent rule; lessons on the person-transformation tagline ban for expert audiences (craft metaphors temper what exists, never create the person; assure the standard, never guarantee the outcome), the signature fast-read misparse check, reality-check-as-terrain framing, and the staccato-cadence / vague-noun / squish-intensifier register rules. New **Long-form origin narrative (constraints file)** subsection: LOCKED FRAMING / ARC / VOICE notes file next to the narrative, dated pass addenda in the source spec, and hard constraints for named people (employer safety, verb restrictions).
- `docs/CONTEXT_PROMPT.md` > Patterns to Follow — positioning-spine-as-rule-file pattern; > Anti-Patterns — person-transformation taglines for expert audiences.
- `content/cursor-rules/writing-voice.mdc` — new always-apply rule template with bracketed spine, banned framings, register rules, and named-person constraint slots.
- `prompts/propagate-to-forgetrail.md` — trigger row for brand theme / positioning-spine crystallization (mirrored in the source app's copy).

### 2026-08-20 — forgetrail.dev live; npm published

https://forgetrail.dev is live. `forgetrail@0.3.0` and `forgetrail-mcp@0.2.2` are on npm. Try and README lead with copy-paste Lite; `pnpm dlx forgetrail install --lite` and `forgetrail-mcp` are optional shortcuts. Spec: `specs/completed/npm-distribution.md`. Publish later releases from `mcp-server/` cwd (npm 12 + `pnpm --dir` EUSAGE).

### 2026-08-19 — Marketing site in `site/` and GitHub slug

GitHub repo is **`Catalyst-Forge-LLC/forgetrail`** (old `forge-kit` URL redirects). Homepage is set to forgetrail.dev. Public links, site GitHub nav, and the Try checklist template use the new slug.

npm packages `forgetrail` and `forgetrail-mcp` are unset from private, with license, repository, homepage, `publishConfig.access: public`, and `pnpm run pack:check`. You publish: see `docs/NPM.md`.

forgetrail.dev is registered but not live. The marketing site lives in this repo at **`site/`**, matching IngotVault: FilePress content (`filepress.config.ts`, `pages/`, `posts/`, `theme.css`) plus Wrangler Pages (`wrangler.jsonc`, `pnpm ship`). Root scripts: `site:dev`, `site:build`, `ship`. First publish still needs Wrangler login, Pages project `forgetrail`, and registrar DNS to Cloudflare.

### 2026-08-15 — Rename: ForgeKit → ForgeTrail

Product name is now **ForgeTrail** (domain: forgetrail.dev). Distinctive idea: the work leaves a structured trail (path, decisions, gotchas, resume breadcrumbs, lessons) that improves the next project. Copy guide: `docs/FORGETRAIL_RENAME.md`. Tagline: **Forge the path. Keep the trail.**

- Identifiers: `.forgetrail/`, `_forgetrail/`, CLI `forgetrail`, packages `forgetrail` / `forgetrail-mcp`, MCP tools `getForgeTrail*`, env `FORGETRAIL_*`, Lite `FORGETRAIL_LITE.md` **v2.0.0**.
- Hero copy (README, WORKFLOW, `forgetrail.html`) leads with category, then the trail metaphor.
- GitHub slug `Catalyst-Forge-LLC/forge-kit` and the local clone folder are unchanged.

### 2026-07-30 — Fix-efficacy pass for security re-audits (Exec Foundry sweep)

Source: an Exec Foundry sweep that re-tested its own hardening from the 2026-07-29 CodeQL pass. Four defenses that a prior audit had credited as effective did not block: an SSRF guard matching loopback as the exact string `127.0.0.1` (so `127.0.0.2`, `[::ffff:127.0.0.1]`, and `localhost.` passed), a DNS check whose IPv4-mapped branch could never match the resolver's output, a filter escaper using SQL-style doubled quotes against a backslash-escaping parser, and an entity decoder whose "ampersand last" ordering was defeated by numeric refs decoding first. Generalized as a review technique, not as the specific ranges.

- **`prompts/black-hat-audit.md`** — New **AREA 0: Fix efficacy**, to run first on any previously audited codebase: read the last report, treat "remediated" as unverified, enumerate bypass inputs per guard, and check the named failure modes. Broken defenses are reported at the severity of the vulnerability they were meant to close. **RULES** — a defense counts as effective only when the rejected inputs can be named, preferably as a regression test; never mark a prior finding remediated because a fix was committed.
- **`docs/CODE_QUALITY.md`** — Checklist rows: numeric (not string-prefix) address range classification with host normalization; regression tests per guard with every branch proven reachable; escaping compared against the vendor SDK's own helper; single-pass sanitizers instead of chained `.replace()`. Lesson + example (`assert.throws` on a mapped-IPv6 metadata URL beats a paragraph claiming metadata is blocked). Two follow-on rows from the same sweep: close validate-then-connect with a filtering resolver in the dispatcher rather than a pre-check alone, and guard headless-browser navigation (abort blocked navigation requests, re-check the landed URL) while noting that the browser still resolves DNS itself.

Source: Exec Foundry CodeQL default-suite remediation (~90 alerts, mostly incomplete URL substring host checks across scraper / Outpost). Prevention lessons only — not app-specific board lists.

- **`docs/CODE_QUALITY.md`** — Checklist rows for host classification, SSRF boundary, scheme allowlist, workflow `permissions` / no client stacks; lesson + example for `hostMatchesDomain`.
- **`docs/CONTEXT_PROMPT.md`** — Patterns: board/vendor host matching + SSRF allowlist; Anti-Patterns: forbid `hostname.includes('brand.com')` and client-visible stacks.
- **`content/cursor-rules/url-host-matching.mdc`** (+ forgetrail `.cursor/rules/` mirror) — globs for app/outpost/scripts; shared helper preference.

### 2026-07-16 — Feature SPEC template (full + Lite)

ForgeTrail had lifecycle folders and an inline Phase-4 bullet list, but no copy-paste delivery skeleton. Agents invented structure or imitated Exec Foundry. Added a shared template modeled on `specs/completed/forgetrail-new-user-experience.md` and Exec Foundry delivery specs (`companies-people-panel-ux-overhaul`, purpose-tailored-resume conventions).

- **`docs/SPEC_FEATURE_TEMPLATE.md`** — Delivery header (kind/status/related/surfaces); problem; goals/non-goals; background; concepts; design (behavior/data/API/UI/files); edge cases; milestones; acceptance criteria; open questions; decisions; Progress; Implementation summary. Lite-cut note in header.
- **`WORKFLOW.md`** — Phase 4 playbook + §1a Phase 4 row + document inventory point at the template and lifecycle rules.
- **`content/FORGETRAIL_LITE.md` v1.5.0** — §3.1 when/where/lifecycle + Lite-cut markdown skeleton; Phase 4 exit criterion mentions specs.
- **`content/cursor-rules/specs-and-todo.mdc`** + **`spec-completion.mdc`** (mirrored into forgetrail `.cursor/rules/`); Lite install copies them via `scripts/install.mjs`.
- **`prompts/product-feedback-to-spec.md`**, **`content/NEW_PROJECT_BOOTSTRAP.md`**, **`specs/README.md`**, **`mcp-server/README.md`**, **`README.md`** — cross-links.

### 2026-07-06 — Lifecycle scaling + lesson harvest (from a one-shot keepsake build)

Source: a ForgeTrail-bootstrapped **one-shot keepsake app** (a birthday trivia game) exposed three structural gaps: full-product exit criteria (payments, brand pillars, black-hat audit) generate noise for a project with no market; the tracking file's `gotchas[]`/`decisions[]` had no consumer at project end, so small-project lessons died in their repos; and the propagate prompt assumed a flagship app with a journal and full doc set. Two fresh SvelteKit gotchas from that build are propagated in the same pass.

- **`WORKFLOW.md`** — New **§1d Project archetypes**: `product` (default, full lifecycle), `internal-tool` (Phase 6 optional; Phase 7 keeps security/deploy/docs, drops payments/business-plan/marketing), `one-shot` (phases 5–7 collapse into one polish-and-ship gate; emotional polish outranks hardening depth). Agent duties: prune criteria once (don't annotate N/A), log the pruning as a decision, escalate on archetype drift. New **§1e Wrap protocol**: sweep `gotchas[]` + `decisions[]` → propagate (Harvest mode) → `project.status: "wrapped"` + final session entry; zero-yield wraps are legitimate. Phase 1 playbook gains the archetype bullet; §1a propagation blurb points at §1e.
- **`TRACKING_SCHEMA.md`** — `project.archetype` and `project.status` fields with pruning and wrap semantics.
- **`workflow_tracking.json`** + **`content/LITE_WORKFLOW_TRACKING.json`** — starter JSONs gain `archetype: "product"` and `status: "active"` (additive; Lite `schemaVersion` stays `lite-1` — the launcher and validator tolerate extra fields).
- **`content/GREENFIELD_INTAKE.md`** — New **§0 Project archetype** (ask or infer first); "Why this exists" updated.
- **`docs/PHASE_1_BRIEF.md`** — §1 gains a **Project archetype** row. Lite's embedded brief template (§6) gains the same line.
- **`content/NEW_PROJECT_BOOTSTRAP.md`** — Progressive-scaffolding archetype bullet; Rules gain the wrap step.
- **`INITIAL_PROMPT.md`** — Phase 1 archetype block (classify, record, prune) + wrap pointer.
- **`prompts/propagate-to-forgetrail.md`** — Genericized: **any ForgeTrail project is a valid source**; new **Harvest mode** section (tracking file as primary discovery source for small projects and wrap; zero-yield is fine); Context inventory reframed as a menu; discovery-scan row for the tracking file; trigger row for project wrap. **Exec Foundry `prompts/Propagate to ForgeTrail.md`** — upstream note, matching trigger + discovery rows (parity).
- **`content/FORGETRAIL_LITE.md`** — **v1.4.0** (header, §12 snippet, footer): §3 archetype table + wrap paragraph; §5 intake topic; §6 brief archetype line; §11 starter fields; §4.2 step 10 A.2 — recent **`sv` CLI (~v0.16+) may emit no `svelte.config.js`** (adapter options inside `sveltekit()` in `vite.config.ts`; `export const prerender = true` in `+layout.ts` works under either layout).
- **`docs/CONTEXT_PROMPT.md`** — Framework gotchas: **Svelte 5 `state_referenced_locally`** — `$state(props.value)` captures only the initial value; initialize empty and populate in an `$effect`, or silence explicitly for intentional snapshots. Plus the `sv` config-layout gotcha above.
- **`update-log.md`** — New **archiving convention** (move oldest rows + Detail together past ~30 rows or a year boundary); pre-2026-05-26 rows and Detail sections moved to new **`update-log-archive.md`** (private-era provenance; the orphaned v1.1.8 detail block got its heading restored in the move).
- **`README.md`** — 7-phases section: archetype scaling + wrap paragraph; file tree lists `update-log-archive.md`; "Propagating lessons back" mentions Harvest mode and any-project sources.

### 2026-07-06 — README positioning: compounding loop + framework comparison

Source: assessment of the 2026 spec-driven development landscape (GitHub Spec Kit, BMAD-Method, OpenSpec, per-project retro/memory loops) ahead of sharing ForgeTrail publicly. The rarest mechanism ForgeTrail has is the **cross-project propagation loop with editorial discipline** — previously buried at the bottom of the README.

- **`README.md`** — Intro: new paragraph leading with the compounding loop ("most frameworks gate the work; ForgeTrail also compounds the learning") linking the propagate prompt and this log. New **How ForgeTrail compares** section after the 7 phases: table contrasting Spec Kit (structural scaffolding vs pre-loaded production lessons), BMAD (persona breadth vs persistent memory + lifecycle state), OpenSpec (per-change governance vs whole-product lifecycle incl. brand/pricing/launch), and retro/memory loops (per-project appends vs generalized, deduplicated, two-track, logged cross-project propagation); closes with honest guidance on when the lighter tools suffice. Origin: notes ~a dozen projects bootstrapped since Exec Foundry, pointing at this log as the record.

### 2026-07-05 — Engineering skill library (Exec Foundry)

Source: Exec Foundry produced a 15-document "retiring principal engineer" skill library (`docs/skills/`) capturing architecture rationale, subsystem deep-dives (data layer, auth/delegation, LLM, DOCX, scraping, billing), debugging playbooks, security/testing gates, and judgment frameworks. This pass propagates the **methodology** and the generalizable **lessons** the library surfaced that ForgeTrail did not yet carry.

- **`prompts/engineering-skill-library.md`** (new) — Generalized capture prompt: audit-first process (core modules, convention files, failure record, specs, representative routes), skill-set shape (architecture + per-subsystem + playbooks + security/testing/process + judgment capstone), mentoring-voice rules (WHY + scar per convention, anti-patterns and war stories, write for less context), index + verification steps. Companion note distinguishing it from findings-oriented audits.
- **`docs/TECHNICAL_REFERENCE.md`** — Prompt Architecture: lesson on **fencing untrusted content** (labeled delimiter blocks + standing guard instruction, helper internal to the one LLM module). New **Model selection and the provider choke point** subsection: one `callLLM()`-style entry point; tier chosen by output value (capable for user-submitted artifacts, mid workhorse, cheap for classification/recovery); model ids in config not identifiers; fallback chains on provider overload. Example block: concatenate **all** text blocks (not `content[0]`), disable extended thinking for JSON tasks, treat blank model env vars as unset.
- **`docs/CONTEXT_PROMPT.md`** — Critical Patterns: new **LLM provider integration** group mirroring the above at gotcha level (multi-block responses, thinking vs JSON, blank env var, tier-by-value + config-based naming, injection wrapping).
- **`docs/CODE_QUALITY.md`** — Audit checklist: verify injection-guard fencing on all untrusted prompt content; verify LLM calls read all response blocks / disable thinking for JSON / handle blank model env vars.
- **`WORKFLOW.md`** — Phase 7 (Hardening) doc schedule: optional **handoff artifact** — run the skill-library prompt before beta, ownership change, or handing work to a cheaper model.
- **`README.md`** — Prompt tree row for `engineering-skill-library.md`.
- **`INITIAL_PROMPT.md`** — runAudit prompt list extended.
- **`mcp-server/src/index.ts`** — `runAudit` aliases `skill-library` and `handoff` (prompt file itself auto-discovered from `prompts/`).
- **`prompts/propagate-to-forgetrail.md`** + Exec Foundry **`prompts/Propagate to ForgeTrail.md`** — New trigger row (skill library / handoff docs created or updated) and prompt-library inventory updated in both copies.

Deliberately not propagated: app-specific content of the 14 skill docs (PocketBase filter helper internals, DOCX run-splitting mechanics, plan-tier tables, scraping vendor chains) — ForgeTrail already carries the generalized versions of those lessons from earlier passes; this pass added only the net-new gaps above.

### 2026-07-04 — Panel side-tab navigation model (Exec Foundry)

Source: Exec Foundry rolled a reusable side-tab navigation model across its slide-out panels via two new shared primitives (`PanelShell` + `PanelSideNav`), then browser-verified. Spec: `specs/completed/panel-side-tab-navigation-model.md`.

- **`docs/DESIGN_SYSTEM.md`** — New **Panel navigation model (side-tab rail)** subsection under Layout Patterns: the four rules (persistent header card, section rail vs stacked cards, single scroll, one content pane), the **≥3-section adoption threshold**, the **master-detail exception** (keep list scroll; borrow persistent-header + no-nested-detail-scroll), and **Guidance** to extract a shared `PanelShell` (chrome/backdrop/animation/header/`belowHeader`/single scroll body/width toggle) + `PanelSideNav` (typed responsive rail).
- **`docs/CONTEXT_PROMPT.md`** — Critical Patterns → Framework gotchas: a Svelte markup/tag imbalance degrades a component's **prop types** so errors surface in the **consumer** (`implicitly has an 'any' type`, `Property … is missing`); run a full build on the child for the real compiler message. Patterns to Follow: extract one panel shell + section-rail primitive (migrate reference panel first, then batches); keep a panel mounted off-screen via a **`dockHidden`** flag for background work (render while `open || work.running`, floating progress chip, preserve in-flight state in `onClose`); extended the Multi-panel SPA + URL state pattern to sync the active section. Anti-Patterns: no second `overflow-y-auto` nested inside a panel's scrolling body (with the master-detail side-by-side exception); don't reinvent panel chrome per component.

### 2026-06-26 — Assertive product voice + structured eligibility fit (Exec Foundry)

- **`.cursor/rules/user-facing-content.mdc`** — New **Assertive capability copy** section: direct verbs for product behavior; when to keep *can* (permission, limits, people). Mirrored in **`content/cursor-rules/`** and Exec Foundry **`.cursor/rules/`**.
- **`docs/BRAND_AND_PRODUCT.md`** — **Assertive product voice (no hedging *can*)** subsection with We say / We don't say table + lesson learned.
- **`docs/CONTEXT_PROMPT.md`** — Patterns: assertive product voice in copy modules; progressive async UI snapshot callbacks before close/unmount.
- **`docs/TECHNICAL_REFERENCE.md`** — New **`[Structured eligibility / requirement fit (optional)]`** feature stub (taxonomy, extraction, surfaces, PATCH maps).
- **`docs/TEST_PLAN.md`** — §4.5 assertive copy grep; §4.6 structured eligibility checklist.
- **`docs/CODE_QUALITY.md`** — Pre-launch copy checklist extended with `\bcan\b` capability-hedge grep.
- **`prompts/propagate-to-forgetrail.md`** + Exec Foundry **`Propagate to ForgeTrail.md`** — Trigger rows + Step 3 mapping for assertive voice and structured eligibility.

### 2026-06-15 — Microcopy centralization (Exec Foundry)

- **`prompts/microcopy-centralization.md`** — Phased cluster migration checklist; three-layer architecture (labels / microcopy / surface `*Copy.ts`); duplication policy; three complementary audits (sync, export duplication, inline AST); legal-as-markdown guidance.
- **`docs/TECHNICAL_REFERENCE.md`** — New **User-facing copy** section: module layout, export/audit scripts, cursor rules, pre-release target (0 inline prose backlog).
- **`docs/CODE_QUALITY.md`** — Audit checklist row for `export:copy` + `audit:inline-copy` + sync audit before marketing pushes.
- **`docs/TEST_PLAN.md`** — §12 optional copy-hygiene walkthrough.
- **`docs/BRAND_AND_PRODUCT.md`** — **Microcopy duplication policy** blockquote under Copy & Messaging Lessons.
- **`docs/CONTEXT_PROMPT.md`** — Centralized copy module pattern + anti-patterns for duplicated help prose and inline product strings.
- **`WORKFLOW.md`** — Phase 7 hardening + post-launch re-run cadence for copy audits.
- **`README.md`** — Prompt tree entry for `microcopy-centralization.md`.
- **`prompts/user-facing-content-sync-audit.md`** — Cross-link to microcopy centralization prompt.
- **`prompts/propagate-to-forgetrail.md`** — Trigger row + Context inventory for microcopy pass.
- **`.cursor/rules/user-facing-content.mdc`**, **`us-english.mdc`** — App copy tone/locale defaults (also in **`content/cursor-rules/`** for MCP distribution).

### 2026-06-10 — Anti-self-importance and position-of-strength tone controls

Propagated from Exec Foundry after implementing and validating the cover letter anti-self-importance and position-of-strength rules. Pattern and feature memory for any application that generates outbound copy representing the user and needs to prevent grandiose, visionary, or striving registers from leaking into the output.

- **`docs/TECHNICAL_REFERENCE.md`**
  - **Anti-self-importance and position-of-strength tone controls** — New subsection documenting the need for strict tone and posture controls, filtering out rhetorical scaffolding/self-narration, banning clever self-authored aphorisms, and enforcing a "position of strength" posture.
- **`docs/CONTEXT_PROMPT.md`**
  - **Patterns to Follow** — Added a pattern on anti-self-importance and position-of-strength posture, outlining specific rules and the "why" behind them.
- **`docs/BRAND_AND_PRODUCT.md`**
  - **Generated letters and long-form outbound copy (LLM)** — Added a lesson learned on how anti-self-importance and position-of-strength rules prevent grandiose and striving registers.
- **`docs/TEST_PLAN.md`**
  - **AI Features** — Added `### 4.4 Anti-self-importance and position-of-strength tone checks` containing manual test cases for grandiose framing, visionary self-positioning, analytical flattery, name-dropping by negation, performative specificity, modifier stacking, and position-of-strength posture.

### 2026-06-10 — Factual grounding and veracity check safety nets

Propagated from Exec Foundry after implementing cover letter grounding in resume truth and a programmatic veracity pass MVP. Pattern and feature memory for any application that generates tailored materials representing the user and needs to prevent hallucinations and establish user trust.

- **`docs/TECHNICAL_REFERENCE.md`**
  - **Factual grounding and veracity checks on tailored outputs** — New subsection documenting the feature shape, grounding contract (passing full source document in prompt), and programmatic veracity pass (post-generation semantic audit using a smaller model) as a human-in-the-loop safety net.
- **`docs/CONTEXT_PROMPT.md`**
  - **Patterns to Follow** — Added a pattern on factual grounding and veracity checks, emphasizing passing full verbatim text of source documents and running post-generation audits.
- **`docs/BRAND_AND_PRODUCT.md`**
  - **Generated letters and long-form outbound copy (LLM)** — Added a lesson learned on how factual grounding and veracity checks prevent hallucinated credentials and establish trust.
- **`docs/DESIGN_SYSTEM.md`**
  - **Factual grounding and veracity cards** — New section specifying visual styling, structure, detailed issue cards (severity badges, exact excerpts, reasons, repairs), and outcome-oriented copy for veracity cards.
- **`docs/TEST_PLAN.md`**
  - **AI Features** — Added `### 4.3 Factual grounding and programmatic veracity checks` containing manual test cases for grounding checks, automatic veracity passes, flagged issues, success states, persistence, and dismissal.

### 2026-06-04 — LLM JSON parse hardening (verbatim document upload)

Propagated from Exec Foundry after production `server_failure_llm_parse` on resume DOCX upload (`Bad control character in string literal` when the model copied soft line breaks verbatim into JSON strings). Pattern memory for any app that maps uploaded documents to structured JSON via LLM.

- **`docs/TECHNICAL_REFERENCE.md`**
  - **Output Validation** — lesson + guidance: prompt escape rule (`\n` / `\t` inside strings), shared `parseJsonFromLlmOutput` + `sanitizeJsonControlChars` (strict-first, repair fallback), route all verbatim-copy parsers through the helper, Support ID on upload failures.
- **`docs/CONTEXT_PROMPT.md`**
  - Integration pattern — verbatim text in LLM JSON: prompt + server-side sanitization for onboarding-critical uploads.
- **`docs/CODE_QUALITY.md`**
  - Audit checklist item **#5** — do not bare-`JSON.parse` verbatim-copy LLM output; unit-test newline-in-string payloads.
- **`docs/TEST_PLAN.md`**
  - **Resume / cover-letter upload — LLM JSON resilience** — manual checks for soft-break DOCX, Support ID correlation, content sanity.

### 2026-06-01 — Loved-tier UX patterns (focus trap, board recommendation, first artifact, AI lifecycle)

Propagated from Exec Foundry's beta-iteration ("loved") cohesion first pass. Generalized delight and cross-cutting primitives beyond the early-beta tier.

- **`docs/DESIGN_SYSTEM.md`**
  - **Accessibility Patterns → Modal and dialog focus trap** (new) — shared trap action: Tab cycle, `[data-autofocus]`, return focus on teardown; Escape stays per-layer.
  - **Board-level "next best move"** (new) — elevate top priority follow-up into a calm "Start here" strip; distinct from inline first-run panel hints.
  - **First successful artifact moment** (new) — one-time orientation overlay after first core generated bundle; per-user dismissal.
  - **AI-generated section lifecycle** (new) — empty / generating / ready / stale vocabulary + canonical stale banner; input-hash prerequisite for stale.
- **`docs/CONTEXT_PROMPT.md`**
  - **Patterns to Follow** — focusTrap adoption; AI lifecycle vocabulary; board Start here from reminders; first-artifact overlay.
  - **Anti-Patterns** — modals without trap/return; per-surface AI status copy drift.
- **`docs/TECHNICAL_REFERENCE.md`**
  - **AI/LLM Integration → AI-generated section lifecycle** — feature stub (routes, persistence, staleness hash, vocabulary module).
- **`docs/TEST_PLAN.md`**
  - New **§7.4c** focus trap, **§7.4d** first-artifact orientation, **§7.4e** board recommendation, **§7.4f** AI section lifecycle checks.

### 2026-05-29 — Cohesion-tier UX patterns (keyboard, skeletons, empty states, save ack, first-run hints)

Propagated from an Exec Foundry "early-beta cohesion" implementation pass that built a minimal global keyboard layer, a board load skeleton, an `EmptyState` hero variant, a unified save acknowledgement, and a first-open wayfinding hint. Generalized into reusable, stack-neutral guidance.

- **`docs/DESIGN_SYSTEM.md`**
  - **Global keyboard shortcuts** — two new lessons: ship the *smallest credible set first* (`/` search, create-new, `?` help, disciplined `Esc`) with `isTypingContext` + IME guards and "bare primary surface only" gating; and a **minimal-safe `Esc`** that defers to layers already owning Escape (record drawers, modals) instead of stacking a second `window` listener — full topmost-layer precedence deferred.
  - **First-load skeletons (shape over spinner)** (new) — skeleton mirroring the destination layout for data-heavy primary surfaces; spinners reserved for small bounded waits.
  - **Canonical empty-state component** (new) — one component with `wrapper`/`centered`/`hero` variants; first-run copy driven by onboarding/search stage so the empty screen teaches the next step.
  - **Save acknowledgement (auto-save feedback)** (new) — one shared three-phase ack (`Saving…`/`✓ Saved`/`Couldn't save`) for blur-save surfaces; no per-field spinners, no success-only ack.
  - **First-run hints (dismissible coach marks)** (new) — one-time inline "start here" cue on dense surfaces, dismissal persisted per user.
- **`docs/CONTEXT_PROMPT.md`**
  - **Patterns to Follow** — unified save acknowledgement fed by parent + child components via an `onSaveStatus(phase, label?)` bubbling callback into one `setSaveAck` machine.
  - **Anti-Patterns to Avoid** — partial/success-only save acks; and registering an app-level `Esc` handler without deferring to layers that already own the key.
- **`docs/TEST_PLAN.md`**
  - §10 — save-ack lifecycle (`Saving…` → `Saved`), error phase on simulated failure, and ack ubiquity across parent + child fields.
  - §7.4 — skeleton-shaped-like-destination check; new **§7.4a** global keyboard shortcuts and **§7.4b** first-run hints checklists.

### 2026-05-29 — New prompt: UX Cohesion Audit

Reusable whole-app UX audit, generalized from an Exec Foundry pass that produced a cohesion-audit spec. Distinct from the existing single-surface and launch-readiness audits.

- **`prompts/ux-cohesion-audit.md`** (new) — app-agnostic prompt for a fresh-eyes, cross-cutting read of where a product confuses, blocks, distracts, or fails to delight. Codifies: a **two-lens method** (Lens A cross-cutting "feels like N apps" themes — inconsistent interaction/save/confirm models, silent feedback, opt-in-only discoverability, missing global keyboard model, fragmented system legibility, vocabulary/state drift; Lens B surface-by-surface findings); a **Step 0** that reads the existing spec/doc corpus so the audit *points at* owned specs instead of re-speccing them (mandatory "relationship to existing specs" table); a **Critical/High/Medium/Low + XS–L effort** model with **delight as a first-class tier**; and a three-tier prioritized plan (trust → cohesion → loved). All placeholders bracketed and stack-neutral.
- **`README.md`** — prompt file tree gains `ux-cohesion-audit.md` (and the previously-missing `panel-usability-audit.md`).
