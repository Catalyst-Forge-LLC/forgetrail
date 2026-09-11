# Brand Copy Edit Pass

A reusable prompt for making an editorial pass on brand, product, or marketing copy. Designed for docs like `BRAND_AND_PRODUCT.md` but applicable to any long-form brand or product narrative.

---

## The Prompt

Review this file and make three sequential editing passes:

### Pass 1: Resolve Annotations

Look for any sections, phrases, or words marked with `[]` square brackets. Inside the brackets there may be comments in parentheses `()` explaining what needs to change. For each annotation:

- Read the surrounding context to understand intent and tone
- Propose and implement a replacement that addresses the comment
- Match the voice and sophistication level of the surrounding prose
- Remove the bracket markers entirely when done

If a comment asks for a new paragraph or expanded content, write it in the same voice as the rest of the document. Do not add filler — every new sentence should carry weight.

### Pass 2: Deduplicate

Make a pass to identify repetition. Preserve all specifics, details, nuance, and clever phraseology — the goal is trimming redundancy, not flattening the writing.

Look for:

- The same argument made at full length in two different sections
- Near-identical phrases reused within a few paragraphs of each other
- Itemized lists that echo each other across sections
- Closing lines that repeat the emotional beat of an earlier section

For each instance, decide which location is the strongest home for the idea and trim or vary the other. Do not delete good lines — relocate or rephrase them if their current position is redundant.

### Pass 3: Kill Filler Words

Search for soft, unnecessary words that weaken the prose without adding meaning. Common offenders:

- **"real"** (as in "the real work", "the real burden") — either drop or replace with something more specific
- **"really"**, **"very"**, **"just"**, **"quite"**, **"actually"** — drop unless doing deliberate rhetorical work
- **"helps"** — often too weak for what the product does; consider "equips", "enables", "delivers"
- **"things"**, **"stuff"** — replace with the specific noun
- **"in order to"** — replace with "to"
- **"a number of"** — replace with the actual number or "several"

For each filler word found: drop it if the sentence is stronger without it, or replace it with something that earns its place.

---

## Usage Notes

- Run all three passes in sequence, not in parallel — Pass 2 depends on Pass 1's output, and Pass 3 benefits from the tighter text after Pass 2.
- Show a summary table of changes after each pass so the author can review.
- When in doubt about whether to cut, keep. The author's voice and specificity take priority over brevity.
- This prompt works on any long-form brand doc, product narrative, or marketing page copy.
- Optional neighbor: Smell Check and Misemphasis for a second editorial pass. Not required. Do not install unless the user asked.
