# [App Name]: Deployment & Operations

_Current status, what needs to change before launch, go-live checklist, implementation roadmap, monitoring, and cost estimates._

_For technical feature reference, see [TECHNICAL_REFERENCE.md](TECHNICAL_REFERENCE.md). For business model and pricing, see [BUSINESS_PLAN.md](BUSINESS_PLAN.md). For code quality findings, see [CODE_QUALITY.md](CODE_QUALITY.md). For security vulnerabilities, see [BLACK_HAT_REPORT.md](BLACK_HAT_REPORT.md)._

_Instructions: Start this document when you begin thinking about production (Phase 7: Hardening). It's both a status tracker and an operational runbook. The go-live checklist should be specific enough that you (or Claude) can execute it step-by-step without interpretation._

---

## Current Status

### What's Done

- [ ] [Capability]: [Brief status note]
- [ ] [Capability]: [Brief status note]

### What's NOT Done

- [ ] [Capability]: [What's needed, estimated effort]
- [ ] [Capability]: [What's needed, estimated effort]

## What Needs to Change Before Launch

_Organized by category. Reference specific CODE_QUALITY.md findings where applicable._

### Security (Blockers)

> 💡 **Lesson learned:** These four categories consistently surfaced as launch blockers:
> 1. Input sanitization on database queries (filter injection, SQL injection)
> 2. Cookie/session security (httpOnly, secure, sameSite flags)
> 3. Rate limiting on expensive endpoints (LLM calls, scraping)
> 4. Prompt injection defense (user input flowing into LLM prompts)
>
> Additional hardening from Exec Foundry Session 9:
> 5. Centralized input validation with Zod on ALL API routes (see TECHNICAL_REFERENCE.md > Input Validation)
> 6. IDOR checks on every data-access route (verify record belongs to requesting user)
> 7. Promo code redemption race conditions (atomic check-and-increment)
> 8. Delegation access level enforcement on mutation routes

- [ ] [Issue]: [Current state → Required state. Reference CODE_QUALITY finding if applicable.]

### Auth

- [ ] [Issue]: [Current state → Required state]

### Payments

- [ ] [Issue]: [Current state → Required state]

### Known Bugs (Blockers)

- [ ] [Bug]: [Impact and fix needed]

### Non-Blocking but Important

- [ ] [Issue]: [Why it matters, when to address]

## Infrastructure

### Target Setup

If the project has **not** already locked providers: **GitHub** for git, **Cloudflare** for DNS (free plan), **Cloudflare Pages + Wrangler** for a static site (FilePress or `adapter-static`). Use a **DigitalOcean** (or similar) origin only when the app needs a server, still behind Cloudflare DNS. Do not migrate a host the operator already chose. forgetrail.dev is the FilePress + Pages worked example.

| Component  | Choice                             | Spec                    | Monthly Cost |
| ---------- | ---------------------------------- | ----------------------- | ------------ |
| Hosting    | [static: Cloudflare Pages + Wrangler; server: e.g. DigitalOcean behind Cloudflare DNS] | [Pages project, or 1 vCPU / 2GB] | $[0 or X] |
| Site / docs | [FilePress `site/` if Markdown; else app `adapter-static`] | [build to `./build/`] | $0 |
| Database   | [e.g., PocketBase on same droplet; none if A-local] | [included]              | $0           |
| Domain     | [Cloudflare DNS unless already specified] | [domain name]           | $[X]/yr      |
| SSL        | [Cloudflare Universal SSL; or Caddy on origin] | [included]              | $0           |
| CI/CD      | [e.g., GitHub Actions]             | [free tier]             | $0           |
| Monitoring | [e.g., UptimeRobot]                | [free tier]             | $0           |

### DNS delegation order (registrar + Cloudflare + origin)

Typical stack: domain at **Namecheap** (or any registrar), **Cloudflare** for DNS and edge TLS. Origin is **Cloudflare Pages** for static, or **DigitalOcean** (or similar) when the app needs a server.

1. **Cloudflare first:** Add the domain as a **zone** in Cloudflare. Cloudflare assigns **two nameservers** (e.g. `*.ns.cloudflare.com`). You need those before changing the registrar.
2. **In Cloudflare DNS:** Point `A`/`CNAME` records at the origin server’s IP or hostname (pre-fill before delegation so cutover is clean).
3. **Registrar (e.g. Namecheap):** Set **Custom DNS** / nameservers to **only** Cloudflare’s two nameservers for that zone. Do **not** switch nameservers at the registrar until the Cloudflare zone exists and you have copied the correct pair.
4. Wait until the zone shows **Active** in Cloudflare; then **SSL/TLS** (e.g. Full / Full strict) and redirects behave as expected.

**Cloudflare plan:** **Free** is enough for most small production apps (Universal SSL, DNS, CDN, basic protection). Use **Pro** if you need advanced WAF rules, more redirect rules, or higher support priority.

> 💡 **Lesson learned:** **Outbound transactional email** (app-owned, not only BaaS password reset): verify the **sending domain** with your mail provider and add the records they require (**SPF**, **DKIM**, often **DMARC**) in DNS before go-live. Staging can use a subdomain or provider test mode; production deliverability failures often show up only as silent drops or spam folders.

> 💡 **Lesson learned:** If your app uses Playwright (headless browser), budget 2x the RAM. A 1GB droplet can't handle Playwright + app server concurrently. Consider: move scraping to async worker, upgrade to 2GB, or drop Playwright for lighter alternatives.

### Environment Variables

| Variable   | Purpose   | Where Set                              |
| ---------- | --------- | -------------------------------------- |
| [VAR_NAME] | [purpose] | [.env / hosting provider / CI secrets] |

> 💡 **Lesson learned:** **Keep Node.js and package-manager versions aligned across `package.json`, CI, and production.** Declare `engines.node` (and `packageManager` for pnpm) to match what GitHub Actions, Docker, and the host actually run. Updating CI’s Node version without updating `engines` (or vice versa) produces “works on deploy” / “fails locally” drift and subtle dependency resolution differences. Treat **workflow `node-version`**, **`engines`**, and the **runtime image** as one triplet to bump together.

> 💡 **Lesson learned:** **Rolling restarts and reverse proxies:** A single upstream socket that goes down for process restart can surface **502/503** to users for a few seconds. Prefer **multiple** app instances or staggered slots behind the proxy with **health-checked** upstreams; configure brief **retry** or drain behavior where safe. **Why:** Deploy-time blips generate more noise than many logic bugs.

> 💡 **Lesson learned:** **`systemd` stop timeout vs deploy wall-clock:** Raising **`TimeoutStopSec`** (or equivalent) so long requests can **drain gracefully** on SIGTERM is often correct for LLM or upload-heavy apps — but **`systemctl stop`** on the old instance waits **up to** that budget before SIGKILL. If the process does not exit promptly on SIGTERM, **each** deploy’s SSH/CI step can grow by a large fraction of that window. **Why:** Blue-green or rolling scripts typically **stop** the superseded unit after traffic moves; a longer cap fixes mid-request kills but can **double** apparent pipeline duration if shutdown is slow. **Mitigations:** implement a **short** graceful shutdown in the app (close listener, bound wait on in-flight work), pick a **middle-ground** timeout, and **split timings** in CI (build vs deploy) so regressions point at compile vs systemd stop.

## Go-Live Checklist

_Prerequisites and numbered steps. Specific enough to execute without interpretation._

### Prerequisites

- [ ] All Critical findings in CODE_QUALITY.md are fixed
- [ ] All Critical/High findings in BLACK_HAT_REPORT.md are fixed (P0 tier in TODO.md)
- [ ] Auth flow tested end to end
- [ ] Payment flow tested end to end (if applicable)
- [ ] Domain and DNS configured
- [ ] SSL certificate provisioned
- [ ] Environment variables set in production
- [ ] Database backed up (if migrating existing data)

### Deploy Steps

1. [ ] [Step]: [Exact command or action]
2. [ ] [Step]: [Exact command or action]
3. [ ] [Step]: [Exact command or action]

### Post-Deploy Verification

1. [ ] [Check]: [What to verify and how]
2. [ ] [Check]: [What to verify and how]

## Implementation Roadmap

_Break remaining work into phases with dependencies and time estimates._

### Phase 1: [Name] ([estimated days])

_Dependencies: [what must be done first]_

- [ ] [Task]
- [ ] [Task]

### Phase 2: [Name] ([estimated days])

_Dependencies: Phase 1_

- [ ] [Task]
- [ ] [Task]

## Monitoring & Alerting

### Uptime

- [Service]: [URL to monitor, expected response]

### Error Alerting

- [Method]: [e.g., PocketBase logs → email on 5xx, Sentry for frontend errors]

### Health Checks

- [Endpoint]: [What it checks, expected response]

### Backup Strategy

- [What]: [How often, where stored, how to restore]

## Quick Reference

| Resource          | URL/Path             |
| ----------------- | -------------------- |
| Production URL    | [https://...]        |
| Staging URL       | [if applicable]      |
| Admin panel       | [URL]                |
| CI/CD             | [GitHub Actions URL] |
| Hosting dashboard | [URL]                |
| Domain registrar  | [URL]                |
| Error tracking    | [URL]                |

## Cost Summary

| Item                     | Monthly         | Annual   |
| ------------------------ | --------------- | -------- |
| Hosting                  | $[X]            | $[X]     |
| API costs (at [N] users) | $[X]            | $[X]     |
| Domain                   | $[X/12]         | $[X]     |
| Payment processing       | [X]% of revenue | varies   |
| **Total**                | **$[X]**        | **$[X]** |
