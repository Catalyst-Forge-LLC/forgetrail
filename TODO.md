# ForgeTrail backlog

Methodology-repo work. App projects keep their own `TODO.md`. After a folder rename or a new chat, start from **[RESUME.md](RESUME.md)** (not `INITIAL_PROMPT.md`).

- [x] [ForgeTrail naming pass](specs/completed/forgetrail-rename.md): GitHub slug `Catalyst-Forge-LLC/forgetrail`. forgetrail.dev is live.
- [x] [forgetrail.dev FilePress site](site/README.md): live at https://forgetrail.dev. Preview: `pnpm site:dev`. Redeploy: `pnpm ship`.
- [x] [npm distribution](specs/completed/npm-distribution.md): `forgetrail@0.3.0` and `forgetrail-mcp@0.2.2` are on npm. Later releases: [docs/NPM.md](docs/NPM.md). Optional M4 (auto content root) is follow-on.
- [x] [AppLedger spec pack](specs/app-ledger-spec-pack-v0.1.0/README.md): format checker and tracking migration live in sibling repo [appledger](https://github.com/Catalyst-Forge-LLC/appledger) (`appledger@0.1.5` on npm). Tracking cutover is in this repo. Project state for apps is `appledger/`. This methodology repo keeps its backlog here.
- [ ] [Companion tools](specs/partial/companion-tools.md): weave Catalyst Forge siblings into ForgeTrail as situation-triggered suggestions (FilePress, LocalHelm/LocalSlip, practice skills, and others). M1–M4 landed 2026-09-11; LocalSlip how (FilePress/Vite, no `ensure-lease`) 2026-09-15. ToolFacts viewer links were refreshed 2026-09-28. Open suite follow-ups are in [specs/suite-cohesion-prelaunch-review.md](specs/suite-cohesion-prelaunch-review.md).
