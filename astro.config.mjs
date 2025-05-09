// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';

// https://astro.build/config
export default defineConfig({
  site: 'https://chenjing7.github.io',
  base: '/tzb',
  integrations: [
    mdx(),
    tailwind(),
    sitemap(),
  ],
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
