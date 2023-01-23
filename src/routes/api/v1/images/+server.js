import { json } from "@sveltejs/kit"

export async function POST()
{
	// NOTE: When this was written, SvelteKit rejected file uploads, so this didn't work. It's not tested.

	return json({
		"image":
		{
			"title": "Video Enhance AI 4K upscaling",
			"imageUrl": "https://images.ivorytower.com/user/tspomer/Video%20Enhance%20AI%204K%20upscaling.jpg",
			"thumbnailUrl": "https://images.ivorytower.com/user/tspomer/thumb/Video%20Enhance%20AI%204K%20upscaling.jpg",
			"width": 800,
			"height": 544
		}
	})
}
