import { call } from "./api"

/** A user's role. */
export const enum UserRole
{
	/** A regular member. */
	Member = 0,
	/** A site administrator. */
	Admin = 1,
	/** A forums moderator. */
	Moderator = 2,
}

/** Basic information about a user in the system. */
export interface BasicUser
{
	/** The username of the user. */
	username: string
	/** The user's full name. */
	fullName: string
	/** The user's short (first) name. */
	shortName: string
	/** The user's role. */
	role: UserRole
}

/** A response from the getAllUsers API. */
export interface GetAllUsersResponse
{
	/** A list of users. */
	users: BasicUser[]
}

/**
	Returns a list of all users in the system.
*/
export async function getAllUsers(): Promise<GetAllUsersResponse>
{
	return call("/users")
}

/**
	Normalizes a username for comparisons.
*/
function normalizeUsername(username: string): string
{
	return username.toLowerCase()
}

/**
	Returns true if two users are the same.
*/
export function isSameUser(user1: BasicUser | string | null, user2: BasicUser | string | null): boolean
{
	if (user1 === null || user2 === null) return false
	if (user1 === user2) return true
	const username1 = typeof user1 === "string" ? normalizeUsername(user1) : user1.username
	const username2 = typeof user2 === "string" ? normalizeUsername(user2) : user2.username
	return username1 === username2
}
