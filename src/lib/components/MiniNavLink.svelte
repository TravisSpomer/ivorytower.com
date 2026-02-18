<script lang="ts">
	/** If true, the nav link will appear as leading to the next page. */
	export let next: boolean = true
	/** If true, the nav link will appear as leading to the previous page. */
	export let previous: boolean = false
	/** Optionally, a link to navigate to. */
	export let href: string | undefined = undefined
	/** If true, the nav link will appear special. */
	export let special: boolean = false
</script>

<style lang="scss">
	@import "../../core";

	.previous, .next
	{
		all: unset;
		box-sizing: border-box;
		user-select: none;

		align-self: start;
		margin-left: -0.5em;
		padding: 0 0.5em 0.125em 0.5em;

		font-family: var(--font-caps);
		font-feature-settings: "c2sc" 1;
		text-transform: uppercase;
		font-size: 19px;
		font-weight: var(--font-weight-bold);
		letter-spacing: -0.05em;

		line-height: var(--line-height);

		cursor: pointer;
		transition:
			color 67ms ease,
			background-color 67ms ease;

		@include rest
		{
			color: var(--listitem-secondary-foreground);
			background-color: var(--listitem-background);
			text-decoration: none;

			&.special
			{
				color: var(--background);
				background-color: var(--link-special);
			}
		}

		@include hover
		{
			color: var(--listitem-foreground);
			background-color: var(--listitem-background-hover);
			text-decoration: underline;

			&.special
			{
				color: var(--background);
				background-color: var(--link-special);
			}
		}

		@include pressed
		{
			color: var(--listitem-foreground);
			background-color: var(--listitem-background-pressed);
			text-decoration: underline;

			&.special
			{
				color: var(--background);
				background-color: var(--foreground);
			}
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

			&.special::before
			{
				color: var(--background);
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

			&.special::before
			{
				color: var(--background);
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

			&.special::after
			{
				color: var(--background);
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

			&.special::after
			{
				color: var(--background);
			}
		}
	}

</style>

<svelte:element this={href ? "a" : "button"}
	class:previous={previous}
	class:next={next && !previous}
	class:special
	{href} on:click
>
	<slot />
</svelte:element>
