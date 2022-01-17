<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page"
	import type { BasicUser } from "$lib/sdk"
	import { users } from "$lib/data"

	export async function load({ params }: LoadInput): Promise<LoadOutput<{username: string}>>
	{
		return { props: { username: params.username } }
	}
</script>

<script lang="ts">
	export let username: string

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
