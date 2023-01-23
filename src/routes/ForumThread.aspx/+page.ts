import { redirect } from "@sveltejs/kit"

import type { PageLoad } from "./$types"
type LoadEvent = Parameters<PageLoad>[0]
type LoadOutput = Promise<ReturnType<PageLoad>>

export async function load({ url }: LoadEvent): Promise<LoadOutput>
{
	throw redirect(301, `/threads/${url.searchParams.get("Thread")}${url.hash}`)
}
