# Greenfield product intake (Phase 1 helper)

Use alongside **`getChecklist`** section `before-session-1`. That checklist covers *problem, stack, assets, hero flow* at a high level. This document adds **delivery and product-shape** questions so Phase 1 does not miss exports, tenancy, hosting, or “how literal is the spec.”

**Already have a written spec (e.g. `docs/GENESIS.md`)?** Feed it into **`ingestPlanArtifact`** first, then use this document only to fill gaps (delivery, tenancy, compliance, live search) it may not cover. If the user has only an idea, **`getGenesisSpecPrompt`** (or human recipe **`TRY_FORGETRAIL.md`**) produces a portable spec via an external LLM chat before you run through these questions.

**Agent:** Walk through these with the user (or infer from context and confirm). Record answers in **`docs/PHASE_1_BRIEF.md`** (§1–3, §6–8 as needed) and **`.forgetrail/workflow_tracking.json` → `decisions[]`**.

---

## 0. Project archetype (ask or infer first)

- **Is this a product, an internal tool, or a one-shot?** — **product** (others will use it, possibly pay), **internal-tool** (real recurring users, no market), **one-shot** (gift, event page, demo — one occasion, then done). Often obvious from the problem statement; confirm rather than interrogate.
- The archetype **prunes the lifecycle**: internal tools make Phase 6 optional and drop payments/business-plan criteria from Phase 7; one-shots collapse phases 5–7 into a single polish-and-ship gate. See **WORKFLOW.md §1d**.
- Record in **`PHASE_1_BRIEF.md`**, **`decisions[]`**, and **`project.archetype`** in the tracking file, then prune the tracking template's exit criteria to match (log the pruning as a decision).

## 1. Outputs and formats

- **What must users be able to export or download?** (e.g. PDF, DOCX, PPTX, Markdown, CSV)
- **Is the product primarily read in-app, or is export the primary deliverable?**

## 2. Tenancy and users

- **Single organization per deployment, or many?** (e.g. consultants with **many clients** → multi-tenant accounts, client workspaces, or org switcher)
- **Who signs up / pays?** (consultant firm vs end-client org)
- **Roles:** admin, editor, viewer — needed for v1 or later?

## 3. How the “spec” becomes the product

- **Full automation from a fixed spec**, **fully AI-generated**, or **hybrid** (structured sections + optional narrative; **skip sections** that do not apply per org)?
- **Source of truth:** single canonical doc (e.g. DOCX/PDF) vs living templates in repo?

## 4. Compliance and data sensitivity (even if “none yet”)

- **Explicit “none at this phase”** is fine — still note it so Phase 7 hardening revisits.
- Any **region**, **retention**, or **enterprise** expectations on the horizon?

## 5. Hero flow (v1 success path)

- **One sentence:** e.g. *Sign up → onboarding wizard → generated playbook v1 → view in app → export PDF / DOCX / PPTX.*
- **What proves the spine works?** (first real export, first saved client, etc.)

## 6. Live web search and current events

- **Does v1 need answers grounded in the public internet** (not only the model’s training data)? Research assistants, RAG over fresh pages, news, and “what happened this week” flows usually do.
- If **yes**, the human will likely need a **search API** key before the spine can return real data. **Common developer starting points** (verify current free tiers and limits on the vendor site):
  - **[Tavily](https://tavily.com/)** — built for LLM/agent retrieval; [docs](https://docs.tavily.com/) · [pricing](https://tavily.com/pricing)
  - **[Brave Search API](https://api-dashboard.search.brave.com/)** — web, news, and more; [pricing](https://api-dashboard.search.brave.com/documentation/pricing) (renewable **monthly credits** for new accounts — set usage caps in the dashboard)
- Record **which provider** and **env var names** in `PHASE_1_BRIEF` / `decisions[]`. **ForgeTrail Lite** §4.4 mirrors this for copy-paste (`content/FORGETRAIL_LITE.md`).

## 7. State persistence (web apps only)

Ask this **before** locking PocketBase + auth into the stack. Wrong answer here = weeks of unused auth flow or, worse, a "local app" that silently depends on a backend that is inconvenient to run locally.

- **Does any state need to outlive the current browser?** Accounts, cross-device sync, shared data between users, admin/curator editing a catalog multiple users read — **yes**. Personal notes, offline-first tools, a single-user dashboard that reloads the same local data — **no**.
- If **no** (A-local): drop PocketBase + auth; `localStorage` / `IndexedDB` for persistence; **`adapter-static`** is viable; no runtime secrets; deploy on free static hosts. An **interactive** A-local app still uses SvelteKit. **FilePress** is for a Markdown site (docs, writing, event page) or an optional `site/` beside the app, not a replacement for the app.
- If **yes** (A-persistent): full Default-A stack — SvelteKit + PocketBase + `adapter-node`; accounts, sessions, server-only writes.
- Record the choice in **`PHASE_1_BRIEF.md` §4** (`State persistence:` row) and **`decisions[]`**. **ForgeTrail Lite** §7 (A-local vs A-persistent) has the longer write-up.

## 8. Content-generation pattern (only if content is produced by an LLM)

Skip this section entirely if content is hand-authored or pulled from a conventional (non-LLM) API. If an LLM **generates** content that the app displays, pick **one** of three patterns **in Phase 1** — it drives deploy model, cost, and secret management:

- **Runtime LLM API** — server route (e.g. `src/routes/api/suggest/+server.ts`) calls the provider per request; rate-limit + streaming UX; server runtime required (not `adapter-static`). **Provider choice:**
  - **Cloud** (OpenAI, Anthropic, …) — API key in `.env`; cost scales with traffic.
  - **Local Ollama** — `OLLAMA_BASE_URL`, `OLLAMA_MODEL`; no cloud key. Phase 2: **`setup-ollama`** / **`test-ollama`** (VRAM-aware pull; default **ibm/granite4.1:8b** or **gemma3:4b** — avoid thinking/reasoning models unless **`OLLAMA_USE_THINKING=1`** and the brief requires it). See **SYSTEM_HEALTH_CHECKS.md**, **FORGETRAIL_LITE** §4.8.
- **Build-time LLM generation** — `scripts/seed.ts` via `pnpm run seed` calls the provider once, writes JSON into `data/`, commits it. Zero runtime LLM cost; pairs well with A-local + `adapter-static`. Seed script may use **cloud** or **Ollama** (same env vars; only needed when running seed).
- **BYO-LLM paste pattern** — prompt in the repo; user runs it in **their own** LLM (ChatGPT, Claude, local Ollama chat, etc.); pastes JSON into e.g. `data/seed.json`; Zod validates at app start. Zero project-level API keys.

Ask which **provider and model** (e.g. `ollama/ibm/granite4.1:8b`, `openai/gpt-4o-mini`, or BYO only). Record pattern, provider, env var names, paths, and validator in **`PHASE_1_BRIEF.md`** (content-generation section) and **`decisions[]`**. **ForgeTrail Lite** §7.1 has skeletons for OpenAI, Ollama, seed, and BYO-LLM.

If the choice is **local Ollama**, you may offer **ollanet** (host manager) and later **Finetuna** (runtime tuner). Keep **`setup-ollama`** / **`test-ollama`** as the in-repo health path. Optional: `getCompanionSuggestions` situations `local-ollama` / `ollama-vram`.

---

## 9. Registrar, DNS, git, and hosting

Ask only what is still open. If the user already named a provider, record it and do not migrate them.

- **Git host** — GitHub unless they already use something else.
- **Registrar** — wherever the domain already lives (Namecheap, Cloudflare Registrar, …).
- **DNS** — if unspecified, prefer **Cloudflare** (free plan: DNS, edge TLS, basic protection). Typical pattern: domain at any registrar, nameservers pointed at Cloudflare.
- **Production host** — static site (FilePress or `adapter-static`): **Cloudflare Pages** + Wrangler, $0. App that needs a server: DigitalOcean (or similar) origin **behind** Cloudflare DNS.

Record git host, DNS, registrar, and deploy target in **`PHASE_1_BRIEF.md` §4** and **`decisions[]`**.

---

## 10. Workstation and personal capture (optional)

Do **not** put these in the first user-facing message. Ask only if they did not already come up.

- **Other local apps?** If this machine already runs (or will run) two or more local apps, offer **LocalSlip** (named ports) and **LocalHelm** (status board). Skip on a first single-app machine.
- **Spoken ideas?** If they capture ideas by voice or want a local journal beside the repo, offer **DictaWhisper**. Audio stays on their computer. It is a personal tool, not part of the app stack.

These are optional companions (`getCompanionSuggestions`). Decline is success.

---

## Why this exists

`before-session-1` alone does not spell out **project archetype (product vs internal tool vs one-shot)**, **exports** (including slide decks), **multi-tenant consulting**, **hybrid vs full spec**, **live web search needs**, **state persistence (local vs accounts)**, **LLM-content generation pattern**, or **registrar / DNS / git / hosting** — common sources of rework if captured only late in Phase 1.
