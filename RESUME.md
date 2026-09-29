# Resume ForgeTrail (this repo)

Use this file after a folder rename or a new chat. Do **not** use `INITIAL_PROMPT.md` or `CONTINUATION_PROMPT.md` here. Those start or resume **app** projects that adopt ForgeTrail.

**Paste this into a new chat:**

> Read `RESUME.md`, `docs/FORGETRAIL_RENAME.md`, and `TODO.md`. Do not restart the rename.

---

## Where we are (2026-08-20)

The product is **ForgeTrail** (https://forgetrail.dev is live). Tagline: **Forge the path. Keep the trail.** Category line: **A persistent development system for building software with AI agents.** Copy rules: `docs/FORGETRAIL_RENAME.md`.

This repo and sibling consumers were renamed (CLI `forgetrail`, `.forgetrail/`, Lite `FORGETRAIL_LITE.md` v2.0.0, MCP tools `getForgeTrail*`, env `FORGETRAIL_*`). Local clone is `Z:/workspace/forgetrail`. `.cursor/mcp.json` points at that path.

GitHub slug is **`Catalyst-Forge-LLC/forgetrail`**. The old `forge-kit` URL redirects.

The marketing site lives in **`site/`**. Preview: `pnpm site:dev`. Redeploy: `pnpm ship`.

npm: [`forgetrail@0.5.5`](https://www.npmjs.com/package/forgetrail) and [`forgetrail-mcp@0.4.3`](https://www.npmjs.com/package/forgetrail-mcp) match this tree and the registry as of 2026-09-29. Later content changes need a version bump before they publish. See [docs/NPM.md](docs/NPM.md). On Windows, prefer `pnpm dlx forgetrail` over npm 12 `npx`.

## Remaining

- P2 items in [specs/suite-cohesion-prelaunch-review.md](specs/suite-cohesion-prelaunch-review.md). This repository stays the template source. Application repositories carry `appledger/`.
- xFacts package names wait on the `@xfacts` npm org. The map is in the x-facts repo, `specs/NPM-NAMING.md`.

## Do not

- Re-run a full ForgeKit → ForgeTrail string replace.
- Use `INITIAL_PROMPT.md` or `CONTINUATION_PROMPT.md` as the kickoff for this methodology repo.
- Put the marketing site in a sibling `forgetrail-site` folder. It belongs in `site/`.
- Tell app repos to add `forgetrail` as a runtime dependency.
