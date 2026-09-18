# Rules and Environment Audit

Analyze the persistent rules, instructions, and hooks loaded into the agent's environment (`.cursor/rules/`, `CLAUDE.md`, `AGENTS.md`, or system prompts).

The goal is to calculate the per-turn token tax, identify overlaps and obsolete instructions, and convert always-on text into deterministic hooks, scoped file globs, or on-demand skills.

---

## How to Use

Provide this prompt to an AI agent with access to `.cursor/rules/`, `CLAUDE.md`, or `AGENTS.md`:

```
Perform a Rules and Environment Audit on this repository.
Inspect all files in .cursor/rules/ (or CLAUDE.md / AGENTS.md).
Analyze per-turn token consumption, alwaysApply status, overlaps, and hook migration opportunities.
Deliver a ranked trimming and migration proposal.
```

---

## Audit Checklist

### 1. Inventory and Token Weight

- [ ] Measure estimated token count per rule file (bytes ÷ 4 or tokenizer).
- [ ] Classify each rule as:
  - **Always-on** (`alwaysApply: true` or unscoped).
  - **Scoped** (`globs: [...]`).
  - **Manual / on-demand** (`alwaysApply: false` without globs).
- [ ] Calculate the total per-turn baseline tax (sum of all always-on rules).

### 2. Overlap and Redundancy

- [ ] Do multiple rules restate the same constraint (e.g. git commit conventions, package manager rules, voice guidelines)?
- [ ] Do rules duplicate instructions already provided by the host environment or CLI tooling?
- [ ] Can companion rules (e.g. Smell Check and writing-voice) be consolidated into a single coherent guide?

### 3. Hook Migration Candidates

Can any prose rule be replaced by a deterministic hook that costs zero tokens on normal turns?

- [ ] **Package manager locking:** Rules telling agents to use pnpm can be enforced by a shell guard hook when `pnpm-lock.yaml` is present.
- [ ] **Git push restrictions:** Rules telling agents not to push can be enforced by `permission: "ask"` in a shell hook.
- [ ] **Pre-commit verification:** Rules requiring typecheck/build before commit can be run automatically before `git commit` executes.
- [ ] **Tracking maintenance:** Rules telling agents to read/update tracking can be replaced by `sessionStart` context injection and `afterFileEdit` tracking validation.

### 4. Skill Conversion Candidates

- [ ] Is the rule only needed during specific tasks (e.g. documentation propagation, release tagging, database migration)?
- [ ] If so, should it be converted to an on-demand Skill (`SKILL.md`) loaded only when triggered, rather than consuming context on every code edit?

---

## Output Format

Return the audit with:

1. **Rule Inventory Table:**
   | Rule | Lines | Est. Tokens | Mode (Always / Glob / Manual) | Purpose |
   |------|-------|-------------|-------------------------------|---------|
   | ...  | ...   | ...         | ...                           | ...     |

2. **Per-Turn Token Tax:**
   - Current always-on tokens per turn: `N` tokens.
   - 40-turn chat impact: `40 × N` tokens.

3. **Trimming & Migration Recommendations:**
   - **Retire (replaced by hooks):** Rules that can be deleted because hooks now enforce them.
   - **Scope (convert to globs):** Always-on rules that only apply to specific file extensions or directories.
   - **Skillify (convert to on-demand):** Deep workflow rules that should load only when specifically invoked.
   - **Consolidate:** Rules that overlap.

4. **Projected Savings:** New always-on token count and percentage reduction.
