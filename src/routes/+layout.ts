import type { LayoutLoad } from "./$types"
type LoadEvent = Parameters<LayoutLoad>[0]
type LoadOutput = Promise<ReturnType<LayoutLoad>>

import { startup } from "$lib/utils/startup"

export async function load({ url: _url, params: _params }: LoadEvent): Promise<LoadOutput>
{
	// When loading this layout for the first time, do app startup stuff.
	startup()

	return {}
}
