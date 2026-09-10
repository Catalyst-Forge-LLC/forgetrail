---
title: Try ForgeTrail
description: Prove ForgeTrail in one sitting with a Genesis spec and ForgeTrail Lite. No MCP required.
order: 1
---

Prove ForgeTrail in one sitting: write a **what, not how** spec, drop it next to **ForgeTrail Lite**, and let your coding agent create the tracking file the next chat will read.

**You need:** any LLM chat and any coding agent that reads files.

**You do not need:** Node, MCP, or `forgetrail` on PATH.

**Important:** Use a **new empty project folder**. Do not run this inside a clone of the ForgeTrail methodology repo.

The first artifact to look for is `.forgetrail/workflow_tracking.json`. How a second session uses it: [Continuity](/docs/continuity).

## Kickoff

1. Write `docs/GENESIS.md` (what, not how) in a new empty folder.
2. Add Lite: copy [FORGETRAIL_LITE.md](https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/content/FORGETRAIL_LITE.md) to `.forgetrail/FORGETRAIL_LITE.md`. Node optional: `pnpm dlx forgetrail install --lite --with-genesis-stub`.
3. Paste the kickoff line from the [Try docs](/docs/try). Approve the Phase 1 brief before any scaffold.

<div class="cta-row">
  <a class="cta cta-primary" href="/docs/try">Full recipe in the docs →</a>
  <a class="cta cta-secondary" href="/docs">Install, CLI, MCP</a>
</div>

Stuck? Open a [Try ForgeTrail checklist](https://github.com/Catalyst-Forge-LLC/forgetrail/issues/new?template=try-forgetrail-checklist.md) issue.
