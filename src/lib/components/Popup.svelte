<script lang="ts">
	import type { Snippet } from "svelte"
	// import { fade } from "svelte/transition"
	import { browser } from "$app/environment"
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
		/** Optionally, explicitly specify the anchor as an unrelated element rather than the anchor snippet. */
		anchorElement?: HTMLElement | undefined
		/** The anchor for the popup. (Or, use anchorElement if you need to use an unrelated element.) */
		anchor?: Snippet | undefined
		/** The content to render in the popup. */
		children: Snippet
	}

	let {
		isOpen = $bindable(),
		onHover = false,
		lightDismiss = false,
		anchorElement = undefined,
		anchor,
		children,
	}: Props = $props()

	let internalAnchor: HTMLElement | undefined = $state()
	let lastExplicitAnchor: HTMLElement | undefined = $state()
	let popup: HTMLElement | undefined = $state()
	let x: number = $state(0)
	let y: number = $state(0)
	let isHovering: boolean = false
	let isHoveringPopup: boolean = false
	let isFocused: boolean = false

	function currentAnchor(): HTMLElement
	{
		// If they manually specified an anchor, just use that.
		if (anchorElement) return anchorElement

		// If they are using the anchor slot, we want to actually get the rendered *child*, because
		// it might be absolutely positioned.
		if (internalAnchor)
			return internalAnchor.children.length ? internalAnchor.children[0] as HTMLElement : internalAnchor

		return null as unknown as HTMLElement
	}

	function reposition(): void
	{
		if (!browser || !popup) return

		const currentAnchorElement = currentAnchor()
		if (currentAnchorElement)
		{
			const anchorPos = currentAnchorElement.getBoundingClientRect()
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

	$effect(() =>
	{
		if (isOpen && browser)
		{
			setTimeout(reposition)
		}
	})
	$effect(() =>
	{
		if (lastExplicitAnchor && (!anchorElement || anchorElement !== lastExplicitAnchor || !onHover))
		{
			lastExplicitAnchor.removeEventListener("mouseenter", onAnchorEnter)
			lastExplicitAnchor.removeEventListener("mouseleave", onAnchorLeave)
			lastExplicitAnchor.removeEventListener("focus", onAnchorFocus)
			lastExplicitAnchor.removeEventListener("blur", onAnchorBlur)
			lastExplicitAnchor = undefined
		}
	})
	$effect(() =>
	{
		if (anchorElement && onHover)
		{
			anchorElement.addEventListener("mouseenter", onAnchorEnter)
			anchorElement.addEventListener("mouseleave", onAnchorLeave)
			anchorElement.addEventListener("focus", onAnchorFocus)
			anchorElement.addEventListener("blur", onAnchorBlur)
			lastExplicitAnchor = anchorElement
		}
	})
</script>

<svelte:window onkeydown={lightDismiss ? onKeyDown : undefined} />

<!-- With whitespace between the tags, Svelte will add unnecessary whitespace... appears to have been introduced between svelte@3.42.6 and svelte@3.46.4 -->
<FocusWithin visibleOnly
		onmouseenter={onAnchorEnter} onmouseleave={onAnchorLeave}
		onfocuswithin={onAnchorFocus} onfocusoutside={onAnchorBlur}
	>{#if !anchorElement && anchor}<span bind:this={internalAnchor}>{@render anchor()}</span>{/if}{#if isOpen}<!-- svelte-ignore a11y_no_static_element_interactions --><div
		bind:this={popup}
		onmouseenter={onPopupEnter} onmouseleave={onPopupLeave}
		style={`position: fixed; z-index: 999999; user-select: none; left: ${x}px; top: ${y}px;`}
	>{@render children()}</div>{#if lightDismiss}<LightDismiss on:close={onLightDismiss} />{/if}{/if}</FocusWithin>
<!-- Removed animation (in:fade={{ duration: 50 }} out:fade={{ duration: 133 }}) to work around bug where the popups were getting left behind -->
