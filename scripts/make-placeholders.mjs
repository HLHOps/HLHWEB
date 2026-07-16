// Generates valid solid-color placeholder JPEGs at every media path the site
// references. Replace these with the real photography/video downloaded from
// hollidaylakehouse.com/wp-content/uploads/ — the paths are already wired up.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// A small valid baseline JPEG (light neutral tone). Scaled via object-cover it
// fills any container with a soft, warm placeholder color.
const JPEG_BASE64 =
  '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRof' +
  'Hh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwh' +
  'MjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAAR' +
  'CAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAA' +
  'AgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkK' +
  'FhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWG' +
  'h4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl' +
  '5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREA' +
  'AgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYk' +
  'NOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOE' +
  'hYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk' +
  '5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD/2Q==';

const jpeg = Buffer.from(JPEG_BASE64, 'base64');

const roomSlugs = [
  'ponderosa',
  'meadow',
  'littlemeadow',
  'hilltop',
  'lake',
  'loft',
  'winbeds',
];

const paths = [
  'media/hero-poster.jpg',
  'media/features/experience.jpg',
  'media/features/ideas.jpg',
  'media/features/the-property.jpg',
  'media/story/the-house.jpg',
  'media/story/the-lake-and-the-land.jpg',
  'media/story/the-story-behind-the-house.jpg',
  'media/story/north-fork-california.jpg',
];

for (let i = 1; i <= 8; i++) {
  paths.push(`media/gallery/gallery-0${i}.jpg`);
}
for (const slug of roomSlugs) {
  paths.push(`media/rooms/${slug}/${slug}-01.jpg`);
  paths.push(`media/rooms/${slug}/${slug}-02.jpg`);
}

let written = 0;
let skipped = 0;
for (const rel of paths) {
  const abs = join(publicDir, rel);
  // Never overwrite a real asset that has already been dropped in.
  if (existsSync(abs)) {
    skipped++;
    continue;
  }
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, jpeg);
  written++;
}

console.log(
  `Placeholders: wrote ${written}, skipped ${skipped} existing, under public/media/`,
);
