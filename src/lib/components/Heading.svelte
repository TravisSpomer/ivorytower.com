<script lang="ts">
	import { createEventDispatcher } from "svelte"

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

			@include phone-only
			{
				flex-direction: row;
				justify-content: flex-end;
				padding: 0;
			}
		}

		@include phone-only
		{
			flex-direction: column;
			gap: 0;
		}
	}

	.previous, .next
	{
		align-self: start;
		margin-left: -0.5em;
		padding: 0 0.5em 0.125em 0.5em;

		@include caps;
		font-size: 19px;
		font-weight: $font-weight-bold;

		letter-spacing: -0.05em;
		line-height: $line-height;

		cursor: pointer;
		transition:
			color 67ms ease,
			background-color 67ms ease;

		@include rest
		{
			color: var(--listitem-secondary-foreground);
			background-color: var(--listitem-background);
			text-decoration: none;
		}

		@include hover
		{
			color: var(--listitem-foreground);
			background-color: var(--listitem-background-hover);
			text-decoration: underline;
		}

		@include pressed
		{
			color: var(--listitem-foreground);
			background-color: var(--listitem-background-pressed);
			text-decoration: underline;
		}
	}

	.previous
	{
		&::before
		{
			display: inline-block;
			content: "‹";
			margin-right: 0.25em;

			transition: transform 125ms ease;
		}

		@include rest
		{
			&::before
			{
				color: var(--listitem-secondary-foreground);

				transform: translate(0, 0);
			}
		}

		@include hover
		{
			&::before
			{
				color: var(--listitem-foreground);
				text-decoration: none;

				transform: translate(-0.125em, 0);
			}
		}
	}

	.next
	{
		&::after
		{
			display: inline-block;
			content: "›";
			margin-left: 0.25em;

			transition: transform 125ms ease;
		}

		@include rest
		{
			&::after
			{
				color: var(--listitem-secondary-foreground);

				transform: translate(0, 0);
			}
		}

		@include hover
		{
			&::after
			{
				color: var(--listitem-foreground);
				text-decoration: none;

				transform: translate(0.125em, 0);
			}
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
				<a class="previous" href={previousHref} on:click={() => dispatch("previous")}>
					{previousTitle}
				</a>
			{/if}
			{#if nextTitle}
				<a class="next" href={nextHref} on:click={() => dispatch("next")}>
					{nextTitle}
				</a>
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
