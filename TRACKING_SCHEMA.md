# Project record

Phase, decisions, sessions, and gotchas live in **`appledger/`**.

- **`appledger/profiles/forgetrail.yaml`** holds the current phase instance and criteria. Phase ids are `plan`, `build`, `stabilize`, `iterate`, `refine`, `align`, and `harden`.
- Decision records, session records, and lesson or question records live under **`appledger/records/`**.
- Do **not** create or update **`.forgetrail/workflow_tracking.json`**. `.forgetrail/` is hooks and host integration.
- If that JSON file already exists and its `status` is not `pointer`, preserve it; current migration is retired. Historical recovery is documented at https://appledger.dev/docs/migration-retirement. Do not keep a second decision log.
- A file with `"status": "pointer"` and `"record": "appledger/"` is a leftover pointer. Do not add decisions, sessions, or phase status to it.

`getInitialWorkflowTracking` does not return a starter JSON file. `validateTracking` classifies an existing file. It does not accept a legacy document as healthy writable state.

The legacy shapes and starter are retained in ForgeTrail Git history at commit `3863f68e01d6f57823ffbc2a94b626defeef9bfe`. Current hooks and MCP only reject a writable legacy file or identify an inert pointer; they do not validate or translate the retired format.
