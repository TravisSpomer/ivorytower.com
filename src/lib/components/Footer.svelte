<script lang="ts">
	import { browser } from "$app/env"
	import { apiEndpoint, hello } from "$lib/sdk"
	import Wait from "./Wait.svelte"
	import Year from "./Year.svelte"

	const serverName = (new URL(apiEndpoint)).host
</script>

<footer>
	<p>
		{#if browser}{#await hello()}
			<Wait size={24} />
			<code>
				{serverName}
			</code>
		{:then value}
			IvoryTower 3 dev on 
			<code>
				{serverName}
				{value.version}
			</code>
		{:catch error}
			IvoryTower 3 dev on
			<code>
				{serverName}
			</code>
			failed:
			<code>
				{error && error.message}
			</code>
		{/await}{/if}
		&copy; <Year from={2021} /> Travis Spomer.
		<a href="/login/terms">Terms and conditions</a>
		<a href="https://github.com/TravisSpomer/ivorytower.com" target="_blank" rel="nooopener">GitHub</a>
	</p>
</footer>
