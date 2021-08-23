import { readable } from "svelte/store"
import { UnreadThreads, _internalInit } from "$lib/sdk/cache/UnreadThreads"

export const unreadThreads = readable(
	UnreadThreads,
	set => _internalInit(() => set(UnreadThreads))
)
