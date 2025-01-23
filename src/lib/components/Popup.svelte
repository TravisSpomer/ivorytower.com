<script lang="ts">
	// import { fade } from "svelte/transition"
	import { browser } from "$app/environment"
	import FocusWithin from "./FocusWithin.svelte"
	import LightDismiss from "./LightDismiss.svelte"

	/** Set to true or false to programmatically open or close the popup respectively. */
	export let isOpen: boolean = false
	/** If true, the popup will automatically open on hover or focus. */
	export let onHover: boolean = false
	/** If true, the popup can be closed by clicking anywhere outside of its bounds. */
	export let lightDismiss: boolean = false
	/** Optionally, explicitly specify the anchor as an unrelated element rather than the child with slot="anchor". */
	export let anchor: HTMLElement | undefined = undefined

	let internalAnchor: HTMLElement
	let lastExplicitAnchor: HTMLElement | undefined
	let popup: HTMLElement
	let x: number = 0
	let y: number = 0
	let isHovering: boolean = false
	let isHoveringPopup: boolean = false
	let isFocused: boolean = false

	$: if (isOpen && browser)
	{
		setTimeout(reposition)
	}

	$: if (lastExplicitAnchor && (!anchor || anchor !== lastExplicitAnchor || !onHover))
	{
		lastExplicitAnchor.removeEventListener("mouseenter", onAnchorEnter)
		lastExplicitAnchor.removeEventListener("mouseleave", onAnchorLeave)
		lastExplicitAnchor.removeEventListener("focus", onAnchorFocus)
		lastExplicitAnchor.removeEventListener("blur", onAnchorBlur)
		lastExplicitAnchor = undefined
	}
	$: if (anchor && onHover)
	{
		anchor.addEventListener("mouseenter", onAnchorEnter)
		anchor.addEventListener("mouseleave", onAnchorLeave)
		anchor.addEventListener("focus", onAnchorFocus)
		anchor.addEventListener("blur", onAnchorBlur)
		lastExplicitAnchor = anchor
	}

	function currentAnchor(): HTMLElement
	{
		// If they manually specified an anchor, just use that.
		if (anchor) return anchor

		// If they are using the anchor slot, we want to actually get the rendered *child*, because
		// it might be absolutely positioned.
		if (internalAnchor)
			return internalAnchor.children.length ? internalAnchor.children[0] as HTMLElement : internalAnchor

		return null as unknown as HTMLElement
	}

	function reposition(): void
	{
		if (!browser || !popup) return

		const anchorElement = currentAnchor()
		if (anchorElement)
		{
			const anchorPos = currentAnchor().getBoundingClientRect()
			const popupPos = popup.getBoundingClientRect()

			x = anchorPos.x
			y = anchorPos.y + anchorPos.height

			// If this positioning would cause the popup to go off the bottom of the screen, but it would have fit above, put it there.
			if (y + popupPos.height > document.documentElement.clientHeight && anchorPos.y >= popupPos.height)
				y = anchorPos.y - popupPos.height
			// Same with the right side of the screen.
			if (x + popupPos.width > document.documentElement.clientWidth && anchorPos.x + anchorPos.width >= popupPos.width)
				x = anchorPos.x + anchorPos.width - popupPos.width
		}
		else
		{
			// If there's no anchor at all, just stick it in the center of the window.
			const popupPos = popup.getBoundingClientRect()
			x = (document.documentElement.clientWidth - popupPos.width) / 2
			y = (document.documentElement.clientHeight - popupPos.height) / 2
		}
	}

	function onAnchorEnter(): void
	{
		if (onHover)
		{
			isHovering = true
			checkForAutoOpen()
		}
	}

	function onAnchorLeave(): void
	{
		if (onHover)
		{
			isHovering = false
			checkForAutoOpen()
		}
	}

	function onPopupEnter(): void
	{
		if (onHover)
		{
			isHoveringPopup = true
			checkForAutoOpen()
		}
	}

	function onPopupLeave(): void
	{
		if (onHover)
		{
			isHoveringPopup = false
			checkForAutoOpen()
		}
	}

	function onAnchorFocus(): void
	{
		if (onHover)
		{
			isFocused = true
			checkForAutoOpen()
		}
	}

	function onAnchorBlur(): void
	{
		if (onHover)
		{
			isFocused = false
			checkForAutoOpen()
		}
	}

	function onKeyDown(ev: KeyboardEvent): void
	{
		if (lightDismiss && ev.code === "Escape")
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

</script>

<svelte:window on:keydown={lightDismiss ? onKeyDown : undefined} />

<!-- With whitespace between the tags, Svelte will add unnecessary whitespace... appears to have been introduced between svelte@3.42.6 and svelte@3.46.4 -->
<FocusWithin visibleOnly
		on:mouseenter={onAnchorEnter} on:mouseleave={onAnchorLeave}
		on:focuswithin={onAnchorFocus} on:focusoutside={onAnchorBlur}
	>{#if !anchor && $$slots.anchor}<span bind:this={internalAnchor}><slot name="anchor" /></span>{/if}{#if isOpen}<div
		bind:this={popup}
		on:mouseenter={onPopupEnter} on:mouseleave={onPopupLeave}
		style={`position: fixed; z-index: 999999; user-select: none; left: ${x}px; top: ${y}px;`}
	><slot /></div>{#if lightDismiss}<LightDismiss on:close={onLightDismiss} />{/if}{/if}</FocusWithin>
<!-- Removed animation (in:fade={{ duration: 50 }} out:fade={{ duration: 133 }}) to work around bug where the popups were getting left behind -->
