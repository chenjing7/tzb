// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';

// Conditionally import MDX to prevent build failures
let mdx;
try {
  mdx = await import('@astrojs/mdx');
} catch (e) {
  console.warn('MDX integration not available, continuing without it');
}

// Create integrations array with available modules
const integrations = [
  tailwind(),
  sitemap(),
];

// Add MDX if available
if (mdx) {
  integrations.push(mdx.default());
}

// https://astro.build/config
export default defineConfig({
  site: 'https://chenjing7.github.io',
  base: '/tzb',
  integrations,
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      langs: [],
      wrap: true
    },
    remarkPlugins: [
      remarkGfm,
    ],
  },
  vite: {
    publicDir: 'public',
    build: {
      assetsInlineLimit: 0,
    },
  },
  output: 'static'
});
