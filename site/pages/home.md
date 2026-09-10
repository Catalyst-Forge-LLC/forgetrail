---
title: ForgeTrail
description: Keep project decisions, development state, and lessons in the repository so your next AI-assisted session can continue with context.
order: 0
---

**Forge the path. Keep the trail.**

Keep project decisions, development state, and lessons in the repository so your next AI-assisted session can continue with context. ForgeTrail is a methodology encoded in files your agent reads, follows, and updates. It is not a library, a SaaS, or a plugin.

After one sitting you should have a live `.forgetrail/workflow_tracking.json` with the phase you are in, a decision, and a line that tells the next chat what to do.

```json
{
  "schemaVersion": "lite-1",
  "currentPhase": 1,
  "decisions": [
    {
      "decision": "TypeScript CLI, files on disk only, no hosted store",
      "why": "Weekend tool. A database would be a second product."
    }
  ],
  "sessions": [
    {
      "nextSession": "Agree the first stamp command, then scaffold."
    }
  ]
}
```

That excerpt is labeled and shortened from the [two-session example](/docs/continuity). A new chat in the same folder reads the file instead of reconstructing the plan from memory.

<div class="cta-row">
  <a class="cta cta-primary" href="/try">Try ForgeTrail Lite</a>
  <a class="cta cta-secondary" href="/docs">Read the docs</a>
  <a class="cta cta-secondary" href="https://github.com/Catalyst-Forge-LLC/forgetrail">View on GitHub</a>
</div>

## Start with Lite

The recommended first path is [Try](/try): write a what-not-how spec, drop in ForgeTrail Lite, and paste one kickoff line. No Node and no MCP required if you copy the Lite file by hand.

You do not have to run all seven phases. Lite is enough for a small tool. The shortest supported first task is: create tracking, draft `docs/PHASE_1_BRIEF.md`, and wait for you to approve that brief before any application scaffold.

## Then the installer and MCP

| Path | Who uses it | What it is |
| --- | --- | --- |
| **Lite** | Anyone with a coding agent that reads files | One protocol file. The agent writes tracking. |
| **CLI** (`forgetrail`) | People with Node.js 20+ who want files placed | Installer. Writes Lite or the full template tree. Does not run the agent. |
| **MCP** (`forgetrail-mcp`) | Cursor or Claude users who want tools in the IDE | Methodology tools. Tracking still lives in the app repo. |

Do not add `forgetrail` to an app's `dependencies`. The trail is the files in your project.

Lessons shipped in Lite and in MCP search are first-party notes from Catalyst Forge production work. They are not independent adoption evidence. [Continuity](/docs/continuity) shows one decision and one gotcha changing the next session.

Flags, the phase table, and install details live in the [docs](/docs).

Open source under [Apache License 2.0](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/LICENSE). Built by [Catalyst Forge](https://catalystforge.com).
