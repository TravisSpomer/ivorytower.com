import { browser } from "$app/environment"
import type { BasicThread } from "../threads"
import { getUnreadThreads } from "../threads"

/** The minimum amount of time that we should wait between checks for new unread threads. */
const MinRefreshTime = 5000 // 5 seconds

let _threads: BasicThread[] | undefined
let _lastRefreshTime: number = 0

/** A framework-independent cache of unread threads. */
export const UnreadThreads =
{
	/** true if we've loaded a list of threads. */
	get isLoaded(): boolean
	{
		return !!_threads
	},

	/** The number of unread threads. */
	get length(): number
	{
		return _threads ? _threads.length : 0
	},

	/** Returns the next unread thread without removing it from the list, or null if the list is empty. */
	get next(): Readonly<BasicThread> | null
	{
		if (!_threads || _threads.length === 0) return null
		return _threads[0]
	},

	/** Returns the next unread thread and removes it from the list, or null if the list is empty. */
	pop(): Readonly<BasicThread> | null
	{
		if (!_threads || _threads.length === 0) return null
		const next = _threads.shift()!
		if (_internalOnStoreUpdate) _internalOnStoreUpdate()
		return next
	},

	/** Removes a thread from the list if it's present, and returns true if it was. */
	remove(thread: Readonly<BasicThread> | number): boolean
	{
		if (!_threads || _threads.length === 0) return false
		const searchID: number = typeof thread === "number" ? thread : thread.id
		const index = _threads.findIndex(unreadThread => searchID === unreadThread.id)
		if (index >= 0)
		{
			_threads.splice(index, 1)
			if (_internalOnStoreUpdate) _internalOnStoreUpdate()
			return true
		}
		return false
	},

	refreshFromArray(threadArray: BasicThread[]): void
	{
		if (!threadArray) return
		_threads = Array.from(threadArray)
		_lastRefreshTime = Date.now()
		if (_internalOnStoreUpdate) _internalOnStoreUpdate()
	},

	async refresh(): Promise<void>
	{
		// Don't attempt to refresh if we're not running in the browser (such as at build time).
		if (!browser) return

		// Don't refresh too often.
		if (_threads && Date.now() < _lastRefreshTime + MinRefreshTime)
			return
		_lastRefreshTime = Date.now()

		this.refreshFromArray((await getUnreadThreads()).unreadThreads)
	},
}

// This really should be an array of registered event listeners, but... meh?
let _internalOnStoreUpdate: () => void

export function _internalInit(callback: typeof _internalOnStoreUpdate): void
{
	_internalOnStoreUpdate = callback
}
