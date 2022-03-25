<script lang="ts">
	/** Come on, you know what the id property is for. */
	export let id: string | undefined = undefined
	/** Optionally, a link to navigate to when the button is clicked. */
	export let href: string | undefined = undefined
	/** Optionally, a tooltip. */
	export let title: string | undefined = undefined
	/** Optionally, the horizontal alignment of the content. */
	export let align: "left" | "center" | "right" = "center"

	/** If true, the button is disabled. */
	export let disabled: boolean = false

	/** If true, the button is itty bitty. */
	export let tiny: boolean = false

	/** If true, the button uses a flat outline style that turns to a normal button when interacted with. (Button styles are mutually exclusive.) */
	export let outline: boolean = false
	/** If true, the button uses an accent style. (Button styles are mutually exclusive.) */
	export let accent: boolean = false
	/** If true, the button uses a style that appears as normal text when not in use. (Button styles are mutually exclusive.) */
	export let ghost: boolean = false
	/** If true, the button uses a style that indicates that the command is dangerous. (Button styles are mutually exclusive.) */
	export let danger: boolean = false

	let justifyContent: string
	$: switch(align)
	{
		case "left": justifyContent = "flex-start"; break
		case "right": justifyContent = "flex-end"; break
		default: justifyContent = ""
	}
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

		&.tiny
		{
			min-width: 48px;

			font-size: $font-size-tiny;
			line-height: $line-height-tiny;

			.content
			{
				padding: 6px 9px;
			}
		}

		.content
		{
			position: relative;
			padding: 6px 20px 6px 20px;
			top: unset;
			left: unset;
			right: unset;
			bottom: unset;

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

				:global(.theme-dark) &
				{
					display: none;
				}
			}
		}

		.bottom
		{
			border-radius: 6px;

			transition: transform 750ms cubic-bezier(.1, .7, .3, 1);
		}

		.shadow
		{
			opacity: var(--solid-shadow-opacity);

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
				color: var(--control-foreground);
			}
			.face
			{
				transform: translateY(0);
				background-color: var(--control-background);
				border-color: var(--control-border);
			}
			.bottom
			{
				transform: translateY(2px);
				background-color: var(--control-border);
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
				transition: transform 67ms cubic-bezier(.3, .7, .4, 1);
				color: var(--control-foreground-hover);
			}
			.face
			{
				transform: translateY(-1px);
				transition: transform 67ms cubic-bezier(.3, .7, .4, 1);
				background-color: var(--control-background-hover);
				border-color: var(--control-border-hover);
			}
			.bottom
			{
				transform: translateY(2px);
				background-color: var(--control-border-hover);
			}
			.shadow
			{
				transform: translateY(8px);
				transition: transform 200ms cubic-bezier(.3, .7, .4, 1);
			}
		}

		@include pressed
		{
			.content
			{
				transform: translateY(1px);
				color: var(--control-foreground-pressed);
			}
			.face
			{
				transform: translateY(1px);
				background-color: var(--control-background-pressed);
				border-color: var(--control-border-pressed);
			}
			.bottom
			{
				transform: translateY(2px);
				background-color: var(--control-border-pressed);
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
				color: var(--control-foreground-disabled);
			}
			.face
			{
				transform: translateY(0);
				background-color: var(--control-background-disabled);
				border-color: var(--control-border-disabled);
				&::after
				{
					opacity: 0;
				}
			}
			.bottom
			{
				opacity: 0;
				transform: translateY(2px);
				background-color: var(--control-border-disabled);
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
				font-weight: $font-weight-bold;
			}
			.face::after
			{
				opacity: 0.33;
			}
			@include rest
			{
				.content
				{
					color: var(--accent-control-foreground);
				}
				.face
				{
					background-color: var(--accent-control-background);
					border-color: var(--accent-control-border);
				}
				.bottom
				{
					background-color: var(--accent-control-border);
				}
			}
			@include hover
			{
				.content
				{
					color: var(--accent-control-foreground-hover);
				}
				.face
				{
					background-color: var(--accent-control-background-hover);
					border-color: var(--accent-control-border-hover);
				}
				.bottom
				{
					background-color: var(--accent-control-border-hover);
				}
			}
			@include pressed
			{
				.content
				{
					color: var(--accent-control-foreground-pressed);
				}
				.face
				{
					background-color: var(--accent-control-background-pressed);
					border-color: var(--accent-control-border-pressed);
				}
				.bottom
				{
					background-color: var(--accent-control-border-pressed);
				}
			}
		}

		&.outline
		{
			@include rest
			{
				.content
				{
					color: var(--link);
				}
				.face
				{
					background-color: var(--background);
					border-color: var(--border-subtle);
					&::after
					{
						opacity: 0;
					}
				}
				.bottom
				{
					background-color: var(--border-subtle);
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
					color: var(--control-foreground-hover);
				}
				.face
				{
					background-color: var(--control-background-hover);
					border-color: var(--control-border-hover);
				}
				.bottom
				{
					background-color: var(--control-border-hover);
					opacity: 1;
					transform: translateY(1px);
				}
				.shadow
				{
					opacity: var(--solid-shadow-opacity);
					transform: translateY(4px);
				}
			}
			@include pressed
			{
				.content
				{
					color: var(--control-foreground-hover);
				}
				.face
				{
					background-color: var(--control-background-pressed);
					border-color: var(--control-border-pressed);
				}
				.bottom
				{
					background-color: var(--control-border-pressed);
					opacity: 1;
					transform: translateY(1px);
				}
				.shadow
				{
					opacity: var(--solid-shadow-opacity);
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
					color: var(--danger-control-foreground);
				}
				.face
				{
					background-color: var(--danger-control-background);
					border-color: var(--danger-control-border);
				}
				.bottom
				{
					background-color: var(--danger-control-border);
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
					color: var(--danger-control-foreground-hover);
				}
				.face
				{
					background-color: var(--danger-control-background-hover);
					border-color: var(--danger-control-border-hover);
				}
				.bottom
				{
					background-color: var(--danger-control-border-hover);
					opacity: 1;
					transform: translateY(1px);
				}
				.shadow
				{
					opacity: var(--solid-shadow-opacity);
					transform: translateY(4px);
				}
			}
			@include pressed
			{
				.content
				{
					color: var(--danger-control-foreground-pressed);
				}
				.face
				{
					background-color: var(--danger-control-background-pressed);
					border-color: var(--danger-control-border-pressed);
				}
				.bottom
				{
					background-color: var(--danger-control-border-pressed);
					opacity: 1;
					transform: translateY(1px);
				}
				.shadow
				{
					opacity: var(--solid-shadow-opacity);
					transform: translateY(2px);
				}
			}
		}

		&.ghost
		{
			@include rest
			{
				.content
				{
					color: var(--ghost-control-foreground);
				}
				.face
				{
					background-color: var(--ghost-control-background);
					border-color: var(--ghost-control-border);
					&::after
					{
						opacity: 0;
					}
				}
				.bottom
				{
					background-color: var(--ghost-control-border);
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
					color: var(--ghost-control-foreground-hover);
				}
				.face
				{
					background-color: var(--ghost-control-background-hover);
					border-color: var(--ghost-control-border-hover);
				}
				.bottom
				{
					background-color: var(--ghost-control-border-hover);
					opacity: 1;
					transform: translateY(1px);
				}
				.shadow
				{
					opacity: var(--solid-shadow-opacity);
					transform: translateY(4px);
				}
			}
			@include pressed
			{
				.content
				{
					color: var(--ghost-control-foreground-hover);
				}
				.face
				{
					background-color: var(--ghost-control-background-pressed);
					border-color: var(--ghost-control-border-pressed);
				}
				.bottom
				{
					background-color: var(--ghost-control-border-pressed);
					opacity: 1;
					transform: translateY(1px);
				}
				.shadow
				{
					opacity: var(--solid-shadow-opacity);
					transform: translateY(2px);
				}
			}
		}

	}
</style>

{#if href && !disabled}
	<a {id} class="root" {href} {title} {disabled} class:accent={accent && !disabled && !danger} class:outline={outline && !disabled && !accent && !danger} class:danger={danger && !disabled} class:ghost={ghost && !disabled && !accent && !danger && !outline} class:tiny style:justify-content={justifyContent} on:click on:dragstart|preventDefault>
		<span class="shadow"></span>
		<span class="bottom"></span>
		<span class="face"></span>
		<span class="content">
			<slot />
		</span>
	</a>
{:else}
	<button {id} class="root" {title} {disabled} class:accent={accent && !disabled && !danger} class:outline={outline && !disabled && !accent && !danger} class:danger={danger && !disabled} class:ghost={ghost && !disabled && !accent && !danger && !outline} class:tiny style:justify-content={justifyContent} on:click>
		<span class="shadow"></span>
		<span class="bottom"></span>
		<span class="face"></span>
		<span class="content">
			<slot />
		</span>
	</button>
{/if}
