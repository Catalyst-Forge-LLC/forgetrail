# [Feature name] — feature spec

_Copy into your app repo as `specs/[feature-name].md` (kebab-case). Fill bracketed placeholders. Delete guidance blockquotes before locking the draft if you want a lean file. For MCP: `getTemplate({ name: "SPEC_FEATURE_TEMPLATE" })`._

**Spec kind:** `[Delivery | Canonical reference]`  
**Status:** `[Draft | Partial | Implemented | Canonical; …]`  
**Date:** `[YYYY-MM-DD]`  
**Related:** `[TODO.md item, PHASE_1_BRIEF, other specs, issues]`  
**Surfaces (optional):** `[components, routes, scripts this touches]`

> 🔧 **Guidance:** Use **Delivery** for time-boxed feature work (lifecycle: `specs/` → `partial/` → `completed/`). Use **Canonical reference** only for living catalogs that stay in `specs/canonical/` and never move for “done.” See ForgeTrail WORKFLOW.md Phase 4 and `.cursor/rules/specs-and-todo.mdc` when present.

> 🔧 **Lite cut:** For a small change, keep header + §1–§3 + §5 (proposed behavior only) + §8 + §9. Skip data/API/UI subsections that do not apply. Still require testable acceptance criteria.

---

## 1. Problem

**What is painful today:**


**Friction / current workaround (if any):**


---

## 2. Goals

1.
2.
3.

### Non-goals

_What this pass will not do. Prevents scope creep._

-
-

---

## 3. Background / current state

_Optional. What exists today (code, data, UX) that the builder must know. Link files; do not paste large dumps._


---

## 4. Core concepts / definitions

_Optional. Domain terms, enums, or mental model unique to this feature._


---

## 5. Proposed approach / Design

_Prefer **what** the system does over **how** to implement it, unless a format or existing module forces a path. Delete subsections that do not apply._

### 5.1 Behavior

_When the user does X, the system does Y. Step-by-step or bullets._


### 5.2 Data model

_Entities, fields, migrations, PocketBase collections, local storage keys, etc._


### 5.3 API / integrations

_Routes, webhooks, LLM calls, external APIs, env vars._


### 5.4 UI / UX

_Surfaces, empty/loading/error states, copy notes, a11y._


### 5.5 Files (optional)

| New | Modified |
| --- | -------- |
|     |          |

---

## 6. Edge cases and risks

-
-

| Risk | Mitigation |
| ---- | ---------- |
|      |            |

---

## 7. Milestones / phasing (optional)

| Milestone | Outcome |
| --------- | ------- |
| M1        | Smallest usable slice |
| M2        |                         |

---

## 8. Verifier and Acceptance Criteria

### 8.1 Verifier command
_Exact automated command(s) that verify this feature (e.g. `pnpm run test:feature`, `pnpm run verify`, or dedicated test script). A delivery spec without a runnable verifier command fails spec review._

```bash
pnpm test
```

### 8.2 Acceptance criteria (boolean-checkable)
_Testable binary pass/fail checks. Avoid vague qualifiers ("performant", "clean"). The feature is not done until each criterion evaluates to true._

- [ ] Given ..., when ..., then ...
- [ ] Given ..., when ..., then ...

---

## 9. Open questions

| # | Question | Blocking? | Owner |
| - | -------- | --------- | ----- |
| 1 |          | yes/no    |       |

---

## 10. Decisions (optional)

_Lock choices here (and mirror major ones into `.forgetrail/workflow_tracking.json` → `decisions[]` when they are architectural)._

**D1.**


---

## Progress (while Partial)

_Date-stamped notes while work is in `specs/partial/`. Remove or fold into Implementation summary when completed._

- `[YYYY-MM-DD]:` …

---

## Implementation summary

_Required when moving a **Delivery** spec to `specs/completed/`. Leave empty until then._

**Implemented:** `[YYYY-MM-DD]`

1. …
2. …

**Verification:** `[e.g. pnpm check / test / manual walkthrough]`

---

> 💡 **Lesson learned:** Specs are session anchors. When the agent context resets, a filled spec plus `TODO.md` beats rediscovering intent from chat. Write the spec **before** multi-file implementation; move it to `partial/` when work starts; append this summary and move to `completed/` when acceptance criteria are met.
