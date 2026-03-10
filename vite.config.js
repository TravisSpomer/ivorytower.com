import { sveltekit } from "@sveltejs/kit/vite"

// Set API_PROXY=https://servername at dev time to redirect all /api requests elsewhere
/** @type {import("vite").UserConfig.server.proxy} */
const proxySettings = process.env.API_PROXY ? { "/api": process.env.API_PROXY } : {}

/** @type {import("vite").UserConfig} */
const config = {
	plugins: [sveltekit()],
	server:
	{
		proxy: proxySettings
	},
}

export default config
