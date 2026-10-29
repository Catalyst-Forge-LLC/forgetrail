---
title: "Build software with AI, from idea to release."
description: "ForgeTrail guides you and your coding agent from defining a project to building a working version, improving it, and preparing it to ship. Phase guidance and review checkpoints make the next step clear; AppLedger keeps the decisions, evidence, lessons, and handoffs with the project."
order: 0
---

<section class="value-hero" aria-label="ForgeTrail overview"><div class="value-intro"><p class="value-kind">Development system for you and your coding agent</p><h1 class="hero-phrased"><span class="hero-phrase">Build software with AI,</span> <span class="hero-phrase">from idea to release.</span></h1><p class="value-lede">ForgeTrail guides you and your coding agent from defining a project to building a working version, improving it, and preparing it to ship. Phase guidance and review checkpoints make the next step clear; AppLedger keeps the decisions, evidence, lessons, and handoffs with the project.</p><div class="cta-row"><a class="cta cta-primary" href="/try">Try ForgeTrail Lite</a><a class="cta cta-secondary" href="#from-idea-to-working-software">See a project take shape</a></div><p class="value-limit">Start with Lite. Manual use needs no Node or MCP. The agent must write the handoff and follow the approval gates.</p></div><figure class="value-proof"><figcaption>Illustrative project: desk-stamp</figcaption><p><strong>Before: an idea with unresolved choices</strong><br>A CLI to date Markdown notes. What should the first command do? Where should it keep data?</p><div class="value-result"><p><strong>With ForgeTrail: agree, then build</strong><br>Approve a short brief, record the choices in AppLedger, then build the first command end to end with checks.</p></div><p><strong>After: a working core and a next step</strong><br>You can run the command and inspect what passed. Stabilization and release checks have a place in the plan.</p><p class="value-note">Illustrative workflow, not a delivered customer project. You review the work before moving to the next phase.</p></figure></section>

## From idea to working software

Suppose you want **desk-stamp**, a small CLI that adds today's date to Markdown notes. ForgeTrail gives the work a sequence:

1. **Agree what to build.** The agent turns the idea into a brief: the first stamp command, files on disk, no database, and what a successful run must do. You review the choices before scaffolding.
2. **Build a complete first workflow.** The agent wires input, date stamping, file output, and checks into a runnable version. You can try the core task before adding more features.
3. **Improve and prepare it to ship.** Later phases cover stability, further features, refinement, product alignment, and release hardening. Exit criteria make unfinished work visible at each review.

The full method has seven phases: **Plan, Build spine, Stabilize, Iterate, Refine, Align, and Harden**. Lite concentrates on agreeing the project and building its first runnable workflow. Scale the process to the project; a weekend tool does not need every phase.

## Two sessions

A fictional example: **desk-stamp**, a weekend CLI that stamps today's date on markdown notes.

**Session one.** You write a short spec and paste the kickoff line. The agent drafts the Phase 1 brief, asks about the gaps, and waits. You approve it. The agent records the phase, the decision to keep everything on disk with no database, a Windows install gotcha, and a note for next time: agree the first stamp command, then scaffold.

**Session two, days later.** You open a fresh chat in the same folder and say "continue." The agent reads the ledger first. It does not reopen the database question. It asks only about the first stamp command, the last open Phase 1 item. Once you agree, it asks to move to Phase 2 and follows that phase's guidance: scaffold the app, wire the main flow end to end, and add a passing `verify` script.

## What the agent writes

The record is `appledger/` in your project: `profiles/forgetrail.yaml` for the phase, and records for decisions, lessons, and the session handoff. AppLedger holds the project record; ForgeTrail supplies the development method. A shortened excerpt from the end of session one:

```yaml
phase: plan
status: in_progress
choice: TypeScript CLI, files on disk only, no hosted store
left_off: Phase 1 brief approved. The first stamp command is not agreed.
next_steps:
  - Agree the first stamp command, then scaffold.
```

ForgeTrail instructs the agent to read that ledger, preserve approved decisions, and pause at approval gates. The agent must write the handoff. Those updates are not automatic. Optional hooks point a new session at `appledger/` and remind it to update the session record. The full example is on [Continuity](/docs/continuity).

## One system, three parts

ForgeTrail uses [AppLedger](https://appledger.dev) as its project record. ForgeTrail defines how the work proceeds; AppLedger keeps what the project is for, how it fits together, and the decisions and evidence behind it. AppLedger can also be used without ForgeTrail. Optional [xFacts](https://xfacts.dev) labels describe the resulting software for readers considering adoption.

## Start with Lite

The recommended first path is [Try](/try): write a what-not-how spec, drop in ForgeTrail Lite, and paste one kickoff line. No Node and no MCP required if you copy the Lite file by hand.

You do not have to run all seven phases. Lite is enough for a small tool. The shortest supported first task is: create `appledger/`, draft `docs/PHASE_1_BRIEF.md`, and wait for you to approve that brief before any application scaffold.

## Then the installer and MCP

| Path | Who uses it | What it is |
| --- | --- | --- |
| **Lite** | Anyone with a coding agent that reads files | One protocol file. The agent writes `appledger/`. |
| **CLI** (`forgetrail`) | People with Node.js 20+ who want files placed | Installer. Writes Lite and Cursor hooks, or the full template tree. Skips files that already exist. Does not run the agent. |
| **MCP** (`forgetrail-mcp`) | Cursor or Claude users who want tools in the IDE | Phase guidance, templates, and lessons search. The ledger still lives in the app repo. |

Do not add `forgetrail` to an app's `dependencies`. The trail is the files in your project.

Lessons shipped in Lite and in MCP search are first-party notes from Catalyst Forge production work. They are not independent adoption evidence.

Flags, the phase table, and install details live in the [docs](/docs).

Open source under [Apache License 2.0](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/LICENSE). Built by [Catalyst Forge](https://catalystforge.com).
