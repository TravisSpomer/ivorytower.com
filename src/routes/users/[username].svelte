<script context="module" lang="ts">
	import type { Load } from "./__types/[username]"
	type LoadEvent = Parameters<Load>[0]
	type LoadOutput = Promise<ReturnType<Load>>

	import type { BasicUser } from "$lib/sdk"
	import { users } from "$lib/data"

	export async function load({ params }: LoadEvent): LoadOutput
	{
		return { props: { username: params.username } }
	}
</script>

<script lang="ts">
	import { Title } from "$lib/components"

	export let username: string

	let user: BasicUser
	$: user = $users.getOrPlaceholder(username)
</script>

<Title title={user.fullName} />

<h1>{user.fullName}</h1>

<p>
	<a href="https://old.ivorytower.com/ProfileShow.aspx?name={username}" class="external">See {user.shortName}'s profile on the old site</a>
</p>
