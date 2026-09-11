# forgetrail.dev

Marketing site for [ForgeTrail](https://github.com/Catalyst-Forge-LLC/forgetrail), built with [FilePress](https://getfilepress.com) ([`getfilepress`](https://www.npmjs.com/package/getfilepress) on npm). Same `/site` pattern as IngotVault.

```bash
# from the ForgeTrail repo root
pnpm site:dev     # local preview
pnpm site:build   # → site/build/

# or from this folder
pnpm install
pnpm dev
pnpm build
```

If [LocalSlip](https://localslip.dev) is installed, this site stays on **5195** as `forgetrail-site`.

Optional: edit `theme.css` next to `filepress.config.ts`.

## Deploy (Cloudflare Pages)

Live at [forgetrail.dev](https://forgetrail.dev). Docs mount: [forgetrail.dev/docs](https://forgetrail.dev/docs) (`site/docs/*.md` → `docs/dist`, requires getfilepress **≥ 0.1.8**).

**Use one pipeline only.** Dual deploys overwrite each other when asset hashes disagree.

```bash
pnpm ship
# = pnpm --dir site run ship
# = pnpm build && wrangler pages deploy build --project-name=forgetrail
```

First time on this machine:

1. `pnpm --dir site exec wrangler login`
2. `pnpm --dir site exec wrangler pages project create forgetrail` (if the project does not exist)
3. `pnpm ship` (publishes to `forgetrail.pages.dev`)
4. Attach **forgetrail.dev** in the Cloudflare dashboard and point the registrar at Cloudflare

### Git-connected Pages

| Setting | Value |
| --- | --- |
| Root directory | `site` |
| Build command | `pnpm install && pnpm build` |
| Output directory | `build` |

Dependency is the public npm package:

```json
"getfilepress": "^0.1.8"
```

## Content sync

**Site** = short product story (home, Try, About). **`/docs`** = install, CLI, MCP, phases, compare. **Root README** = short npm page (install + link to docs). When behavior changes, update `site/docs/*` + `TRY_FORGETRAIL.md`. Keep FilePress pages thin. Add a post under `posts/` only when there is something to publish; then put Writing back in the header.
