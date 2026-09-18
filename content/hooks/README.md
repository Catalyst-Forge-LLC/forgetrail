# ForgeTrail Hooks

Enforces ForgeTrail rules and guards at the host tool level, rather than relying only on prompt requests.

## What is in this directory

- `guard-shell.mjs`: blocks unrequested attribution trailers (`--trailer`, `-c trailer.*`, `Co-Authored-By:`), prevents npm/yarn when `pnpm-lock.yaml` is present, gates `git push`, and prompts on destructive git or filesystem operations.
- `guard-edit.mjs`: guards `.env*` secrets files and `specs/completed/**` or `specs/canonical/**` records against accidental mutation.
- `session-start.mjs`: on session start, reads `.forgetrail/workflow_tracking.json` and injects live phase status, open exit criteria, and last session notes into agent context.
- `validate-tracking.mjs`: after editing `workflow_tracking.json`, runs structural validation and returns any issues as context.
- `validate-tracking-core.mjs`: standalone zero-dependency tracking validator.
- `session-stop.mjs`: on session stop, checks that session notes were added to tracking.
- `cursor-hooks.json`: standard Cursor hooks configuration.
- `claude-settings-hooks.json`: standard Claude Code configuration fragment.

## Host setup

### Cursor

Copy or link `cursor-hooks.json` to `.cursor/hooks.json` in your repository root. The hook scripts reside in `.forgetrail/hooks/`.

### Claude Code

Add the contents of `claude-settings-hooks.json` to `.claude/settings.json` in your project root or user configuration.

## Verification

Run any script with test input via stdin:

```bash
echo '{"command": "git commit --trailer Co-Authored-By:Bot"}' | node .forgetrail/hooks/guard-shell.mjs
# Output: {"permission":"deny", ...}

echo '{"command": "git push"}' | node .forgetrail/hooks/guard-shell.mjs
# Output: {"permission":"ask", ...}
```
