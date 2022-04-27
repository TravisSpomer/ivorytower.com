<script lang="ts">
	import { goto } from "$app/navigation"
	import { loginState, LoginState } from "$lib/data"
	import { login } from "$lib/data/session"
	import { Button, Title, Wait } from "$lib/components"
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
		{
			lastError = null
			console.log(location.href)
			if (location.href.endsWith("/login")) goto("/")
		}
		else
		{
			lastError = result
		}
	}
</script>

<style lang="scss">
	@import "../../core";

	.form
	{
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5em;

		label
		{
			color: var(--link);
			font-weight: $font-weight-bold;
		}

		input
		{
			width: min(100%, 360px);
		}
	}

</style>

<Title title={null} />

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
		<div class="form">
			<label for="username">Username</label>
			<!-- svelte-ignore a11y-autofocus -->
			<input id="username" type="text" required autofocus autocapitalize="off" bind:value={username} />

			<label for="password">Password</label>
			<input id="password" type="password" required bind:value={password} />
		</div>
		<p>
			<Button accent on:click={loginButtonOnClick}>Sign in</Button>
		</p>
		<p><small>
			<a href="https://old.ivorytower.com/LoginChangePassword.aspx" class="external">Change password</a>
		</small></p>
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
