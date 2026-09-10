---
tool_facts_version: "0.1.0"
name: ForgeTrail MCP Server
developer: Catalyst Forge
version: "0.3.6"
status: active
license: Apache-2.0
kind: mcp-server
homepage: https://forgetrail.dev
repository: https://github.com/Catalyst-Forge-LLC/forgetrail
runtime:
  execution: local-process
  transport: stdio
credentials:
  required: []
egress:
  telemetry: none
  destinations: []
tools:
  - name: ping
    purpose: "Connectivity check: returns ok, package version, FORGETRAIL_ROOT, and whether WORKFLOW.md was found"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getPhaseGuidance
    purpose: "Return methodology guidance for a development phase (1-7)"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: searchLessons
    purpose: "Search the ForgeTrail lesson database by keyword"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getTemplate
    purpose: "Return a ForgeTrail document template from docs/*.md"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: runAudit
    purpose: "Return a structured audit prompt for the current project (does not scan the workspace itself)"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getChecklist
    purpose: "Return a project checklist for a milestone or the full checklist"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getTrackingSchema
    purpose: "Return the workflow_tracking.json schema reference"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getAntiPatterns
    purpose: "Return documented anti-patterns from the methodology"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getProgressiveDocSchedule
    purpose: "Return which doc templates to create in each phase"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getNewProjectKickoff
    purpose: "Return greenfield bootstrap payload including starter tracking and optional Cursor rules"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: kickoffGreenfield
    purpose: "Same as getNewProjectKickoff with includeCursorRule true and no parameters"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: kickoffGreenfieldNoCursor
    purpose: "Same as kickoffGreenfield without the Cursor rule section"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getNewProjectBootstrap
    purpose: "Return MCP-first instructions to start a greenfield project without copying ForgeTrail into the repo"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getForgeTrailLite
    purpose: "Return the FORGETRAIL_LITE.md portable kickoff protocol"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getForgeTrailLiteUpdates
    purpose: "Return the Lite updates starter for logging protocol gaps"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getForgeTrailCursorPhaseRule
    purpose: "Return the optional Cursor phase-status rule (.mdc)"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getForgeTrailCursorLessonsRules
    purpose: "Return Cursor rules for lessons gate and MCP lessons usage"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getScaffoldInstallParams
    purpose: "Return JSON defaults for scripted Phase-2 setup"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getGenesisSpecPrompt
    purpose: "Return a copy-paste prompt for producing docs/GENESIS.md in an external LLM"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getGreenfieldIntakePrompt
    purpose: "Return Phase 1 structured questions about exports, tenancy, and delivery gaps"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getResumeSessionInstructions
    purpose: "Return instructions for continuing work in a later MCP-only session"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getInitialWorkflowTracking
    purpose: "Return starter .forgetrail/workflow_tracking.json for a new repo"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getPostBootstrapUserMessage
    purpose: "Return canonical short first-reply guidance after bootstrap files are written"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getUserReplyFormat
    purpose: "Return guidance for formatting options and next steps to users"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: validateTracking
    purpose: "Validate .forgetrail/workflow_tracking.json (inline JSON or optional filesystem path) against schema and phase rules"
    side_effects: read
    reach:
      filesystem: scoped
      network: none
      processes: false
    idempotent: true
  - name: suggestSubagentDecomposition
    purpose: "Return recommended subagent spawn parameters for a phase and task"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: ingestPlanArtifact
    purpose: "Map an approved plan artifact into a PHASE_1_BRIEF.md draft plus decisions[] entries"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getPlanModePatterns
    purpose: "Return guidance for using native agent plan modes as Phase 1"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getAgentIntegrationGuide
    purpose: "Return tailored ForgeTrail bootstrap mappings for a specific agent host"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
  - name: getForgeTrailSkill
    purpose: "Return the canonical forgetrail SKILL.md for skill-capable agents"
    side_effects: none
    reach:
      filesystem: none
      network: none
      processes: false
    idempotent: true
generated:
  date: 2026-09-10
  generator: hand-authored (tools inventory from forgetrail-mcp 0.3.5)
credits:
  generated_with: https://toolfacts.dev
  built_by: "Catalyst Forge - https://www.catalystforge.com/"
---

# Tool Facts - ForgeTrail MCP Server

| | |
|---|---|
| **Developer** | Catalyst Forge |
| **Version** | 0.3.6 |
| **Status** | active |
| **License** | Apache-2.0 |
| **Kind** | mcp-server |

## Runtime

| | |
|---|---|
| Execution | local-process |
| Transport | stdio |

## Credentials

None required.

## Egress

| | |
|---|---|
| Telemetry | none |
| Destinations | (none) |

## Tools (30)

| Tool | Side effects | Filesystem | Network | Processes | Idempotent |
|---|---|---|---|---|---|
| `ping` | none | none | none | no | yes |
| `getPhaseGuidance` | none | none | none | no | yes |
| `searchLessons` | none | none | none | no | yes |
| `getTemplate` | none | none | none | no | yes |
| `runAudit` | none | none | none | no | yes |
| `getChecklist` | none | none | none | no | yes |
| `getTrackingSchema` | none | none | none | no | yes |
| `getAntiPatterns` | none | none | none | no | yes |
| `getProgressiveDocSchedule` | none | none | none | no | yes |
| `getNewProjectKickoff` | none | none | none | no | yes |
| `kickoffGreenfield` | none | none | none | no | yes |
| `kickoffGreenfieldNoCursor` | none | none | none | no | yes |
| `getNewProjectBootstrap` | none | none | none | no | yes |
| `getForgeTrailLite` | none | none | none | no | yes |
| `getForgeTrailLiteUpdates` | none | none | none | no | yes |
| `getForgeTrailCursorPhaseRule` | none | none | none | no | yes |
| `getForgeTrailCursorLessonsRules` | none | none | none | no | yes |
| `getScaffoldInstallParams` | none | none | none | no | yes |
| `getGenesisSpecPrompt` | none | none | none | no | yes |
| `getGreenfieldIntakePrompt` | none | none | none | no | yes |
| `getResumeSessionInstructions` | none | none | none | no | yes |
| `getInitialWorkflowTracking` | none | none | none | no | yes |
| `getPostBootstrapUserMessage` | none | none | none | no | yes |
| `getUserReplyFormat` | none | none | none | no | yes |
| `validateTracking` | read | scoped | none | no | yes |
| `suggestSubagentDecomposition` | none | none | none | no | yes |
| `ingestPlanArtifact` | none | none | none | no | yes |
| `getPlanModePatterns` | none | none | none | no | yes |
| `getAgentIntegrationGuide` | none | none | none | no | yes |
| `getForgeTrailSkill` | none | none | none | no | yes |

**Purpose lines**

| Tool | Purpose |
|---|---|
| `ping` | Connectivity check: returns ok, package version, FORGETRAIL_ROOT, and whether WORKFLOW.md was found |
| `getPhaseGuidance` | Return methodology guidance for a development phase (1-7) |
| `searchLessons` | Search the ForgeTrail lesson database by keyword |
| `getTemplate` | Return a ForgeTrail document template from docs/*.md |
| `runAudit` | Return a structured audit prompt for the current project (does not scan the workspace itself) |
| `getChecklist` | Return a project checklist for a milestone or the full checklist |
| `getTrackingSchema` | Return the workflow_tracking.json schema reference |
| `getAntiPatterns` | Return documented anti-patterns from the methodology |
| `getProgressiveDocSchedule` | Return which doc templates to create in each phase |
| `getNewProjectKickoff` | Return greenfield bootstrap payload including starter tracking and optional Cursor rules |
| `kickoffGreenfield` | Same as getNewProjectKickoff with includeCursorRule true and no parameters |
| `kickoffGreenfieldNoCursor` | Same as kickoffGreenfield without the Cursor rule section |
| `getNewProjectBootstrap` | Return MCP-first instructions to start a greenfield project without copying ForgeTrail into the repo |
| `getForgeTrailLite` | Return the FORGETRAIL_LITE.md portable kickoff protocol |
| `getForgeTrailLiteUpdates` | Return the Lite updates starter for logging protocol gaps |
| `getForgeTrailCursorPhaseRule` | Return the optional Cursor phase-status rule (.mdc) |
| `getForgeTrailCursorLessonsRules` | Return Cursor rules for lessons gate and MCP lessons usage |
| `getScaffoldInstallParams` | Return JSON defaults for scripted Phase-2 setup |
| `getGenesisSpecPrompt` | Return a copy-paste prompt for producing docs/GENESIS.md in an external LLM |
| `getGreenfieldIntakePrompt` | Return Phase 1 structured questions about exports, tenancy, and delivery gaps |
| `getResumeSessionInstructions` | Return instructions for continuing work in a later MCP-only session |
| `getInitialWorkflowTracking` | Return starter .forgetrail/workflow_tracking.json for a new repo |
| `getPostBootstrapUserMessage` | Return canonical short first-reply guidance after bootstrap files are written |
| `getUserReplyFormat` | Return guidance for formatting options and next steps to users |
| `validateTracking` | Validate .forgetrail/workflow_tracking.json (inline JSON or optional filesystem path) against schema and phase rules |
| `suggestSubagentDecomposition` | Return recommended subagent spawn parameters for a phase and task |
| `ingestPlanArtifact` | Map an approved plan artifact into a PHASE_1_BRIEF.md draft plus decisions[] entries |
| `getPlanModePatterns` | Return guidance for using native agent plan modes as Phase 1 |
| `getAgentIntegrationGuide` | Return tailored ForgeTrail bootstrap mappings for a specific agent host |
| `getForgeTrailSkill` | Return the canonical forgetrail SKILL.md for skill-capable agents |

---
*Generated with [ToolFacts](https://toolfacts.dev) · Built by [Catalyst Forge](https://www.catalystforge.com/)*

[toolfacts-label]: https://toolfacts.dev/v#tf1.eNrFl1Fv2zYQx7_KgU_JoLjthmGA3rKsCbqmceBk60NRBAx1klhTPO54smsE-e7DyXLiullf9qBXmyL_v7v_HY8PZmXKN4WJtkNTmnPiBm_Z-gAfzq7hBnmFbApT4QoDJWRTmjMrNmyywLDYFGaFnD1FU5rXs19mv5rCZLHSZ1Ma68SvdE3wDmPWI06TdS2e_Dx7bQqz9LEypelcOsm7s7iP4lXNg8Gv6HrZ7h3I2XCSmBzmbAojbGNOxGJKk6XyZB4L4xgrjOJtyPo94z-9Z6xM-enzY2GwYf22fDCCATsU3pjSRIo4IGbx0eppeVwvRLrPp4ddeFY2-MqKRsgtfWwU1Vd4h3WNThSY0VbKgNa1elDtA-ZNFuxUpqOE-ndEWRMvnw8fsTCbsrYh42NhfIVdIsEophTusTCp50RDDP8edcCs1hyIJuyV7lgHWt_JqG72JVOEIx-Djwh_3syvgBgoKaIN8CwNkpX2GGxjfcwC2bXYWbCxgtTajMB9wGwei6c4pBfZR5aX2cc__y_5GcWIaiovG3AtumUJjNJzzEDLApJ1S9sgjJ4s4Hy-uHh7uzh9d3m3mM9viwFr3aK0yPBxvnh_fjn_OOsqWNsMNfWx2gdtUK41BBe9r2x0OA30YgCEDqWligI1G2hGQVATg4WxPjuMMubs6M3Jb8f7KBktu_YSc1aDT8JxM0gAaRH2Gk0YJEFlxd6r8vsNLHGzJj7MxC12KViZNgl2X3pFrh9iLqM0qJk6_Tm_-mnWfQPAfTztKy8Tq8_CvZOesQKrciAxdUkGH2liXM88uIjpCzqBo4owQyRtCzYOS1RITtYheMkY6uODPJ1pWQafp0bdIbidnrFYOj1UKCKMzHUfwvOqQ9eN3fRm6IqTIu2C_0KXH3s2Y42M2qi-hTiN4q-tCPJUtT8i7CpG7RfFn6RR1LZwFHCvyx12YqbhAvcr_IOc5qPqw7TdYN161yrUUwfIIASOUZuBj6Aath35AOYK19dbf773bkl1PSlHw4ix9hgquCeSLGwTJLsJZCvw0YW-8rGBLJYFGXbeGy7Tp4HirOdM_P20sNwCXjydMdHtYzsEm-Gl4MPaSzuC4pZj0QcE3WOAjATJsu1QkH8Md0Xb76eF_E7WQEi9DDW2lynIOk5R_E97_r7zw6QG_XB2fVJ7zgI6ouoVpnO61trgSbD7Ft41_h2yo7RRt-7d3D4KDaFgTHTA_rzs0k88bQyj0vMEe_nu9q3OqvrssfcBd2lWYiFH4YckfyV9M-TJgVQL9FsxTy1Fr-ZATaN52tFAY1M2j5_1sddHZ0Vfcrrx47-gjDXT
