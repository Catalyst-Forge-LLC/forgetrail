---
skill_facts_version: "0.1.0"
name: forgetrail
developer: Catalyst Forge
version: "0.3.0"
status: active
license: Apache-2.0
kind: cursor-skill
purpose: "Enforce the ForgeTrail 7-phase lifecycle and maintain .forgetrail/workflow_tracking.json as the system of record"
homepage: https://forgetrail.dev
repository: https://github.com/Catalyst-Forge-LLC/forgetrail
provenance:
  source: https://github.com/Catalyst-Forge-LLC/forgetrail
  publisher: Catalyst Forge
instructions_reach:
  shell: explicit
  network: implied
  filesystem: read-write
tools_referenced:
  - https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/mcp-server/TOOL_FACTS.md
  - getPhaseGuidance
  - getCompanionSuggestions
  - runAudit
  - searchLessons
  - validateTracking
  - suggestSubagentDecomposition
  - getTemplate
  - getNewProjectKickoff
  - getResumeSessionInstructions
bundled_artifacts:
  []
egress:
  telemetry: none
  destinations: []
generated:
  date: 2026-08-20
  generator: hand-authored
credits:
  generated_with: https://skillfacts.dev
  built_by: "Catalyst Forge - https://www.catalystforge.com/"
---

# Skill Facts - forgetrail

| | |
|---|---|
| **Developer** | Catalyst Forge |
| **Version** | 0.3.0 |
| **Status** | active |
| **License** | Apache-2.0 |
| **Kind** | cursor-skill |

*Lifecycle playbook with explicit shell and read-write filesystem reach. Points at ForgeTrail MCP ToolFacts.*

## Purpose

Enforce the ForgeTrail 7-phase lifecycle and maintain .forgetrail/workflow_tracking.json as the system of record

## Provenance

| | |
|---|---|
| Source | https://github.com/Catalyst-Forge-LLC/forgetrail |
| Publisher | Catalyst Forge |

## Instructions reach

| | |
|---|---|
| Shell | explicit |
| Network | implied |
| Filesystem | read-write |

## Tools referenced

- https://github.com/Catalyst-Forge-LLC/forgetrail/blob/main/mcp-server/TOOL_FACTS.md
- getPhaseGuidance
- runAudit
- searchLessons
- validateTracking
- suggestSubagentDecomposition
- getTemplate
- getNewProjectKickoff
- getResumeSessionInstructions

## Bundled artifacts

(none)

## Egress

| | |
|---|---|
| Telemetry | none |
| Destinations | (none) |

---
*Generated with [SkillFacts](https://skillfacts.dev) · Built by [Catalyst Forge](https://www.catalystforge.com/)*

[skillfacts-label]: https://skillfacts.dev/v#sf1.eNqdk0-L2zAQxb-K0Tm2t-2hkFtIu6U0dJcmt6UEWR7b2uiPkUZJw7LfvU8yZXehl_ZgsEdPM29-M34SZ7F-txJOWhJrMfgwEgepjViJns5k_EwBB1vJ0lwjV7dZgcMzhai9w9FN86G5QSSy5BQRkIr1OWuMVuRizruZpZqofl-EJ-16xFQK0Yc6nrTJ1eYUZl_Enx1sKKp4oqXcIRuqPtbzJCNVRg-krspQJV1fWakd46maF-_txYfTYPzliE-FcmPzGL2rZCw5I_ogW_mhCqR86HPx4M_kpFOo_ySiTyG_iYl5juu2HTVPqWuUt-0fEHVxVu922_YNtDl1Rsfpb9CeV0K7yCGBj3fxGAhQSr2JgGAt6NcMZJqRxhHnJhDUFkHKJgdtaPGOMC739SVoLnnZe5MTDhQITQDvwz-bbzvjuzbzbK2a60gBM24Pd3e74-1me9g3NpuA-D6P4UvSfeG1EiG5TeqL7UgyqGlHEbhj3hJpIOM8wTKHLEnjSJH3qZMjOf6EEVgMXmcmS_4DoWVcWr6-0-U--EdS_E2rkx-GJfyDYrK0RyXc-_oKq_i5El1yvaH-KAPrAeuIrXxAmMYAfSbOZMii7StIOu-obHtk7eSSA3JQnbylGS5fbcILrga_R26einlfUv3HvsC3U2gWI8MrPf8GOlRERg
