import { call, callWithFullResponse } from "./api"
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

interface LegacyAutoLoginTokenCredentials
{
	username: string
	token: string
}

export type Credentials = PlaintextCredentials | LegacyAutoLoginTokenCredentials

const AuthResultHeaderName = "X-Auth-Result"
export type LoginResult = "success" | "needtologin" | "credentialsinvalid" | "loginrestricted" | "allloginsdisabled" | "unknown"

function legacyLoginResultToNewLoginResult(legacyResult: number): LoginResult
{ 
	switch (legacyResult)
	{ 
		case 1: return "success"
		case -2: return "credentialsinvalid"
		case -3: return "allloginsdisabled"
		case -4: return "loginrestricted"
		case -5: return "credentialsinvalid"
		default: return "unknown"
	}
}

/** A successful response from the login API. */
export interface SuccessfulLoginResponse
{
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

export interface AcceptTermsResponse
{
	/** If false, the user hasn't accepted the terms and conditions yet. */
	acceptedTerms: boolean
}

/**
	Logs the user in using either their username and password, or username and autologin token.
*/
export async function login(credentials: Credentials): Promise<LoginResult | SuccessfulLoginResponse>
{
	return loginCore(await callWithFullResponse("/login", { body: JSON.stringify(credentials), method: "POST" }))
}

/**
	Logs the user in using their auth tokens stored in cookies.
*/
export async function loginPassive(): Promise<LoginResult | SuccessfulLoginResponse>
{
	return loginCore(await callWithFullResponse("/login/cookie", { method: "POST" }))
}

async function loginCore(response: Response): Promise<LoginResult | SuccessfulLoginResponse>
{
	const responseJson: SuccessfulLoginResponse = await response.json()
	let result: LoginResult

	// Prefer to get auth results from headers (new API), but look for a "result" property on the response if the headers aren't there (temp API).
	if (response.headers.has(AuthResultHeaderName))
	{
		result = response.headers.get(AuthResultHeaderName) as LoginResult || "unknown"
	}
	else if ("result" in responseJson)
	{
		result = legacyLoginResultToNewLoginResult((responseJson as any).result)
	}
	else if (responseJson)
	{ 
		result = "success"
	}
	else
	{ 
		result = "unknown"
	}

	if (result === "success")
	{
		// Some fields are optional in the JSON.
		if (!("acceptedTerms" in responseJson)) (responseJson as SuccessfulLoginResponse).acceptedTerms = true

		// The /login API returns a "welcome package" of data if successful. Cache that before returning.
		UserCache.refreshFromArray(responseJson.users)
		UnreadThreads.refreshFromArray(responseJson.unreadThreads)

		return responseJson
	}
	else
	{ 
		return result
	}
}

/**
	Logs the user out.
*/
export async function logout(): Promise<void>
{ 
	await call("/logout", { method: "POST" })
}

/**
	Accepts the IvoryTower Terms and Conditions.
*/
export async function acceptTerms(): Promise<AcceptTermsResponse>
{
	return call("/terms/accept", { method: "POST" })
}
