import { readable } from "svelte/store"
import { UserCache, _internalInit } from "$lib/sdk/cache/UserCache"

export const users = readable(
	UserCache,
	set => _internalInit(() => set(UserCache))
)
