import adapterStatic from "@sveltejs/adapter-static"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config} */
export default {

	preprocess: [
		vitePreprocess(),
	],

	kit: {
		adapter: adapterStatic({
			// This makes the site a SPA and effectively disables all prerendering.
			fallback: "index.html",
		}),
		paths: {
			base: process.env.BASE_URL || "",
		},
		prerender: {
			// Only render the pages that we need for the SPA.
			crawl: false,
			entries: [ "/", "/404" ],
		},
	},

}
