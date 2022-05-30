<script lang="ts">
	import ButtonBorder from "./ButtonBorder.svelte"
	
	/** Come on, you know what the id property is for. */
	export let id: string | undefined = undefined
	/** Optionally, a link to navigate to when the button is clicked. Supplying this will make the button an A tag. If you also use on:click, call preventDefault on the event object to stop navigation to this URL. */
	export let href: string | undefined = undefined
	/** Optionally, a tooltip. */
	export let title: string | undefined = undefined
	/** Optionally, the horizontal alignment of the content. */
	export let align: "left" | "center" | "right" = "center"

	/** If true, the button is disabled. */
	export let disabled: boolean = false
	/** If true, the content can be selected. */
	export let selectable: boolean = false

	/** If true, the button is itty bitty. */
	export let tiny: boolean = false

	/** If true, the button uses a style meant for use on a toolbar. (Button styles are mutually exclusive.) */
	export let toolbar: boolean = false
	/** If true, the button uses an accent style. (Button styles are mutually exclusive.) */
	export let accent: boolean = false
	/** If true, the button uses a style that appears as normal text when not in use. (Button styles are mutually exclusive.) */
	export let ghost: boolean = false
	/** If true, the button uses a style that indicates that the command is dangerous. (Button styles are mutually exclusive.) */
	export let danger: boolean = false
</script>

<ButtonBorder tag={href && !disabled ? "a" : "button"} {id} {href} {title} {disabled}
	{danger} {accent} {toolbar} {ghost}
	regular={!tiny} tiny={tiny}
	{selectable}
	{align}
	on:click
>
	<slot />
</ButtonBorder>
