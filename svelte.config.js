import adapterStatic from "@sveltejs/adapter-static"

/** @type {import('@sveltejs/kit').Config} */
export default {

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
		version: {
			// Check for new versions every 30 minutes
			pollInterval: 30 * 60_000,
		}
	},

}
