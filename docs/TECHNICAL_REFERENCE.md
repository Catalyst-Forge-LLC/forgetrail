# [App Name] - Technical Reference

_Comprehensive documentation of how each feature works, data models, API routes, and configuration. This is the "how does it actually work" document._

_For brand positioning and product copy, see [BRAND_AND_PRODUCT.md](BRAND_AND_PRODUCT.md). For business model, see [BUSINESS_PLAN.md](BUSINESS_PLAN.md)._

_Instructions: Start populating this during Phase 4 (Feature Iteration) and keep it updated as features are built. Organize by functional area, not by file. Each section should answer: "What does this feature do, how does it work technically, and what are the edge cases?"_

---

## Architecture Overview

### System Design

[High-level description of how the major components interact. Include a simple diagram if helpful.]

```
[User] → [Frontend (SvelteKit)] → [API Routes] → [Backend Services] → [Database]
                                                 → [External APIs (LLM, etc.)]
```

### Design Principles

>🔧 **Guidance:** These should mirror your BRAND_AND_PRODUCT.md pillars but from a technical perspective.
>
> 📝 **Example:**
> - Human-in-the-loop: Every AI feature prepares, drafts, suggests, then returns control. No auto-submission.
> - Prep-before-write: Intersections → Selling Points → Materials. This sequence is enforced in the UI flow.
> - Progressive disclosure: Basic features visible by default, advanced features revealed through user action.

- **[Principle]:** [Technical manifestation]

## Data Model

### Collections/Tables

| Collection | Purpose          | Key Fields         |
| ---------- | ---------------- | ------------------ |
| [name]     | [what it stores] | [field: type, ...] |

### Relationships

```
[Collection A] 1──┤ [Collection B]
                   └── [field_name]

[Collection C] ┤──┤ [Collection D]
```

### Schema Notes

> 🔧 **Guidance:** Document any non-obvious schema decisions:
> - Field size limits (especially for fields storing LLM output)
> - Enum values and what they mean
> - Fields that are computed vs. stored
> - Migration notes if schema has changed

> 💡 **Lesson learned:** **Mapper inputs should reflect what PocketBase returns.** Functions that turn a raw collection row into a typed domain object (`[UserConfig]`, `[Job]`, etc.) should accept the SDK record type (commonly `RecordModel`) at the boundary. Casting with `as RecordModel` (or passing through from `getOne` / `getList` items) preserves intent; `as any` only silences the compiler. Pair with **`catch (e: unknown)`** and narrowers in routes that call mappers so failures don’t devolve into untyped throws.

> 💡 **Lesson learned:** **List endpoints that enrich each parent row with related-collection reads must respect the JS SDK’s request lifecycle.** The PocketBase JavaScript client auto-cancels overlapping in-flight requests to the same collection on the same client instance. A handler that runs `Promise.all(parents.map((p) => pb.collection('[child]').getList(..., { filter: … p.id … }) ))` can abort every call but one; catch blocks then return empty related arrays so the API responds 200 but omits nested data after reload. Prefer **`requestKey: null`** (or distinct keys per item) on those `getList` calls, serialize the related fetches, or use separate client instances per concurrent branch. Symptom: rows exist in the database but the list route always shows empty children.

### Deletion and data lifecycle

Document **what actually happens** when users remove data — not only the happy-path UI copy. Support and product need the same picture engineering uses.

> 💡 **Lesson learned:** **Hard delete vs soft delete should be explicit per entity.** Note which collections rely on **cascade delete** (schema + setup script), which use a **`deleted_at` (or equivalent) tombstone**, and which are **hard-deleted only**. If forks/copies can outlive a “parent” record, say so — children may keep a pointer to a removed id by design; list/detail routes should tolerate missing parents for labels, not 500s.

> 💡 **Lesson learned:** **Orphan and stale-pointer risks belong in this doc, not only in a spec.** Call out relations that are *not* cascade-deleted (e.g. person vs connections), optional analytics rows tied to deleted parents, and file blobs — and what you verified in staging. That sets expectations: recovery is often operational (backup/restore), not an in-app “undo,” unless you ship trash/restore.

> 💡 **Lesson learned:** **Admin off-boarding: archive vs gated erase.** For **operator/admin** accounts, prefer **archive or deactivate** (revoke sessions, remove from admin lists, retain audit history) over hard-delete unless policy requires erasure. If you offer **hard-delete or PII wipe**, gate it (confirm text, elevated role, or break-glass) and document **cascade** vs **orphan** behavior so support knows what disappears from dashboards, billing hooks, and exports.

> 🔧 **Guidance:** When you add user-visible **trash** or retention later, this section becomes the checklist for filters (`deleted_at` empty vs set), exports, and purge jobs — keep it updated as the source of truth.

## User-facing copy (optional — adopt when copy volume grows)

> 🔧 **Guidance:** Centralize product strings so landing, help, tours, and in-app UI stay aligned. ForgeTrail describes the **pattern**; each app implements modules and audit scripts under its own `$lib/content/` (or equivalent).

### Three layers

| Layer | Typical module | Owns |
| --- | --- | --- |
| Feature labels | `[productLabels].ts` | Canonical feature names for marketing, help, tours, nav |
| Cross-cutting UI | `[microcopy].ts` | Save failures, quota errors, shared toasts, connectivity banners |
| Surface modules | `[panelName]Copy.ts` | Panel intros, modals, wizard steps, section blurbs |

**Inline exceptions:** `Cancel`, `Save`, `Close` unless repeated 3+ times. **Legal pages:** one markdown file per page (`terms.md`, `privacy.md`) — not sharded into copy constants.

### Export and audits

| Script / prompt | Purpose |
| --- | --- |
| `pnpm export:copy` (or app equivalent) | Regenerate **prose** + **terms** catalogs for writers (`docs/internal/USER_FACING_COPY.*.md`) |
| `pnpm audit:copy` | Duplicate prose inside the export inventory |
| `pnpm audit:inline-copy` | AST scan of `.svelte`; backlog = UI prose **not** in export |
| `prompts/user-facing-content-sync-audit.md` | Feature discoverability across landing, help, tours |
| `prompts/microcopy-centralization.md` | Phased migration checklist and duplication policy |

**Pre-release target:** inline audit at **0 UI prose not in export**; sync audit passes for shipped features.

**Cursor rules:** `.cursor/rules/writing-voice.mdc` (voice, theme, and locale defaults), `.cursor/rules/user-facing-content.mdc` (no spec paths in UI).

## Feature Documentation

_One section per major feature area. Each section covers: what it does, how it works technically, API routes, and edge cases._

### [Feature Area 1]

**What it does:** [User-facing description]

**How it works:**
[Technical description of the flow. Include which files/services are involved.]

**API Routes:**

| Method          | Route      | Purpose        | Auth Required |
| --------------- | ---------- | -------------- | ------------- |
| [GET/POST/etc.] | [/api/...] | [what it does] | [yes/no]      |

**Edge Cases:**

- [Edge case]: [How it's handled]

**Known Limitations:**

- [Limitation]: [Why, and potential fix]

### [Feature Area 2]

_[Same structure as above]_

### [Calendar / scheduling exports (optional)]

> 🔧 **Guidance:** If users download **`.ics`** (or similar) for interviews, reminders, or deadlines, document **generation** (server vs client), **timezone** rules (floating vs UTC), **UID** stability across edits, and **routes** or handlers that serve the file. Note re-download behavior (duplicate events in some calendar apps).

**API Routes:**

| Method | Route | Purpose | Auth Required |
| ------ | ----- | ------- | ------------- |
| [GET] | [/api/.../events.ics] | [Build calendar payload] | [yes] |

### [User data export & portability (optional)]

> 🔧 **Guidance:** If you offer **self-service export** (ZIP, JSON, or bundled documents of user-owned records), document **scope** (included vs excluded collections), **inline vs async job** flow, **retention / rate limits**, and how exports interact with **deletion and data lifecycle** (see Data Model). PII-heavy bundles may need entitlement gates and audit notes.

**API Routes:**

| Method | Route | Purpose | Auth Required |
| ------ | ----- | ------- | ------------- |
| [POST] | [/api/user/export] | [Queue or return archive] | [yes] |

### [Structured eligibility / requirement fit (optional)]

> 🔧 **Guidance:** When postings or profiles carry **structured requirements** the product compares to user-declared status (education level, professional license, security clearance, work authorization, etc.), implement as a **repeatable shape** — not one-off strings per surface.

**Taxonomy module (shared client + server):**

- Ordered **requirement levels** + **flexibility** qualifiers (e.g. required / preferred / flexible; active / sponsorable).
- Separate **user status** type when profile values differ from job requirements (e.g. active vs inactive/lapsed).
- Type guards, `hardMismatch()`, optional `match()` for positive badges, `formatRequirement()` for Logistics rows.

**Data model:**

- Job/posting fields: `[domain]_requirement`, `[domain]_flexibility` (or JSON sub-object if multiple domains).
- User profile fields: `[domain]_status`, optional `[domain]_inactive_level`.
- PocketBase mappers **`pbJobToApp` / `appJobToPB` / user config** — include fields in **PATCH field maps** (easy to forget).

**Extraction pipeline:**

- Regex/heuristics on plain posting text first (context-gated patterns to avoid false positives).
- LLM extraction schema second; merge on import/refresh with regex fallback when LLM omits.
- Propagate on **metadata-only refresh** and **full posting refresh** branches.

**Surfaces (keep in sync):**

- Detail **Logistics** row; card **match/mismatch** badge; board **filter** predicate shared with `FilterBar` counts.
- **`buildCandidateProfileForFit`** (or equivalent) + **`build*ContextBlock`** in tailoring/prep/adapt prompts.
- Onboarding/profile select + optional **resume inference**; help topic.

**Edge cases:**

- `preferred` / `must_be_clearable` flexibilities should not trigger hard mismatch badges.
- Do not backfill legacy rows; populate on next import/refresh unless you run an explicit migration.

**API Routes:** document import, refresh, user config PATCH, and any prerequisite errors (`so we suggest X` → assertive voice).

## AI/LLM Integration

_If your app uses AI, document the integration patterns here. Record the Phase 1 **content-generation pattern** (runtime API, build-time seed, or BYO-LLM paste) and **provider** — including **local Ollama** when used (`OLLAMA_BASE_URL`, `OLLAMA_MODEL`; setup/test via ForgeTrail **`setup-ollama`** / **`test-ollama`**). Default local models: **Granite 4.1** or **Gemma 3** instruct — not reasoning/thinking models unless product requirements say otherwise._

### LLM Functions

| Function | Purpose             | Model   | Avg Tokens | Cost/Call |
| -------- | ------------------- | ------- | ---------- | --------- |
| [name]   | [what it generates] | [model] | [~N]       | [$X]      |

### Prompt Architecture

[How are prompts structured? What context is injected? What rules are enforced?]

> 💡 **Lesson learned:** Style rules (no em dashes, Oxford comma, active voice, etc.) are injected into ALL LLM prompts, not applied as post-processing. This produces better results than trying to fix output after generation.
>
> 💡 **Also:** When LLM output needs to fit into structured formats (DOCX, database fields), have the code own the structure and use the LLM only for content. Don't ask the LLM to generate find/replace pairs or structural markup.

> 💡 **Lesson learned:** **Fence untrusted content inside prompts.** Any text the app did not author — user input, scraped pages, uploaded documents, third-party API responses — is a **prompt-injection vector** ("ignore previous instructions and…"). Wrap every such value in a labeled delimiter block and prepend a standing guard instruction that says content inside the block is **data to analyze, never instructions to follow.** Keep the wrapping helper (and a shared `INJECTION_GUARD`-style constant) **internal to the one LLM module** so new prompt functions inherit the defense by construction rather than each author remembering it. **Why:** a model that obeys embedded directives can leak the system prompt or emit fabricated content that the user then submits under their own name — the highest-trust failure class for any AI product.

### Model selection and the provider choke point

[Document your model tiers, how a model is chosen per call, and the single module all model calls pass through.]

> 💡 **Lesson learned:** **Route every model call through one function and pick the tier by the value of the output.** A single `callLLM()`-style entry point is where provider switching (hosted vs local Ollama), usage logging, and response normalization live — features should never construct a provider client directly. Choose the model by what the output is worth: the **most capable/expensive** tier for extraction and anything the user submits as their own; a **mid** tier as the default workhorse; a **cheap/fast** tier for classification, retries, and recovery. Keep model ids in **config/constants**, never in function or route names (`callBigModel()` rots the day you change providers — see `.cursor/rules/api-naming` guidance). For user-facing actions, a small **fallback chain** that retries down the tiers on provider overload (429/503) beats hard-failing.
>
> 📝 **Example:** Read the **entire** response, not the first content block — providers can return reasoning/tool blocks before text, so `content[0]` intermittently yields "empty" output; concatenate all text blocks in the wrapper. Disable **extended/adaptive thinking** for JSON tasks (reasoning tokens can eat the output budget and return empty text). Treat a **blank model-name env var** as unset so `MODEL_X=` doesn't get passed into the API and rejected.

### Output Validation

[How do you validate LLM responses? What happens when the LLM returns malformed output?]

> 💡 **Lesson learned:** LLM JSON parsing with no runtime validation means missing fields propagate as incomplete objects. Always validate the shape of LLM responses before storing or displaying them.

> 💡 **Lesson learned:** **Verbatim-copy JSON** (resume/cover-letter upload, large structured transforms) fails when the model puts **literal newlines or tabs inside quoted strings** — `JSON.parse` throws `Bad control character in string literal` even when the payload is otherwise correct. **Defense in depth:** (1) prompt rule — escape `\\n` / `\\t` / `\\r` inside every string value; (2) shared **`parseJsonFromLlmOutput`** that tries strict parse first, then **`sanitizeJsonControlChars`** (string-aware escape of U+0000–U+001F only inside `"…"`) before retry; (3) route **all** verbatim-text mapping parsers through that helper, not raw `JSON.parse(stripCodeFence(…))`. Preserves candidate text instead of failing onboarding.

> 🔧 **Guidance:** Implement `sanitizeJsonControlChars` + `parseJsonFromLlmOutput` in a shared module (e.g. `lib/format.ts`). Unit-test a minimal broken payload: `{"bullets":["line one\nline two"]}`. Log parse failures with `server_failure_llm_parse` and return a **Support ID** on the upload route.

> 💡 **Lesson learned:** When an LLM assigns a numeric score or rank, always ask for a short textual justification in the same response. A bare number (e.g. "fit rank: 3/5") is opaque to users and useless for debugging prompt quality. A 1-2 sentence explanation ("Direct enterprise SaaS leadership maps to this VP role, but the ML research requirement is a gap") turns the score into actionable insight. Store the justification as a separate field so the UI can show it conditionally (gracefully hidden for older records that predate the field), and include concrete prompt guidance like "reference specific alignment or gaps" so the LLM produces useful text, not generic filler.
>
> 📝 **Example:** A job-fit scoring prompt originally asked for `fitRank: 1-5`. Adding `fitJustification: 1-2 sentence explanation referencing specific alignment or gaps` required a full-stack field addition (type definition → database mapping → schema migration → API route → UI display) but immediately made the feature comprehensible to users.

> 💡 **Lesson learned:** **Treat HTTP responses from long-running generation routes as untyped until validated.** Clients polling or awaiting dossiers, multi-section briefs, or chained LLM pipelines must handle **`application/json` failures**, **`text/html` error pages**, and empty bodies from gateways — parse safely (`Content-Type` check or read-as-text then `JSON.parse` inside try/catch) before assigning to UI models. Prefer **`Accept: application/json`** on clients and return structured `{ message, code?, correlationId? }` from your routes when upstream failures occur so UX stays consistent with progressive-import reconcile paths.

### AI-generated section lifecycle (multi-surface records)

> 🔧 **Guidance:** When one primary entity has **several distinct LLM outputs** (e.g. alignment brief, company dossier, personalized resonance, document transformation), document:
>
> - **Routes and persistence** per output type (separate fields or documents — do not overwrite Lens A when regenerating Lens B).
> - **Phase UI** shared across surfaces: empty CTA, generating (button spinner and/or staged progress), ready, stale-with-refresh.
> - **Staleness detection:** server-side input hash (or explicit version) compared at read time; client shows a non-blocking stale banner — **no auto-regen** on input change.
> - **Vocabulary module** for shared refresh labels and stale message structure; per-surface generate-verbs only where voice differs.
>
> See **`DESIGN_SYSTEM.md` → AI-generated section lifecycle** and **`TEST_PLAN.md` §7.4f** for manual checks.

### LLM Usage Tracking

[How do you track and audit LLM usage? Two concerns: cost visibility (admin) and limit enforcement (user).]

> 💡 **Lesson learned:** Two-layer LLM tracking architecture:
>
> Layer 1 — Token-level logging (cost visibility):
> - Log every LLM API call to a `llm_usage` collection with: input_tokens, output_tokens, model, cost_estimate, duration_ms, operation_name, user_id.
> - The centralized `callLLM()` function reads a global tracking context (set by each API route via `setLLMTrackingContext()`) and logs automatically after each response.
> - Surfaces on an admin dashboard for cost analysis.
>
> Layer 2 — Feature-level counters (limit enforcement):
> - Integer fields on the user record (e.g., `ai_tailoring_count`, `ai_prep_count`) incremented by `incrementCounter()`.
> - Gated by `checkLimit()` which compares against `PLAN_LIMITS[plan][counter]`.
> - Reset on a 30-day rolling window.
> - Uses PocketBase atomic increment syntax (`{ 'counter+': 1 }`) to prevent race conditions.
>
> Bridge: The API route calls `setLLMTrackingContext()` at the top, then `checkLimit()` for entitlement enforcement. After a successful LLM call, it calls `incrementCounter()`. The `callLLM()` function handles Layer 1 automatically.
>
> Audit methodology: Periodically inventory ALL routes that call `callLLM()` and check:
> 1. Does the route set tracking context? (If not, token usage is silently lost)
> 2. Does the route call `checkLimit()`? (If not, the operation is unmetered)
> 3. Does the route call `incrementCounter()` after success? (If not, usage isn't counted)
> Create a table of all routes with their tracking status. Routes with token logging but no feature counter are the most dangerous — they cost money but don't count against limits.

### Content Refresh from External Sources

[If your app imports content from external URLs, how does it handle stale/changed/deleted content?]

> 💡 **Lesson learned:** Re-fetch pattern for imported content:
>
> 1. Eligible items: Only items in early pipeline statuses (e.g., "backlog", "draft"). Items in later stages (submitted, active) have already been acted on — refreshing the source is less actionable.
> 2. Re-scrape using the same pipeline as initial import (fallback chain: fetch → headless browser → third-party extraction API).
> 3. Detect closed/removed status via: HTTP 404/410, redirect to generic page, regex patterns for known "closed" phrases across major platforms, content below minimum length threshold.
> 4. Compare new content to stored content to detect changes. Surface a diff summary (LLM-generated or structural).
> 5. Return a typed result: `{ status: 'open' | 'closed' | 'changed' | 'unchanged' | 'unreachable', ...details }`.
> 6. UI: Button per item (not batch). Show result inline. If closed, offer to update status. If changed, offer to re-process.

### URL import: paywalls and bot interstitials

[If your app creates records from external URLs — job postings, listings, articles — document how you handle unusable responses.]

> 💡 **Lesson learned:** The same URL pipeline used for **re-scrape** applies to **first-time import**: many sites return HTML shells (sign-in required, apply-only view, rate limit, or bot challenge) to automated clients. Heuristics should include marker strings, minimum extracted text length, and structural checks (e.g. absence of job-title/description blocks). On failure, respond with a **typed outcome** the UI can explain — not a generic 500 — and never write placeholder HTML into the user's record as if it were the real content. Optional: track a "blocked / paywall suspected" flag for support and product analytics.

### URL import: deterministic extractors vs markup drift (and optional LLM recover)

[When **Cheerio**, **domain-specific parsers**, or **structured-data** extraction pull **title/metadata** from HTML but the **main body** parses empty because the host **changed DOM** (new ATS layout, renamed containers, alternate subdomain).]

> 💡 **Lesson learned:** **Treat “fetch succeeded, parse yielded nothing” separately from “wrong URL.”** The server may return 200 and a large HTML document while your selectors no longer match the description root — users paste a correct listing link and still see failure. **Why:** Blaming the URL trains mistrust; support burns on false negatives.
>
> **Pattern:** Keep a **layered pipeline** (fast HTTP fetch → headless browser if needed → optional third-party or residential fetch for bot-hostile hosts). Prefer **updating selectors** or adding **host-specific branches** when one board pattern is known. When all deterministic stages still produce **below-minimum body text** but you retained a **large raw HTML snapshot**, an optional **single** structured extract via your **small/cheap LLM** on **plain text derived from that HTML** can recover — only as a **last resort before throwing**, with **verbatim-from-source** prompt rules, **JSON validation**, and the same **minimum length** gate. Provide an **env opt-out** so operators can disable the path for cost or policy.
>
> **Observability:** Record **per-stage diagnostics** (e.g. fetch vs browser vs recover; approximate description length) for support bundles — without logging full HTML in analytics.
>
> 🔧 **Guidance:** Capture shipped behavior in a **delivery spec** (`specs/partial/` until deferred observability or tests are done); link from backlog (`TODO.md`). Full ForgeTrail methodology also mirrors scrape/import resilience for Lite-only projects in **`content/FORGETRAIL_LITE.md`** §7.2.

### Multi-record URL import (bulk paste / spreadsheet)

[If users can add **many** external URLs or CSV rows in one operation — jobs, listings, bookmarks — document how it differs from single import.]

> 💡 **Lesson learned:** **Preview and confirm** before firing N expensive fetches. Parse client- or server-side with a **row cap**; dedupe using the **same URL normalization** as `POST` handlers (tracking params, host casing, trailing slashes) so preview matches server duplicate behavior. Each accepted row should pass the **same** entitlement, rate-limit, and duplicate checks as a one-off import — batch UX must not become a bypass. **Progressive pipeline:** Prefer the same **stub → finalize** (or equivalent) two-phase pattern as single import so the UI shows partial records immediately and enrichment finishes asynchronously. Optional **batch / lite finalize** flag: skip or defer noisy automatic follow-ups (e.g. secondary LLM alignment) while still running trust/extraction steps you rely on for data quality. **Hints from files:** After server extract, merge user-supplied columns (status, tags, labels) with a PATCH or dedicated merge rule so spreadsheet metadata isn't silently discarded. **Observability:** Emit **aggregate** analytics (started/completed counts, errors, skips) — avoid PII in event payloads. **CSV symmetry:** If you export a spreadsheet for backup, align **header order and row cell order**; misaligned exports make re-import mapping look "random" and erode trust.

### URL import: extraction hints and required-field merge

[If **enrichment** or **finalize** merges LLM output into records that already have stub or scrape metadata — especially when the BaaS marks fields **required**.]

> 💡 **Lesson learned:** **Pass structured hints into extraction, and merge defensively.**
>
> 1. **Hints:** After the initial fetch/scrape, you often know title, employer/site name, or canonical listing id from the page header, JSON-LD, OpenGraph, or URL path — even when the **body text** omits the employer (common on job boards). Feed those hints into the second-phase extraction prompt (or parallel structured parser) so the model is not forced to invent or leave fields empty.
> 2. **Required fields:** When applying LLM JSON to an existing row, treat **empty strings** and obvious **placeholder** tokens as “no new information.” Fall back to the stub value, the hint, or a small resolver (e.g. match company by hostname) instead of overwriting. **Why:** A blank model field should not clear a PocketBase (or similar) **required** relation/string that was already satisfied at stub time — users see validation errors or broken lists after a “successful” import.
> 3. **Normalization:** Use the **same** URL normalization for dedupe, fetch, and re-scrape (tracking query params stripped, stable path for platforms that embed ids in the path). See duplicate-detection patterns in **`docs/CONTEXT_PROMPT.md`**.

### URL import: client reconciliation after multi-step finalize

[When **stub → finalize** (or similar) runs as **more than one HTTP round-trip** from the browser — modal add, discovery batch, onboarding — and the UI must stay consistent if the second request misbehaves.]

> 💡 **Lesson learned:** **Do not treat a failed or unreadable finalize response as the source of truth for terminal state.** The server may already have completed enrichment while the client sees a network error, non-JSON body, or timeout. **Why:** Users end up with a half-updated card, stuck progress, or no toast while dedupe still blocks a retry — support cannot see what the user sees.
>
> **Pattern:** After finalize returns an error or unusable JSON, **GET the record by id** (or a small “status” endpoint) and merge the **authoritative** fields the UI needs (e.g. import/enrichment flags, title, error state). Strip bulky sidecars from the payload if your read API includes logs or relation blobs not meant for list merge. If the record is **terminal** (success or failed), drive the same completion/failure handlers you would have run on a clean finalize JSON so every surface (main add flow, suggestions, bulk) stays consistent.
>
> **Surfaces:** Any code path that calls stub then finalize **separately** needs the same **failure / merge** callback wiring as the primary add flow — not only the happy path. Use **safe JSON parsing** (e.g. `.json().catch(() => ({}))`) on both steps so a bad body does not throw past your error UI after the user has already dismissed a modal.

### Stored workflow enums and filter surfaces

[When records use **status**, **stage**, or **column** values that power **boards**, **search**, and **deduplication**.]

> 💡 **Lesson learned:** **Normalize at the data boundary before UI filters.** Legacy rows, imports, or one-off writes can leave **empty** or **deprecated** enum values that match **no** visible column or filter bucket. The same row may still **dedupe** against new adds — producing “ghost” cards, count mismatches (“showing N of M”), and search that cannot find the item. Map unknown/empty values to a **defined** internal key (or a dedicated “inbox / needs triage” column) in one mapper used by list, detail, and board views.
>
> 🔧 **Guidance:** Document the canonical set of keys, where normalization runs (BaaS hook, server mapper, or client store), and how migrations or backfills handle legacy values.

### Imported record: apply URL vs discovery URL

[When listings can carry **two URLs** — where the user **applies** or reads the official posting vs where they **discovered** the lead (board, aggregator, email).]

> 💡 **Lesson learned:** **Store both when the product needs them.** Application or ATS links differ from “where I found this” links; users need one-click access to each for different tasks. **Dedupe and normalization** should define which URL is canonical for identity (often the stable employer/ATS listing) vs which is diagnostic metadata.
>
> 🔧 **Guidance:** Document field names, which URL feeds **re-scrape** / refresh, how exports and **CSV** include both without column drift, and how the UI labels them so buyers are not confused.

### Posting body upgrade (additive merge)

[When users **paste**, **upload**, or **fetch** a richer job/posting body **after** an initial import — e.g. employer career site vs thin board snippet.]

> 💡 **Lesson learned:** **Prefer additive merge with preview/confirm.** Overwriting the whole record from a second pass can destroy user edits, connection notes, or status. Merge new fields **only where the incoming payload is strictly stronger**; keep explicit **fallback extraction** from plain text when structured panels omit salary, location, or work arrangement.
>
> 🔧 **Guidance:** List preview and confirm routes, merge rules, idempotency if the user retries, and how this path shares enrichment with **URL import** pipelines.

### AI-assisted tailoring: in-tab critique and structural controls

[When tailoring a document to a target (job, role, school) goes beyond **one-shot generate** — **quality review**, **heuristic catalog**, **user-approved actions**, **structural adjustments** (e.g. reorder for narrative flow), **persistence per target**.]

> 💡 **Lesson learned:** **Treat critique and structure as first-class persisted state**, not ephemeral chat. Results should survive **tab switches** and reloads; approvals should bind to the **specific artifact + target pair**. If **optional AI providers or keys** are missing, finish in a **terminal state** with clear UX — not an infinite “still working” placeholder.
>
> 💡 **Lesson learned:** **Base cover-letter templates** for emailed or attached DOCX should omit legacy mailed-letter headers (`[City, State]`, employer street address blocks unless the product truly mails letters). Those lines are often marked “fixed” in find/replace tailoring and leak through as untailored placeholders. Audit the stored base doc and any “protected template spans” list when users report leftover bracket text.
>
> 🔧 **Guidance:** Document collections/fields for critique output, versioning or timestamps, `/api/` routes, and where the same **quality rules** apply across surfaces (e.g. base doc editor vs role-specific tab) so signals stay aligned.

### Factual grounding and programmatic veracity checks on tailored outputs

[When generating tailored artifacts (cover letters, statements of interest, custom pitches) that must represent the user truthfully, implementing **factual grounding** (passing the full source document in the prompt) and a **programmatic veracity pass** (a post-generation audit) to catch fabrications, hallucinated metrics, or mis-attributed achievements.]

> 💡 **Lesson learned:** **Never tailor in a vacuum.** If the user has a source document of record (e.g. a base resume), always pass its full verbatim text directly in the tailoring prompt as the *only* source of truth for candidate facts. Relying on lossy summaries or profile blocks invites the LLM to invent technologies, metrics, or past roles to match the target description.
>
> 💡 **Lesson learned:** **Implement a programmatic veracity pass as an automated safety net.** Run a fast, cheap semantic audit (using a smaller model) immediately after generation. Compare the drafted paragraphs against the source document to flag ungrounded claims. Surfacing these issues in the UI with exact excerpts, clear reasons, and suggested repairs provides a robust, human-in-the-loop safety net before the user treats the output as final.
>
> 🔧 **Guidance:** Document the veracity check schema, how results are persisted on the target record, `/api/` routes for generation and dismissal, and the UI components used to display grounding gaps to the user.

### Anti-self-importance and position-of-strength tone controls

[When generating outbound documents (cover letters, statements of interest, custom pitches) representing the user, implementing strict tone and posture controls to prevent grandiose, visionary, or striving registers from leaking into the output.]

> 💡 **Lesson learned:** **Filter out rhetorical scaffolding and self-narration.** Avoid letting the model tell the reader how to interpret the user's career or label their experiences as "chapters," "milestones," or "my range." Let the facts of what they built carry the weight directly.
>
> 💡 **Lesson learned:** **Ban clever, self-authored aphorisms and insider-coded observations.** Do not include philosophical observations about what the work "really requires" or "depends on" (e.g., "reading across teams as much as on the code," "where the margin for architectural guesswork was low," or "at the pace an enterprise sales cycle sets").
>
> 💡 **Lesson learned:** **Enforce a "position of strength" posture.** Ensure the generated text does not mirror the job description as proof of fit, deliver maxims/theses as quotable wisdom, brand ordinary habits as named methods, or use striving/grind vocabulary.
>
> 🔧 **Guidance:** Document how tone and posture guidelines are injected into the prompts, the specific anti-patterns banned, and how to validate generated text against these rules (e.g., using a programmatic LLM audit pass during development or as a post-generation safety net).

### Persistent contextual assistant (dock, rail, or side panel)

[When the product embeds a **long-lived AI or copilot surface** alongside the main workflow — not only one-off modals — scoped to a **selected record** or page context.]

> 💡 **Lesson learned:** Treat the assistant as **integrated shell state**: which record (or nothing) it is bound to, how it survives **panel open/close**, **resize**, and **navigation**, and how **streaming** partial tokens interact with layout and focus. **Entitlements and rate limits** should match other LLM entry points; avoid a second-class code path that bypasses metering or observability.
>
> 🔧 **Guidance:** Document routes for turns/messages, compaction or thread limits, archive/history, injection safety boundaries, and **capability-based** API names (see project **api-naming** rules). Optional: feature flags for rollout.

### Companion lenses on a primary record (multi-tab analysis)

[When one **entity** (deal, ticket, job application, candidate, project) supports **more than one analytic or generative “view”** on the same underlying data — e.g. fit vs motivation, summary vs risk checklist — each with **its own persisted output**.]

> 💡 **Lesson learned:** **Avoid one blob that tries to do everything.** Separate **lens identity** in the data model (or versioned sub-documents) so regen, export, and assistant prompts do not overwrite unrelated content. **Reuse** shared inputs (base description, scores) but **do not** silently duplicate conflicting LLM narratives in the same UI without clear labels.
>
> 🔧 **Guidance:** List tab or sub-route names, persistence keys, regen actions, inclusion in **ZIP/exports**, and how the in-app assistant references each lens.

### User-visible external identity URLs (professional / social profile links)

[When you store **URLs** that point at the user or a contact on a **third-party identity surface** — professional network, code host, portfolio — for display, deep links, or prompt context.]

> 💡 **Lesson learned:** **Normalize and validate** URLs on write (scheme, host policy if you need one). Prefer **storing canonical form** for display and dedupe; never leak raw tokens in analytics. In **exports**, decide whether these fields are **PII** — document opt-out or redaction for shared bundles.
>
> 🔧 **Guidance:** Fields on which collection, UI entry points (profile tab, settings, modal), and how imports (e.g. paste from address bar) map to the same normalizer as manual edit.

### User intent profile (direction, goals) driving discovery and artifacts

[If the app stores a **north-star profile** — career direction, priorities, constraints — that powers recommendations, search, or multiple **variants** of a core artifact, document it as its own feature area.]

> 💡 **Lesson learned:** **Treat the intent profile as first-class data**, not ephemeral UI state. Downstream surfaces (discovery panels, board filters, tailored exports, “variant” records) should **read the same structured fields** with explicit invalidation when the profile changes. If users edit in **multiple modes** (structured sections vs free text), define how those views sync and which is canonical for server routes. Document **which API handlers and jobs consume which fields** so refactors don’t leave half the app on a stale shape.

> 🔧 **Guidance:** List collections/fields, routes that mutate the profile, and how **discovery results** enter the **same create/import pipeline** as manual entry (entitlements, duplicates, telemetry). See **`docs/CONTEXT_PROMPT.md` → Patterns to Follow** for discovery → import parity.

### Branded discovery hub and navigation elevation (optional)

[When a **named discovery** capability lives primarily inside a multi-tab panel but you also expose it from **top-level navigation**, marketing, or help as a first-class entry.]

> 💡 **Lesson learned:** **Burying discovery behind an unrelated parent label** trains users to hunt; **elevating** it often does not require a new route — a nav item or CTA that **deep-opens the existing panel and tab** is enough. The fragile part is **message parity**: if you introduce a **branded name** in marketing, every surface that references the workflow (About, Help, tours, onboarding, tab labels) must use the same name or explicitly say where the feature lives. Otherwise users believe something is "missing."

> 🔧 **Guidance:** Document client actions or routes that open the **same panel + tab** from the main menu, help "open panel" hooks, and tour effects. After IA or renaming passes, run the project's copy of **`user-facing-content-sync-audit.md`** (or equivalent) so landing and in-app story stay aligned.

### Optional: LLM vendor browsing tools (web search / fetch)

[If you integrate **hosted** search or fetch tools exposed by your LLM provider — distinct from your own scrape or third-party search API — document when they are primary vs fallback, cost/latency tradeoffs, and how results feed **URL import** or research records.]

> 🔧 **Guidance:** List feature flags or env toggles, adapters, rate limits, and merge rules with existing pipelines. Keep **capability-based** names in exported APIs and routes; treat vendor product names as configuration details.

> 💡 **Lesson learned:** **Prefer structured fallbacks.** When the vendor tool is unavailable, over budget, or returns thin results, your app should degrade to the existing fetch/scrape path (or a clear "could not retrieve" state) — not a silent empty UX.

### Trust or plausibility checks on imported external content

[If you run heuristics, rules, or LLM audits on records created from URLs — job postings, listings, articles — document inputs, outputs, and how warnings map to the UI.]

> 💡 **Lesson learned:** **When structured signals exist, use them before inferring from loose text.** If the source exposes machine-readable comp (JSON-LD salary, OpenGraph, native pay-range UI, schema fields), parse and **prefer those** for severity. Mixed signals (vague prose but a concrete structured range) should **not** surface “unknown pay” or “truncated” at high severity — users read that as a product bug. **Why:** Trust features erode confidence faster than no feature when they contradict what users see on the source page.

### Record-level activity / event timeline (optional)

[If a primary entity (record, ticket, listing) accumulates user actions, AI decisions, or external signals over time — document the event model, creation paths, and UI surface.]

> 🔧 **Guidance:** Consider a **per-entity event log** when the primary record accumulates meaningful status changes, communications, AI-generated outputs, or user reflections over days or weeks. The model is typically an append-mostly child collection (parent relation, `type` enum, `timestamp`, `body`, optional `metadata` JSON). Key design decisions to document:
>
> - **Creation paths:** Manual log entry, automatic system events on status change, inline "quick log" from reminder or dashboard surfaces, AI-suggested triage notes.
> - **Event types:** Define an enum or union (`note`, `status_change`, `communication`, `ai_triage`, `milestone`, `reminder_action`) — breadth grows over time; plan for extensibility.
> - **AI-generated entries:** When an AI agent produces triage notes, action items, or summaries from entity context, store the output as a timeline event (not loose entity fields) so the user can review, edit, or discard it alongside their own notes. Mark AI-generated entries distinctly in the UI.
> - **Deduplication:** Guard against duplicate event creation from optimistic UI + server hooks firing on the same action (e.g., a status-change hook **and** an explicit client POST).
> - **Rendering:** Markdown or structured body; open external links in new tabs; consider grouping by date.
> - **Inline editing:** Quick-log and full-form affordances; forms should be vertically dense (consolidated field rows) to avoid pushing the existing timeline off-screen.

### Demo Mode

[If your app needs demo capabilities, how do you create demo-safe content?]

> 💡 **Lesson learned:** Two components for effective demos:
>
> 1. Content anonymization: LLM-powered tool that takes real content (e.g., a resume DOCX) and produces a new version with all identifying information replaced but professional substance preserved. The LLM generates a JSON replacement map (`{find: "real text", replace: "anonymized text"}`), then existing document manipulation code applies the replacements. This preserves formatting exactly — the LLM doesn't rewrite the document, it maps substitutions. Apply replacements longest-string-first to prevent partial matches.
>
> 2. Quick-access links: Pre-configured links to external sources (job boards, search results) with dynamic query parameters built from demo-account metadata (tags, role types, locations). One click opens a live, current results page ready for URL-grabbing during demos. Beats hunting for listings mid-demo.
>
> Both features live behind admin-only access. The anonymizer is a one-time prep tool, not a runtime feature.

## Configuration

### Environment Variables

| Variable | Required | Default             | Description        |
| -------- | -------- | ------------------- | ------------------ |
| [VAR]    | [yes/no] | [default or "none"] | [what it controls] |

Optional — **app-owned transactional email** (welcome, security notices, billing receipts) sent from your server via a provider HTTP API (e.g. Resend, Postmark):

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `[PROVIDER]_API_KEY` | If sending | Server-only API key for the email provider. |
| `EMAIL_FROM` | With API key | Full From header (e.g. `[Product] <notifications@[domain]>`). |
| `EMAIL_REPLY_TO` | No | Reply-To when support should not use the From address. |

> 💡 **Lesson learned:** **Split “BaaS/auth email” from “app-owned email.”** Many stacks use the database or auth service’s **built-in SMTP** only for password reset and verification. Product mail (welcome, payment failed, password changed) should go through **one server module** (templates + shared layout + provider client) so subjects, footers, and failure logging stay consistent. **Webhook- or cron-triggered** sends should accept an **idempotency key** (provider header or internal dedupe) so retries don’t spam users.

> 💡 **Lesson learned:** When API key or From is **unset**, prefer a **silent no-op** for non-critical mail (log at debug / structured failure channel) rather than failing the user’s primary action — unless the message is legally required for the step to count as complete.

### Startup Validation

[What does the app check on startup? What fails gracefully vs. hard-fails?]

> 💡 **Lesson learned:** The app works without an LLM API key (graceful degradation). Scraping still works; just no AI-powered enrichment. This pattern is valuable for development and testing.

### Service base URLs (HTTPS and ports)

When constructing the base URL for a BaaS client, API gateway, or database SDK from environment variables (e.g. separate `HOST` and `PORT` with a default for local dev), **treat `https://` origins as authoritative**: if the configured URL already resolves to an origin on the standard HTTPS port, do not concatenate an extra port segment from a dev-default variable. **Why:** Requests to `[https host]:[wrong port]` fail TLS negotiation; failures often appear as generic fetch or SDK errors rather than “fix your `.env`.” Document which modes append ports (local HTTP) vs. which use the URL as-is (production HTTPS).

## File/Document Pipeline

_If your app processes files (upload, transform, export), document the pipeline here._

### Upload Flow

[How files get into the system]

### Processing/Transformation

[What happens to files after upload]

> 💡 **Lesson learned:** **Centralize file text-extraction parsing behind a dedicated server library wrapper (e.g., `pbFiles.ts`).** Avoid importing third-party parsing packages (such as `mammoth`, `pdf-parse`, or other document extractors) directly inside individual route endpoints. Instead, define clean extractor helper functions (such as `extractTextFromPdfBuffer(buffer)`) inside a server utility layer. Let these helper methods encapsulate lazy imports of their underlying packages (to keep server startup light) and contain common edge cases (such as catching `PasswordException` or invalid buffers). This prevents duplicate package initializations and ensures a single point of maintenance for third-party parser integrations.

### Output/Export

[How files leave the system]

> 💡 **Lesson learned:** **Headless office conversion (e.g. LibreOffice `soffice` for DOCX→PDF or similar):** Point the process at a **dedicated writable user/profile directory** per job or worker (via env such as `HOME` or the suite’s user-installation flag) so concurrent exports don’t trample the same cache. **Install fonts** on the conversion host if users rely on non-core typefaces — otherwise substituted metrics change pagination. Capture **stdout/stderr** with request correlation; failures often only appear under parallelism or cold start.
>
> 💡 **Lesson learned:** When writing files that might be open in another application (e.g., Word), detect the lock error and create versioned copies (filename-v2, v3) instead of failing. Simple, but prevents a class of support tickets.
>
> 💡 **Lesson learned:** **Programmatic DOCX from markdown-ish strings** (headings, bullets, `**bold**`, `_italic_`, optional line-prefix centering): if you split on `**bold**` *before* resolving outer `_…_` (or guarded `*…*`) emphasis, lines like `_See **Settings → Profile** in the app._` break — the underscores end up in different segments and show **literally** in Word. **Peel** whole-line underscore wrappers first (inner must not contain stray `_`), then apply bold splits with a shared italic flag; for `*…*`, avoid treating `*a* and *b*` as one span (skip peel when the inner slice contains a lone `*`). Same pipeline applies to any OOXML builder that tokenizes markdown-lite inline.
>
> 💡 **Lesson learned:** **User-supplied long context for LLM** (pasted job text, extra profile notes, supplementary files): enforce a **documented max length** (characters or tokens) at validation time; show remaining budget in the UI. WHY: Caps cost, reduces truncation surprises, and keeps prompts within model context. Pair with clear empty-state copy when users hit the limit.
>
> 💡 **Lesson learned:** **Feature flags** for gradual rollout: store a small JSON object on the user or a global settings record (`{ flagName: true }`), hydrate into session or a reactive store on load, and gate **both** server handlers and client routes. WHY: Ship dark features to internal accounts without branch drift; admin UI optional early on.
>
> 💡 **Lesson learned:** **Template / document transformation history** (optional): append-only rows per user for major events — upload, AI transformation, manual save — with timestamps, optional excerpt or diagnosis text, and pointers to stored files. Distinct from raw file storage; supports “what changed when?” in support, compliance, and **export packages** without full VCS.

## Multi-User / Auth

_If applicable._

### Auth Flow

[How users authenticate. OAuth providers, session management, cookie configuration.]

### Authorization Model

[Who can see/do what. How permissions are checked.]

> 💡 **Lesson learned:** Distinguish between authenticated identity (who you are) and data ownership (whose data you're viewing). Cookie-based delegation allows advisors to manage client data without impersonating them. This distinction is subtle but critical for permission logic.
>
> 💡 **Lesson learned:** Multi-tier delegation access control:
>
> 1. Define access levels as an enum or union type: 'full' | 'collaborator' | 'viewer' (or similar).
>    - full: Can do everything the owner can, including managing other delegates.
>    - collaborator: Can create, edit, and delete records. Cannot manage team or billing.
>    - viewer: Read-only access. Can view all data but not modify anything.
>
> 2. Store delegation records in a dedicated collection: { owner, delegate, accessLevel, grantedAt }.
>    Each record represents "user X can access user Y's data at level Z."
>
> 3. Create a server-side helper: getActiveUserId(request) that checks:
>    a. Is there a delegation cookie? If so, return the delegated user's ID (not the logged-in user's ID).
>    b. Otherwise, return the logged-in user's ID.
>    All data-fetching routes use this — they operate on the "active" user, not necessarily the authenticated user.
>
> 4. Create a permission check helper: canPerformAction(request, requiredLevel) that:
>    a. If no delegation is active, the user is the owner — allow everything.
>    b. If delegation is active, look up the delegate's access level and compare against requiredLevel.
>    c. Use a numeric hierarchy (viewer=1, collaborator=2, full=3) so checks are simple comparisons.
>
> 5. Protect sensitive routes explicitly:
>    - Billing/subscription routes: owner only (no delegation).
>    - Team management routes: full access only.
>    - Data modification routes: collaborator or above.
>    - Read routes: any access level.
>
> 6. Anti-pattern: Don't check delegation in every route individually. Centralize it in getActiveUserId() and canPerformAction(), then call those helpers. Scattered inline checks lead to inconsistency and missed routes.

### Gated Server-Side Proxies for Private Edge Services (Admin-Only)

[If the system integrates private edge/node services (e.g. specialized crawlers, residential proxies, internal queues) that are protected behind firewall boundaries (such as a mesh VPN/Tailscale) or require unauthenticated endpoints to be proxied to administrative dashboards, document the security proxy pattern here.]

> 💡 **Lesson learned:** **Never expose raw edge service credentials or unauthenticated health URLs to the client browser.** Instead, route admin-only dashboard requests through a gated server-side API proxy (e.g., `GET /api/admin/[service]-health`). On this server route:
> 1. Enforce strict admin session verification first (e.g., `requireAdmin(locals)`).
> 2. Fetch from the private edge node (using a short timeout like 10s to prevent hanging).
> 3. Inject sensitive tokens (such as `[SERVICE]_TOKEN`) entirely on the server-side, returning only sanitized status, version, and queue depths to the client.
> 4. Resolve connection hints (e.g., stripping passwords/hosts from connection strings) to keep internal network topography hidden from the browser.

## Billing / Entitlements

_If applicable. Fill in during Phase 7._

### Tier Enforcement

[How are tier limits checked? Which routes enforce limits?]

> 💡 **Lesson learned:** Entitlement enforcement architecture:
>
> 1. Create a shared entitlements module ($lib/server/entitlements.ts) with a PLAN_LIMITS constant:
>    - Keys: plan names (e.g., 'starter', 'pro', 'hold', 'expired')
>    - Values: objects mapping counter names to numeric limits (0 = blocked, 999 = unlimited)
>    - Export helpers: getEffectivePlan(user), checkLimit(user, counter), incrementCounter(user, counter)
>
> 2. checkLimit() does TWO things atomically: verifies the user hasn't exceeded their limit AND returns the current count.
>    - Use 30-day rolling windows for usage counters (not calendar month). Calculate: count records where created >= 30 days ago.
>    - Return a structured response: { allowed: boolean, current: number, limit: number, plan: string }
>    - When blocked, return a 402 with a limitReachedBody() that includes the plan name and a message tailored to the plan state (expired vs. hold vs. standard limit-reached).
>
> 3. incrementCounter() creates a usage record AFTER the action succeeds (not before). If the action fails, the counter shouldn't increment.
>
> 4. Import and call checkLimit() at the TOP of every paid/gated API route handler. Don't scatter limit checks inside business logic.
>
> 5. Client-side entitlements: Expose plan + limits via the root layout server load. Create a reactive entitlements store that derives isExpired, isHold, isPaid, and per-counter remaining counts. Components read from this store to show inline usage badges and gate UI elements — but client-side checks are UX only, never security.
>
> 💡 **Lesson learned:** Naming plan-tier numerics and shared policy limits:
>
> 1. Define per-tier limits as **named constants** in a dedicated module, then assemble `PLAN_LIMITS` (or equivalent) from those names — readable diffs and easy grep when pricing changes.
> 2. Keep trial length, usage-period length, trial-specific download/export caps, and HTTP rate limits in **separate small modules**; import from one source in entitlements, hooks, and gated API routes.
> 3. Use a single **milliseconds-per-day** (or your stack’s shared helper) for all “N days from now” math, including usage-period rollover and trial remaining days.
> 4. Plain Node setup scripts that cannot import your TS modules may **duplicate the integers** with a one-line comment: must match the canonical `[path]` — so changes are intentional, not forgotten.
>
> 💡 **Lesson learned:** Implementing a "Hold" or "Pause" tier alongside standard paid tiers:
>
> 1. Add the hold tier to your PLAN_LIMITS with 0 for all action counters but a HIGH maxItems value (e.g., 999). The high item limit preserves the user's existing data; the zero action limits block all expensive operations.
> 2. Add a dedicated `isHoldPlan(user)` helper. Use it for creation-blocking checks (e.g., "can add new item?") because the limit-based check alone won't catch it — maxItems is intentionally high.
> 3. The hold tier uses the same Stripe product/price/webhook plumbing as every other tier. No special Stripe logic needed — just another price ID mapped in `priceIdToPlan()`.
> 4. For `limitReachedBody()` (the 402 error response), check the plan and return a hold-specific message ("Your account is paused. Resume to use this feature.") instead of the generic limit-reached wording. The client can then render contextual upgrade UI based on the plan field.
> 5. Counter resets still run for hold users (harmless). When they resume to a paid plan via Stripe Checkout, the checkout webhook sets the new plan and resets counters normally.
>
> 💡 **Lesson learned:** Replacing "free tier" with "expired" state:
>
> 1. After trial ends, `getEffectivePlan()` returns `'expired'` (not `'free'`). The expired tier has ALL limits at 0 — no AI features, no new item creation.
> 2. `limitReachedBody()` needs 3-way messaging: hold ("Account paused"), expired ("Trial ended — subscribe or hold to preserve data"), standard limit-reached ("Upgrade for more").
> 3. Webhook `subscription.deleted` sets plan to `'expired'`, not `'free'`. Same for `priceIdToPlan()` fallback.
> 4. Client-side: add `isExpired` getter alongside `isHold`, `isPaid`. BillingSection shows red banner for expired, amber for hold.
> 5. Data retention window (e.g., 30 days) after expiration before archival. Hold ($10/mo) is the only path to indefinite data preservation without a full subscription.
>
> 💡 **Lesson learned:** Inline usage visibility (UsageBadge pattern):
>
> 1. Create a reusable component that shows "X / Y" usage counts inline near each feature's trigger (button, section header).
> 2. Component takes a counter name, derives current usage and max limit from the reactive entitlements store.
> 3. Color coding: muted (normal), amber (≥70%), red (at limit or blocked). Hidden when unlimited (≥999).
> 4. At max=0 (expired/hold): show "Subscribe to unlock" link to billing. At limit: show "X/Y — Upgrade" link. Normal: plain "X/Y".
> 5. Place badges next to EVERY feature gated by plan limits — users should never be surprised by a 402 error.

### Stripe Integration

[Products, prices, webhooks, customer portal. How the payment flow works end to end.]

### Dynamic Pricing

> 💡 **Lesson learned:** Display prices should come from Stripe, not hardcoded strings. Pattern:
> 1. Server-side module calls stripe.prices.retrieve() for each price ID, caches results (1 hour TTL)
> 2. Root layout server load includes pricing in returned data
> 3. Components read prices from page data ($page.data.pricing or data.pricing)
> 4. Fallback values in components handle Stripe-unreachable gracefully
>
> This means changing prices in Stripe Dashboard propagates to the app within the cache TTL, no redeploy needed.

[How are display prices fetched and cached? Where do components get price data?]

## Promo Code System

_If your app supports promotional discounts. Fill in during Phase 7._

### Promo Code Architecture

[How promo codes are stored, validated, and applied.]

> 💡 **Lesson learned:** Promo code system implementation pattern:
>
> 1. Data model: Create a promo_codes collection with fields:
>    - code (text, unique, uppercase-normalized)
>    - discountType: 'percent' | 'fixed' | 'trial_extension'
>    - discountValue: number (percentage 0-100, or fixed amount in cents, or trial days)
>    - maxRedemptions: number (0 = unlimited)
>    - currentRedemptions: number (incremented atomically on use)
>    - expiresAt: datetime (null = never)
>    - active: boolean
>    - stripePromotionId: text (optional — maps to a Stripe Promotion Code for Checkout integration)
>    - Create a separate promo_redemptions collection: { user, promo_code, redeemedAt } to track per-user usage and prevent reuse.
>
> 2. Validation flow (server-side):
>    a. Normalize code to uppercase, trim whitespace.
>    b. Look up code in promo_codes collection. If not found → 404.
>    c. Check active === true. If not → 410 "Code is no longer active."
>    d. Check expiresAt (if set) > now. If expired → 410 "Code has expired."
>    e. Check currentRedemptions < maxRedemptions (if maxRedemptions > 0). If exhausted → 410 "Code has reached its maximum uses."
>    f. Check promo_redemptions for existing record with this user + code. If found → 409 "You've already used this code."
>    g. Return the validated promo details to the client.
>
> 3. Stripe integration:
>    - For percent/fixed discounts: Create a Stripe Promotion Code (via Stripe Dashboard or API) and store the ID in stripePromotionId.
>    - When creating a Checkout Session, pass the promotion code via `discounts: [{ promotion_code: promo.stripePromotionId }]`.
>    - For trial extensions: Don't use Stripe promotion codes. Instead, pass `subscription_data: { trial_period_days: promo.discountValue }` to the Checkout Session.
>
> 4. Redemption (atomic):
>    - AFTER successful Stripe checkout (in the webhook handler), create the promo_redemptions record AND increment currentRedemptions.
>    - Do NOT redeem on validation — only on successful payment. Users who validate but don't complete checkout shouldn't consume redemption slots.
>
> 5. Client-side UX:
>    - Add a "Have a promo code?" toggle on the billing/upgrade UI. Don't show the input field by default (it anchors users on finding a discount).
>    - On validation success, show the discount details and auto-apply to the Checkout flow.
>    - Store the validated promo code ID in a brief cookie or session state so it survives the redirect to Stripe Checkout and back.
>
> 6. Anti-pattern: Don't validate and redeem promo codes in the same step. Validation is "can this code be used?" — redemption is "this code WAS used." They happen at different points in the checkout flow.

### API Routes

| Method | Route                 | Purpose                                    |
| ------ | --------------------- | ------------------------------------------ |
| [POST] | [/api/promo/validate] | [Validate a code, return discount details] |

## Input Validation

_Centralized validation strategy for all user input._

### Validation Architecture

[How is input validated? Where do schemas live? What library is used?]

> 💡 **Lesson learned:** Centralized Zod validation pattern:
>
> 1. Create a single validation module ($lib/server/validation.ts) with:
>    - All Zod schemas for every API route's expected input
>    - A parseBody(request, schema) helper that: reads request.json(), runs schema.safeParse(), returns { success, data, error }
>    - On validation failure, return a 400 with the Zod error formatted as a human-readable message
>
> 2. Every API route's first action: const { data, error } = await parseBody(request, mySchema). If error, return 400 immediately. No business logic runs on unvalidated input.
>
> 3. Schema design:
>    - Use z.string().trim() for all text fields (prevents whitespace-only submissions)
>    - Use z.string().max(N) for fields that map to database columns with size limits
>    - Use z.enum([...]) for status fields, plan names, and other fixed-value fields
>    - Use z.coerce.number() for numeric inputs that arrive as strings (common in form data)
>    - Export schemas so they can be shared with client-side validation if needed
>
> 4. Benefits over ad-hoc validation:
>    - One place to audit all input contracts
>    - Automatic TypeScript type inference (z.infer<typeof schema>)
>    - Consistent error format across all routes
>    - No "forgot to validate" bugs — the pattern is obvious and repeatable
>
> 5. Anti-pattern: Don't validate inside business logic functions. Validate at the API boundary (the route handler), then pass clean, typed data to business logic. Business logic should trust its inputs.

## Product Analytics

_Instrument user behavior to validate the product works (SM0) and track growth metrics._

> 💡 **Lesson learned:** PostHog Cloud is the recommended default for product analytics.
>
> Architecture:
> - Client module: $lib/posthog.ts — thin wrapper. Exports initPostHog(), identifyUser(), resetUser(), trackEvent(), trackPageView().
> - Initialization: Root +layout.svelte calls initPostHog() in onMount, then identifies the user from server layout data.
> - SPA page views: Tracked via afterNavigate (disable PostHog's capture_pageview to avoid double-counting).
> - CSP: Add PostHog domains to connect-src and script-src in hooks.server.ts.
> - Env vars: PUBLIC_POSTHOG_KEY and PUBLIC_POSTHOG_HOST. If key is empty, all tracking silently no-ops.
>
> Key events to track (adapt to your app):
> - user_signed_up, user_logged_in
> - [core_action_completed] (the "aha moment")
> - subscription_started
> - [milestone_reached] (the success/celebration moment)
>
> Define your SM0 funnel: the sequence of events that proves a new user got value from the product.
### First-party / reverse-proxy ingest (optional)

> 🔧 **Guidance:** When analytics HTTP is routed through **your own origin** (reverse proxy) for CSP tightness, privacy posture, or ad-block resilience, document the **proxy path**, **upstream host env**, and how **`PUBLIC_*`** client config matches the path users’ browsers hit. Verify in staging that events arrive; misaligned host/base URLs often fail **silently**.

### Digest, labs, or experimental analytics panels (optional)

[When you ship a **digest**, **labs**, or **experiments** area that runs **secondary analysis** — clustering, grouping, novelty summaries — on data the user already owns, distinct from core CRUD.]

> 🔧 **Guidance:** Document **routes**, **entitlements** (plan gates vs internal-only), and whether results are **persisted** or **computed on demand**. Expose APIs with **capability-based** names; keep model/provider choice in **configuration**, not in path segments. If sub-views are shareable, sync **URL query state** for tabs or filters. Reuse your **central failure / observability** helpers for errors; sample or strip PII in analytics payloads.

> 💡 **Lesson learned:** Treat outputs as **suggestions** unless the product explicitly auto-writes records. A **lightweight** secondary model pass is often enough for exploratory grouping when cost must stay bounded; surface uncertainty in the UI when decisions are high-stakes.

### Server-Side Failure Observability

> 💡 **Lesson learned:** Most server-side failures return 4xx JSON and only `console.error`. They never reach your analytics dashboard unless they throw an uncaught 500. This creates a blind spot: LLM parse failures, billing webhook mismatches, auth errors, and file-processing problems are invisible in PostHog while being the failures users actually encounter.
>
> **Pattern: centralized failure logging**
>
> 1. Create a **low-level server capture module** (`posthogServer.ts`): a single `captureServerEvent(distinctId, event, properties)` function that POSTs to PostHog's `/capture/` endpoint. Fire-and-forget (never block the response). All server PostHog events flow through this one function.
>
> 2. Create a **failure logging module** (`failureLog.ts`) that wraps it:
>    - `logServerFailure({ userId, category, operation, error, path, httpStatus, extra })` → generates a UUID `debugId`, writes tagged `console.error` with JSON payload, fires PostHog event, returns the `debugId`.
>    - The `debugId` can be included in the API response for support ticket correlation.
>    - Error messages are clipped (2000 chars), extra values clipped (500 chars). Never send full HTML, request bodies, or credentials.
>
> 3. **Failure categories map to PostHog event names:**
>    - `llm_parse` → `server_failure_llm_parse` (LLM returned unparseable output)
>    - `llm_call` → `server_failure_llm_call` (LLM API itself failed)
>    - `auth` → `server_failure_auth`
>    - `billing` → `server_failure_billing`
>    - `file_operation` → `server_failure_file`
>    - `data_persistence` → `server_failure_data`
>    - `external_api` → `server_failure_external`
>    - `general` → `server_failure`
>
> 4. **Convenience wrappers** for high-volume categories. Example: `logLLMParseFailure()` reads the LLM tracking context (AsyncLocalStorage) for `userId` and `operation`, so call sites only pass the error and a raw output preview.
>
> 5. **Domain-specific failure modules** when the category needs extra diagnostics. Example: scrape failures warrant response-fingerprinting (Cloudflare detection, captcha heuristics, content-length checks) that don't belong in the general module. Keep the specialized module (`scrapeFailureLog.ts`) and the general one (`failureLog.ts`) separate.
>
> 6. **Refactor `handleError` hooks** to use the shared `captureServerEvent` — don't duplicate the PostHog HTTP POST inline.
>
> 7. **What NOT to track:** Expected 400s the user can self-correct (bad email format, missing required field). Track failures that indicate bugs, infrastructure problems, or degraded service.
>
> 8. **Instrumentation priority:**
>    - Tier 1 (ship immediately): LLM parse failures, billing/webhook failures, auth failures, scrape failures.
>    - Tier 2 (instrument when touching the area): file uploads/processing, tailoring route failures, external API errors.
>    - Tier 3 (low priority): admin routes, internal tooling.
>
> 📝 **Example:** In a `catch` block that already has `console.error`:
> ```typescript
> } catch (e) {
>   console.error('[myRoute] Failed:', e);
>   logServerFailure({ userId: user.id, category: 'data_persistence', operation: 'saveNote', error: e, path: '/api/notes' });
>   return json({ message: 'Failed' }, { status: 500 });
> }
> ```

### Setup

[PostHog Cloud or self-hosted? Env var names? CSP additions?]

### Tracked Events

| Event        | Location         | Properties        |
| ------------ | ---------------- | ----------------- |
| [event_name] | [file/component] | [key: value, ...] |

### SM0 Funnel

[The primary funnel that validates whether the product works. e.g., signup → core_action → value_delivered]

### NPS Survey (SM1)

[In-app NPS survey implementation. Fill in once you build it.]

> 💡 **Lesson learned:** NPS implementation pattern:
>
> Architecture:
> - Component: A fixed-position toast (bottom-right) with 3 phases: score → qualitative reason → thank-you auto-dismiss.
> - API: GET /api/nps?trigger= checks if user already responded. POST /api/nps submits score + reason. Prevents duplicates (409).
> - Data: PocketBase collection `nps_responses` (score: number 0-10, reason: text, trigger: select, user: relation). Immutable records.
> - Validation: Zod schemas for both check (trigger enum) and submit (score 0-10, reason optional, trigger enum).
> - Triggers: Feature components dispatch window CustomEvents (e.g., 'app:feature-done'). Main page listens, checks eligibility, shows survey.
> - PostHog: Track nps_submitted (score, trigger) and nps_dismissed (trigger) for response rate analysis.
>
> Key decisions:
> - In-app toast, not email — catches users in context, much higher response rate.
> - One response per trigger per user — server enforces via DB query before showing.
> - Immutable records — no update/delete API rules. Users can't change scores.
> - Decoupled via window events — NPS logic lives in the page, not inside feature components.
