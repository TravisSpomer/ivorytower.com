import { error } from "@sveltejs/kit"

import type { PageLoad } from "./$types"
type LoadEvent = Parameters<PageLoad>[0]
type LoadOutput = Promise<ReturnType<PageLoad>>

import { browser } from "$app/environment"

export async function load({ params }: LoadEvent): Promise<LoadOutput>
{
	const { id } = params
	const threadID = Number.parseInt(id, 10)
	if (isNaN(threadID)) error(404, `There's no thread "${id}".`)
	const locationHashPresent = browser && !!location.hash.match(/^#Post\d+$/)

	return { id: threadID, locationHashPresent: locationHashPresent, lastReload: new Date() }
}
