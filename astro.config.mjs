// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

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
  vite: {
    plugins: [tailwindcss()],
  },
});
