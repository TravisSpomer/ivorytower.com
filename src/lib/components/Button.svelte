<script lang="ts">
	import type { Snippet }	from "svelte"
	import ButtonBorder from "./ButtonBorder.svelte"

	export interface Props
	{
		/** Come on, you know what the id property is for. */
		id?: string | undefined
		/** Optionally, a link to navigate to when the button is clicked. Supplying this will make the button an A tag. If you also use on:click, call preventDefault on the event object to stop navigation to this URL. */
		href?: string | undefined
		/** Optionally, a tooltip. */
		title?: string | undefined
		/** Optionally, the horizontal alignment of the content. */
		align?: "left" | "center" | "right"
		/** If true, the button is disabled. */
		disabled?: boolean
		/** If true, the content can be selected. */
		selectable?: boolean
		/** If true, the button appears checked. */
		checked?: boolean
		/** If true, the button is itty bitty. */
		tiny?: boolean
		/** If true, the button uses a style meant for use on a toolbar. (Button styles are mutually exclusive.) */
		toolbar?: boolean
		/** If true, the button uses an accent style. (Button styles are mutually exclusive.) */
		accent?: boolean
		/** If true, the button uses a style that appears as normal text when not in use. (Button styles are mutually exclusive.) */
		ghost?: boolean
		/** If true, the button uses a style that indicates that the command is dangerous. (Button styles are mutually exclusive.) */
		danger?: boolean
		/** The content to render in the button. */
		children: Snippet
	}

	const {
		id = undefined,
		href = undefined,
		title = undefined,
		align = "center",
		disabled = false,
		selectable = false,
		checked = false,
		tiny = false,
		toolbar = false,
		accent = false,
		ghost = false,
		danger = false,
		children,
	}: Props = $props()
</script>

<ButtonBorder tag={href && !disabled ? "a" : "button"} {id} {href} {title} {disabled}
	{danger} {accent} {toolbar} {ghost}
	regular={!tiny} tiny={tiny}
	{selectable}
	{checked}
	{align}
	on:click
>
	{@render children()}
</ButtonBorder>
