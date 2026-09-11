# Docs Alignment Audit

Run this prompt to verify that all project documentation is accurate and internally consistent. It checks each doc against the actual codebase and cross-checks docs against each other.

---

## The Prompt

You are auditing the project documentation suite for accuracy and alignment. The docs to audit are:

- `docs/DEPLOYMENT.md`
- `docs/TECHNICAL_REFERENCE.md`
- `docs/CODE_QUALITY.md`
- `docs/BLACK_HAT_REPORT.md`
- `docs/BUSINESS_PLAN.md`
- `docs/BRAND_AND_PRODUCT.md`
- `docs/BUGS.md`
- `TODO.md`
- `CONTEXT_PROMPT.md`
- `.env.example`

## Audit Procedure

Work through each section below. For each check, report PASS, FAIL (with specifics), or STALE (accurate but outdated context). Use the codebase as the source of truth.

### 1. DEPLOYMENT.md vs. Codebase

Check the "What's Done" and "What's Not Done" sections against what actually exists:

- [ ] **Security claims:** For each security item listed as done, verify the code exists. Search for rate limiting, CSRF protection, security headers, input validation schemas, prompt injection guards, parameterized database queries, and file handling sanitization.
- [ ] **Payment claims:** Verify all payment-related API routes exist. Verify entitlements enforcement exists. Count how many routes import from the entitlements module.
- [ ] **OAuth claims:** Verify OAuth routes exist. Check that OAuth env vars are referenced in code.
- [ ] **"Not Done" accuracy:** For each item listed as not done, confirm it's genuinely missing.
- [ ] **Infrastructure files:** Verify all files listed in deployment sections exist at the stated paths.
- [ ] **Cost estimates:** Cross-check resource recommendations against actual resource usage patterns.

### 2. TECHNICAL_REFERENCE.md vs. Codebase

- [ ] **Env vars table:** Compare every row against `.env.example`. Flag missing vars in either direction.
- [ ] **API routes:** List all actual API route files. Compare against the documented routes. Flag undocumented or documented-but-missing routes.
- [ ] **Data model:** Compare collection schemas against setup/migration scripts. Flag missing fields or collections.
- [ ] **Billing section:** Cross-check plan limits against the entitlements module constants. Verify product/price IDs if referenced.
- [ ] **Feature descriptions:** Spot-check 3-5 feature descriptions against their actual implementations.

### 3. CODE_QUALITY.md vs. Codebase

- [ ] **Remediated items:** For each item listed as fixed, verify the fix exists in code.
- [ ] **Open findings:** For each open finding, verify it's genuinely still present.
- [ ] **Severity counts:** Recount Critical/Major/Minor from the open findings and verify the summary table.

### 4. BLACK_HAT_REPORT.md vs. Codebase & TODO

- [ ] **Fixed findings:** For each finding marked as fixed, verify remediation code exists.
- [ ] **Open findings:** For each open finding, verify the vulnerability still exists.
- [ ] **TODO integration:** Every actionable finding should have a corresponding entry in TODO.md's Security Audit section.
- [ ] **Priority alignment:** P0 findings should map to Critical + exploitable High. P1 to defense-in-depth. P2 to remaining.

### 5. Cross-Document Consistency

- [ ] **DEPLOYMENT.md vs. TECHNICAL_REFERENCE.md:** Do they agree on env vars, API routes, schemas, payment details, and security measures?
- [ ] **DEPLOYMENT.md vs. TODO.md:** Are items marked "done" in DEPLOYMENT also checked off in TODO? Are "not done" items present as unchecked?
- [ ] **CODE_QUALITY.md vs. TODO.md:** Are remediated findings reflected as checked in the TODO Foundation section?
- [ ] **BLACK_HAT_REPORT.md vs. TODO.md:** Are finding statuses synchronized between the report and the Security Audit section of TODO?
- [ ] **BUSINESS_PLAN.md vs. TECHNICAL_REFERENCE.md:** Do pricing tiers and plan limits match?
- [ ] **BUSINESS_PLAN.md vs. entitlements code:** Do documented plan limits match the constants in code?
- [ ] **CONTEXT_PROMPT.md vs. everything:** Does the project context prompt accurately describe the current architecture? Spot-check 5-10 claims.
- [ ] **.env.example vs. DEPLOYMENT.md:** Does .env.example include all vars referenced in the go-live checklist?
- [ ] **BUGS.md vs. TODO.md:** Are triaged bugs cross-referenced to TODO entries?

### 6. Staleness Indicators

Flag any of these patterns found in any doc:

- [ ] Phrases like "not yet done," "planned," "will be added," "TODO" that describe features which now exist
- [ ] Checked items (`[x]`) that describe features not in the codebase
- [ ] Unchecked items (`[ ]`) that describe features already implemented
- [ ] References to old file names, removed files, or restructured paths
- [ ] Model strings or version numbers that don't match current defaults

## Output Format

For each section, output:

```
### [Section Name]
- PASS: [item] - [brief confirmation]
- FAIL: [item] - [what's wrong and what the correct state is]
- STALE: [item] - [what's outdated]
```

End with a summary:

```
## Summary
- Total checks: X
- Pass: X
- Fail: X (list file + issue for each)
- Stale: X (list file + issue for each)
- Recommended fixes: [prioritized list]
```

---

## Usage Notes

- Run this audit during Phase 7 (Hardening) and before every release.
- After running, fix all FAIL items first (incorrect information), then STALE items (outdated but not wrong).
- This prompt is framework-agnostic — adapt the specific file checks to your project's actual doc structure.
- Optional neighbor: Detangler for broken references and journeys that no longer meet. Not required. Do not install unless the user asked.
