<script lang="ts">
	import { browser } from "$app/environment"
	import { users } from "$lib/data"
	import { getAllUsers } from "$lib/sdk"
	import { Title, User, Wait } from "$lib/components"
</script>

<Title title="Users" />

<h1>User list from cache ({$users.length})</h1>
<p>
	These links use the <code>User</code> component with forums-style coloring enabled.
</p>

<ul>
	{#each $users.all as user}
		<li><User username={user.username} color /></li>
	{/each}
</ul>

<h1>User list from API</h1>
<p>
	These links use the <code>User</code> component without coloring.
</p>

{#if browser}{#await getAllUsers()}
	<p>
		<Wait />
	</p>
{:then value}
	<ul>
		{#each value.users as user}
			<li><User username={user.username} /></li>
		{/each}
	</ul>
{:catch}
	<aside class="danger">
		Failed to get the list of all users.
	</aside>
{/await}{/if}
