import { toBool } from "$lib/utils/convert"

/** @type {import("./1").RequestHandler} */
export async function post({ url })
{
	const ignoreParam = url.searchParams.get("ignore")
	const ignore = ignoreParam === null ? true : toBool(ignoreParam)

	return {
		body:

		{
			id: 1,
			ignored: ignore,
		}

	}
}
