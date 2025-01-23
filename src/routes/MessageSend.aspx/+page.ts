import { error } from "@sveltejs/kit"

import type { PageLoad } from "./$types"
type LoadEvent = Parameters<PageLoad>[0]
type LoadOutput = Promise<ReturnType<PageLoad>>

export async function load({ url }: LoadEvent): Promise<LoadOutput>
{
	const name = url.searchParams.get("name")
	if (name !== "csmolinsky") error(404);

	return {}
}
