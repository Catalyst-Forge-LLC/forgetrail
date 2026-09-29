# System health checks (isolated)

**Goal:** Verify **one dependency at a time** (PocketBase, Ollama, later Postgres/Redis/etc.) without starting the full app. Non-technical users double-click **`test-*.bat`**; developers run matching **`pnpm`** scripts.

Upstream reference scripts: `content/scripts/` (`test-pocketbase.mjs`, `test-ollama.mjs`, `setup-ollama.mjs`, `forgetrail-env.mjs`).

---

## Agent obligations (Phase 2+)

1. Copy reference scripts into the app **`scripts/`** folder when the stack uses that system.
2. Add **`package.json`** scripts and repo-root launchers (see **ONE_CLICK_DEV_SETUP.md**).
3. Document in **README** under **“Troubleshooting”** or **“Check services”** — three lines, no command dumps.
4. **Ollama:** run **`setup:ollama`** when Phase 1 brief §12 chooses **runtime local LLM**; default models are **non-thinking** (Granite 4.1, Gemma 3). See **FORGETRAIL_LITE.md** section 4.8.

---

## PocketBase — `test-pocketbase`

| Entry | Command |
|-------|---------|
| Windows | Double-click **`test-pocketbase.bat`** |
| Mac/Linux | `./test-pocketbase.sh` |
| pnpm | `pnpm run test:pocketbase` |

**What it checks**

- `GET {PUBLIC_POCKETBASE_URL}/api/health`
- Optional: admin login with `POCKETBASE_ADMIN_EMAIL` / `POCKETBASE_ADMIN_PASSWORD`
- If down but `pocketbase/pocketbase(.exe)` exists: starts PB briefly for the test (does not replace **run.bat** for daily dev)

**Env (`.env`)**

- `PUBLIC_POCKETBASE_URL=http://127.0.0.1:8096` (or host + port vars from scaffold)

---

## Ollama — `setup-ollama` then `test-ollama`

| Step | Windows | pnpm |
|------|---------|------|
| Install + pull model | **`setup-ollama.bat`** | `pnpm run setup:ollama` |
| Smoke completion | **`test-ollama.bat`** | `pnpm run test:ollama` |

**Install script (`setup-ollama.mjs`)**

- Tries **winget** (Windows), **brew** (macOS), or **ollama.com install.sh** (Linux) when `ollama` is missing
- Detects **NVIDIA VRAM** via `nvidia-smi` when available
- Picks a **non-thinking** model unless `OLLAMA_USE_THINKING=1`:
  - **≥10 GB VRAM:** `ibm/granite4.1:8b` (default) or `gemma3:12b` if `OLLAMA_PREFER_GEMMA=1`
  - **6–10 GB:** `ibm/granite4.1:8b` or `gemma3:4b`
  - **4–6 GB / CPU:** `ibm/granite4.1:3b` or `gemma3:4b`
- Records choice in **`.forgetrail/ollama-model.txt`**
- **Never** auto-pull DeepSeek-R1, QwQ, or other reasoning-only families

**Test script (`test-ollama.mjs`)**

- `GET /api/version`
- `POST /api/generate` with a one-word prompt (confirms inference, not just daemon up)

**Env**

```env
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=ibm/granite4.1:8b
# Optional:
# OLLAMA_PREFER_GEMMA=1
# OLLAMA_USE_THINKING=1   # only when brief requires reasoning models
# SKIP_OLLAMA_INSTALL=1  # skip entire setup
```

Pin **`OLLAMA_MODEL`** after a successful **test-ollama** run, and record that pin as an appledger decision record.

---

## `package.json` script block (example)

```json
{
  "scripts": {
    "test:pocketbase": "node scripts/test-pocketbase.mjs",
    "setup:ollama": "node scripts/setup-ollama.mjs",
    "test:ollama": "node scripts/test-ollama.mjs"
  }
}
```

---

## Windows launcher copy blocks

**test-pocketbase.bat**

```bat
@echo off
cd /d "%~dp0"
node scripts/test-pocketbase.mjs
if errorlevel 1 pause
```

**setup-ollama.bat**

```bat
@echo off
cd /d "%~dp0"
node scripts/setup-ollama.mjs
if errorlevel 1 pause
```

**test-ollama.bat**

```bat
@echo off
cd /d "%~dp0"
node scripts/test-ollama.mjs
if errorlevel 1 pause
```

Mac/Linux: thin `test-pocketbase.sh`, `setup-ollama.sh`, `test-ollama.sh` calling the same `node scripts/…` paths.

---

## When to add more isolated checks

| System | Suggested check |
|--------|-----------------|
| Postgres | `pg_isready` or TCP + simple query script |
| Redis | `PING` |
| Custom API | `GET /health` with env-backed URL (same pattern as PocketBase) |

Keep each check **one script**, **one bat**, **exit code 0/1**, plain-language console output.
