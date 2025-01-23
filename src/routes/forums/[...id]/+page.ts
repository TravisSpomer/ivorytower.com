import { error } from "@sveltejs/kit"

import type { PageLoad, PageLoadEvent } from "./$types"
type PageLoadOutput = Promise<ReturnType<PageLoad>>

export async function load({ params }: PageLoadEvent): Promise<PageLoadOutput>
{
	const { id } = params
	const forumID = id ? parseInt(id, 10) : null
	if (forumID !== null && isNaN(forumID)) error(404, `There's no forum "${forumID}".`);

	return { id: forumID }
}
