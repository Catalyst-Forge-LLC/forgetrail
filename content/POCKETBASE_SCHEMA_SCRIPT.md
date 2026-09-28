# PocketBase: script collections from `.env` (Phase 2)

Manual admin-UI collection setup (click-through wizards) does not scale across machines, CI, or new contributors. **Prefer an idempotent script** that uses **admin credentials from `.env`** to create or update collections to match your spec (e.g. `docs/pocketbase-setup.md`).

---

## What the human does (high level)

**Prefer one-click launchers** (ForgeTrail **ONE_CLICK_DEV_SETUP.md** / **FORGETRAIL_LITE.md** §4.5) — not a list of terminal commands.

1. **`cp .env.example .env`** — set **base URL including port** (e.g. `PUBLIC_POCKETBASE_URL=http://127.0.0.1:8096` or your app’s convention) and **admin** credentials used only for local/dev automation:
   - `POCKETBASE_ADMIN_EMAIL`
   - `POCKETBASE_ADMIN_PASSWORD`
   - **Port matters on multi-project machines.** If another PocketBase is already bound, change the port in `.env` — do not assume **8090**.
   - **`POCKETBASE_VERSION`** — leave unset or `latest` for first install (downloads current release); pin a semver only after a successful boot.
2. **Double-click `setup.bat`** (Windows) or run **`setup.sh`** (Mac/Linux) — installs deps, downloads PocketBase (**latest** unless pinned), safe to run twice.
3. **Double-click `run.bat`** / **`run.sh`** — starts PocketBase if needed, then the app. First PocketBase run may require completing superuser setup in the browser URL shown in the console.
4. **Schema (agent or one terminal):** `pnpm run pocketbase:schema` after PocketBase is up — idempotent; replaces manual Admin UI collection wizards.
5. **PocketBase broken?** double-click **`test-pocketbase.bat`** / **`pnpm run test:pocketbase`** — isolated health check (**`SYSTEM_HEALTH_CHECKS.md`**).
6. **Check progress:** double-click **`status.bat`** / **`status.sh`** or open **`docs/FORGETRAIL_PROGRESS.md`**.
7. Walk the hero flow; mark Phase 2 criteria met in `appledger/profiles/forgetrail.yaml`, with evidence, when dev runs, data appears, CRUD works, and the full journey passes.

---

## What the app repo should add

| Piece | Role |
|--------|------|
| **`docs/pocketbase-setup.md`** (or similar) | Human-readable spec: collection names, fields, rules, indexes — **source of truth for reviewers**. |
| **`scripts/ensure-pocketbase-schema.ts`** (or `.mjs`) | Implements that spec via PocketBase **Admin API** (or SDK) using URL + admin email/password from env. |
| **`pnpm` script** | e.g. `"pocketbase:schema": "tsx scripts/ensure-pocketbase-schema.ts"` — name is up to you; align with **`SCAFFOLD_INSTALL.json`** → `pnpmScripts` if you document it there. |

The script should:

- **Load env** without printing secrets (never log passwords).
- **Authenticate** as superuser/admin (PocketBase’s admin auth flow for your version).
- **Upsert collections** (create if missing; optionally patch fields/rules when you intentionally change the spec — document migration policy in the repo).
- **Exit non-zero** on failure so CI/agents don’t silently continue.

---

## Why not only the Admin UI?

- Repeatable **clone → bootstrap → schema → dev** without a checklist of clicks.
- Same path for **optional CI** (headless) later, if you add a service token or test instance.
- Keeps **`POCKETBASE_ADMIN_*`** as the single automation secret for local schema apply (still **gitignored**; never ship admin creds to production patterns unchanged).

---

## Relation to `getScaffoldInstallParams`

**`SCAFFOLD_INSTALL.json`** (via **`getScaffoldInstallParams`**) covers **binary install**, ports, and folders (`pocketbase/`, `pb_data`). Schema automation is a **second** script layered on top after PocketBase is running — reference both from your README Phase 2 section.
