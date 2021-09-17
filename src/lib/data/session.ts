import type { Readable } from "svelte/store"
import { writable, derived, get } from "svelte/store"
import { browser } from "$app/env"
import { users } from "./users"
import { unreadThreads } from "./unreadThreads"
import type { Credentials, LoginResponse } from "$lib/sdk"
import { login as callLoginApi, loginSucceeded, LoginResult } from "$lib/sdk"

const AutoLoginUsernameKey = "IvoryTower.AutoLoginUsername"
const AutoLoginTokenKey = "IvoryTower.AutoLoginToken"

export const enum LoginState
{
	Anonymous = 0,
	LoggingIn = 1,
	LoggedIn = 2,
}

const loginState = writable<LoginState>(LoginState.Anonymous)
const loginStateReadOnly = loginState as Readable<LoginState>
const currentUsername = writable<string | null>(null)

/** The current login state. */
export { loginStateReadOnly as loginState }

/** The currently-signed in user, or null. */
export const currentUser = derived([loginState, currentUsername, users], ([$loginState, $currentUsername, $users]) => $loginState === LoginState.LoggedIn && $currentUsername ? $users.get($currentUsername) : null)

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
	loginState.set(LoginState.LoggedIn)
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
