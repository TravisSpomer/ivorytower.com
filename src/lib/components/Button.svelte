<script lang="ts">
	/** Optionally, a link to navigate to when the button is clicked. */
	export let href: string | undefined = undefined
	/** Optionally, a tooltip. */
	export let title: string | undefined = undefined

	/** If true, the button uses an accent style. (accent, subtle, and danger are mutually exclusive.) */
	export let accent: boolean = false
	/** If true, the button uses a subtle style. (accent, subtle, and danger are mutually exclusive.) */
	export let subtle: boolean = false
	/** If true, the button uses a style that indicates that the command is dangerous. (accent, subtle, and danger are mutually exclusive.) */
	export let danger: boolean = false
	/** If true, the button is disabled. */
	export let disabled: boolean = false
</script>

<style lang="scss">
	@import "../../core";

	.root
	{
		all: initial;
		box-sizing: border-box;

		display: inline-grid;
		justify-content: center;
		position: relative;
		min-width: 6em;
		margin-bottom: 2px;

		font: inherit;

		user-select: none;
		cursor: default;
		-webkit-tap-highlight-color: transparent;

		& > *
		{
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
		}

		.content
		{
			position: relative;
			padding: 6px 20px 6px 20px;
			top: unset;
			left: unset;
			right: unset;
			bottom: unset;

			color: black;

			font-family: $font-ui;
			font-size: $font-size-ui;
			font-weight: $font-weight-ui;
			text-decoration: none;
		}

		.face
		{
			border: 1px solid transparent;
			border-radius: .25em;
			background-clip: border-box;

			transition:
				background-color 750ms cubic-bezier(.1, .7, .3, 1),
				border-color 750ms cubic-bezier(.1, .7, .3, 1),
				transform 750ms cubic-bezier(.1, .7, .3, 1);

			&::after
			{
				content: "";
				display: block;
				position: absolute;
				top: 0.05em;
				left: 0.1em;
				right: 0.1em;
				height: 0.05em;
				border-radius: .5em .5em 0 0;

				background-color: white;
				opacity: 1;
			}
		}

		.bottom
		{
			border-radius: 6px;

			transition: transform 750ms cubic-bezier(.1, .7, .3, 1);
		}

		.shadow
		{
			opacity: 0.05;

			border-radius: 6px;
			background-color: black;

			transition: transform 750ms cubic-bezier(.1, .7, .3, 1);
			pointer-events: none;
		}

		@include rest
		{
			.content
			{
				transform: translateY(0);
			}
			.face
			{
				transform: translateY(0);
				background-color: var(--grey-light4);
				border-color: var(--grey-light1);
			}
			.bottom
			{
				transform: translateY(2px);
				background-color: var(--grey-light1);
			}
			.shadow
			{
				transform: translateY(5px);
			}
		}

		@include hover
		{
			.content
			{
				transform: translateY(-1px);
				transition: transform 67ms cubic-bezier(.3, .7, .4, 1.5);
			}
			.face
			{
				transform: translateY(-1px);
				transition: transform 67ms cubic-bezier(.3, .7, .4, 1.5);
				background-color: white;
				border-color: var(--grey);
			}
			.bottom
			{
				transform: translateY(2px);
				background-color: var(--grey);
			}
			.shadow
			{
				transform: translateY(8px);
				transition: transform 200ms cubic-bezier(.3, .7, .4, 1.5);
			}
		}

		@include pressed
		{
			.content
			{
				transform: translateY(1px);
			}
			.face
			{
				transform: translateY(1px);
				background-color: white;
			}
			.bottom
			{
				transform: translateY(2px);
				background-color: var(--grey);
			}
			.shadow
			{
				transform: translateY(3px);
			}
		}

		@include disabled
		{
			cursor: not-allowed;

			.content
			{
				transform: translateY(0);
				color: var(--grey-light1);
			}
			.face
			{
				transform: translateY(0);
				background-color: var(--grey-light4);
				border-color: var(--grey-light3);
				&::after
				{
					opacity: 0;
				}
			}
			.bottom
			{
				opacity: 0;
				transform: translateY(2px);
				background-color: var(--grey-light2);
			}
			.shadow
			{
				opacity: 0;
			}
		}

		&.accent
		{
			.content
			{
				color: white;
			}
			.face::after
			{
				opacity: 0.33;
			}
			@include rest
			{
				.face
				{
					background-color: var(--primary-dark1);
					border-color: var(--primary-dark2);
				}
				.bottom
				{
					background-color: var(--primary-dark3);
				}
			}
			@include hover
			{
				.face
				{
					background-color: var(--primary);
					border-color: var(--primary-dark3);
				}
				.bottom
				{
					background-color: var(--primary-dark4);
				}
			}
			@include pressed
			{
				.face
				{
					background-color: var(--primary);
					border-color: var(--primary-dark3);
				}
				.bottom
				{
					background-color: var(--primary-dark4);
				}
			}
		}

		&.subtle
		{
			@include rest
			{
				.face
				{
					background-color: white;
					border-color: var(--grey-light2);
				}
				.bottom
				{
					background-color: var(--grey-light2);
					opacity: 0;
					transform: translateY(0);
				}
				.shadow
				{
					opacity: 0;
					transform: translateY(0);
				}
			}
			@include hover
			{
				.face
				{
					background-color: white;
					border-color: var(--grey);
				}
				.bottom
				{
					background-color: var(--grey);
					opacity: 1;
					transform: translateY(1px);
				}
				.shadow
				{
					opacity: 0.05;
					transform: translateY(4px);
				}
			}
			@include pressed
			{
				.face
				{
					background-color: white;
					border-color: var(--grey);
				}
				.bottom
				{
					background-color: var(--grey);
					opacity: 1;
					transform: translateY(1px);
				}
				.shadow
				{
					opacity: 0.05;
					transform: translateY(2px);
				}
			}
		}

		&.danger
		{
			.face
			{
				/* Don't transition the background color for this style since it's such a dramatic change */
				transition: transform 67ms cubic-bezier(.1, .7, .3, 1);
				&::after
				{
					opacity: 0.33;
				}
			}
			@include rest
			{
				.content
				{
					color: var(--red-dark2);
				}
				.face
				{
					background-color: white;
					border-color: var(--red-dark2);
				}
				.bottom
				{
					background-color: var(--red-dark3);
					opacity: 0;
					transform: translateY(0);
				}
				.shadow
				{
					opacity: 0;
					transform: translateY(0);
				}
			}
			@include hover
			{
				.content
				{
					color: white;
				}
				.face
				{
					background-color: var(--red-dark2);
					border-color: var(--red-dark4);
				}
				.bottom
				{
					background-color: var(--red-dark4);
					opacity: 1;
					transform: translateY(1px);
				}
				.shadow
				{
					opacity: 0.05;
					transform: translateY(4px);
				}
			}
			@include pressed
			{
				.content
				{
					color: white;
				}
				.face
				{
					background-color: var(--red-dark2);
					border-color: var(--red-dark4);
				}
				.bottom
				{
					background-color: var(--red-dark4);
					opacity: 1;
					transform: translateY(1px);
				}
				.shadow
				{
					opacity: 0.05;
					transform: translateY(2px);
				}
			}
		}
		
	}
</style>

{#if href && !disabled}
	<a class="root" {href} {title} {disabled} class:accent={accent && !disabled && !danger} class:subtle={subtle && !disabled && !accent && !danger} class:danger={danger && !disabled} on:click on:dragstart|preventDefault>
		<span class="shadow"></span>
		<span class="bottom"></span>
		<span class="face"></span>
		<span class="content">
			<slot />
		</span>
	</a>
{:else}
	<button class="root" {title} {disabled} class:accent={accent && !disabled && !danger} class:subtle={subtle && !disabled && !accent && !danger} class:danger={danger && !disabled} on:click>
		<span class="shadow"></span>
		<span class="bottom"></span>
		<span class="face"></span>
		<span class="content">
			<slot />
		</span>
	</button>
{/if}
