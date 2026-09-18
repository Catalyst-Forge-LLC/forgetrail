# Spec Review

A structured pre-implementation audit for feature specifications. Run this against any draft spec in `specs/` before writing multi-file code. Modeled after Bugbot and Security Review: read the spec, check it against the live codebase, and catch ambiguities, missing verifiers, or architectural drift before code starts.

---

## How to Use

Provide this prompt to an AI agent with read access to the repository:

```
Perform a Spec Review on [path/to/spec.md].
Inspect the existing codebase to verify assumptions, referenced files, and API contracts.
Report findings grouped by VERIFIER, FEASIBILITY, ACCEPTANCE CRITERIA, and AMBIGUITIES.
Conclude with a clear verdict: APPROVED, REVISE, or BLOCKED.
```

---

## Review Dimensions

### 1. Verifier Presence (Gate)

- [ ] Does the spec include a dedicated **How to test / Verifier command** section?
- [ ] Is the command runnable by an agent or developer (e.g. `pnpm test`, `pnpm run verify`, or targeted test script)?
- [ ] If no automated test exists, does it name the exact manual verification steps with expected outputs?
- **Rule:** A delivery spec without a runnable verifier fails this gate automatically.

### 2. Codebase Grounding & Feasibility

- [ ] Do referenced files, routes, components, and functions actually exist in the codebase?
- [ ] Does the proposed approach align with existing conventions (imports, error handling, state management)?
- [ ] Does the proposed data model conflict with existing database schemas or migrations?
- [ ] Will this change break existing tests or public API contracts?

### 3. Acceptance Criteria Quality

- [ ] Are criteria written as boolean-checkable statements?
- [ ] Do criteria specify clear inputs and expected outcomes (Given / When / Then)?
- [ ] Are vague qualifiers ("fast", "intuitive", "clean", "responsive") eliminated or replaced with concrete metrics?
- [ ] Are sad paths, error conditions, and empty states covered?

### 4. Edge Cases and Traps

- [ ] What happens on network failure, timeout, or invalid inputs?
- [ ] Are concurrency, race conditions, or multi-tab usage considered?
- [ ] Are secrets, environment variables, or permissions handled properly?

---

## Output Format

Return your review in the following structure:

1. **Summary:** 1–2 sentences on what the spec intends to build.
2. **Verifier Gate:** Pass or Fail (name the verifier command or flag missing).
3. **Findings Table:**
   | Severity | Category | Item | Issue / Risk | Suggested Fix |
   |----------|----------|------|--------------|---------------|
   | Blocker  | Feasibility | ... | ... | ... |
   | Warning  | Acceptance Criteria | ... | ... | ... |
4. **Verdict:**
   - **APPROVED:** Ready for implementation.
   - **REVISE:** Minor fixes needed in spec before implementation.
   - **BLOCKED:** Architectural or verifier gaps prevent starting code.
