// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://hollidaylakehouse.com',
  output: 'static',
  // Ensure directory-style URLs so paths like /hlhid2604/ and /ponderosa/
  // are served exactly as authored.
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [
    // Emits sitemap-index.xml + sitemap-0.xml against the `site` domain above.
    // Exclude the private guest-guidelines page (/hlhid2604/) so it is not
    // advertised to search engines; the homepage and the 7 room pages remain.
    sitemap({
      filter: (page) => !page.includes('/hlhid2604'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
