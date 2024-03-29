import type { Readable } from "svelte/store"
import { writable, derived, get } from "svelte/store"
import { browser } from "$app/environment"
import { users } from "./users"
import { unreadThreads } from "./unreadThreads"
import type { Credentials, LoginResponse, AccountPreferences } from "$lib/sdk"
import { login as callLoginApi, loginSucceeded, LoginResult, acceptTerms as callAcceptTermsApi } from "$lib/sdk"

const AutoLoginUsernameKey = "IvoryTower.AutoLoginUsername"
const AutoLoginTokenKey = "IvoryTower.AutoLoginToken"

export const enum LoginState
{
	Anonymous = 0,
	LoggingIn = 1,
	MustAcceptTerms = 2,
	LoggedIn = 3,
}

const loginState = writable<LoginState>(LoginState.Anonymous)
const loginStateReadOnly = loginState as Readable<LoginState>
const currentUsername = writable<string | null>(null)
let acceptedTerms: boolean = false
const preferences = writable<AccountPreferences>({})
const preferencesReadOnly = preferences as Readable<AccountPreferences>

/** The current login state. */
export { loginStateReadOnly as loginState }

/** User preferences synced across all devices the user logs in on. */
export { preferencesReadOnly as preferences }

/** The currently-signed in user, or null. */
export const currentUser = derived([loginState, currentUsername, users], ([$loginState, $currentUsername, $users]) => ($loginState === LoginState.LoggedIn || $loginState === LoginState.MustAcceptTerms) && $currentUsername ? $users.get($currentUsername) : null)

interface LoginOptions
{
	/** If true, the login token will be saved so that the user can be automatically logged on again next time. */
	rememberMe?: boolean
}

/** Logs a user in using a username and password, and returns a promise that is fulfilled when the login completes, successfully or otherwise. */
export async function login(credentials: Credentials, options: LoginOptions = {}): Promise<LoginResult>
{
	if (credentials.username.length === 0) throw new Error("Username must be specified.")
	if (!("password" in credentials) && !("token" in credentials)) throw new Error("Either a password or a token must be specified.")
	if ("password" in credentials && credentials.password.length === 0) throw new Error("Password must not be empty.")
	if ("token" in credentials && credentials.token.length === 0) throw new Error("Token must not be empty.")

	// If they're already logged in, log out first.
	if (get(loginStateReadOnly) !== LoginState.Anonymous)
		logout()

	// Now, try the login.
	loginState.set(LoginState.LoggingIn)
	let response: LoginResponse
	try
	{
		response = await callLoginApi(credentials)
	}
	catch (error)
	{
		loginState.set(LoginState.Anonymous)
		throw error
	}
	if (!loginSucceeded(response))
	{
		loginState.set(LoginState.Anonymous)
		return response.result
	}

	// It worked! Update the app state.
	if (options.rememberMe)
	{
		localStorage.setItem(AutoLoginUsernameKey, response.username)
		localStorage.setItem(AutoLoginTokenKey, response.token)
	}
	currentUsername.set(response.username)
	acceptedTerms = response.acceptedTerms
	preferences.set(response.preferences || {})
	loginState.set(acceptedTerms ? LoginState.LoggedIn : LoginState.MustAcceptTerms)
	return response.result
}

/** Logs the current user out. */
export function logout(): void
{
	localStorage.removeItem(AutoLoginUsernameKey)
	localStorage.removeItem(AutoLoginTokenKey)
	loginState.set(LoginState.Anonymous)
	currentUsername.set(null)
	get(unreadThreads).refreshFromArray([])
}

/** Returns true if the user has an auto-login token stored. */
export function canAutoLogin(): boolean
{
	return browser &&
		get(loginStateReadOnly) === LoginState.Anonymous &&
		localStorage.getItem(AutoLoginUsernameKey) !== null &&
		localStorage.getItem(AutoLoginTokenKey) !== null
}

/** Attempts to log the current user in using a previously saved auto-login token. Returns true if it was successful. */
export async function autoLogin(): Promise<boolean>
{
	if (!canAutoLogin()) return false

	const credentials: Credentials =
	{
		username: localStorage.getItem(AutoLoginUsernameKey) as string,
		token: localStorage.getItem(AutoLoginTokenKey) as string,
	}

	return loginSucceeded(await login(credentials, { rememberMe: true }))
}

export async function acceptTerms(): Promise<boolean>
{
	if (get(loginStateReadOnly) !== LoginState.MustAcceptTerms) return false

	acceptedTerms = (await callAcceptTermsApi()).acceptedTerms
	if (acceptedTerms) loginState.set(LoginState.LoggedIn)
	return acceptedTerms
}
