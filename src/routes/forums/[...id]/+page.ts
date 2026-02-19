import { error } from "@sveltejs/kit"
import type { PageLoadEvent } from "./$types"

export async function load({ params }: PageLoadEvent)
{
	const { id } = params
	const forumID = id ? parseInt(id, 10) : null
	if (forumID !== null && isNaN(forumID)) error(404, `There's no forum "${forumID}".`);

	return { id: forumID }
}
