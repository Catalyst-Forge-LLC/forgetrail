# Pre-Launch Audit

Run this audit against the codebase before any major launch or deploy milestone. The goal is to catch gaps that would embarrass the product, break for real users, cause data loss, or undermine trust. This is NOT about new features — it's about polish, robustness, and reliability of what exists.

---

## How to Use

Give this prompt to an AI coding assistant with full codebase access and ask it to perform the audit, reporting findings as **BLOCKER / HIGH / MEDIUM / LOW** with specific file paths, line numbers, and one-line fix suggestions.

```
Perform a pre-launch audit of this codebase using the checklist in [path to this file].
Report findings as BLOCKER / HIGH / MEDIUM / LOW with specific file paths, line numbers,
and one-line fix suggestions. For each finding, include the checklist item number it relates to.
```

---

## Audit Checklist

### 1. Error Handling & Boundaries

- [ ] Does a custom error page exist with branded 404 and 500 pages?
- [ ] Does the server error handler export structured logging (not just console.error)?
- [ ] Do API routes return meaningful error messages, or do some silently swallow failures?
- [ ] Are there fire-and-forget async calls missing error handling?
- [ ] What happens if the database is down when a user saves? Is work lost after an expensive operation (LLM call, file generation) succeeds?

> 💡 **Lesson learned:** The most painful production bugs are silent data loss
> after expensive operations. If an LLM call costs $0.05 and succeeds, but the DB save
> fails silently, the user loses work AND you lose money. Always save-or-retry after
> expensive operations.

### 2. Security & Infrastructure

- [ ] Is the app's origin/host set correctly for production (reverse proxy awareness)?
- [ ] Is the real client IP being forwarded correctly for rate limiting (not just 127.0.0.1)?
- [ ] Is the database admin UI restricted to authorized IPs in production?
- [ ] Are source maps disabled in production builds?
- [ ] Does CSRF origin checking work correctly behind the reverse proxy?
- [ ] Are there any hardcoded secrets, tokens, or API keys in the codebase (not in `.env`)?
- [ ] Are security headers present (CSP, HSTS, X-Frame-Options, etc.)?
- [ ] Are rate limits configured? Are auth endpoints and expensive routes (LLM) stricter?

### 3. Legal & Compliance

- [ ] Do privacy policy and terms of service pages exist and render full content?
- [ ] Is there a cookie consent banner if analytics set cookies?
- [ ] Does analytics respect opt-out?
- [ ] Are AI processing disclosures present in the privacy policy (if using LLMs on user data)?

### 4. SEO & Social Sharing

- [ ] Does the landing page have `<title>`, `<meta description>`, `og:title`, `og:description`, `og:image`, and `twitter:card` tags?
- [ ] Does `static/` contain `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, and `site.webmanifest`?
- [ ] Does `robots.txt` exist and allow indexing of public pages?
- [ ] Does `robots.txt` include a `Sitemap:` directive pointing at `sitemap.xml`?
- [ ] Does a `static/sitemap.xml` exist listing all public routes (landing, privacy, terms)?
- [ ] Is there a `<link rel="canonical" href="...">` on the landing page?
- [ ] Is there JSON-LD structured data (`SoftwareApplication`, `FAQPage`, or similar) in the landing page's `<head>`?
- [ ] Are `<title>`, meta description, Open Graph, Twitter, and JSON-LD `description` driven from the **same content module** (or shared constants) as the visible hero and key sections — not a second copy of the pitch only in `<head>`?
- [ ] Does **audience / ICP language** match between meta tags, schema, and on-page copy (same specificity — e.g. band + seniority — not a generic phrase in one place and a precise phrase in another)?
- [ ] After landing copy changes, are in-app story surfaces (About panel, Help introduction, etc.) still aligned on hero framing, section titles, timing claims, and customer-facing feature names?
- [ ] If you added or renamed a **primary nav hub** (new top-level section, major tab family), do landing, About, Help, and FAQ **groupings** still describe the product map users see when logged in?
- [ ] If users download **bundled exports** (ZIP, Word, PDF) that include marketing links or “learn more” CTAs, does every URL resolve on the **public** site (no dead routes like `/pricing` if you haven’t shipped that page)?

- [ ] If the app offers **CSV (or spreadsheet) export** and a symmetric **import**, do header columns and row cell order match so round-trip or re-import does not silently map fields into the wrong columns?
> 💡 **Lesson learned:** Canonical URL, sitemap, and JSON-LD structured data are all low-effort, moderate-SEO-upside items that are easy to forget. A `SoftwareApplication` schema with pricing aggregate offer gives Google richer context for search results. Add all three during the landing page build, not as a follow-up.

### 5. Billing & Payments (if applicable)

- [ ] Does the payment webhook handle all critical events (checkout completed, subscription updated, subscription deleted, payment failed)?
- [ ] What happens when a trial expires? Is the user gracefully downgraded or stuck?
- [ ] Has the full payment flow been tested end-to-end in test mode (signup → trial → upgrade → hit limits → downgrade → cancel)?
- [ ] Is the webhook signing secret set in `.env`?
- [ ] After **cold load**, **resume from sleep**, and **fast navigation** during onboarding, do trial/plan banners and upgrade modals match **server** state (no spurious "trial ended" or expired UI while the account is still in trial)?

> 💡 **Lesson learned:** Payment edge cases are embarrassment machines.
> Test the full lifecycle, not just the happy path. What happens when a subscription
> update webhook arrives before the checkout completion webhook? What happens when
> a user's card is declined on renewal?

### 6. Data Integrity & Resilience

- [ ] Has a database backup restore been tested? Can you spin up against a pulled snapshot?
- [ ] Are there retry mechanisms for critical saves (especially after expensive LLM calls)?
- [ ] What happens with concurrent usage across multiple tabs? Do refetch patterns cause conflicts?
- [ ] Are database query workarounds documented for known driver/ORM issues?

> 💡 **Lesson learned:** PocketBase's default 5K text field limit silently
> truncated LLM output with no error. Check ALL fields that receive LLM output against
> your database's field size limits. One systematic audit prevented 5 production bugs.

### 7. Authentication & Sessions

- [ ] Are auth cookies set with `httpOnly`, `secure`, and `sameSite`?
- [ ] Does logout clear all cookies (auth, delegation, impersonation)?
- [ ] What happens if access is revoked mid-session (e.g., delegation removed)?
- [ ] Does the forgot-password flow work? Is email sending configured?
- [ ] Is there session invalidation on password change?
- [ ] If the app sends **app-owned** transactional email (welcome, billing, security notices) via a provider API, are production credentials set and is the **sending domain** authenticated (SPF/DKIM/DMARC per provider)?

### 8. Client UX & Mobile

- [ ] Does the app load with proper skeletons/spinners, or does it flash empty states?
- [ ] What happens if the initial data load fails? Is there a retry/refresh indication?
- [ ] Does the layout work on mobile (especially complex layouts like Kanban boards, multi-column panels)?
- [ ] Are all modals/panels keyboard-accessible with Escape to close?
- [ ] Are file upload size limits communicated to users before they pick a file?

### 8a. Accessibility (Landing Page)

- [ ] Is there a skip-to-content link as the first focusable element?
- [ ] Is there a `<main>` landmark wrapping the primary content?
- [ ] Do all `<section>` elements have `aria-labelledby` or `aria-label`?
- [ ] Does the primary `<nav>` have `aria-label="Main"`?
- [ ] Do all password inputs have show/hide toggles with `aria-pressed` and `aria-controls`?
- [ ] Are tooltips used only where they add information not already visible? (See DESIGN_SYSTEM.md > Tooltip Usage Guidelines)

### 9. Caching

- [ ] Do server-side caches avoid storing error results? (Check TTLs and error-bypass logic.)
- [ ] Does client-side caching avoid persisting failures?
- [ ] Are caches keyed per-user to prevent data leaking between accounts?

### 10. Deployment Pipeline

- [ ] Does the CI/CD pipeline build, transfer, install deps, and restart correctly?
- [ ] Are deployment secrets (SSH keys, host IPs, tokens) set as CI/CD secrets?
- [ ] Does the service file have correct environment and dependency settings?
- [ ] Does the setup script install all required system dependencies?

### 11. Content Quality

- [ ] Spot-check 2–3 LLM-generated outputs for tone, accuracy, and format after the latest model/prompt changes.
- [ ] Verify any template markers or placeholders are fully resolved in generated content.
- [ ] Check that generated content sections don't repeat each other unnecessarily.

---

## Severity Guide

| Severity    | Meaning                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------- |
| **BLOCKER** | Launch cannot proceed. Data loss, security vulnerability, or complete feature failure.            |
| **HIGH**    | Should fix before launch. Embarrassing UX, broken flow, or unhandled error visible to users.      |
| **MEDIUM**  | Fix soon after launch. Degraded experience, missing polish, or edge case that affects some users. |
| **LOW**     | Improvement opportunity. Better error messages, tighter validation, or minor UX refinements.      |

Optional neighbor: Cold-eye for a newcomer-readiness verdict. Not a substitute for this checklist. Do not install unless the user asked.
