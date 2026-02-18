<script lang="ts">
	import { browser } from "$app/environment"
	import { apiEndpoint, hello } from "$lib/sdk"
	import { Wait, Year } from "$lib/components"

	const serverName = apiEndpoint.startsWith("/") ? "dev" : (new URL(apiEndpoint)).host
</script>

<style lang="scss">
	@import "../core";

	footer
	{
		position: relative;
		padding: 120px 24px 16px 24px;

		color: var(--grey-dark3);
		font-size: var(--font-size-tiny);
		line-height: var(--line-height-tiny);

		:global(.theme-dark) &
		{
			color: var(--grey);
		}

		& > *
		{
			margin: 0 auto;
			max-width: 900px;
		}

		code
		{
			font-size: unset;
		}
	}
</style>

<footer>
	<p>
		&copy; <Year from={2021} /> Travis Spomer.
		<a href="/login/terms">Terms</a>.
		<a href="https://github.com/TravisSpomer/ivorytower.com" class="external" target="_blank" rel="nooopener noreferrer">GitHub</a>.
		{#if browser}{#await hello()}
			<Wait size={24} delay={2000} />
			<code>{serverName}</code>
		{:catch error}
			<br />
			❌ <code>{serverName}</code>
			failed to connect:
			<code>
				{error && error.message}
			</code>
		{/await}{/if}
	</p>
</footer>
