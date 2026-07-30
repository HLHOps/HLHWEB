# Holliday Lake House — marketing site

A warm, literary marketing site for Holliday Lake House, a waterfront short-term
rental in North Fork, California. Built with [Astro](https://astro.build) (static
output) and [Tailwind CSS](https://tailwindcss.com) v4, deployed to Cloudflare
Workers static assets.

## Design

Georgia/serif typography, earth-tone palette (browns, greens, golds),
photography-forward, and unhurried — no flashy animation or urgency. Theme
tokens live in `src/styles/global.css` (`@theme`).

## Getting started

```sh
npm install
npm run dev      # local dev server
npm run build    # static build to ./dist
npm run preview  # serve the built ./dist
```

## Structure

```
src/
  data/
    site.ts        # nav, story, feature cards, gallery, JotForm + Instagram links
    rooms.ts       # the 7 rooms (slug, floor, beds, capacity, copy, images)
  layouts/Base.astro
  components/       # Nav, Hero, FeatureCards, Gallery, StoryIntro,
                    # StoryDetail, SleepingArrangements, RoomCards,
                    # Contact, Footer
  pages/
    index.astro           # home
    [room].astro          # /ponderosa, /meadow, /littlemeadow, /hilltop,
                          #   /lake, /loft, /winbeds (one per room, static)
    hlhid2604/index.astro # Guest Guidelines, preserved at /hlhid2604/
public/
  media/           # photography + hero video (see public/media/README.md)
```

## Content that still needs the source of truth

This repo was scaffolded in an environment that **could not reach
`hollidaylakehouse.com`** (blocked by the workspace egress policy), so a few
pieces use clearly-marked placeholders wired to the correct paths:

1. **Media** — images are generated solid-color placeholders (created by
   `scripts/make-placeholders.mjs`, run automatically before `dev`/`build`) and
   the hero video is not yet present. The generator skips files that already
   exist, so dropping real assets in place is safe. See `public/media/README.md`
   for the full list of files to add (download from
   `hollidaylakehouse.com/wp-content/uploads/`).
2. **Per-room bed/floor/capacity** — the figures in `src/data/rooms.ts` sum to
   the brief's totals (7 rooms, sleeps 22) but should be reconciled against the
   authoritative migration brief.
3. **Guest Guidelines copy** — `src/pages/hlhid2604/index.astro` preserves the
   exact `/hlhid2604/` path with placeholder section copy; replace the body text
   with the original guidelines.

## Deployment

`wrangler.jsonc` serves the built `./dist` as Cloudflare Workers static assets:

```sh
npm run build
npx wrangler deploy
```
