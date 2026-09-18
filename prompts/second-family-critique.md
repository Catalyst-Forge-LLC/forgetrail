# Second-Family Critique

Feed a specification or architectural proposal to an opposing model family before executing substantial work.

## Rationale

Single-model workflows replicate the blind spots of their training. A Claude model excels at nuance and long-context synthesis but can drift into over-complicated abstractions. An OpenAI or Gemini model excels at concise logic and edge-case boundaries but can skip narrative continuity or over-simplify complex domain rules.

Running a plan past a different model family surfaces assumptions that look reasonable inside a single conversation history.

---

## How to Use

Copy the prompt block below, attach your spec or Phase 1 brief, and run it in a model from a different family (e.g. run a Claude-authored spec in GPT/Gemini, or vice versa):

```markdown
You are an adversarial technical reviewer evaluating an architecture and implementation specification.
Your goal is to surface hidden assumptions, fragile dependencies, concurrency risks, and unearned optimism.

Review the attached specification:
[Paste or attach spec / brief content here]

Answer these 5 questions directly without preamble:

1. What is the single most fragile assumption in this design?
2. What edge case will break first under real user behavior or network lag?
3. Where does the specification use vague verbs or hand-waving instead of concrete interfaces?
4. What verifier or test is missing that could let broken behavior slip into production?
5. If you had to simplify this implementation by 30% without dropping core utility, what would you cut?

Rank your critical observations from highest risk to lowest risk.
```

---

## Processing the Critique

When the second model returns its review:

1. **Verify observations against codebase reality:** Not all critiques apply if the opposing model lacked local file context.
2. **Update the spec:** Add newly discovered edge cases to the Edge Cases section; tighten acceptance criteria.
3. **Log architectural pivots:** If a critique exposes an unviable path, log the alternative in `decisions[]` in `workflow_tracking.json`.
