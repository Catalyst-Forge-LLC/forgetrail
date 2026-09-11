# Specs in the ForgeTrail repo

This folder holds **ForgeTrail methodology and meta-documentation** — not customer app feature specs (those live in each product repo's `specs/` per WORKFLOW.md).

**For app projects:** copy **`docs/SPEC_FEATURE_TEMPLATE.md`** (MCP: `getTemplate({ name: "SPEC_FEATURE_TEMPLATE" })`) into your app as `specs/[feature-name].md`. Lite ships a short skeleton in **`FORGETRAIL_LITE.md` §3.1**. Cursor rules: `content/cursor-rules/specs-and-todo.mdc` + `spec-completion.mdc`.

## Folder layout

| Path | Purpose |
|------|---------|
| `specs/` | Draft proposals and not-yet-started feature specs for ForgeTrail itself |
| `specs/partial/` | In-flight implementation specs (work started, not all criteria met) |
| `specs/completed/` | Fully implemented specs with an implementation summary |
| `specs/canonical/` | Living reference documents — methodology, evolution plans, archived strategy notes |

Canonical docs use `**Spec kind:** Canonical reference` in the header and track **catalog/evolution state**, not a delivery lifecycle. They stay in `canonical/` and evolve over time.

## In progress

| Document | Summary |
|----------|---------|
| `companion-tools.md` | Draft: map Catalyst Forge sibling tools into ForgeTrail as optional, situation-triggered suggestions |

## Completed

| Document | Summary |
|----------|---------|
| `completed/npm-distribution.md` | Two npm packages (`forgetrail`, `forgetrail-mcp`); Try stays no-Node |
| `completed/forgetrail-rename.md` | Naming pass, GitHub slug, live forgetrail.dev |
| `completed/forgetrail-new-user-experience.md` | NUX / README front door — Genesis + Lite prove-it path (M1–M4 done; M5 optional deferred) |

## Canonical references (current)

| Document | Summary |
|----------|---------|
| `canonical/forgetrail-modern-agents-evolution.md` | Modern agent integration (Grok, subagents, skills, MCP evolution) |
| `canonical/forgetrail-prelaunch-review.md` | Pre-adoption kit review (implemented 2026-06-01) |
| `canonical/forgetrail-as-product.md` | Archived paid-product draft — OSS is the shipping model |

For the full spec lifecycle model (draft → partial → completed vs canonical), see **WORKFLOW.md** Phase 4 and **`docs/SPEC_FEATURE_TEMPLATE.md`**.
