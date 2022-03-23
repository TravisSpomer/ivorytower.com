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
				background-color 600ms cubic-bezier(.1, .7, .3, 1),
				transform 600ms cubic-bezier(.1, .7, .3, 1);
		}

		.bottom
		{
			border-radius: 6px;

			transition: transform 600ms cubic-bezier(.1, .7, .3, 1);
		}

		.shadow
		{
			opacity: 0.05;

			border-radius: 6px;
			background-color: black;

			transition: transform 600ms cubic-bezier(.1, .7, .3, 1);
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
				background-color: var(--grey-light3);
				background-image: linear-gradient(to bottom, white, var(--grey-light4) 50%, var(--grey-light3));
				border-color: var(--grey-light1);
			}
			.bottom
			{
				transform: translateY(2px);
				background-color: var(--grey);
			}
			.shadow
			{
				transform: translateY(4px);
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
				background-color: var(--grey-light4);
				background-image: linear-gradient(to bottom, white, white 50%, var(--grey-light4));
				border-color: var(--grey-light2);
			}
			.bottom
			{
				transform: translateY(2px);
				background-color: var(--grey);
			}
			.shadow
			{
				transform: translateY(6px);
				transition: transform 200ms cubic-bezier(.3, .7, .4, 1.5);
			}
		}

		@include pressed
		{
			.face
			{
				transform: translateY(1px);
				background-color: var(--grey-light4);
			}
			.content
			{
				transform: translateY(1px);
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
				background-image: none;
			}
			.bottom
			{
				transform: translateY(2px);
				background-color: var(--grey-light2);
			}
			.shadow
			{
				display: none;
			}
		}

		&.accent
		{
			.content
			{
				color: white;
			}
			@include rest
			{
				.face
				{
					background-color: var(--primary-dark1);
					background-image: linear-gradient(to bottom, var(--primary), var(--primary-dark1) 50%, var(--primary-dark2));
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
					background-image: linear-gradient(to bottom, var(--primary-light1), var(--primary) 50%, var(--primary-dark1));
					border-color: var(--primary-dark2);
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
					background-color: var(--primary-dark3);
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
					border-color: var(--grey-light2);
					background-color: white;
					background-image: none;
				}
				.bottom
				{
					background-color: var(--grey-dark3);
					opacity: 0.2;
				}
				.shadow
				{
					opacity: 0;
				}
			}
			@include hover
			{
				.face
				{
					border-color: transparent;
					background-color: var(--grey-light4);
					background-image: linear-gradient(to bottom, white, white 50%, var(--grey-light4));
					border-color: var(--grey-light2);
				}
				.bottom
				{
					background-color: var(--grey);
					opacity: 1;
				}
				.shadow
				{
					opacity: 0.05;
				}
			}
			@include pressed
			{
				.face
				{
					border-color: transparent;
					background-color: var(--grey-light3);
				}
				.bottom
				{
					background-color: var(--grey);
					opacity: 1;
				}
				.shadow
				{
					opacity: 0.05;
				}
			}
		}

		&.danger
		{
			.face
			{
				/* Don't transition the background color for this style since it's such a dramatic change */
				transition: transform 67ms cubic-bezier(.1, .7, .3, 1);
			}
			@include rest
			{
				.content
				{
					color: var(--red-dark2);
				}
				.face
				{
					border-color: var(--red-dark2);
					background-color: white;
					background-image: none;
				}
				.bottom
				{
					background-color: var(--red-dark3);
					opacity: 0.2;
				}
				.shadow
				{
					opacity: 0;
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
					border-color: transparent;
					background-color: var(--red-dark2);
					background-image: linear-gradient(to bottom, var(--red-dark1), var(--red-dark2) 50%, var(--red-dark3));
					border-color: var(--red-dark3);
				}
				.bottom
				{
					background-color: var(--red-dark4);
					opacity: 1;
				}
				.shadow
				{
					opacity: 0.05;
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
					background-color: var(--red-dark3);
					border-color: var(--red-dark3);
				}
				.bottom
				{
					background-color: var(--red-dark4);
					opacity: 1;
				}
				.shadow
				{
					opacity: 0.05;
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
