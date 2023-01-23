import { json } from "@sveltejs/kit"

export async function GET()
{
	return json({
		version: 0.0001,
		built: (new Date()).toISOString(),
	})
}
