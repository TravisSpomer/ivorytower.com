<script lang="ts">
	import { browser } from "$app/env"
	import { apiEndpoint, hello } from "$lib/sdk"
	import Wait from "./Wait.svelte"
	import Year from "./Year.svelte"

	const serverName = apiEndpoint.startsWith("/") ? "dev" : (new URL(apiEndpoint)).host
</script>

<style lang="scss">
	@import "../../core";

	footer
	{
		padding: 120px 24px 16px 24px;

		color: var(--grey-dark3);
		font-size: $font-size-tiny;
		line-height: $line-height-tiny;

		:global(.theme-dark) &
		{
			color: var(--grey);
		}

		& > *
		{
			margin: 0 auto;
			max-width: $full-width;
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
		<a href="https://old.ivorytower.com/" class="external">Old site</a>.
		<a href="https://github.com/TravisSpomer/ivorytower.com" class="external" target="_blank" rel="nooopener">GitHub</a>.
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
