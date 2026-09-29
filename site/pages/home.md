---
title: Guide your agent through building solid software, and keep the trail between sessions.
description: A development method for agent-assisted builds. Seven phases with approval gates, and the project's phase, decisions, and lessons kept in the repository so the next session picks up where the last one stopped.
order: 0
---

ForgeTrail gives your next coding session a place to start. It keeps the phase, decisions, and handoff in your repository so an agent can read them when you resume.

Start with Lite for a small project. Add the full templates or MCP when you need them. You do not have to run all seven phases to try the method. ForgeTrail ships as files your agent reads and follows, plus an optional installer, MCP server, and hooks. It is not a library or a SaaS.

<div class="cta-row">
  <a class="cta cta-primary" href="/try">Try ForgeTrail Lite</a>
  <a class="cta cta-secondary" href="/docs">Read the docs</a>
  <a class="cta cta-secondary" href="https://github.com/Catalyst-Forge-LLC/forgetrail">View on GitHub</a>
</div>

## Two sessions

A fictional example: **desk-stamp**, a weekend CLI that stamps today's date on markdown notes.

**Session one.** You write a short spec and paste the kickoff line. The agent drafts the Phase 1 brief, asks about the gaps, and waits. You approve it. The agent records the phase, the decision to keep everything on disk with no database, a Windows install gotcha, and a note for next time: agree the first stamp command, then scaffold.

**Session two, days later.** You open a fresh chat in the same folder and say "continue." The agent reads the ledger first. It does not reopen the database question. It asks only about the first stamp command, the last open Phase 1 item. Once you agree, it asks to move to Phase 2 and follows that phase's guidance: scaffold the app, wire the main flow end to end, and add a passing `verify` script.

## What the agent writes

The record is `appledger/` in your project: `profiles/forgetrail.yaml` for the phase, and records for decisions, lessons, and the session handoff. A new install does not create `.forgetrail/workflow_tracking.json`. The ForgeTrail repository is the template source, and its backlog stays in `RESUME.md` and `TODO.md`. Application repositories carry the ledger. A shortened excerpt from the end of session one:

```yaml
phase: plan
status: in_progress
choice: TypeScript CLI, files on disk only, no hosted store
left_off: Phase 1 brief approved. The first stamp command is not agreed.
next_steps:
  - Agree the first stamp command, then scaffold.
```

ForgeTrail instructs the agent to read that ledger, preserve approved decisions, and pause at approval gates. The agent must write the handoff. Those updates are not automatic. Optional hooks point a new session at `appledger/` and remind it to update the session record. If an older project still has a writable tracking file, `appledger migrate preview` then `apply` replaces that file with a pointer. The full example is on [Continuity](/docs/continuity).

## One system, three parts

[ForgeTrail](https://forgetrail.dev) guides the work through phases with approval gates. [AppLedger](https://appledger.dev) keeps the record of that work in `appledger/`. [xFacts](https://xfacts.dev) labels describe what was built. Each works on its own.

## Start with Lite

The recommended first path is [Try](/try): write a what-not-how spec, drop in ForgeTrail Lite, and paste one kickoff line. No Node and no MCP required if you copy the Lite file by hand.

You do not have to run all seven phases. Lite is enough for a small tool. The shortest supported first task is: create `appledger/`, draft `docs/PHASE_1_BRIEF.md`, and wait for you to approve that brief before any application scaffold.

## Then the installer and MCP

| Path | Who uses it | What it is |
| --- | --- | --- |
| **Lite** | Anyone with a coding agent that reads files | One protocol file. The agent writes `appledger/`. |
| **CLI** (`forgetrail`) | People with Node.js 20+ who want files placed | Installer. Writes Lite and Cursor hooks, or the full template tree. It does not write a tracking JSON file. Skips files that already exist. Does not run the agent. |
| **MCP** (`forgetrail-mcp`) | Cursor or Claude users who want tools in the IDE | Phase guidance, templates, and lessons search. The ledger still lives in the app repo. |

Do not add `forgetrail` to an app's `dependencies`. The trail is the files in your project.

Lessons shipped in Lite and in MCP search are first-party notes from Catalyst Forge production work. They are not independent adoption evidence.

Flags, the phase table, and install details live in the [docs](/docs).

Open source under [Apache License 2.0](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/LICENSE). Built by [Catalyst Forge](https://catalystforge.com).
