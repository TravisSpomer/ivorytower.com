import { error } from "@sveltejs/kit"

import type { PageLoad, PageLoadEvent } from "./$types"
type PageLoadOutput = Promise<ReturnType<PageLoad>>

export async function load({ url }: PageLoadEvent): PageLoadOutput
{
	const id = url.searchParams.get("forum")
	const forumID = id ? Number.parseInt(id, 10) : NaN
	if (isNaN(forumID)) throw error(404, `There's no forum "${forumID}".`)

	return { forumID }
}
