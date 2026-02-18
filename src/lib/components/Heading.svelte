<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import MiniNavLink from "./MiniNavLink.svelte"

	/** Optionally, the title of the parent or previous page. */
	export let previousTitle: string | undefined = undefined
	/** Optionally, a link to navigate to for a parent or previous page. */
	export let previousHref: string | undefined = undefined
	/** Optionally, the title of the next page. */
	export let nextTitle: string | undefined = undefined
	/** Optionally, a link to navigate to for a next page. */
	export let nextHref: string | undefined = undefined

	const dispatch = createEventDispatcher()
</script>

<style lang="scss">
	@import "../../core";

	.stack
	{
		display: flex;
		flex-direction: column;
	}

	.horiz
	{
		display: flex;
		gap: 1em;
		margin-bottom: 1em;
		
		h1
		{
			flex: 1;
			margin-bottom: 0;
		}

		.controls
		{
			flex: none;
			gap: 0.5em;
			padding: 0.5em 0;
			display: flex;
			flex-direction: column;

			@media (width <= 600px)
			{
				flex-direction: row;
				justify-content: flex-end;
				padding: 0;
			}
		}

		@media (width <= 600px)
		{
			flex-direction: column;
			gap: 0;
		}
	}

	.nav
	{
		display: flex;
		flex-wrap: wrap;
		gap: 0em 1em;
	}

</style>

<div class="stack">
	{#if previousTitle || nextTitle}
		<div class="nav">
			{#if previousTitle}
				<MiniNavLink previous href={previousHref} on:click={() => dispatch("previous")}>
					{previousTitle}
				</MiniNavLink>
			{/if}
			{#if nextTitle}
				<MiniNavLink next href={nextHref} on:click={() => dispatch("next")}>
					{nextTitle}
				</MiniNavLink>
			{/if}
		</div>
	{/if}
	<div class="horiz">
		<h1><slot /></h1>
		{#if "controls" in $$slots}
			<div class="controls"><slot name="controls" /></div>
		{/if}
	</div>
</div>
