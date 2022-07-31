<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import { elementIsWithin } from "$lib/utils/dom"
	
	/*
		Usage:

		<FocusWithin let:within visibleOnly
			on:focuswithin={() => console.log("Focus entered")}
			on:focusoutside={() => console.log("Focus left")}
		>
			<div class:focus-within={within}>I have the class "focus-within" whenever anything in me is :focus-visible()</div>
		</FocusWithin>
	*/

	/** Only tracks focus-visible instead of all focus. */
	export let visibleOnly: boolean = false

	/** True whenever focus is within the component. */
	let within: boolean = false

	const dispatch = createEventDispatcher()
	let root: HTMLSpanElement

	function onFocusIn(ev: FocusEvent): void
	{
		if (within) return
		if (visibleOnly && !isFocusVisible(ev.target)) return

		within = true
		dispatch("focuswithin")
	}

	function onFocusOut(_ev: FocusEvent): void
	{
		if (!within) return

		setTimeout(() =>
		{
			const target = document.activeElement
			if (within && ((visibleOnly && !isFocusVisible(target)) || !elementIsWithin(target, root)))
			{
				within = false
				dispatch("focusoutside")
			}
		})
	}

	function isFocusVisible(target: EventTarget | null): boolean
	{
		if (target === null || !("matches" in target)) return false
		return (target as HTMLElement).matches(":focus-visible")
	}
</script>

<span bind:this={root} on:focusin={onFocusIn} on:focusout={onFocusOut} on:mouseenter on:mouseleave>
	<slot {within} />
</span>
