<script lang="ts">
	// TIP: See Button.svelte for documentation on these properties.

	/** Determines what tag to render. Defaults to "button". */
	export let tag: string = "button"
	export let id: string | undefined = undefined
	export let href: string | undefined = undefined
	export let title: string | undefined = undefined
	export let align: "left" | "center" | "right" = "center"

	export let disabled: boolean = false
	/** If true, the control will show focus visuals at rest. */
	export let focus: boolean = false
	export let selectable: boolean = false
	export let checked: boolean = false
	/** If false, the button border won't use click visuals. Defaults to true. */
	export let clickable: boolean = true

	export let regular: boolean = false
	export let tiny: boolean = false

	export let toolbar: boolean = false
	export let accent: boolean = false
	export let ghost: boolean = false
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

			font-size: var(--font-size-tiny);
			line-height: var(--line-height-tiny);

			.content
			{
				padding: 5px 8px;
			}
		}

		&.regular
		{
			min-width: 6em;

			.content
			{
				padding: 5px 19px 5px 19px;
			}
		}

		.content
		{
			position: relative;
			top: unset;
			left: unset;
			right: unset;
			bottom: unset;
			margin: 1px;

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

		@include hover-or-focus-class
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

		&.clickable
		{
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
		}

		@include disabled-or-disabled-class
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

			&.disabledghost
			{
				.face
				{
					background-color: transparent;
					border-color: transparent;
				}
				.bottom
				{
					background-color: transparent;
				}
			}
		}

		&.accent
		{
			.content
			{
				font-weight: var(--font-weight-bold);
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
			@include hover-or-focus-class
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
			&.clickable
			{
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
		}

		&.toolbar
		{
			min-width: 32px;

			@include rest
			{
				.content
				{
					color: var(--toolbar-foreground);
				}
				.face
				{
					background-color: transparent;
					border-color: transparent;
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
			@include hover-or-focus-class
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
			&.clickable
			{
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
			@include hover-or-focus-class
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
			&.clickable
			{
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
					background-color: transparent;
					border-color: transparent;
					&::after
					{
						opacity: 0;
					}
				}
				.bottom
				{
					background-color: var(--control-border);
					opacity: 0;
					transform: translateY(0);
				}
				.shadow
				{
					opacity: 0;
					transform: translateY(0);
				}
			}
			@include hover-or-focus-class
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
			&.clickable
			{
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

		}

		&.checked
		{
			.face
			{
				background-color: var(--link-underline);
			}

			@include hover-or-focus-class
			{
				.face
				{
					background-color: var(--link-underline);
				}
			}
		}

	}
</style>

<svelte:element this={tag} {id}
	class:root={true} {href} {title}
	role="button"
	disabled={disabled ? true : undefined} class:disabled
	class:danger={danger && !disabled}
	class:accent={accent && !disabled && !danger}
	class:toolbar={toolbar && !disabled && !accent && !danger}
	class:ghost={ghost && !disabled && !accent && !danger && !toolbar}
	class:disabledghost={disabled && (ghost || toolbar)}
	class:regular={regular}
	class:tiny={tiny && !regular}
	class:clickable={clickable && !disabled}
	class:focus
	class:checked
	style:user-select={selectable ? "unset" : ""}
	style:justify-content={justifyContent}
	on:click
	on:dragstart|preventDefault
	tabindex="0"
>
	<span class="shadow"></span>
	<span class="bottom"></span>
	<span class="face"></span>
	<span class="content">
		<slot />
	</span>
</svelte:element>
