// This messy import is required to distinguish SvelteKit's generated types from the real ones.
import { GET as GET1 } from "$lib/../routes/api/v1/threads/1"
import { sleep } from "$lib/utils/promise"

export async function POST()
{
	await sleep(2000)
	return GET1()
}
