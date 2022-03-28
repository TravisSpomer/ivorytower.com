import { call } from "./api"
import { UnreadThreads } from "./cache/UnreadThreads"
import { UserCache } from "./cache/UserCache"
import type { AccountPreferences } from "./preferences"
import type { GetUnreadThreadsResponse } from "./threads"
import type { GetAllUsersResponse } from "./users"

interface PlaintextCredentials
{
	username: string
	password: string
}

interface AutoLoginTokenCredentials
{
	username: string
	token: string
}

export type Credentials = PlaintextCredentials | AutoLoginTokenCredentials

export const enum LoginResult
{
	Success = 1,
	UnknownError = -1,
	WrongPassword = -2,
	AllLoginsDisabled = -3,
	UserLoginDisabled = -4,
}

/** Returns true if the supplied login API response represents a successful login. */
export function loginSucceeded(result: LoginResult): boolean
export function loginSucceeded(response: LoginResponse): response is SuccessfulLoginResponse
export function loginSucceeded(arg: LoginResponse | LoginResult): boolean
{
	return (typeof arg === "number") ? (arg > 0) : (arg.result > 0)
}

/** A successful response from the login API. */
export interface SuccessfulLoginResponse
{
	result: LoginResult.Success

	/** The logged-in username, in case you forgot. */
	username: string
	/** The user's autologin token, for password-free login next time. */
	token: string
	/** If false, the user hasn't accepted the terms and conditions yet. */
	acceptedTerms: boolean
	/** The user's preferences. */
	preferences: AccountPreferences
	/** A list of users, in the format returned by the getAllUsers API. */
	users: GetAllUsersResponse["users"]
	/** An array of unread theads, in the format returned by the getUnreadThreads API. */
	unreadThreads: GetUnreadThreadsResponse["unreadThreads"]
}

/** An unsuccessful response from the login API. */
export interface ErrorLoginResponse
{
	result: LoginResult.UnknownError | LoginResult.WrongPassword | LoginResult.AllLoginsDisabled | LoginResult.UserLoginDisabled
}

/** A response from the login API, successful or not. */
export type LoginResponse = SuccessfulLoginResponse | ErrorLoginResponse

export interface AcceptTermsResponse
{
	/** If false, the user hasn't accepted the terms and conditions yet. */
	acceptedTerms: boolean
}

/**
	Logs the user in using either their username and password, or username and autologin token.
*/
export async function login(credentials: Credentials): Promise<LoginResponse>
{
	const response: LoginResponse = await call("/login", { body: JSON.stringify(credentials), method: "POST" })

	if (loginSucceeded(response))
	{
		// Some fields are optional in the JSON.
		if (!("acceptedTerms" in response)) (response as SuccessfulLoginResponse).acceptedTerms = true

		// The /login API returns a "welcome package" of data if successful. Cache that before returning.
		UserCache.refreshFromArray(response.users)
		UnreadThreads.refreshFromArray(response.unreadThreads)
	}

	return response
}

/**
	Accepts the IvoryTower Terms and Conditions.
*/
export async function acceptTerms(): Promise<AcceptTermsResponse>
{
	return call("/terms/accept", { method: "POST" })
}
