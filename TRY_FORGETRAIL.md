# Try ForgeTrail (no MCP required)

Prove ForgeTrail in one sitting: write a **what, not how** spec in any AI chat, drop it next to **ForgeTrail Lite**, and let your coding agent forge the path and keep the trail.

**Docs:** [forgetrail.dev/docs](https://forgetrail.dev/docs) (same recipe, plus CLI and MCP).

**You need:** any LLM chat (ChatGPT, Claude, Grok, a local Ollama UI, …) and any coding agent that can read files (Cursor, Claude Code, Codex, …).

**You do not need:** Node MCP setup, `pnpm run mcp:build`, or `forgetrail` on PATH (those are optional shortcuts below).

**Important:** Use a **new empty project folder**. Do not run this inside a clone of the ForgeTrail methodology repo.

---

## 15-minute recipe

1. **Get the Genesis prompt**  
   Open [`content/GENESIS_SPEC_PROMPT.md`](content/GENESIS_SPEC_PROMPT.md) (or the [raw file on GitHub](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/content/GENESIS_SPEC_PROMPT.md)). Copy the **Copy-paste prompt** section.

2. **Iterate a spec in your favorite chat app**  
   Fill the bracketed parts, send it, and refine until you trust the markdown. Optional shape reference: [`content/examples/GENESIS_SAMPLE_mars-habitat-roster.md`](content/examples/GENESIS_SAMPLE_mars-habitat-roster.md) (fictional Mars duty roster; relatable shared-schedule problem).

3. **Create a new project folder**  
   Example: `mkdir my-app && cd my-app`

4. **Add ForgeTrail Lite**  
   - **Copy:** save [`content/FORGETRAIL_LITE.md`](content/FORGETRAIL_LITE.md) as `.forgetrail/FORGETRAIL_LITE.md` in your project, **or**  
   - **CLI** (Node 20+):  
     `npx forgetrail install --lite`  
     Stub for Genesis too:  
     `npx forgetrail install --lite --with-genesis-stub`

5. **Save your spec as `docs/GENESIS.md`**  
   Create `docs/` if needed. That path is the canonical handoff for ForgeTrail (not the repo root).

6. **Open the folder in your coding agent** and paste this kickoff line:

> Follow `.forgetrail/FORGETRAIL_LITE.md` as the project protocol. Treat `docs/GENESIS.md` as the product spec (what, not how). Create `.forgetrail/workflow_tracking.json` and draft `docs/PHASE_1_BRIEF.md` from the Genesis file, asking me only about gaps. Do not scaffold application code until I explicitly approve the Phase 1 brief.

7. **Approve the Phase 1 brief** before any app scaffold. If the agent starts writing application code early, stop it and paste the kickoff line again.

---

## What “it worked” looks like

- [ ] `.forgetrail/FORGETRAIL_LITE.md` is present  
- [ ] `docs/GENESIS.md` is present  
- [ ] `.forgetrail/workflow_tracking.json` exists  
- [ ] `docs/PHASE_1_BRIEF.md` drafted from your Genesis (or clearly in progress)  
- [ ] The agent asked for approval before scaffolding  

Stuck? Open a [Try ForgeTrail checklist](https://github.com/Catalyst-Forge-LLC/forgetrail/issues/new?template=try-forgetrail-checklist.md) issue and mark how far you got.

---

## If you skip Genesis

No written idea yet? Tell the agent: *Follow `.forgetrail/FORGETRAIL_LITE.md`. Ask me the §5 intake questions before writing any code.* You can add `docs/GENESIS.md` later.

Already have a long PRD? Save it as `docs/GENESIS.md` and use the kickoff line above. Optionally run the Genesis prompt only to fill gaps (prior art, file-format research, edge cases).

---

## After the try: graduation ladder

1. **Stay on Lite** for small tools and weekend builds. Enough for many projects.  
2. **Add MCP** when you live in Cursor/Claude: `npx -y forgetrail-mcp` (set `FORGETRAIL_ROOT` to a `forgetrail` install or clone). See [mcp-server/README.md](mcp-server/README.md).  
3. **Full `_forgetrail/` install** when you need the whole template tree on disk (offline / no MCP). `npx forgetrail install` (without `--lite`).

---

## Related files

| File | Role |
|------|------|
| [`content/GENESIS_SPEC_PROMPT.md`](content/GENESIS_SPEC_PROMPT.md) | Prompt to paste into any LLM chat |
| [`content/examples/GENESIS_SAMPLE_mars-habitat-roster.md`](content/examples/GENESIS_SAMPLE_mars-habitat-roster.md) | Fictional sample Genesis |
| [`content/examples/two-session-continuity.md`](content/examples/two-session-continuity.md) | Labeled two-session tracking example |
| [`content/FORGETRAIL_LITE.md`](content/FORGETRAIL_LITE.md) | Portable agent protocol |
| [`content/GENESIS_STUB.md`](content/GENESIS_STUB.md) | Stub written by `--with-genesis-stub` |
| [`README.md`](README.md) | Full methodology overview |
