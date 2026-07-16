# Media assets

This folder holds the site's photography and video.

The real photography and video below have been downloaded from
`hollidaylakehouse.com/wp-content/uploads/` and are **committed to git** (the
`public/media/**` ignore lines were removed from the root `.gitignore`). The
placeholder generator (`scripts/make-placeholders.mjs`, still run on
`npm run dev` / `npm run build` / `npm run placeholders`) **skips any file that
already exists**, so these real assets are authoritative and permanent — the
generator only fills in a solid-color placeholder if a file is ever missing.

Every path below is already wired into the site — dropping the real file at the
same path is all that's needed. Filenames are referenced from
`src/data/site.ts` and `src/data/rooms.ts`; if you rename a file, update it
there too.

## Required assets

### Hero
- The full-screen hero background video is **not** stored here. It is hosted on
  Cloudflare R2 and referenced by absolute URL from `src/data/site.ts`
  (`heroVideo`), so it is never bundled into the Worker deploy. The current URL
  is R2's rate-limited public development URL (testing only) — swap it for a
  custom R2 domain before production launch.
- `hero-poster.jpg` — local poster shown before/instead of the video.

### Logo
- `logo-final.jpg` — circular brand emblem, used as the nav mark.
- `android-chrome-512x512-2.png` — icon used as the PNG favicon / apple-touch-icon.

### Feature cards (`/media/features/`)
- `experience.jpg`
- `ideas.jpg`
- `the-property.jpg`

### Property story (`/media/story/`)
- `the-house.jpg`
- `the-lake-and-the-land.jpg`
- `the-story-behind-the-house.jpg`
- `north-fork-california.jpg`

### Home gallery (`/media/gallery/`)
- `gallery-01.jpg` … `gallery-08.jpg`

### Rooms (`/media/rooms/<slug>/`)
For each room slug (`ponderosa`, `meadow`, `littlemeadow`, `hilltop`, `lake`,
`loft`, `winbeds`):
- `<slug>-01.jpg` — used as the room's hero/card image
- `<slug>-02.jpg` — second gallery image on the room detail page
