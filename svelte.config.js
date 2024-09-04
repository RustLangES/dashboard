import adapter from '@sveltejs/adapter-cloudflare-workers';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

  kit: {
    outDir: 'dist',
    adapter: adapter({
      platformProxy: {
        configPath: 'wrangler.toml',
        environment: undefined,
        experimentalJsonConfig: false,
        persist: false
      }
    })
  }
};

export default config;
