# Post-bootstrap: first reply to the user

**When:** Right after `appledger/` exists (and, for Cursor, the phase rule file if you use it).

**Purpose:** Confirm what happened in **plain language** and give **one clear ask**—what the human should do or answer next. This is not an implementation report.

---

## Audience

Assume the reader is a **product owner**, not a methodology engineer. They should **not** see:

- MCP or ForgeTrail server/tool names (`getChecklist`, `getGreenfieldIntakePrompt`, “bundle”, “methodology stays on the MCP side”, etc.)
- Paths like `.cursor/rules/…` unless they need to edit something themselves
- Field-by-field descriptions of `appledger/` files or other “for your reference only” inventories
- ForgeTrail **footers** (phase · exit criteria · “Next: …”)—those are for **agent** orientation in later turns, not for this first message

Agents keep planning steps **internal** until they turn user answers into `docs/PHASE_1_BRIEF.md`.

---

## Do include

1. **One sentence on what you did** in everyday terms—e.g. set up project tracking so we lock the plan before building the app (use the **project name** if known).
2. **What happens next in plain language**—we’ll turn their answers into a short written plan (the brief) and agree on it before coding.
3. **A concrete “reply with”** so the user knows exactly what to send—minimum:
   - **Problem:** what they’re building and why (1–3 sentences)
   - **Who it’s for** (audience / user)
   - **Hero workflow:** the one main journey that must work in v1
   - **Constraints:** tech preferences, deadlines, compliance, or “open to suggestions”
   - **Scope:** what must ship in v1 vs can wait

Optional closing: invite them to add anything else that would block a wrong architecture.

**Length:** Aim for **under ~150 words**, no bullet lists of repo files.

If you later offer **multiple** paths or an ordered pipeline in the same conversation, use **`USER_REPLY_FORMAT.md`** (ForgeTrail): numbers for sequence, bullets for parallel options, letters for “pick one” / which first.

---

## Example (adapt; do not paste MCP or internal paths)

> I’ve set up tracking for **gr-playbook** so we lock the product plan before we write application code.  
> **Next:** Reply with a short outline so I can draft the planning brief:
> - **Problem** — what you’re solving and why it matters  
> - **Who it’s for** — primary users or customers  
> - **Main workflow** — the one end-to-end journey that must work in v1  
> - **Constraints** — stack, timeline, integrations, or say you’re flexible  
> - **Must-haves vs later** — what has to ship in v1  

Adjust tone to match the chat; keep it **done → your turn → what to send**.
