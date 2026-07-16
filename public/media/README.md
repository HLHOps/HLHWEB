# Media assets

This folder holds the site's photography and video.

The image files are **not committed to git**. Instead, running `npm run dev` or
`npm run build` (or `npm run placeholders`) generates solid-color placeholder
JPEGs at every path below via `scripts/make-placeholders.mjs`, so the layout
renders and the build succeeds out of the box. The generator **skips any file
that already exists**, so dropping a real asset in place is safe and permanent.

Replace each placeholder, in place, with the real asset downloaded from
`hollidaylakehouse.com/wp-content/uploads/`. The build environment could not
download the originals directly — the source host is blocked by this workspace's
outbound network (egress) policy — so the originals must be added manually (or
the host allow-listed in a session that can reach it).

> To track the real binary assets in git rather than hosting them separately,
> remove the `public/media/**` ignore lines from the root `.gitignore` and
> commit the files.

Every path below is already wired into the site — dropping the real file at the
same path is all that's needed. Filenames are referenced from
`src/data/site.ts` and `src/data/rooms.ts`; if you rename a file, update it
there too.

## Required assets

### Hero
- `Landing-Media-Made-with-Clipchamp.mp4` — full-screen hero background video.
  **Not currently present** (a corrupt placeholder would error in-browser; the
  absent file falls back cleanly to the poster below). Add the real MP4 here.
- `hero-poster.jpg` — first-frame poster shown before/instead of the video.

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
