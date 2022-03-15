<script context="module" lang="ts">
	import type { Load } from "./[username]"
	type LoadInput = Parameters<Load>[0]
	type LoadOutput = Promise<ReturnType<Load>>

	import type { BasicUser } from "$lib/sdk"
	import { users } from "$lib/data"

	export async function load({ params }: LoadInput): LoadOutput
	{
		return { props: { username: params.username } }
	}
</script>

<script lang="ts">
	import { browser } from "$app/env"
	import { goto } from "$app/navigation"

	export let username: string

	$: if (browser)
	{
		// Temporary: since this page doesn't do anything useful, just redirect to the useful version until it does.
		goto(`https://old.ivorytower.com/ProfileShow.aspx?name=${username}`, { replaceState: true })
	}

	let user: BasicUser
	$: user = $users.getOrPlaceholder(username)
</script>

<svelte:head>
	<title>{user.fullName} - IvoryTower</title>
</svelte:head>

<h1>{user.fullName}</h1>

<p>
	<a href="https://old.ivorytower.com/ProfileShow.aspx?name={username}" class="external">See {user.shortName}'s profile on the old site</a>
</p>
