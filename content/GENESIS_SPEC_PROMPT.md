# ForgeTrail — Genesis spec prompt (pre-Phase 1, external LLM chat)

Use this **before** Phase 1, in **any** LLM chat — ChatGPT, Claude, Grok, a local Ollama window, whatever you have open — not inside ForgeTrail's MCP tools. It produces a **`GENESIS.md`**: a "what, not how" build spec, focused on requirements and behavior rather than implementation, that you can then hand to a coding agent.

**Best fit:** ideas that wrap or extend an **existing app's data or file format** (plugins, converters, companion tools, importers/exporters). The shape generalizes to most "point an agent at this and build it" ideas even without that constraint.

**Relationship to ForgeTrail's own Phase 1 tools:**

- **`getGreenfieldIntakePrompt`** + `getChecklist(before-session-1)` are for **in-session** Phase 1 intake with the coding agent (exports, tenancy, hero flow, etc.) — use them when you're starting Phase 1 directly with no pre-written spec.
- **This prompt** runs **earlier and elsewhere** — a separate LLM chat, before you've even opened the coding agent — and produces a **portable artifact** (`GENESIS.md`) instead of an interactive Q&A. Use it when the idea needs upfront market/format research that's better done as its own pass, or when you want a spec you can shop between different coding agents/stacks without rewriting it.
- **They are complementary, not competing** — a `GENESIS.md` from this prompt is a perfectly good input to `getGreenfieldIntakePrompt`'s delivery questions (exports, tenancy, compliance) if those aren't already covered.

## After you have `GENESIS.md`

1. Save it in the project repo as **`docs/GENESIS.md`** (canonical path).
2. Follow the human recipe in **`TRY_FORGETRAIL.md`** (ForgeTrail repo root), or feed the spec into ForgeTrail Phase 1:
   - **Automatic draft:** call **`ingestPlanArtifact`** with the full `GENESIS.md` text as `planContent`. It maps headings like *Problem statement*, *Goals and non-goals*, *Required background on the data/file format*, *Core domain concepts*, *Edge cases*, *Milestones*, and *Open questions* into `docs/PHASE_1_BRIEF.md` sections, and extracts any `D1.`/`D2.`-style decisions into decision records for `appledger/`. Sections without a clean home (e.g. **Acceptance criteria** — the brief has no dedicated section for it) land in a "Plan sections not auto-mapped" footer — fold that into **§12 Handoff checklist** or its own appendix by hand.
   - **Manual walkthrough:** read `docs/GENESIS.md` together with the agent as context, then run **`getGreenfieldIntakePrompt`** + `getChecklist(before-session-1)` to confirm delivery details the spec might not cover (tenancy, compliance, live search, content-generation pattern).
3. Either way, **lock `docs/PHASE_1_BRIEF.md`** before Phase 2 scaffolding, per the normal Phase 1 exit criteria.

**Shape reference (fiction):** `content/examples/GENESIS_SAMPLE_mars-habitat-roster.md` — a Mars habitat duty roster (shared shift schedule in a sci-fi skin).

---

## Copy-paste prompt

Copy this, fill in the bracketed parts, and send it to an LLM chat.

---

I want to build **[tool idea, one sentence]**.

**The problem:** [what's currently painful, and what you're doing manually today as a workaround — e.g. "I export to CSV and diff in a spreadsheet"]

**Before you write the spec:**

1. Search for whether something like this already exists (tools, plugins, GitHub issues/feature requests for the underlying app, abandoned projects). Tell me what's out there, what it covers, and what it's missing. I want to know if I'm reinventing something or if this gap is real.
2. Research the underlying data format / file structure this tool needs to work with (e.g. how [the app] actually stores its data on disk — file formats, folder layout, versioning quirks, any non-obvious serialization behavior). I need this documented in the spec itself so my build agents don't have to rediscover it.

**Then write a detailed spec** for me to hand to coding agents, focused on **what** the tool does, not **how** to build it (leave stack/implementation choices to the builder unless a file format forces a specific approach). Structure it with:

- Problem statement
- Goals and explicit non-goals (v1 scope)
- Required background on the underlying data/file format the builder needs to know
- Core domain concepts/model
- Numbered functional requirements, grouped logically, each with a decimal-numbered checklist of specifics
- Non-functional requirements (performance, safety, platform, privacy)
- Edge cases the builder must handle — be exhaustive here, this is where naive implementations fail
- Suggested milestones (M1 = smallest usable version, building up)
- Acceptance criteria — concrete, testable "given X, then Y" statements
- Open questions for me to confirm before/during the build

**Constraints:**

- Local-only / [your privacy, platform, or stack constraints]
- [Any must-have safety behavior — e.g. "never modify source files without a backup"]
- [Any explicit out-of-scope items you already know you don't want]

**Format:** Deliver it as a markdown file I can hand off directly, not just inline chat text.

---

### Why this prompt works

- **Forces a validation step first** — you find out if the idea already exists before investing in a spec.
- **Forces the format research up front** — the hardest bugs in these tools come from misunderstanding the underlying file format, so making that a required section catches problems early instead of during a rewrite.
- **"What not how"** keeps the spec durable — you can hand it to different agents/stacks without rewriting it, and it won't go stale when a library changes.
- **Non-goals section** stops scope creep before it starts — just as important as the goals.
- **Edge cases + acceptance criteria** are what separate a spec that produces a demo from one that produces something you'll actually trust with real data.
- **Milestones** give you a working v1 fast instead of a big-bang build.
