# [App Name] — Phase 1 architecture brief

_Structured capture of planning and architecture **before** code scaffolding. Goal: Phase 2 (or a new agent/session) can start from this file + `.forgetrail/workflow_tracking.json` without re-reading the whole Phase 1 chat._

**Status:** `[draft | locked]`  
**Last updated:** `[ISO date]`  
**Phase 1 exit:** Do not mark Phase 1 complete in `.forgetrail/workflow_tracking.json` until this brief is **locked** and major commitments are in `decisions[]`.

---

## 1. Problem and outcome

**What we are building (2–4 sentences):**


**Project archetype:** `[product | internal-tool | one-shot]` _(WORKFLOW.md §1d — non-`product` archetypes prune later-phase exit criteria in the tracking file; log the pruning in `decisions[]`)_

**What “done” looks like for v1 (measurable where possible):**


---

## 2. Users and hero flow

**Primary user(s):**


**The single most important workflow (hero flow) end-to-end:**


**Secondary workflows (if any) for v1:**


---

## 3. Constraints

_Hard requirements the stack and design must respect._

- **Technical:** (e.g. must run on X, offline, no PII region, etc.)
- **Business / timeline:**
- **Explicit non-goals for v1:** (link to section 9 for detail)

---

## 4. Stack and tooling

_Confirmed choices only after user sign-off. Mirror the same choices into `CONTEXT_PROMPT.md` → Tech Stack in Phase 2._

| Area            | Choice   | Status (proposed / confirmed) | Notes / WHY |
| --------------- | -------- | ----------------------------- | ----------- |
| Framework       |          |                               |             |
| Language        |          |                               |             |
| DB / backend    |          |                               |             |
| Auth / storage  |          |                               |             |
| Styling         |          |                               |             |
| Deploy / CI     |          |                               |             |
| Git host        |          |                               |             |
| DNS             |          |                               | Cloudflare unless already specified |
| Registrar       |          |                               |             |
| Package manager |          |                               |             |

---

## 5. Data model (sketch)

_Entities and relationships — not full schemas. Enough for Phase 2 scaffolding._

**Core entities:**


**Relationships:**


**Existing data / migration:** _(none | describe import path)_


---

## 6. Integrations and external systems

_APIs, webhooks, LLM, payments, email, analytics, etc._

| Integration | Purpose | Auth / secrets | Risk notes |
| ------------- | ------- | -------------- | ---------- |
| LLM (if any)  | Content generation | Cloud: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, … **or** local: `OLLAMA_BASE_URL`, `OLLAMA_MODEL` (no cloud key) | Rate limits; field size limits; validate JSON at boundary |

---

## 6a. Content-generation pattern (only if LLM-produced content)

_Skip if content is hand-authored or from a non-LLM API._

| Field | Value |
| ----- | ----- |
| **Pattern** | _runtime API \| build-time seed \| BYO-LLM paste_ |
| **Provider / model** | _e.g. `openai/gpt-4o-mini`, `anthropic/claude-sonnet`, `ollama/ibm/granite4.1:8b`, `ollama/gemma3:4b`, BYO only_ |
| **Env vars** | _cloud keys and/or `OLLAMA_BASE_URL`, `OLLAMA_MODEL`_ |
| **Ollama launchers** (local runtime) | _setup-ollama.bat, test-ollama.bat after Phase 2 scaffold_ |
| **Validator / paths** | _e.g. Zod at `src/lib/...`, `data/seed.json`, prompt in `prompts/seed.md`_ |

> 💡 **Lesson learned:** **Local Ollama** fits the same three patterns as cloud — runtime routes call `/api/generate`; build-time seed calls Ollama once; BYO-LLM can mean the user runs a prompt in the Ollama desktop app and pastes JSON. Prefer **Granite 4.1** or **Gemma 3** for general product features; avoid reasoning-only models unless v1 explicitly needs chain-of-thought. See **ForgeTrail Lite** §7.1 and §4.8.

---

## 7. Hardest problems and risks

_What could blow schedule or architecture — honest list._

1.
2.
3.

---

## 8. Architectural decisions (numbered)

_Each decision should include **WHY** and what was rejected. **Also** add each major commitment to `.forgetrail/workflow_tracking.json` → `decisions[]` (id, timestamp, phase, decision, rationale, alternatives_considered)._

**D1.**


**D2.**


**D3.**


_(Add D4+ as needed.)_

---

## 9. Open questions (before or during Phase 2)

_Items that are not yet decided. Resolve or explicitly defer._

| # | Question | Owner / resolve by |
| - | -------- | ------------------ |
|   |          |                    |

---

## 10. Explicitly out of scope (v1)

_Bullet list — prevents scope creep during scaffold._


---

## 11. First feature batch (post-scaffold)

_Ordered list of what to build after the spine runs — aligns with initial `TODO.md`._


---

## 12. Handoff checklist (before leaving Phase 1)

- [ ] User has confirmed stack, folder shape, data sketch, hero flow, and v1 boundaries
- [ ] This brief is **locked** (no `[draft]` ambiguity) or remaining items are only in §9 Open questions
- [ ] `.forgetrail/workflow_tracking.json` updated: `decisions[]` for each major D#; `phases["1-architecture"]` notes summarize sign-off
- [ ] Phase 2 opener will read **this file** + `.forgetrail/workflow_tracking.json` first

> 💡 **Lesson learned:** Treat the brief and `decisions[]` as a pair: JSON is great for machine-structured history; the brief is great for the next human or agent to read in one pass. Duplicated rationale is OK — drift between them is not. After Phase 2 starts, **merge** this content into `CONTEXT_PROMPT.md` per the mapping in that template’s “Handoff from Phase 1” section.
