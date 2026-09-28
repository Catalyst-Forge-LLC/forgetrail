# ForgeTrail, AppLedger, and xFacts — suite cohesion review before promotion

**Spec kind:** Delivery
**Status:** Draft. P0 fixes are published and forgetrail.dev is redeployed. appledger.dev still serves the old text. See §9. P1 and P2 are open.
**Date:** 2026-09-28
**Related:** [`app-ledger-spec-pack-v0.1.0/`](app-ledger-spec-pack-v0.1.0/), [`partial/companion-tools.md`](partial/companion-tools.md), [`canonical/forgetrail-prelaunch-review.md`](canonical/forgetrail-prelaunch-review.md), root [`TODO.md`](../TODO.md)
**Surfaces:** `README.md`, `content/FORGETRAIL_LITE.md`, `content/companion-tools.json`, `scripts/forgetrail-cli.mjs`, `scripts/mcp-status.mjs`, `mcp-server/`, `content/hooks/`, `site/`; sibling repos `appledger`, `x-facts`, `app-facts`, `feature-facts`, `tool-facts`, `skill-facts`, `agent-facts`, `model-facts`; catalystforge.com tools shelf

---

## 1. Problem

The operator wants to promote ForgeTrail, AppLedger, and xFacts together this week. The three are pitched as one system: ForgeTrail runs the work, AppLedger keeps the record, and xFacts labels describe what was built. This review asks whether a newcomer who arrives from a promotion link can use them as one system, and whether the public surfaces agree with each other.

The short answer is no, not yet. Each part works on its own. The joins between them are where a newcomer fails:

- The MCP path from the README gives misleading failures without a manual root setting.
- No ForgeTrail surface says how to get the `appledger` command.
- AppLedger does not see xFacts labels that already exist in the same repository.
- Several live pages still describe the pre-ledger design, including ForgeTrail's own labels on the xFacts sites.

## 2. Goals

1. List every defect found, with the evidence that shows it, so each one can be fixed or consciously accepted.
2. Separate what must be fixed before promotion from what can wait.
3. Give each blocking finding an acceptance check that can be run again.

### Non-goals

- This document does not apply fixes, publish packages, or deploy sites.
- It does not re-review each xFacts schema, each companion tool's internals, or the 7-phase methodology content.
- It does not measure whether agents follow the protocol better with the ledger than with the old tracking file. The pilot did not claim that and neither does this review.

## 3. How the review was done

All checks ran on the afternoon of 2026-09-28, local time UTC-4, on the maintainer's Windows machine with Node v24.17.0 and pnpm 10.30.1. The sites had been redeployed earlier that day.

- **Registry.** `curl https://registry.npmjs.org/<name>/latest` for each suite and companion name. `npm view` was not used because it has returned cached versions right after a publish.
- **Live sites.** HTTP status for 40 URLs across the suite, companion, and shelf domains. Page text was extracted from forgetrail.dev, appledger.dev, xfacts.dev, featurefacts.dev, agentfacts.dev, and catalystforge.com/tools/. A word count of `appledger` and `forgetrail` was taken on each xFacts site.
- **Cold new-project trial.** In an empty temporary folder: `pnpm dlx forgetrail@0.5.2 install --lite --with-genesis-stub`, then `pnpm dlx appledger@0.1.1 init`, `check`, `orient`, `subjects`, and `reconcile`. The installed session hooks were run directly.
- **MCP trial.** `pnpm dlx forgetrail-mcp@0.4.1` with `FORGETRAIL_ROOT` unset, driven over stdio with JSON-RPC `initialize`, then `ping`, `getPhaseGuidance`, `getNewProjectKickoff`, and `searchLessons`.
- **Config helper.** `forgetrail mcp cursor-config` from both `pnpm dlx forgetrail@0.5.2` and the global `forgetrail@0.5.2`.
- **Integration.** `appledger subjects` in repos that already carry `APP_FACTS.md` or `FEATURE_FACTS.md` (filepress, localslip, coldeye, feature-facts), and in the appledger repo itself.
- **Source reads.** README, Lite, companion mapping, hooks, MCP sources, `TOOL_FACTS.md`, and the example labels in the xFacts repos.

Not done: a browser visual pass, a mobile pass, reading every page of every companion site, running any xFacts generator, or asking a fresh agent to hand-write a ledger from Lite alone.

---

## 4. What already works

These held up and should be kept as they are.

- **The published cold path runs.** `forgetrail@0.5.2 install --lite` wrote Lite, rules, hooks, and a Genesis stub, and did not write a tracking file. `appledger@0.1.1 init --name "Trial App"` wrote four files. `check` returned ok. `orient` printed a short brief with the pending purpose criterion under Gaps.
- **Hooks agree with the ledger.** The installed `session-start.mjs` points the agent at `appledger/` and says not to update `workflow_tracking.json`. `session-stop.mjs` asks for the session record.
- **The fleet migration held.** All 27 migrated repositories pass `appledger check`, carry a pointer file, and were even with their upstream at the last check.
- **Every product domain answers.** forgetrail.dev, appledger.dev, xfacts.dev, and the six family sites return 200. So do all 14 companion homepages in `content/companion-tools.json`, plus catalystforge.com/tools/. The only failures were anticonfab.dev (no response) and engram.dev (403). Neither is in the companion mapping.
- **Limits language is consistent.** Across the ledger, the labels, and the sites, the wording keeps separating structure from truth, declaration from enforcement, and a missing source from an absent subject. That is a real strength for a skeptical audience.

---

## 5. Findings

Severity:

- **P0:** a newcomer following a public instruction fails, or a public page contradicts the product. Fix before promotion.
- **P1:** visible to a careful reader, or weakens the "one system" claim. Fix this week if possible.
- **P2:** after promotion.

### P0-1. The MCP path in the README fails quietly without `FORGETRAIL_ROOT`

**Evidence.** The README says: "MCP: `npx -y forgetrail-mcp` with `FORGETRAIL_ROOT` set." The docs say the variable can be omitted "only when `forgetrail` is resolvable next to the MCP package," which never holds for `npx` or `pnpm dlx`. With the variable unset, `forgetrail-mcp@0.4.1` set its root to its own `node_modules` folder. `ping` reported `WORKFLOW.md: missing`. The content tools then failed with misleading messages:

| Call | Response |
| --- | --- |
| `getPhaseGuidance({ phase: "1" })` | `Phase "1" not found. Available phases: 1 (Architecture), …` |
| `getNewProjectKickoff({})` | `NEW_PROJECT_BOOTSTRAP.md not found. Ensure FORGETRAIL_ROOT points at the ForgeTrail repo root.` |
| `searchLessons({ query: "pocketbase" })` | `No lessons found matching "pocketbase". … The lesson database covers: PocketBase, …` |

An agent reading those responses would conclude the phase does not exist or that no lesson applies. It would not conclude that the server is misconfigured.

The docs also never say where a global `forgetrail` install puts its files. On this machine that path is `C:/Users/<user>/AppData/Local/pnpm/global/5/.pnpm/forgetrail@0.5.2/node_modules/forgetrail`.

**Fix direction.** Open RESUME item M4 (find content without `FORGETRAIL_ROOT`) is this defect. Options, not yet chosen:

- (a) Make `forgetrail` a dependency of `forgetrail-mcp` and resolve it by default.
- (b) Ship the methodology content inside the MCP tarball.

Either way, every content tool should return one explicit error when the root is missing ("ForgeTrail content was not found at … Set FORGETRAIL_ROOT …"), not a domain answer.

**Acceptance.** With `FORGETRAIL_ROOT` unset, `pnpm dlx forgetrail-mcp@<next>` answers `getPhaseGuidance({ phase: "1" })` with the Phase 1 text. If content still cannot be found, every content tool names the missing root. None of them reports "not found" or "no lessons" for a valid input.

### P0-2. `forgetrail mcp cursor-config` prints a path to a file the package does not contain

**Evidence.** From both `pnpm dlx forgetrail@0.5.2` and the global `forgetrail@0.5.2`, the helper prints `"command": "node"` with `…/node_modules/forgetrail/mcp-server/dist/index.js`. The `forgetrail` package `files` list has no `mcp-server/`. Listing the installed package confirms there is no `mcp-server` directory. From `pnpm dlx`, the printed paths also point into a temporary dlx cache folder. The docs recommend this helper as the easy path, but the config it prints cannot start. The helper works only from a clone after `pnpm run mcp:build`, which is what the maintainer's machine uses.

**Fix direction.** When `mcp-server/dist/index.js` does not exist beside the CLI, print the `forgetrail-mcp` package form, with `FORGETRAIL_ROOT` set to the installed `forgetrail` path. If the CLI runs from a dlx cache, say the path is temporary and recommend `pnpm add -g forgetrail`.

**Acceptance.** Run from a global install, the config that `forgetrail mcp cursor-config` prints starts the server, and `ping` reports `WORKFLOW.md: found`.

### P0-3. No ForgeTrail surface says how to get the `appledger` command

**Evidence.**

- A search of `content/`, `WORKFLOW.md`, the prompts, `TRY_FORGETRAIL.md`, `README.md`, `site/docs`, `site/pages`, and `mcp-server/src` for `pnpm dlx appledger`, `pnpm add -g appledger`, `npx appledger`, or `npm install -g appledger` returned zero matches.
- The installer ends with `Next: see TRY_FORGETRAIL.md in the ForgeTrail repo` and does not mention AppLedger.
- `content/FORGETRAIL_LITE.md`, the primary path, never names `appledger init`. Line 323 tells the agent to create `manifest.yaml`, `profiles/forgetrail.yaml`, an application record, and a session record. It gives no field list, no example, and no check step.
- The live forgetrail.dev install page still says of the CLI: "It is not a published npm release." `appledger@0.1.1` is published.
- The MCP kickoff text does name `appledger init` and has a hand-written fallback. The Lite path, which the README recommends first, does not.

Without the CLI, an agent following Lite must invent a YAML format that it cannot validate. Whether agents produce a ledger that passes `appledger check` from Lite alone was not tested.

This also creates a gap with the Try page's "Node optional" framing. The ledger has no practical validation without Node.

**Fix direction.**

- Lite §4 step 4 names `pnpm dlx appledger init --name "<name>"` then `appledger check`, and keeps the hand-written path as the fallback with a pointer to `examples/minimal`.
- The installer's `Next:` line names the same two commands.
- The install page drops "not a published npm release" and shows one install line.
- Decide whether `forgetrail install` should offer to run `appledger init`. This is a product decision for the operator.

**Acceptance.** In an empty folder, following only the README and Lite, a reader reaches a ledger that passes `appledger check` without consulting the AppLedger repository.

### P0-4. appledger.dev says it is not deployed and that the package is a name hold

**Evidence.** The live home page at https://appledger.dev reads: "This site is not deployed to AppLedger.dev. … The published npm package appledger@0.0.0 is a name hold, not this checker." The source is `site/pages/home.md` line 11. Similar sentences are in `site/pages/changelog.md` ("The npm package remains the `0.0.0` name hold", "AppLedger.dev is not deployed") and `site/pages/standard.md` ("It is not deployed").

In the repository, `README.md` still says "`appledger@0.1.0` is this source. `0.0.0` remains the name hold until you publish `0.1.0`" and "Domain | https://appledger.dev (not deployed)". `spec/README.md` says the same in two places.

**Fix direction.** Rewrite those sentences to state what is true now: `appledger@0.1.1` on npm, the site at appledger.dev, and one install line. Leave the historical test-count sentences in `docs/rel-01.md` unchanged. Add a new dated sentence for the current release.

**Acceptance.** None of the phrases "name hold", "not deployed", or `0.0.0` appears on the live appledger.dev pages or in the AppLedger `README.md` and `spec/README.md`, except as a dated historical note.

### P0-5. The ForgeTrail README contradicts itself about the record

**Evidence.** `README.md` line 16 says: "The record is `.forgetrail/workflow_tracking.json`." Line 47 says: "A new install does not create `.forgetrail/workflow_tracking.json`." Line 14 says the agent will "read tracking". The README is the GitHub front door and the npm package page. The live forgetrail.dev home page is correct.

**Fix direction.** Line 16 names `appledger/` and links the continuity example. Line 14 says "read the ledger".

**Acceptance.** `README.md` names `workflow_tracking.json` only as the legacy file that migrate replaces.

### P0-6. AppLedger does not see the xFacts labels that already exist

This is the finding that most weakens the "one system" claim.

**Evidence.**

- filepress, localslip, and coldeye each carry `APP_FACTS.md`. localslip and the feature-facts repository carry `FEATURE_FACTS.md`. All four have migrated ledgers.
- In every one, `appledger/manifest.yaml` has `bindings: []`.
- `appledger subjects` prints `unsupported appfacts …: The application is a subject and no register is bound.` The same line appears for featurefacts, including in the FeatureFacts repository itself.
- No command creates a binding. `src/cli.ts` has no bind operation. `migrate apply` and `init` do not look for root-level `*_FACTS.md` files. The bundled `examples/minimal` also has `bindings: []`. Bound labels exist only in hand-written test fixtures.
- The word "unsupported" reads as "AppLedger cannot handle AppFacts". The actual state is that a label exists and has not been linked.

**Fix direction.**

- (a) `subjects --operation discover` reports root-level `APP_FACTS.md`, `FEATURE_FACTS.md`, `TOOL_FACTS.md`, `SKILL_FACTS.md`, `AGENT_FACTS.md`, and `MODEL_FACTS.md` files, and proposes a binding.
- (b) `subjects --operation bind --apply`, or `reconcile --apply`, writes that binding through a transaction. It does not rewrite the label.
- (c) `migrate apply` proposes the same binding when those files exist.
- (d) Rename the disposition for "label present, not bound" so it does not read as unsupported.
- (e) Bind at least one real repository and show `subjects --operation validate` passing before the suite page claims the integration.

**Acceptance.** In the filepress repository, one command binds the existing `APP_FACTS.md`. `appledger subjects` then reports it as bound. `subjects --operation validate` checks it against the pinned AppFacts schema. The label bytes are unchanged.

**If not fixed this week,** promote AppLedger and xFacts as compatible, not integrated: "AppLedger can point at an xFacts label", not "AppLedger maintains your labels".

---

### P1-1. ForgeTrail's own labels on the xFacts sites describe the old design

xfacts.dev says "We wear them" and names ForgeTrail's ToolFacts and SkillFacts as examples.

**Evidence.**

- The skillfacts.dev example (`skill-facts/site/examples/forgetrail/SKILL_FACTS.md`) says the skill will "maintain `.forgetrail/workflow_tracking.json` as the system of record". ForgeTrail's own `content/skills/forgetrail/SKILL_FACTS.md` now says `appledger/`.
- The toolfacts.dev example (`tool-facts/site/examples/forgetrail-mcp/TOOL_FACTS.md`) describes `getInitialWorkflowTracking` as "Return starter .forgetrail/workflow_tracking.json". It describes `validateTracking` as validating against schema and phase rules, and `ingestPlanArtifact` as writing `decisions[]` entries. ForgeTrail's `mcp-server/TOOL_FACTS.md` is at 0.4.1 and describes the pointer model.
- The viewer links in ForgeTrail's `README.md` encode the label in the URL. Decoding them shows the ToolFacts payload at version `0.3.10` and the SkillFacts payload at `0.3.0`. Both mention `workflow_tracking` and neither mentions `appledger`.
- The AgentFacts example `agent-facts/examples/forgetrail-reference/AGENT_FACTS.md`, shown on agentfacts.dev, says `count: 31` and describes filesystem reach through "the ForgeTrail tracking-validation tool (`validateTracking`)". The current ToolFacts label lists 32 tools.

**Fix direction.** Copy the current ForgeTrail labels into the three xFacts example folders and redeploy those sites. Regenerate the three README viewer links from the current files. Update the AgentFacts example count and reach text.

**Acceptance.** No xFacts site example for ForgeTrail mentions `workflow_tracking.json` as the live record. The README viewer links decode to the versions in the repository.

### P1-2. The sites do not link to each other as one system

**Evidence.**

- The word `appledger` appears zero times on xfacts.dev, appfacts.dev, featurefacts.dev, toolfacts.dev, skillfacts.dev, modelfacts.dev, agentfacts.dev, and catalystforge.com/tools/.
- The shelf lists 24 tools and no AppLedger.
- appledger.dev links to ForgeTrail and Catalyst Forge in its footer, not to xFacts.
- forgetrail.dev mentions AppLedger only in the docs.

A reader who lands on any one site cannot find the other two parts.

**Fix direction.** Add one short "how the three fit" paragraph, with the same wording, to forgetrail.dev, appledger.dev, and xfacts.dev. Add AppLedger to the Catalyst Forge shelf. Add an xFacts footer link on appledger.dev.

**Acceptance.** From each of the three home pages, the other two are one click away.

### P1-3. Two companion offers still describe the old model

**Evidence.** In `content/companion-tools.json`:

- Gap Last: "Log leftovers in gotchas[]." `gotchas[]` was a tracking-file field. Unresolved items are now question records in `appledger/`.
- xFacts (`ship-label`): "xFacts labels … are the house standard for shipped products. Write a label when the product is public or handed off." Lite and WORKFLOW now say to record a disposition for each subject, and to generate a label only if the user asks.

**Fix direction.** Gap Last: "Record leftovers as open question records in appledger/." xFacts: "When the product is public or handed off, offer an xFacts label. Record the subject disposition either way."

**Acceptance.** `rg 'gotchas\[\]|house standard' content/companion-tools.json` returns nothing. The MCP `getCompanionSuggestions` output matches after a `forgetrail-mcp` release.

### P1-4. The MCP banner and tool descriptions still name the old kickoff pieces

**Evidence.** `forgetrail-mcp@0.4.1` prints on start: "Granular: getNewProjectBootstrap + getInitialWorkflowTracking + …" and "ingestPlanArtifact (approved plan → PHASE_1_BRIEF + decisions[])". `getInitialWorkflowTracking` now returns ledger init text.

**Fix direction.** Drop `getInitialWorkflowTracking` from the granular list, or rename it in the banner as "ledger init text". Say that `ingestPlanArtifact` produces decision records.

**Acceptance.** The banner and the ToolFacts purposes do not mention `decisions[]` or the starter tracking file.

### P1-5. AppLedger's own ledger is a poor first demo

A newcomer who clones AppLedger and runs `appledger orient` sees this.

**Evidence.**

- Phase: `Plan is in_progress`, after two npm releases.
- 22 work records, all `in_progress`, including shipped commands such as init, diff, and reconcile.
- Session left off: "Package 0.1.0 is published. The timezone fix is not in that published package. … AppLedger.dev and forgetrail.dev are not deployed." All three statements are now false.
- `orient --budget 300` printed well over 300 words, ending with "The brief exceeds the word budget so that recorded gaps stay visible." The overrun is mostly the work list, not the gaps. The work list is never trimmed.

**Fix direction.**

- This needs an operator decision. Earlier work deliberately did not mass-flip work to done. Options: close each shipped work record with its existing evidence, or leave it and explain in the README why work stays open.
- Advance the profile phase to match what shipped.
- Rewrite the session `left_off` and `next_steps`.
- In `orient`, count the work list against the budget and summarize overflow as "N more in progress", the way related records are already dropped.

**Acceptance.** `appledger orient` in the appledger repository shows a phase and handoff that match the npm and site state. `--budget 300` stays within budget when no gaps are recorded.

### P1-6. npm names for the xFacts families are not settled

**Evidence.**

- No xFacts family is published: `xfacts`, `featurefacts`, `appfacts`, `toolfacts`, `skillfacts`, `modelfacts`, and the dashed forms all return not found.
- `agentfacts@0.1.2` is published by another account (`xr3less`, repository `github.com/xr3less/agentfacts`, created 2026-08-05). Its description, "See what your coding agent actually did, next to what it said it did.", is close to AgentFacts' own subject. Someone who searches npm after the promotion will find that package.
- FeatureFacts and four other family sites give `git clone` as the install path. featurefacts.dev says the CLI "is not on npm yet".
- `engram` and `curator` on npm belong to unrelated authors from 2014 and 2011. This matters only if those two tools are promoted by name.

**Fix direction.** This is an operator decision before promotion:

- reserve the unscoped names that are still free, following the name-hold rule;
- move the families to a scope such as `@catalyst-forge/agentfacts`; or
- state on agentfacts.dev that the npm package of that name is not this project.

**Acceptance.** The decision is recorded. Every family site's install instruction matches what npm or the clone actually provides.

### P1-7. forgetrail.dev has no `llms.txt`

**Evidence.** `https://forgetrail.dev/llms.txt` returns 404. appledger.dev and xfacts.dev both serve one. ForgeTrail's audience is agent users, so this is the one site where agents are most likely to look.

**Fix direction.** Add `site/static/llms.txt` as an index to Lite, WORKFLOW, the docs, and the MCP page. Keep it an index, the same rule as AppLedger.

**Acceptance.** The URL returns 200 and lists the Lite path first.

### P1-8. Neither CLI answers `--version`

**Evidence.** `forgetrail --version` prints "Unknown command: --version". `appledger --version` prints "--version is not implemented." A bug report or support exchange usually starts with that command.

**Fix direction.** Print the package version and exit 0 for `--version` and `-v` in both CLIs.

**Acceptance.** Both commands print the version that `package.json` records.

---

### P2-1. Hooks do not check ledger edits or use `orient`

`afterFileEdit` validates only `workflow_tracking.json`, so an agent's hand edit under `appledger/` is never checked. `session-start` says "Read the latest session record" without saying how to pick it; session files are named by UUID. Fix direction: when `appledger` is on PATH, `session-start` adds the `appledger orient` output, and `afterFileEdit` runs `appledger check` for paths under `appledger/`. When the command is absent, keep the current text.

### P2-2. The ForgeTrail repository does not keep its own ledger

AppLedger and 27 app repositories use the ledger. The methodology repository uses `RESUME.md` and `TODO.md` by rule. A promotion audience may ask whether the maintainer uses the record on the tool itself. Either add a ledger here, or say on the site that the methodology repository is a template source and that the apps carry ledgers.

### P2-3. Stale internal status text

- `RESUME.md` says `forgetrail@0.5.1` and that `forgetrail-mcp` 0.4.1 "is not published yet".
- `docs/NPM.md` lists 0.5.1/0.5.1 and 0.4.1/0.4.0. The registry shows `forgetrail` 0.5.2 and `forgetrail-mcp` 0.4.1.
- `specs/README.md` still says "xFacts maintenance inside ForgeTrail phases is still open". That work landed in commit `ac8576c`.
- `docs/rel-01.md` says npm still has the name hold. Add a dated sentence; do not rewrite the historical counts.

### P2-4. `getPhaseGuidance` rejects a numeric phase

`getPhaseGuidance({ phase: 1 })` fails input validation ("Expected string, received number"). Agents often send numbers. Accept both.

### P2-5. Later-phase templates still name `decisions[]`

These were deferred when kickoff was fixed:

- `SYSTEM_HEALTH_CHECKS.md`
- `ONE_CLICK_DEV_SETUP.md`
- the PocketBase schema script doc
- `docs/SPEC_FEATURE_TEMPLATE.md`
- `prompts/propagate-to-forgetrail.md`
- `prompts/second-family-critique.md`

They are not on the first-run path.

### P2-6. Known AppLedger product gaps

These are already recorded elsewhere and are listed here so the promotion copy does not overclaim:

- Source locators are not implemented, so a moved component cannot be matched.
- Many conformance rows in `docs/rel-01.md` are "not tested" or "partial".
- Promotion copy should not say the format is fully conformance-tested.

### P2-7. Companion homepages mostly show no install command

A text scrape of the companion homepages found a copyable install line only on ingotvault.dev (`pnpm add -g ingotvault`). It found `git clone` lines on toolfacts.dev, appfacts.dev, modelfacts.dev, and agentfacts.dev. The scrape strips HTML and may miss commands split across tags, so treat this as a lead to spot-check, not a confirmed defect. `coldeye` is on npm with no bin; confirm its site says how it runs.

---

## 6. Proposed order before promotion

1. P0-5 and P0-4: text-only fixes to the two front doors. Redeploy appledger.dev.
2. P0-3: Lite, installer `Next:` line, and install page name `appledger init` and `appledger check`. Redeploy forgetrail.dev.
3. P0-1 and P0-2: MCP content resolution, explicit missing-root errors, and a working `cursor-config`. Needs a `forgetrail` and `forgetrail-mcp` release, which the operator publishes.
4. P0-6: bind existing labels, or narrow the promotion wording as described there. Needs an `appledger` release if implemented.
5. P1-1 through P1-4: refresh ForgeTrail's labels on the xFacts sites, cross-link the three sites, and fix the companion and banner text.
6. P1-5 through P1-8 as time allows.

If only one day is available, do steps 1 and 2, and use the narrower promotion wording from P0-6. Point MCP users to the clone-based setup, which works today, until step 3 ships.

## 7. Open decisions for the operator

- Should `forgetrail install` offer to run `appledger init`, or only print the command? (P0-3)
- Should `forgetrail-mcp` depend on `forgetrail`, or ship the content itself? (P0-1)
- Which npm naming approach for the xFacts families, and what to say about the third-party `agentfacts` package? (P1-6)
- Should shipped work records in the AppLedger ledger be closed with their evidence? (P1-5)
- Should the ForgeTrail repository carry its own ledger? (P2-2)

## 8. Acceptance for this review

This spec is complete when each P0 finding is either fixed, with its acceptance check re-run and the result dated here, or explicitly accepted by the operator with the promotion wording adjusted. P1 and P2 findings move to root `TODO.md` or the owning repository's backlog.

## 9. P0 fix record (2026-09-28)

Decisions taken for §7: `forgetrail-mcp` depends on `forgetrail` (`^0.5.2`). `forgetrail install` prints the `appledger init` and `appledger check` commands and does not run them.

| Item | Fix | Check re-run |
| --- | --- | --- |
| P0-1 | `forgetrail-mcp` 0.4.2 resolves content from the `forgetrail` dependency. When no content is found, `ping` says `content missing` and every other tool returns an error that names the missing root instead of an answer. | Packed 0.4.2 in a temporary project with no `FORGETRAIL_ROOT`: `getPhaseGuidance` and the kickoff returned content. With a bad root, every tool except `ping` returned the error. |
| P0-2 | From an npm install, `forgetrail mcp cursor-config` prints `npx -y forgetrail-mcp`, with `FORGETRAIL_ROOT` only for a lasting install path. The other `mcp` subcommands say they need a clone. | Packed `forgetrail` in a temporary project: `cursor-config` printed the npx form. `scripts/tracking-cutover.test.mjs` covers it. |
| P0-3 | Lite v2.2.1 step 4, the installer's `Next:` lines, the README, and `site/docs/install.md` name `pnpm dlx appledger init` and `pnpm dlx appledger check`. | `scripts/tracking-cutover.test.mjs`: 8 passed at 14:25 local time (UTC-4). |
| P0-4 | appledger.dev pages, `llms.txt`, and the AppLedger READMEs say the package is on npm and the site is deployed. | AppLedger commit `965320e`. The live site changes only after a redeploy. |
| P0-5 | The README names the AppLedger ledger in `appledger/` as the record. | Text check. |
| P0-6 | AppLedger 0.1.2 adds `appledger bind`. An unbound `APP_FACTS.md` or FeatureFacts register is `needs_review`, an absent one is `not_applicable`, and a bound one is `unchanged`. | AppLedger `pnpm test`: 62 passed. A temporary filepress clone bound `APP_FACTS.md` in one command, validated it against pinned AppFacts, and left its bytes unchanged. No local ledger was bound. |

Still required from the operator: bump and publish `forgetrail` (the tree is 0.5.2, which is already on npm), then publish `forgetrail-mcp` 0.4.2 and `appledger` 0.1.2, and redeploy both sites. Until `forgetrail` is republished, the published Lite and installer lack the P0-3 text. The 27 migrated ledgers have no bindings until `appledger bind --apply` runs in each.

Later on 2026-09-28 the operator published `forgetrail` 0.5.3, `forgetrail-mcp` 0.4.2, and `appledger` 0.1.2. The local MCP server's `ping` reported `ok` and version 0.4.2 with the clone as its root. forgetrail.dev/docs/install/ names `appledger init` and `appledger check`. appledger.dev still says "name hold" and "not deployed", and /docs/quickstart/ returns 404, so AppLedger commit `965320e` is not deployed.

Fleet binding with the published `appledger@0.1.2`: 18 of the 27 migrated repositories had a label at the root. `bind --apply` added 22 bindings, 8 for `APP_FACTS.md` and 14 for `.featurefacts/features.yaml`. In each repository the label digests were unchanged, `check` reported no errors, `subjects --operation validate` accepted every bound label, and only `appledger/manifest.yaml` changed. Each repository has one local commit, vaulted and not pushed. The other 9 have no label, and their application families are `not_applicable`.

### New finding from the binding run

**Most FeatureFacts registers are unfilled starters.** 13 of the 14 bound registers have `scan_id: scan-init`, product type `unknown`, and `features: []`. They validate because an empty selection is valid. Only `feature-facts` lists a feature. Do not use one of these repositories as a FeatureFacts demo until its register has been scanned and reviewed.
