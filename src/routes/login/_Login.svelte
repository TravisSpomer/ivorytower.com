<script lang="ts">
	import { goto } from "$app/navigation"
	import { loginState, LoginState } from "$lib/data"
	import { login } from "$lib/data/session"
	import { Button, Title, Wait } from "$lib/components"
	import type { Credentials } from "$lib/sdk"
	import { loginSucceeded, LoginResult } from "$lib/sdk"

	let form: HTMLFormElement
	let usernameBox: HTMLInputElement
	let passwordBox: HTMLInputElement
	let username: string
	let password: string

	let lastError: LoginResult | string | null = null

	async function loginButtonOnClick()
	{
		if (!form.reportValidity()) return

		// Hack for iOS Firefox: if using a password manager, password will still be undefined at this point, so try pulling it out manually.
		// https://github.com/TravisSpomer/ivorytower.com/issues/85
		const credentials: Credentials = { username: username || usernameBox.value, password: password || passwordBox.value }

		let result: LoginResult
		try
		{
			result = await login(credentials, { rememberMe: true })
		}
		catch(ex)
		{
			lastError = ex instanceof Error ? ex.message : ex.toString()
			return
		}
		if (loginSucceeded(result))
		{
			lastError = null
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

	.logincenter
	{
		margin: 0 auto;
		max-width: 600px;
		min-height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	}

	form, .box
	{
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	form
	{
		label
		{
			@include caps;

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

<div class="logincenter">
{#if $loginState === LoginState.LoggingIn}
	<div class="box">
		<h1>
			Welcome to IvoryTower
		</h1>
		<Wait />
	</div>
{:else}
	<h1>
		Papers, please
	</h1>
	<form bind:this={form} on:submit|preventDefault={loginButtonOnClick}>
		<label for="username">Username</label>
		<!-- svelte-ignore a11y-autofocus -->
		<input id="username" type="text" required autofocus autocapitalize="off" bind:value={username} bind:this={usernameBox} />

		<label for="password">Password</label>
		<input id="password" type="password" required bind:value={password} bind:this={passwordBox} />

		<p>
			<Button accent on:click={loginButtonOnClick}>Sign in</Button>
		</p>
		<p><small>
			<a href="https://old.ivorytower.com/LoginChangePassword.aspx" class="external">Change password</a>
		</small></p>
		{#if lastError}
			<aside class="danger">
				{#if typeof lastError === "string"}
					{lastError}
				{:else if lastError === LoginResult.WrongPassword}
					That's not the right password. Please try again.
				{:else if lastError === LoginResult.MissingPassword}
					You need a password to log in.
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
	</form>
{/if}
</div>
