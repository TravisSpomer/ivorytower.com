import { error } from "@sveltejs/kit"
import type { PageLoadEvent } from "./$types"

export async function load({ url }: PageLoadEvent)
{
	const id = url.searchParams.get("forum")
	const forumID = id ? parseInt(id, 10) : NaN
	if (isNaN(forumID)) error(404, `There's no forum "${forumID}".`);

	return { forumID }
}
