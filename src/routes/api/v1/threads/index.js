// This messy import is required to distinguish SvelteKit's generated types from the real ones.
import { GET as GET1 } from "$lib/../routes/api/v1/threads/1"

export async function POST()
{
	return GET1()
}
