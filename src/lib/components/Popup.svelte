<script lang="ts">
	import type { Snippet } from "svelte"
	import FocusWithin from "./FocusWithin.svelte"
	import LightDismiss from "./LightDismiss.svelte"

	export interface Props
	{
		/** Set to true or false to programmatically open or close the popup respectively. */
		isOpen?: boolean
		/** If true, the popup will automatically open on hover or focus. */
		onHover?: boolean
		/** If true, the popup can be closed by clicking anywhere outside of its bounds. */
		lightDismiss?: boolean
		/** An optional CSS positioning-area for the popup. Defaults to "end span-end". */
		positionArea?: string | undefined
		/** The anchor for the popup. */
		anchor: Snippet
		/** The content to render in the popup. */
		children: Snippet
	}

	let {
		isOpen = $bindable(),
		onHover = false,
		lightDismiss = false,
		positionArea = "end span-end",
		anchor,
		children,
	}: Props = $props()

	let anchorParent: HTMLElement | undefined = $state()
	let popupElement: HTMLElement | undefined = $state()
	let isHovering: boolean = false
	let isHoveringPopup: boolean = false
	let isFocused: boolean = false

	function onAnchorEnter(): void
	{
		isHovering = true
		checkForAutoOpen()
	}

	function onAnchorLeave(): void
	{
		isHovering = false
		checkForAutoOpen()
	}

	function onPopupEnter(): void
	{
		isHoveringPopup = true
		checkForAutoOpen()
	}

	function onPopupLeave(): void
	{
		isHoveringPopup = false
		checkForAutoOpen()
	}

	function onAnchorFocus(): void
	{
		isFocused = true
		checkForAutoOpen()
	}

	function onAnchorBlur(): void
	{
		isFocused = false
		checkForAutoOpen()
	}

	function onPopupKeyDown(ev: KeyboardEvent): void
	{
		if (ev.code === "Escape")
		{
			onLightDismiss()
			ev.preventDefault()
			ev.stopPropagation()
		}
	}

	function onLightDismiss(): void
	{
		isOpen = false
	}

	function checkForAutoOpen(isRechecking: boolean = false): void
	{
		// When using onHover to automatically open the popup, the popup is opened immediately, but when it's
		// time to close, we wait a split second before actually closing in case something else triggers it to open
		// again a moment later, such as from moving the mouse from the anchor (mouseleave) to the popup (mouseenter).

		const shouldBeOpen = isHovering || isFocused || isHoveringPopup
		if (shouldBeOpen && !isOpen)
			isOpen = true
		else if (!shouldBeOpen && isOpen && !isRechecking)
			setTimeout(() => checkForAutoOpen(true))
		else if (!shouldBeOpen && isOpen)
			isOpen = false
	}

	$effect(() =>
	{
		if (!anchorParent || !popupElement) return

		const popupElementIsOpen = popupElement.matches(":popover-open")

		if (isOpen && !popupElementIsOpen)
			// Typings don't include showPopover's options parameter yet but I promise it's there
			(popupElement as any).showPopover({ source: getAnchorElement() })
		else if (!isOpen && popupElementIsOpen)
			popupElement.hidePopover()
	})

	function getAnchorElement()
	{
		// Calling showPopover() with a source/anchor/invoker that can't receive focus, like our <span> tag, prevents tab order from
		// working properly. So, extract the actual contents of the anchor snippet to use as the anchor.
		if (!anchorParent || anchorParent.children.length === 0) return anchorParent
		const renderTag = anchorParent.children[0]
		if (renderTag.children.length === 0) return anchorParent
		return renderTag.children[0] as HTMLElement
	}
</script>

<style>

	.scope
	{
		anchor-scope: --popup-scope;
	}

	.anchor
	{
		anchor-name: --popup-scope;
	}

	.popup
	{
		/* Reset the awful default [popover] styles */
		inset: unset;
		margin: unset;
		border: unset;
		padding: unset;
		overflow: unset;
		color: unset;
		background-color: unset;

		position-anchor: --popup-scope;
		position: fixed;
		position-try-fallbacks: flip-inline, flip-block, flip-inline flip-block;
	}

</style>

<!-- All whitespace needs to be trimmed for this component to render properly in an inline, such as PostLink. -->

<FocusWithin
	onmouseenter={onHover ? onAnchorEnter : undefined} onmouseleave={onHover ? onAnchorLeave : undefined}
	onfocuswithin={onHover ? onAnchorFocus : undefined} onfocusoutside={onHover ? onAnchorBlur : undefined}
><!--
	--><span class="scope"><!--
		--><span bind:this={anchorParent} class="anchor">{@render anchor()}</span><!--
		--><!-- svelte-ignore a11y_no_static_element_interactions --><!--
		--><div bind:this={popupElement} class="popup" popover="manual" tabindex="-1"
			onmouseenter={onHover ? onPopupEnter : undefined} onmouseleave={onHover ? onPopupLeave : undefined}
			onkeydown={onPopupKeyDown}
			style:position-area={positionArea}
		><!--
			-->{#if isOpen}{@render children()}{/if}<!--
		--></div><!--
		-->{#if isOpen && lightDismiss}<LightDismiss onclose={onLightDismiss} />{/if}<!--
	--></span><!--
--></FocusWithin>
