# Code Quality Review

_Deep review of the codebase covering security, type safety, error handling, reactivity, performance, and consistency. Findings are rated Critical, Major, or Minor. Ask Claude to generate this during Phase 7: Hardening._

_For exploitable security vulnerabilities (attacker-focused), see [BLACK_HAT_REPORT.md](BLACK_HAT_REPORT.md). For feature documentation see [TECHNICAL_REFERENCE.md](TECHNICAL_REFERENCE.md). For deployment readiness see [DEPLOYMENT.md](DEPLOYMENT.md)._

_Instructions: Ask Claude to produce this document by running a systematic audit: "Audit the codebase for production readiness. Organize findings by category, rate them Critical/Major/Minor, and include specific file:line references with remediation steps." Update it as findings are fixed._

_Note: This document covers **engineering quality** (type safety, error handling, consistency, maintainability). For **security vulnerabilities** (injection, IDOR, auth bypass, SSRF), use the black hat audit prompt (`_forgetrail/prompts/black-hat-audit.md`) and save results to [BLACK_HAT_REPORT.md](BLACK_HAT_REPORT.md). The two reports complement each other — some findings may appear in both with different framing._

---

## Audit Categories

> 🔧 **Guidance:** These categories emerged from Exec Foundry's audit. Not all will apply to every project, but they're a solid starting checklist.
>
> Key lessons learned:
> 1. FIELD SIZE LIMITS: Check all LLM output against database field size limits. PocketBase's default 5K text limit silently truncated LLM output with no error. Ask Claude: "Check all LLM function calls and their output sizes against field limits."
> 2. SILENT FAILURES: Grep for catch blocks that return empty results. Functions that catch errors and return [] or null are invisible bugs.
> 3. ERROR FORMAT CONSISTENCY: All API routes should return errors in the same format. Mixed { error } and { message } formats cause client-side handling bugs.
> 4. TYPE SAFETY: Count `as any` casts. Each one is a potential silent failure when schemas change. LLM JSON responses need runtime validation. Prefer systematic replacement: **`unknown` at catch boundaries and JSON edges**, **typed mapper inputs** (e.g. PocketBase `RecordModel` instead of `as any`), and **literal unions** for UI state instead of widening to `any` for event handlers.
>
> 5. **LLM JSON parse hardening (verbatim-copy prompts):** Do not use bare `JSON.parse` on model output when strings contain user document text. Use a shared **`parseJsonFromLlmOutput`** (fence strip + leading-object extraction + **control-char sanitization inside string literals** as fallback). Strict parse first so valid output is unchanged. Add unit tests for raw-newline-in-string payloads.
> 5. AUTHORIZATION: Check that auth checks are atomic. A delegation check followed by a separate data fetch can be exploited between the two calls.

## Summary Table

| Category         | Critical | Major | Minor | Fixed |
| ---------------- | -------- | ----- | ----- | ----- |
| Security         |          |       |       |       |
| Type Safety      |          |       |       |       |
| Error Handling   |          |       |       |       |
| Reactivity/State |          |       |       |       |
| Performance      |          |       |       |       |
| Consistency      |          |       |       |       |
| **Total**        |          |       |       |       |

## Critical Findings

_Must fix before launch. Each finding includes: what's wrong, where it is, why it matters, and how to fix it._

### C1: [Finding Title]

**File:** `[path/to/file.ts]:[line]`
**Category:** [Security / Type Safety / etc.]
**Impact:** [What could go wrong]

**Problem:**
[Specific description with code example if helpful]

**Fix:**
[Exact remediation steps]

**Status:** [ ] Not started / [x] Fixed ([date])

## Major Findings

_Should fix before launch. Won't cause security incidents but will cause user-facing bugs or maintenance pain._

### M1: [Finding Title]

**File:** `[path/to/file.ts]:[line]`
**Category:** [category]
**Impact:** [What could go wrong]

**Problem:**
[Description]

**Fix:**
[Remediation]

**Status:** [ ] Not started / [x] Fixed ([date])

## Minor Findings

_Fix when convenient. Code quality improvements that reduce future maintenance burden._

### m1: [Finding Title]

**File:** `[path/to/file.ts]:[line]`
**Category:** [category]

**Problem:**
[Description]

**Fix:**
[Remediation]

**Status:** [ ] Not started / [x] Fixed ([date])

## Priority Actions

_Sequenced by dependency. Do these in order._

1. [ ] [Action]: [Which findings it resolves]
2. [ ] [Action]: [Which findings it resolves]
3. [ ] [Action]: [Which findings it resolves]

## Audit Checklist for Future Reviews

_Run through this list periodically, especially before releases._

- [ ] Grep for `as any` casts and evaluate each one
- [ ] Grep for `catch (` / `: any)` — prefer `unknown` plus shared helpers for user-facing messages and optional HTTP/status extraction
- [ ] Confirm lint/typecheck (e.g. ESLint with `@typescript-eslint/no-explicit-any`, `svelte-check`) runs in CI or pre-release so type hygiene doesn’t regress silently
- [ ] Grep for empty catch blocks (`catch (e) { }` or `catch { return [] }`)
- [ ] Check all API routes return errors in the same format
- [ ] Verify all LLM output fields have adequate database field sizes
- [ ] Check all auth/permission checks are atomic (no TOCTOU vulnerabilities)
- [ ] Verify all setTimeout/setInterval are cleaned up on component unmount
- [ ] Check for stale closure captures in async functions with reactive state
- [ ] Validate all user input before database queries (injection prevention)
- [ ] Verify error messages are user-facing, not developer-facing
- [ ] **User-facing copy (when adopted):** run `export:copy`; `audit:inline-copy` at **0 UI prose not in export**; run `user-facing-content-sync-audit.md` before major marketing pushes; grep `\bcan\b` for capability hedges (`can strengthen` → `strengthens`) per **`.cursor/rules/user-facing-content.mdc`**
- [ ] Check that no secrets are hardcoded or logged
- [ ] Verify all database filter strings use parameterized helpers (no string interpolation)
- [ ] Check that promo code redemption and usage counter increments are atomic
- [ ] Verify delegation/impersonation routes check access level before mutations
- [ ] Check that rate limiting covers all expensive endpoints (LLM calls, scraping, file processing)
- [ ] Verify untrusted content (user input, scraped pages, uploads) is fenced with an injection-guard wrapper before entering any LLM prompt
- [ ] Verify LLM calls read all response text blocks (not `content[0]`), disable thinking for JSON tasks, and treat blank model-name env vars as unset
- [ ] Verify Stripe webhook signatures are validated on all payment endpoints
- [ ] Verify all `fetch` call sites check `res.ok` before calling `.json()` or assigning response data to state
- [ ] Check that all `setInterval` polling loops handle 429 responses with exponential backoff (not just `!res.ok` → skip)
- [ ] Verify optimistic UI updates (star toggles, status changes) revert on `!res.ok`, not only on thrown errors
- [ ] Check that success indicators ("Saved", "Deleted", dialog closes) are gated on `res.ok`, not fired unconditionally
- [ ] Verify async callbacks in long-running operations guard against stale context (entity ID changed during await)
- [ ] Check that bulk/batch operations suppress per-item polling (no N×M interval storm)
- [ ] Verify that third-party file parsing engines (such as `pdf-parse` or `mammoth`) are isolated behind a centralized server-side file utility boundary (`pbFiles.ts` or similar) to protect route endpoints from library-specific imports.
- [ ] Check that all ISO timestamp string transformations are standardized using a shared formatter (`formatUtcTimestamp` or similar) rather than repeated ad-hoc string replacements.
- [ ] Verify that all gated admin-only API endpoints proxying private edge nodes enforce strict admin checks (`requireAdmin`) and implement a short connection timeout to prevent hanging.
- [ ] **URL host classification:** Grep for `hostname.includes('…com')` / `url.includes('…com')` used as board/ATS allowlists — prefer a shared `hostMatchesDomain` (exact or subdomain suffix match on parsed hostname), not substring checks (CodeQL `js/incomplete-url-substring-sanitization`).
- [ ] **SSRF boundary:** Outgoing fetch / browser navigation validates http(s) allowlist, rejects userinfo, localhost, private IPs, and `.local`/`.internal` at the handler edge; re-check redirects.
- [ ] **Address ranges are numeric, not string prefixes:** blocked ranges computed from octets/hextets (whole `127/8`, not `=== '127.0.0.1'`), IPv6 expanded before comparison (`::ffff:127.0.0.1` normalizes to `::ffff:7f00:1`), hostnames lowercased with brackets and the trailing FQDN dot stripped (`localhost.` is `localhost`).
- [ ] **Guards have regression tests:** each blocked input class is asserted in a test that fails against the pre-fix code, and each branch of the guard is proven reachable (a regex that can never match is dead code, not a defense).
- [ ] **Escaping matches the downstream parser:** compare against the vendor SDK's own escape helper before hand-rolling (e.g. PocketBase filters use backslash escapes, not SQL-style doubled quotes).
- [ ] **Sanitizers run in one pass:** chained `.replace()` calls re-scan their own output (an entity decoder that expands `&#38;` before named entities still double-decodes); use a single regex pass, or iterate to a fixed point when stripping nested constructs.
- [ ] **Validate-then-connect is closed, not just narrowed:** the check and the socket must use the same address. In Node, an `undici` `Agent` with a filtering `connect.lookup` removes the rebinding window that a `resolve → validate → fetch` sequence leaves open; honor `options.all` so Happy Eyeballs still works.
- [ ] **Headless browser navigation is guarded too:** a validated `goto` URL does not constrain 3xx, `<meta refresh>`, or script navigation. Abort navigation requests to blocked hosts via request interception and re-check the landed URL before reading content. Note the residual limit: the browser resolves DNS itself unless routed through a controlled proxy.
- [ ] **Scheme allowlist:** Prefer `protocol === 'http:' || protocol === 'https:'` on a parsed `URL`, not only denying `javascript:`.
- [ ] **GitHub Actions:** Workflows set top-level `permissions:` (least privilege). Never return `err.stack` / raw exception text in client JSON.
- [ ] **Dependabot High on lockfiles:** Pin the **named** transitive with `pnpm.overrides` (or npm `overrides`) in the package that owns that lockfile. Do **not** major-upgrade Vite 4 / SvelteKit 1 (or another EOL framework line) just to pick up a nested advisory. Recurring pins as of 2026-09: `sharp` `0.35.4` (libheif), `fast-uri` `3.1.7` (Ajv), `cookie@<0.7.0` → `0.7.2`, `js-yaml` `3.15.2`. Cookie 1.x already sits past the 0.6 advisory; leave it.
- [ ] **CodeQL polynomial `/\/+$/` / `\\0+$`:** These are trailing-delimiter strips, not real ReDoS. Rewrite as a `while (endsWith)` / length walk. Same for last-integer or `in <folder>` parses that used `.+` / `.*`.
- [ ] **CodeQL incomplete escaping:** `replace('/', '%2f')` and `.replace(/\|/g, '\\|')` are incomplete. Use `replaceAll` (or encode each segment), and escape `\\` **before** the metacharacter.
- [ ] **Scanner wave ≠ breach:** The first org Dependabot/CodeQL run after enabling Advanced Security is a baseline. Triage production High first. Do **not** file GHSA/CVE for lockfile or local-stdio scanner findings unless there is a real remote exploit.

> 💡 **Lesson learned:** **Host matching is not string `includes`.** Scrapers and board classifiers that use `hostname.includes('linkedin.com')` match lookalikes and generate dozens of identical CodeQL alerts. One shared helper (`host === domain || host.endsWith('.' + domain)`) plus call-site migration clears the storm and keeps regional subdomains (`uk.linkedin.com`, `boards.greenhouse.io`) working. Keep path checks on `pathname`. Sibling edge services that cannot import the app module should copy the helper with a sync comment.
>
> 📝 **Example:** `hostMatchesDomain('www.linkedin.com', 'linkedin.com')` → true; `hostMatchesDomain('evil-linkedin.com', 'linkedin.com')` → false.

> 💡 **Lesson learned:** **Dependabot High on a site or tool lockfile is usually a nested pin, not a product rewrite.** FilePress sites pull `sharp`; Ajv pulls `fast-uri`; SvelteKit still ships `cookie@0.6` next to `cookie@1`. Add `pnpm.overrides` in the package that owns the flagged lockfile, run `pnpm install --lockfile-only`, and leave the app version and the site framework where they are. A fleet scan of lockfiles (skip `node_modules`) finds the same four packages on almost every marketing site.
>
> 📝 **Example:** `"pnpm": { "overrides": { "sharp": "0.35.4", "fast-uri": "3.1.7", "cookie@<0.7.0": "0.7.2" } }`

> 💡 **Lesson learned:** **CodeQL “polynomial regex” on `/\/+$/` is a trailing-slash strip.** Walk the string. The same query flags `replace(/\\0+$/)`, `/^-+|-+$/`, and `.+` / `.*` used to peel `cmd /c` or `in <folder>` off operator logs. Those are not remote ReDoS; they are scanner hygiene. Incomplete-escaping alerts are the sibling: escape `\\` first, then `|` or `"`, and replace every `/` when encoding an npm name.
>
> 📝 **Example:** `while (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)` instead of `path.replace(/\/+$/, '')`.

> 💡 **Lesson learned:** **A hardening fix is not done until you run the bypass inputs through it.** A codebase can pass a security audit, ship the recommended guard, and still be exploitable because the guard compares strings where it should compare ranges. Real examples from one Exec Foundry sweep: an SSRF check that blocked `127.0.0.1` but not `127.0.0.2` or `[::ffff:127.0.0.1]` or `localhost.`; a DNS-resolution check whose IPv4-mapped branch used `/^:ffff:/` and could never match the resolver's `::ffff:` output; a filter escaper using SQL-style doubled quotes against a parser that expects backslashes; and an "`&amp;` last" entity decoder that still double-decoded because numeric refs ran first. All four had been reviewed and credited as effective. Add an **AREA 0 fix-efficacy pass** to security re-audits, and land a regression test with every guard so the next refactor cannot quietly undo it.
>
> 📝 **Example:** `assert.throws(() => assertSafeUrl('http://[::ffff:169.254.169.254]/'))` is worth more than a paragraph in the audit report claiming metadata endpoints are blocked.

> 💡 **Lesson learned:** **Tighten types at boundaries instead of sprinkling `any`.** Unchecked `any` makes refactors expensive: renamed API fields and mapper outputs fail silently until a user hits an edge case. Treat **`catch` clauses**, **`fetch().json()` results**, and **ORM/PocketBase rows passed into mappers** as the main places to invest — use `unknown`, narrow once, or cast to the framework’s record type (`RecordModel`) at the mapper input so greps stay honest. For UI toggles and segmented controls, model allowed values as a string union (or `typeof` existing state) instead of `as any` on click handlers.
>
> 📝 **Example:** A shared `errorMessage(e: unknown)` (and optional `getHttpStatus`) avoids duplicating `instanceof Error` checks across dozens of Svelte components; `pbEntityToApp(record as RecordModel)` documents the handoff from raw store to domain type better than `record as any`.

> 💡 **Lesson learned:** Remediation tracking pattern — integrating findings with TODO:
>
> 1. After generating CODE_QUALITY.md and BLACK_HAT_REPORT.md, add ALL actionable findings to TODO.md under dedicated sections.
> 2. Use priority tiers:
>    - P0 (Critical/Immediate): Directly exploitable vulnerabilities, data loss risks. Fix before launch.
>    - P1 (High/Short-term): Defense-in-depth, hardening, significant code quality issues. Fix next sprint.
>    - P2 (Medium-Low/Backlog): Nice-to-haves, future-proofing, cosmetic code quality. Schedule when convenient.
> 3. Annotate each finding in the report with its TODO status: `→ *Added to TODO (P0)*`
> 4. As fixes are implemented, update BOTH:
>    - The finding's status in this doc: `**Status:** [x] Fixed (date)`
>    - The TODO checkbox
> 5. This dual-tracking prevents findings from getting lost and provides an audit trail of what was fixed and when.

> 💡 **Lesson learned:** **Audit for fetch/polling resilience as a class, not one-off.** After discovering that bulk import triggered a 429 request storm (N concurrent polling intervals × rate-limited API = frozen UI + cascading `TypeError`s from error objects assigned to array state), a systematic sweep of every `setInterval`-based polling loop and every `fetch` → `.json()` call site revealed the same anti-pattern in 6+ files: no `res.ok` guard, no 429-specific backoff, no timer cleanup on destroy. Treat these as a **category** during code review — anywhere `setInterval` + `fetch` appear together, verify the three guards (response check, backoff, lifecycle cleanup). Bulk operations are the stress test: if single-item import works fine, try 20+ items and watch the console for 429 cascades.
>
> 📝 **Example:** A skip-tick backoff pattern for `setInterval` polling: declare `let skipTicks = 0` outside the interval callback; on 429, set `skipTicks = Math.min((skipTicks || 1) * 2, maxSkip)`; at the start of each tick, if `skipTicks > 0`, decrement and return. This provides exponential backoff within the existing interval without replacing it with `setTimeout` chains.
