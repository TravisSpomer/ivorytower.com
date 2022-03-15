// This messy import is required to distinguish SvelteKit's generated types from the real ones.
import { get as get1 } from "$lib/../routes/api/v1/threads/1"

export async function post()
{
	return get1()
}
