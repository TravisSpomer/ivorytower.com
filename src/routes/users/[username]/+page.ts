import type { PageLoad } from "./$types"
type LoadEvent = Parameters<PageLoad>[0]
type LoadOutput = Promise<ReturnType<PageLoad>>

export async function load({ params }: LoadEvent): LoadOutput
{
	return { username: params.username }
}
