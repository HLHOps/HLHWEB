# Family sites

Two small static sites, each deployed as its own Cloudflare Worker. They are
not part of the hollidaylakehouse.com Astro build (that only builds `src/`).

| Folder | Domain | Worker | Content |
|---|---|---|---|
| `belindavidorholliday/` | belindavidorholliday.com | `belindavidorholliday` | Tribute + Gallery, copied from the WordPress site at belindaholliday.com (Oct 2026). Celebration of Life and Guest Book intentionally not carried over. |
| `jsholliday/` | jsholliday.com | `jsholliday` | Placeholder page (noindex) until real content is ready. |
| `redirects/` | 6 alternate domains (+ www) | `domain-redirects` | 301-forwards belindaholliday.com and belindavidor.com to belindavidorholliday.com, and holidaylakehouse.com, hollidaylake.com, holidaylake.net, hollidaylake.net to hollidaylakehouse.com. Keeps path and query string. To add a domain, add it to `src/index.js` and `wrangler.jsonc`. |

## Deploy

```
cd sites/belindavidorholliday && npx wrangler deploy
cd sites/jsholliday && npx wrangler deploy
```

First deploy goes to `*.workers.dev`. Check it, then uncomment `routes` in that
site's `wrangler.jsonc` and deploy again to attach the real domain. Attaching a
custom domain replaces whatever DNS record currently points that hostname
elsewhere (e.g. the old WordPress host), so do it when ready to cut over.

Plain HTML/CSS — edit files in `public/` directly, no build step.
