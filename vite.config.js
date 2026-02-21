import { sveltekit } from "@sveltejs/kit/vite"

/** @type {import("vite").UserConfig} */
const config = {
	plugins: [sveltekit()],
	server:
	{
		proxy:
		{
			// Uncomment to proxy all /api requests to the live server instead
			// "/api": "https://api.ivorytower.com"
		}
	},
}

export default config
