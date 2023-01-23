import { json } from "@sveltejs/kit"
import { toBool } from "$lib/utils/convert"

/** @type {import("./$types").RequestHandler} */
export async function POST({ url })
{
	const ignoreParam = url.searchParams.get("ignore")
	const ignore = ignoreParam === null ? true : toBool(ignoreParam)

	return json({
		id: 1,
		ignored: ignore,
	})
}
