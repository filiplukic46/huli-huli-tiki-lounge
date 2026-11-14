// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The client's live domain. Canonical, OG and sitemap read it.
// The GitHub Pages build (PAGES=1, set in the deploy workflow) serves the site under /<repo>/.
const pages = process.env.PAGES === '1';
export default defineConfig({
  site: pages ? 'https://filiplukic46.github.io' : 'https://www.hulihulipowell.com',
  base: pages ? '/huli-huli-tiki-lounge' : undefined,
  integrations: [sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'auto' },
});
