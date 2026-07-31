// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://hollidaylakehouse.com',
  output: 'static',
  // Ensure directory-style URLs so paths like /ponderosa/ are served
  // exactly as authored.
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [
    // Emits sitemap-index.xml + sitemap-0.xml against the `site` domain above.
    // The homepage and the 7 room pages are advertised to search engines.
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
