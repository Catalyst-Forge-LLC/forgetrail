# ForgeTrail backlog

Methodology-repo work. App projects keep their own `TODO.md`. After a folder rename or a new chat, start from **[RESUME.md](RESUME.md)** (not `INITIAL_PROMPT.md`).

- [x] [ForgeTrail naming pass](specs/completed/forgetrail-rename.md): GitHub slug `Catalyst-Forge-LLC/forgetrail`. forgetrail.dev is live.
- [x] [forgetrail.dev FilePress site](site/README.md): live at https://forgetrail.dev. Preview: `pnpm site:dev`. Redeploy: `pnpm ship`.
- [x] [npm distribution](specs/completed/npm-distribution.md): `forgetrail@0.3.0` and `forgetrail-mcp@0.2.2` are on npm. Later releases: [docs/NPM.md](docs/NPM.md). Optional M4 (auto content root) is follow-on.
- [ ] [AppLedger spec pack](specs/app-ledger-spec-pack-v0.1.0/README.md): format checker and tracking migration live in sibling repo [appledger](https://github.com/Catalyst-Forge-LLC/appledger) (npm name staked at `0.0.0`). Tracking cutover is in this repo: new installs do not write `workflow_tracking.json`; kickoff runs `appledger init` when that command is installed; project state is `appledger/`. Site source matches that. forgetrail.dev and AppLedger.dev were not redeployed. Lite v2.2.0 and WORKFLOW now tell an agent to write `appledger/`, record a disposition when a subject exists, and leave a missing family `not_applicable`. They do not generate labels.
- [ ] [Companion tools](specs/partial/companion-tools.md): weave Catalyst Forge siblings into ForgeTrail as situation-triggered suggestions (FilePress, LocalHelm/LocalSlip, practice skills, and others). M1–M4 landed 2026-09-11; LocalSlip how (FilePress/Vite, no `ensure-lease`) 2026-09-15; leftover: ToolFacts viewer hash / live site ship.
