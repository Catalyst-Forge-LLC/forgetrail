---
app_facts_version: 0.1.0
name: ForgeTrail
type: spec / tooling
status: active
license: Apache-2.0
homepage: https://forgetrail.dev
repository: https://github.com/Catalyst-Forge-LLC/forgetrail
stack:
  language: "JavaScript, TypeScript"
  runtime: Node.js
  tooling: "Model Context Protocol (MCP)"
  hosting: Cloudflare
key_dependencies:
  - name: "@modelcontextprotocol/sdk"
    purpose: Model Context Protocol server implementation
  - name: zod
    purpose: Schema validation and type inference
  - name: wrangler
    purpose: Cloudflare deployment tool
  - name: getfilepress
    purpose: File-based content management
services:
  - name: Cloudflare
    role: hosting provider for website
build:
  package_manager: pnpm
  test: undisclosed
  ci: undisclosed
generated:
  date: 2026-08-20
  generator: "appfacts-cli v0.1.0 (ollama:gemma4:12b)"
  inputs_fingerprint: 80474633db4f5705
credits:
  generated_with: https://appfacts.dev
  built_by: "Catalyst Forge — https://www.catalystforge.com/"
---

# ForgeTrail

`spec / tooling` · **active** · Apache-2.0

Curated stack label for this repository — aimed at an under-a-minute skim.

**[Open visual label →][appfacts-label]** · or scan `APP_FACTS.png`

[Homepage](https://forgetrail.dev) · [Repository](https://github.com/Catalyst-Forge-LLC/forgetrail)

### Stack

| Layer | Choice |
| --- | --- |
| Language | JavaScript, TypeScript |
| Runtime | Node.js |
| Tooling | Model Context Protocol (MCP) |
| Hosting | Cloudflare |

### Key dependencies

- `@modelcontextprotocol/sdk` — Model Context Protocol server implementation
- `zod` — Schema validation and type inference
- `wrangler` — Cloudflare deployment tool
- `getfilepress` — File-based content management

### Services

- **Cloudflare** — hosting provider for website

### Build

- **Package Manager** — pnpm

---
*Generated with [AppFacts](https://appfacts.dev) · Built by [Catalyst Forge](https://www.catalystforge.com/) · [Visual label][appfacts-label]*

[appfacts-label]: https://appfacts.dev/v#af1.eNp1UsFq3DAQ_RUxpwa067ZHn1oMOZQkBJJbKWVWGtvqypLQjJ26i_-9yHa3S6E3Id578-bNu8AE9QcNAQeCGu5j7ug1o_OgQeZU_jiRUZWSGL0LHWhgQRkZakAjbiLQ4J2hwAX8OaHp6fDx-H4DmjPUF_AYuhG7AviCE76Y7JJo9Ton2t6gIY9B3GriKVo6_uDiYJ9Zw2O05FUTg9BPUc85SjTRq3ePzfMdaOgjywZsfBxt6zETLBosJYb66wUC1PBpKCJm00i7RMX2DBrS_2cw5YmyckPyNFAQFBcDLHoT_RXtTn8xPQ2oJvTOrhiFwaoSonKhpUzB0JX2ljF0nvLO_etaWUo-zmXQGvmV0ZG0zlPKxLyz7p2nwwmZrFq3CqIGDNitNmH5poEnc13_JhkNGeo_oamU4-QsZdXGrN7oxE5oZZ9G5225X0Jzxo6-b-qFm0IayoGIBWoYg3VsfGQqYRj3z9dSDjRQ2hrQiySuq6otXZPStaOlqXiiFNlJzPMNqnPSj6ejiUPVoKCfWQ5rSw8PD82NBiy_ATHV9b4
