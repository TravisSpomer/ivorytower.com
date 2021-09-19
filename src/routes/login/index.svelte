<script lang="ts">
	import { loginState, LoginState } from "$lib/data"
	import { login } from "$lib/data/session"
	import { Wait } from "$lib/components"
	import type { Credentials } from "$lib/sdk"
	import { loginSucceeded, LoginResult } from "$lib/sdk"

	let form: HTMLFormElement
	let username: string
	let password: string

	let lastError: LoginResult | null = null

	async function loginButtonOnClick()
	{
		if (!form.reportValidity()) return

		const credentials: Credentials = { username, password }
		const result = await login(credentials, { rememberMe: true })
		if (loginSucceeded(result))
			lastError = null
		else
			lastError = result
	}
</script>

<svelte:head>
	<title>Log in - IvoryTower</title>
</svelte:head>

{#if $loginState === LoginState.LoggingIn}
	<h1>
		Welcome to IvoryTower
	</h1>
	<Wait />
{:else}
	<h1>
		Papers, please
	</h1>
	<form bind:this={form} on:submit|preventDefault={loginButtonOnClick}>
		<table class="no-lines">
			<tr>
				<th><label for="username">Username</label></th>
				<!-- svelte-ignore a11y-autofocus -->
				<td><input id="username" type="text" required autofocus autocapitalize="off" bind:value={username} /></td>
			</tr>
			<tr>
				<th><label for="password">Password</label></th>
				<td><input id="password" type="password" required bind:value={password} /></td>
			</tr>
		</table>
		<p>
			<button class:button={true} class:accent={true} on:click|preventDefault={loginButtonOnClick}>Sign in</button>
		</p>
	</form>
	{#if lastError}
		<aside class="danger">
			{#if lastError === LoginResult.WrongPassword}
				That's not the right password. Please try again.
			{:else if lastError === LoginResult.AllLoginsDisabled}
				Logging in is temporarily unavailable, probably because IvoryTower is about to get an update. IvoryTower will return in a few.
			{:else if lastError === LoginResult.UserLoginDisabled}
				Your account has been restricted and you aren't able to log in at this time. Please contact an administrator if this is unexpected.
			{:else}
				The login failed and we're not sure why. Please try again in a moment.
			{/if}
		</aside>
	{/if}
	<p><small>
		This is a private site for authorized users only, and is not affiliated with any other organization.
		You must abide by the <a href="/login/terms">terms and conditions</a> to use IvoryTower.
	</small></p>
{/if}
