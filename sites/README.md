# Family sites

Two small static sites, each deployed as its own Cloudflare Worker. They are
not part of the hollidaylakehouse.com Astro build (that only builds `src/`).
Plain HTML/CSS — edit files in `public/` directly, no build step.

| Folder | Live at | Worker | Content |
|---|---|---|---|
| `belindavidorholliday/` | belindavidorholliday.com + www | `belindavidorholliday` | Biography (~1,900 words; original family tribute text kept nearly verbatim, expanded with research, 3 inline photos, timeline) + Gallery (13 photos, lightbox). Bio live 2026-10-27. Gallery copied from the old WordPress site at belindaholliday.com; Celebration of Life and Guest Book intentionally not carried over. |
| `jsholliday/` | jsholliday.com + www | `jsholliday` | Full biography of J.S. Holliday (~2,200 words), published works, timeline, 4 photos. Live 2026-10-27. |

Both went live on 2026-10-26. The `workers.dev` review URLs are off; each
deploy goes straight to the real domain.

Both pages share the same look (Georgia serif, cream/brown palette). Each site
has its own `public/style.css`; the jsholliday copy started from Belinda's.
Bio sources are listed in the descriptions of PRs #34 (J.S.) and #36 (Belinda).

## Deploy a change

```
cd sites/belindavidorholliday && npx wrangler deploy
cd sites/jsholliday && npx wrangler deploy
```

Each `wrangler.jsonc` lists the bare and `www` hostnames as custom domains, so a
deploy keeps them attached. Cloudflare manages those DNS records itself
(shown as type "Worker" on the domain's DNS page) — don't edit or delete them.

## Adding a new domain to a Worker

1. In Cloudflare → the domain → **DNS → Records**, delete any existing `@` /
   `www` A, AAAA or CNAME records (otherwise the attach fails with
   "record already exists").
2. **Workers & Pages → (worker) → Domains → + Add → Custom domain**, add the
   bare name, then `www.`.
3. Add the same two hostnames to `routes` in that site's `wrangler.jsonc`.

## Alternate domains (redirects, not in this repo)

Six alternate domains 301-forward to the main sites using a **Redirect Rule in
each domain's own Cloudflare dashboard** — no code involved:

| Domain (+ www) | Forwards to |
|---|---|
| belindaholliday.com | https://belindavidorholliday.com |
| belindavidor.com | https://belindavidorholliday.com |
| holidaylakehouse.com (one L) | https://hollidaylakehouse.com |
| hollidaylake.com | https://hollidaylakehouse.com |
| holidaylake.net | https://hollidaylakehouse.com |
| hollidaylake.net | https://hollidaylakehouse.com |

Setup on each of those domains:

- **DNS:** `A @ 192.0.2.1` and `A www 192.0.2.1`, both **Proxied** (orange
  cloud). `192.0.2.1` is a reserved dummy address; the proxy is what lets the
  redirect rule run. Never put this address on the three main domains.
- **Rules → Redirect Rules → "Forward to main site":** All incoming requests →
  Dynamic → `concat("https://<target>", http.request.uri.path)` → 301 →
  Preserve query string ✓.

Path and query string are kept, e.g.
`belindaholliday.com/gallery/?utm=x` → `belindavidorholliday.com/gallery/?utm=x`.
