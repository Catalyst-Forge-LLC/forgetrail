# Microcopy centralization

Run this when a product has **substantial UI copy still inline in `.svelte` files**, or when marketing/help/tour strings drift from a single source of truth. Complements [User-Facing Content Sync Audit](./user-facing-content-sync-audit.md) (surface completeness) with **implementation discipline** (where strings live and how to verify them).

---

## How to use

Give this prompt to an AI coding assistant with full codebase access:

```
Run microcopy centralization using [path to this file].
Mode: [phased clusters / final sweep / audit-only].
Scope: [optional panel list, or "follow inline audit"].
```

**Audit-only** — run export + inline + duplication audits; report backlog; no refactors.

**Phased clusters** — migrate high-traffic surfaces in batches (onboarding, primary record tabs, billing, admin). Prefer **clusters over long-tail sweeps** until the inline audit is near zero.

**Final sweep** — after clusters, clear remaining 1-hit files in one pass.

---

## Three-layer architecture

| Layer | Typical module | Owns |
| --- | --- | --- |
| **Feature labels** | `[productLabels].ts` | Canonical feature names for landing, help, tours, nav, tabs |
| **Cross-cutting UI** | `[microcopy].ts` | Save failures, quota errors, shared toasts, Foreman/network banners |
| **Surface modules** | `[panelName]Copy.ts` under `$lib/content/` (or equivalent) | Panel intros, modals, section blurbs, wizard steps |

**What stays inline:** dead-obvious chrome (`Cancel`, `Save`, `Close`) unless repeated 3+ times; CSS classes; paths; MIME constants may live in admin/dev copy modules **omitted from user-facing export**.

**Legal pages:** one **markdown file per page** (`terms.md`, `privacy.md`) — do **not** shard into microcopy constants. Inline audit treats legal as document sections.

---

## Duplication policy

| Pattern | Action |
| --- | --- |
| Same feature title on landing + help + tour | Import `[FEATURE_LABELS].*` |
| Feature group on About cards | Import `[FEATURE_GROUP_LABELS].*` |
| Help tip body | Import from tips module; **never duplicate prose** |
| Elevator pitch variants | **Keep separate** — intentional messaging options |
| Landing FAQ vs feature summary | FAQ may shorten; don't force identical text |
| Short tooltip vs long feature summary | **Derive** tip from summary or shared excerpt constant |
| Terms / Privacy | **Markdown** per page, not `*Copy.ts` shards |
| Plan tier names / limits | Structured catalog; separate landing vs billing depth where needed |

---

## Three audits (different jobs)

| Command / prompt | Answers |
| --- | --- |
| **`user-facing-content-sync-audit.md`** | Is every **shipped feature mentioned** on landing, help, tours, onboarding? |
| **`export:copy`** (app script) | Regenerate **prose + terms** catalogs for writers/review |
| **`audit:copy`** (app script) | Exact **duplicate prose** inside the export inventory |
| **`audit:inline-copy`** (app script) | AST scan of `.svelte`; backlog metric = **UI prose not in export** |

**Acceptance:** inline audit reaches **0 UI prose not in export** (terms/noise/CSS may remain). Sync audit passes for feature parity.

> 🔧 **Guidance:** Apps adopt these scripts when copy volume justifies them (typically Phase 6–7 or after 10+ panels with product copy). ForgeTrail templates describe the **pattern**; copy script implementations from a reference app or build minimal stubs that call your `$lib/content/exportUserFacingCopy` module.

---

## Phased migration checklist

### Phase 1 — Foundation

- [ ] `[productLabels].ts` — wire into marketing About, help section titles, tours
- [ ] `[microcopy].ts` — save failures, network errors, shared toasts
- [ ] Document Help ← tips **aliases** in export (no double prose)
- [ ] `audit:copy` duplication report

### Phase 2+ — Clusters (repeat until audit clean)

For each cluster:

1. Create or extend `*Copy.ts` for the surface
2. Wire Svelte components to import constants (no string literals for product copy)
3. Register strings in **export aggregator** (prose + terms groups)
4. Run `export:copy` + `audit:inline-copy`
5. Update delivery spec / TODO backlog count

**Cluster examples (rename for your product):**

- Onboarding wizard + start page
- Primary entity detail tabs
- Settings / profile / work preferences
- Billing + export panels
- Admin / internal tools (may omit dev-only strings from user export)

### Final sweep

- [ ] Remaining 1-hit files from inline audit
- [ ] Move spec to **completed**; mark TODO done
- [ ] Propagate lessons to ForgeTrail (`propagate-to-forgetrail.md`)

---

## Export structure

Split **prose** (paragraphs, intros, help bodies) from **terms** (labels, tooltips, errors, button-adjacent strings). Use helper functions for parameterized copy (`saveFailedWithLabel(name)`) and register **sample invocations** in export so audit can match dynamic strings.

**User-facing content rule:** Help, onboarding, tours, toasts, and empty states must **not** mention internal spec paths or engineering jargon (see `.cursor/rules/user-facing-content.mdc`).

**Locale:** Default **US English** for product copy and LLM prompts that generate user-visible text, adapting to target audience or locale (see `.cursor/rules/writing-voice.mdc`).

---

## When to run

| Trigger | Action |
| --- | --- |
| After 3+ features ship in a week | Sync audit + spot-check inline audit |
| Before launch / marketing push | Full sync audit + inline audit at 0 prose backlog |
| After landing/help rebrand | Reconcile `FEATURE_LABELS` + sync audit |
| New high-traffic panel | Add `*Copy.ts` in same PR; don't defer |
| Periodic (monthly) | `export:copy` + `audit:inline-copy` in CI or pre-release checklist |

---

## Propagate to ForgeTrail

When your app completes a centralization pass, run **`prompts/propagate-to-forgetrail.md`** so templates, `TECHNICAL_REFERENCE`, and `CODE_QUALITY` stay aligned — generalize patterns only, not app-specific strings.
