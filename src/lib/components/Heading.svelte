<script lang="ts">
	import type { Snippet }	from "svelte"
	import { createEventDispatcher } from "svelte"
	import MiniNavLink from "./MiniNavLink.svelte"

	export interface Props
	{
		/** Optionally, the title of the parent or previous page. */
		previousTitle?: string | undefined
		/** Optionally, a link to navigate to for a parent or previous page. */
		previousHref?: string | undefined
		/** Optionally, the title of the next page. */
		nextTitle?: string | undefined
		/** Optionally, a link to navigate to for a next page. */
		nextHref?: string | undefined
		/** The title to render in the heading. */
		children: Snippet
		/** Additional controls to be displayed to the right of the title. */
		controls?: Snippet
	}

	const {
		previousTitle,
		previousHref,
		nextTitle,
		nextHref,
		children,
		controls,
	}: Props = $props()

	const dispatch = createEventDispatcher()
</script>

<style>
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
		<h1>{@render children?.()}</h1>
		{#if controls}
			<div class="controls">{@render controls()}</div>
		{/if}
	</div>
</div>
