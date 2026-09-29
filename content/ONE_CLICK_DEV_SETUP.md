# One-click dev setup (ForgeTrail / Lite Phase 2)

**Goal:** A non-technical operator never copies a dozen terminal commands. The **agent** creates safe, idempotent launchers; the human **double-clicks** (or runs one `pnpm` script).

Upstream reference scripts: `content/scripts/` (`forgetrail-dev-launcher.mjs`, `setup-pocketbase.mjs`, `test-pocketbase.mjs`, `setup-ollama.mjs`, `test-ollama.mjs`, `forgetrail-env.mjs`). Isolated checks: **`SYSTEM_HEALTH_CHECKS.md`**.

---

## Agent obligations

1. **Do not** paste long manual command lists to the user for routine setup — **create** the files below in Phase 2.
2. **Do not** hardcode PocketBase (or any tool) versions in ForgeTrail docs alone — resolve **latest at install** unless the user locked a version in `.env` (see **FORGETRAIL_LITE.md** §4.2.2).
3. **Run** `pnpm install` and script creation yourself when possible; launchers are for **repeat** runs and non-agent operators.
4. After every phase transition, refresh **`docs/FORGETRAIL_PROGRESS.md`** (or tell the user to double-click **status.bat**).

---

## Files to create at repo root (Phase 2)

| File | Purpose |
|------|---------|
| `setup.bat` / `setup.sh` | First-time (or refresh) install — deps, PocketBase binary, optional schema |
| `run.bat` / `run.sh` | Start PocketBase if needed + app dev server |
| `status.bat` / `status.sh` | Print ForgeTrail phase + write `docs/FORGETRAIL_PROGRESS.md` |
| `test-pocketbase.bat` / `.sh` | PocketBase health only (no app) — **`SYSTEM_HEALTH_CHECKS.md`** |
| `setup-ollama.bat` / `.sh` | Install Ollama + pull VRAM-sized model (when local LLM) |
| `test-ollama.bat` / `.sh` | Ollama version + one completion smoke test |
| `scripts/forgetrail-dev-launcher.mjs` | Shared logic (copy from ForgeTrail upstream) |
| `scripts/setup-pocketbase.mjs` | PB download with **latest** release resolution (if no `setup:pocketbase` yet) |
| `scripts/test-pocketbase.mjs`, `scripts/setup-ollama.mjs`, `scripts/test-ollama.mjs` | Isolated service checks |
| `docs/FORGETRAIL_PROGRESS.md` | Human-readable progress (template: **FORGETRAIL_PROGRESS.md**) |

**`package.json` scripts (add):**

```json
"setup:pocketbase": "node scripts/setup-pocketbase.mjs",
"forgetrail:status": "node scripts/forgetrail-dev-launcher.mjs status",
"test:pocketbase": "node scripts/test-pocketbase.mjs",
"setup:ollama": "node scripts/setup-ollama.mjs",
"test:ollama": "node scripts/test-ollama.mjs"
```

---

## Windows `setup.bat` (copy block)

```bat
@echo off
cd /d "%~dp0"
where node >nul 2>&1 || (echo Install Node.js LTS from https://nodejs.org/ && pause && exit /b 1)
where npm >nul 2>&1 || (echo Reinstall Node.js LTS — npm should ship with Node && pause && exit /b 1)
where pnpm >nul 2>&1 || (echo Run: corepack enable && corepack prepare pnpm@latest --activate   OR: npm install -g pnpm && pause && exit /b 1)
node scripts/forgetrail-dev-launcher.mjs setup
if errorlevel 1 pause
```

## Windows `run.bat`

```bat
@echo off
cd /d "%~dp0"
where node >nul 2>&1 || (echo Install Node.js from https://nodejs.org/ && pause && exit /b 1)
node scripts/forgetrail-dev-launcher.mjs run
pause
```

## Windows `status.bat`

```bat
@echo off
cd /d "%~dp0"
node scripts/forgetrail-dev-launcher.mjs status
pause
```

## Mac/Linux `setup.sh` / `run.sh` / `status.sh`

```sh
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
command -v node >/dev/null || { echo "Install Node.js LTS from https://nodejs.org/"; exit 1; }
command -v pnpm >/dev/null || { echo "Run: corepack enable && corepack prepare pnpm@latest --activate"; exit 1; }
node scripts/forgetrail-dev-launcher.mjs "${1:-setup}"
```

Use `setup.sh`, `run.sh`, `status.sh` as thin wrappers calling `forgetrail-dev-launcher.mjs` with `setup`, `run`, or `status`. `chmod +x` all three.

---

## README block for non-technical users

```markdown
## Quick start (no terminal required)

1. Install [Node.js LTS](https://nodejs.org/) once (includes **npm**; use it to enable **pnpm** via corepack or `npm install -g pnpm`).
2. Copy `.env.example` → `.env` and fill in any passwords shown in the example.
3. **First time:** double-click **setup.bat** (Windows) or run **setup.sh** (Mac/Linux).
4. **Every day:** double-click **run.bat** / **run.sh** to start the app.
5. **Where are we?** double-click **status.bat** / **status.sh** — also opens **docs/FORGETRAIL_PROGRESS.md**.

### Troubleshooting (one service at a time)

- **PocketBase:** double-click **test-pocketbase.bat**
- **Local AI (Ollama):** run **setup-ollama.bat** once, then **test-ollama.bat**
```

## Windows `test-pocketbase.bat`

```bat
@echo off
cd /d "%~dp0"
node scripts/test-pocketbase.mjs
if errorlevel 1 pause
```

## Windows `setup-ollama.bat` / `test-ollama.bat`

```bat
@echo off
cd /d "%~dp0"
node scripts/setup-ollama.mjs
if errorlevel 1 pause
```

```bat
@echo off
cd /d "%~dp0"
node scripts/test-ollama.mjs
if errorlevel 1 pause
```

---

## PocketBase version policy

See **FORGETRAIL_LITE.md** §4.2.2 and **`SCAFFOLD_INSTALL.json`** (`versionPolicy`). Install scripts read `POCKETBASE_VERSION` from `.env`:

- unset or `latest` → resolve from GitHub **releases/latest** at setup time
- `0.26.2` (example) → pin that release; record it as an appledger decision record when the user confirms a good boot

Never ship a stale semver only in methodology docs without an env override path.
