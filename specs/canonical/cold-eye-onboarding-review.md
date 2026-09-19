# Cold-eye Review: ForgeTrail Onboarding & Newcomer Experience

**Spec kind:** Canonical reference (Cold-eye readiness audit)  
**Status:** Open / Draft  
**Target artifact:** ForgeTrail onboarding documentation, Lite protocol, CLI installer, safety hooks, and MCP server configuration.  
**Subject under review:** Can a newcomer developer successfully bootstrap and run their first ForgeTrail project (both Lite/15-minute Try path and MCP-first path) without hitting undocumented failures or dead ends?  
**Review date:** 2026-09-18  
**Verdict:** **Conditional** (Core methodology and Lite protocol are sound, but critical path traps, contradictory folder conventions, and hardcoded environment paths will fail or confuse a newcomer on their first pass).

---

## 1. Scorecard

| Dimension | Grade | Diagnosis |
|:---|:---:|:---|
| **First-Run Friction** | **C+** | A user can get files into place, but path traps and kickoff phrasing cause early agent friction or broken MCP connections. |
| **Instruction Completeness** | **B-** | The 15-minute Try path is close, but Cursor rule discovery on Windows requires manual symlinking that fails under default permissions. |
| **Consistency & Cohesion** | **C** | The repo splits between modern `.forgetrail/` (dot) and legacy `_forgetrail/` (underscore) instructions across key prompt files. |
| **Tooling & Hook Safety** | **B+** | Hook scripts are robust, but assume Node and pnpm are universally available in subshells without fallback detection. |
| **Grounding & Accuracy** | **B-** | Several public setup snippets contain hardcoded developer paths (`Z:/workspace/forgetrail/...`) instead of portable or packaged commands. |

---

## 2. Ranked Contradictions

### C1. Hardcoded Developer Paths in Quickstart & Docs (High)
- **Where:** `TRY_FORGETRAIL.md` (lines 79–87), `mcp-server/README.md` (lines 105, 125, 134), `content/AGENT_INTEGRATION_grok.md` (line 79).
- **The contradiction:** The docs introduce ForgeTrail as an open-source tool installable anywhere via `npm` or git clone, but the copy-paste MCP configuration snippet in `TRY_FORGETRAIL.md` reads:
  ```json
  "args": ["Z:/workspace/forgetrail/mcp-server/dist/index.js"],
  "env": { "FORGETRAIL_ROOT": "Z:/workspace/forgetrail" }
  ```
- **Newcomer impact:** A developer on macOS, Linux, or a Windows machine without drive `Z:` copy-pastes this snippet into `.cursor/mcp.json` and immediately gets a dead, failing MCP server connection.

### C2. Dual Folder Conventions: `.forgetrail/` vs `_forgetrail/` (High)
- **Where:** `INITIAL_PROMPT.md` vs `NEW_PROJECT_BOOTSTRAP.md` vs `FORGETRAIL_LITE.md`.
- **The contradiction:** 
  - `INITIAL_PROMPT.md` line 52 states: *"ForgeTrail files live in `_forgetrail/` by default... Read `_forgetrail/WORKFLOW.md`... Read `_forgetrail/TRACKING_SCHEMA.md`"*.
  - But `NEW_PROJECT_BOOTSTRAP.md` line 3 states: *"The customer repo should not contain a copied `_forgetrail/` methodology tree... Only project-local state (chiefly `.forgetrail/workflow_tracking.json`) lives in the app repo."*
  - And `FORGETRAIL_LITE.md` puts everything in `.forgetrail/` (dot).
- **Newcomer impact:** If an MCP-first or Lite user pastes `INITIAL_PROMPT.md` into their agent, the agent reads the lower section and halts, asking where `_forgetrail/WORKFLOW.md` is because the folder does not exist.

### C3. "Node is optional" vs Default Stack and Hook Scripts (Medium)
- **Where:** `README.md` line 22 vs `FORGETRAIL_LITE.md` §4.1 vs `scripts/install.mjs`.
- **The contradiction:** The README states *"Node is optional"*. However:
  1. The default recommended stack throughout Lite is Default A (SvelteKit + TypeScript + Node 20+).
  2. The CLI installer automatically configures `.cursor/hooks.json` with commands like `"command": "node .forgetrail/hooks/guard-shell.mjs"`.
  3. If a user is not running Node, Cursor will throw hook execution failures on every shell invocation.
- **Newcomer impact:** Users building non-Node projects (e.g. Python, Go) or users without Node in their system PATH get broken hook execution.

### C4. Kickoff Prompt Overwrite Race (Medium)
- **Where:** `TRY_FORGETRAIL.md` (step 6) vs `content/GENESIS_STUB.md` vs `scripts/install.mjs`.
- **The contradiction:** When a user runs `forgetrail install --lite --with-genesis-stub`, the installer writes a fully formed, schema-valid `.forgetrail/workflow_tracking.json`. Then step 6 tells them to paste this prompt to their agent:
  > *"Create `.forgetrail/workflow_tracking.json` and draft `docs/PHASE_1_BRIEF.md`..."*
- **Newcomer impact:** The agent sees an instruction to *create* a file that already exists. Depending on the model, it either blindly clobbers the starter schema with a minimal dummy JSON, or stops and asks the user whether it should overwrite it.

---

## 3. Ranked Missing Instructions

### M1. Cursor Rules Orphaned by the Lite Installer (High)
- **Where:** `scripts/install.mjs` (lines 121–128).
- **The gap:** Running `forgetrail install --lite` copies Cursor rules into `.forgetrail/cursor/rules/*.mdc`. It also copies hooks directly into `.cursor/hooks.json`. But it does *not* write rules into `.cursor/rules/`.
- **Why it trips newcomers:** Cursor only discovers rules placed in `.cursor/rules/`. The documentation says "symlink or copy", but Windows users cannot symlink without Developer Mode or elevated privileges (Git Bash `ln -s` fails or creates shallow file copies). Because hooks were auto-installed into `.cursor/`, the user expects rules to work out of the box too. They do not, leaving Phase status and updates-log rules dormant.

### M2. Uninitialized Starter Triggers Validation Errors (Medium)
- **Where:** `content/LITE_WORKFLOW_TRACKING.json` vs `validate-tracking-core.mjs`.
- **The gap:** The tracking starter file shipped with Lite has `"project": { "name": "" }`. When an agent modifies or saves tracking, `validate-tracking-core.mjs` checks `project.name` and throws an issue: `"project.name is missing or empty."`
- **Why it trips newcomers:** On the very first turn, the agent gets a validation failure from the `afterFileEdit` hook before it has even had a chance to ask the user what the project is called or read Genesis.

### M3. Pre-commit Verification Runner Hardcoded to `pnpm` (Medium)
- **Where:** `content/hooks/guard-shell.mjs` (line 61).
- **The gap:** When checking whether to run verification before `git commit`, `guard-shell.mjs` runs `pnpm run verify`. If a project uses `npm` or `yarn` (or does not have `pnpm` globally installed in the execution environment), the pre-commit hook throws a shell error and blocks the commit.
- **Why it trips newcomers:** It needs a fallback to `yarn verify` or `npm run verify` based on existing lockfiles.

---

## 4. Ranked Unsupported or Misleading Claims

### U1. "One-line MCP connect" in `TRY_FORGETRAIL.md`
- **Claim:** Connecting MCP is the immediate next step with a snippet ready to copy.
- **Reality:** Providing a local Windows absolute path (`Z:/workspace/...`) makes the claim false for any external user. It should default to `npx -y forgetrail-mcp` or explain the placeholder clearly.

### U2. "Skip Genesis and just ask intake questions"
- **Claim:** `TRY_FORGETRAIL.md` says you can skip Genesis and tell the agent: *"Follow `.forgetrail/FORGETRAIL_LITE.md`. Ask me the §5 intake questions before writing any code."*
- **Reality:** If the agent doesn't have the MCP server connected and only has the Lite file, several §5 prompts refer to MCP tools (`getGreenfieldIntakePrompt`, `getChecklist`) that the agent cannot call without MCP.

---

## 5. Recommended Remediations

1. **Clean up hardcoded local paths:**
   - In `TRY_FORGETRAIL.md`, make the primary Cursor MCP snippet use `npx -y forgetrail-mcp`, and clearly label the local clone snippet with generic placeholders (`/path/to/forgetrail/mcp-server/dist/index.js`).
   - Clean up `mcp-server/README.md` and `content/AGENT_INTEGRATION_grok.md` to avoid referencing `Z:/workspace/forgetrail`.

2. **Fix Cursor rule placement in `scripts/install.mjs`:**
   - Update `runInstallLite` in `install.mjs` so that in addition to storing rules under `.forgetrail/cursor/rules/`, it also copies them directly into `.cursor/rules/` (just like it does for `.cursor/hooks.json`). This ensures out-of-the-box rule loading in Cursor across all platforms without manual symlinking.

3. **Align `INITIAL_PROMPT.md` with Modern ForgeTrail:**
   - Retire the legacy `_forgetrail/` (vendored) section from `INITIAL_PROMPT.md`, or move it to a clear secondary fallback at the very bottom.
   - Standardize all paths to `.forgetrail/`.

4. **Refine the Try Kickoff Line:**
   - Change *"Create `.forgetrail/workflow_tracking.json`"* to *"Initialize or update `.forgetrail/workflow_tracking.json` with the project name and metadata from Genesis"*.
   - In `content/LITE_WORKFLOW_TRACKING.json`, default `"name": "New Project"` or relax `validate-tracking-core.mjs` to issue a warning rather than an error during Phase 1 if the name is not yet set.

5. **Make `guard-shell.mjs` Package-Manager Aware:**
   - Check whether `pnpm-lock.yaml`, `yarn.lock`, or `package-lock.json` is present when selecting the runner for `run verify` (e.g. `pnpm run verify`, `yarn verify`, or `npm run verify`).
