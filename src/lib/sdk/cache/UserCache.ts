import { browser } from "$app/env"
import type { BasicUser } from "../users"
import { getAllUsers, UserRole } from "../users"

type UserMap = { [username: string]: BasicUser }

/** The minimum amount of time that we should wait between checks for the latest user data. */
const MinRefreshTime = 300000 // 5 minutes

let _users: UserMap | undefined
let _userCount: number = 0
let _lastRefreshTime: number = 0

/** A framework-independent cache of user data. */
export const UserCache =
{
	/** true if we've loaded a list of users. */
	get isLoaded(): boolean
	{
		return _users !== undefined
	},

	/** An array of all of the current users. */
	get all(): ReadonlyArray<Readonly<BasicUser>>
	{
		return _users ? Object.values(_users) : []
	},

	/** The number of users in the store. */
	get length(): number
	{
		return _userCount
	},

	/** Returns information about a user by their username, or null if that user is not known. */
	get(username: string): Readonly<BasicUser> | null
	{
		if (!_users) return null
		const user = _users[username]
		if (!user)
		{
			// If code asked for a user that isn't known, try rechecking for fresh user data: maybe they were just added.
			this.refresh()
			return null
		}
		return user
	},

	/** Returns information about a user by their username, or placeholder data if that user is not known. */
	getOrPlaceholder(username: string): Readonly<BasicUser>
	{
		const user = this.get(username)
		if (user) return user
		const placeholderName = `(${username})`
		return { username, fullName: placeholderName, shortName: placeholderName, role: UserRole.Member }
	},

	[Symbol.iterator](): Iterator<Readonly<BasicUser>>
	{
		if (!_users) return [][Symbol.iterator]()
		return Object.values(_users)[Symbol.iterator]()
	},

	refreshFromArray(userArray: BasicUser[]): void
	{
		if (!userArray) return
		userArray.sort((a, b) => a.username < b.username ? -1 : 1)
		_users = userArray.reduce<UserMap>(
			(map, user) =>
			{
				map[user.username] = user
				return map
			},
			{})
		_userCount = userArray.length
		_lastRefreshTime = Date.now()
		if (_internalOnStoreUpdate) _internalOnStoreUpdate()
	},

	async refresh(): Promise<void>
	{
		// Don't attempt to refresh if we're not running in the browser (such as at build time).
		if (!browser) return

		// Don't refresh too often.
		if (_users && Date.now() < _lastRefreshTime + MinRefreshTime)
			return
		_lastRefreshTime = Date.now()

		this.refreshFromArray((await getAllUsers()).users)
	},
}

// This really should be an array of registered event listeners, but... meh?
let _internalOnStoreUpdate: () => void

export function _internalInit(callback: typeof _internalOnStoreUpdate): void
{
	_internalOnStoreUpdate = callback
}
