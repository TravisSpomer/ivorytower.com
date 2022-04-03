<script lang="ts">
	/** Optionally, the title of the parent page. */
	export let parentTitle: string | undefined = undefined
	/** Optionally, a link to navigate to for a parent page. */
	export let parentHref: string | undefined = undefined
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

	.parent
	{
		align-self: start;
		margin-left: -0.5em;
		padding: 0 0.5em 0.125em 0.5em;

		@include caps;
		font-size: 19px;
		font-weight: $font-weight-bold;

		color: var(--listitem-secondary-foreground);
		text-decoration: none;
		letter-spacing: -0.05em;
		line-height: $line-height;

		transition:
			color 67ms ease,
			background-color 67ms ease;

		&::before
		{
			display: inline-block;
			content: "‹";
			margin-right: 0.25em;

			color: var(--listitem-secondary-foreground);

			transition: translate 125ms ease;
		}

		@include rest
		{
			background-color: var(--listitem-background);
		}

		@include hover
		{
			color: var(--listitem-foreground);
			background-color: var(--listitem-background-hover);

			text-decoration: underline;
			&::before
			{
				color: var(--listitem-foreground);
				text-decoration: none;

				translate: -0.125em 0;
			}
		}

		@include pressed
		{
			background-color: var(--listitem-background-pressed);
		}
	}

</style>

<div class="stack">
	{#if parentHref || parentTitle}
		<a class="parent" href={parentHref}>
			{parentTitle}
		</a>
	{/if}
	<div class="horiz">
		<h1><slot /></h1>
		{#if "controls" in $$slots}
			<div class="controls"><slot name="controls" /></div>
		{/if}
	</div>
</div>
