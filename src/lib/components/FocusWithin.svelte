<script lang="ts">
	import type { Snippet } from "svelte"
	import { elementIsWithin } from "$lib/utils/dom"

	/*
		Usage:

		<FocusWithin visibleOnly
			on:focuswithin={() => console.log("Focus entered")}
			on:focusoutside={() => console.log("Focus left")}
		>
			{#snippet children({ within })}
				<div class:focus-within={within}>I have the class "focus-within" whenever anything in me is :focus-visible()</div>
			{/snippet}
		</FocusWithin>
	*/

	export interface Props
	{
		/** Only tracks focus-visible instead of all focus. */
		visibleOnly?: boolean
		/** A new, nonstandard event that is raised when focus is anywhere within this component. */
		onfocuswithin?: ((ev: FocusEvent) => void)
		/** A new, nonstandard event that is raised when focus is no longer anywhere within this component. */
		onfocusoutside?: ((ev: FocusEvent) => void)
		/** The standard browser mouseenter event. */
		onmouseenter?: ((ev: MouseEvent) => void)
		/** The standard browser mouseleave event. */
		onmouseleave?: ((ev: MouseEvent) => void)
		/** The children to render. The within parameter is true when focus is within the component. */
		children: Snippet<[{ within: boolean }]>
	}

	const {
		visibleOnly = false,
		onfocuswithin,
		onfocusoutside,
		onmouseenter,
		onmouseleave,
		children,
	}: Props = $props()

	/** True whenever focus is within the component. */
	let within: boolean = $state(false)
	let root: HTMLSpanElement | undefined = $state()

	function onFocusIn(ev: FocusEvent): void
	{
		if (within) return
		if (visibleOnly && !isFocusVisible(ev.target)) return

		within = true
		if (onfocuswithin) onfocuswithin(ev)
	}

	function onFocusOut(ev: FocusEvent): void
	{
		if (!within) return

		setTimeout(() =>
		{
			if (!root) return
			const target = document.activeElement
			if (within && ((visibleOnly && !isFocusVisible(target)) || !elementIsWithin(target, root)))
			{
				within = false
				if (onfocusoutside) onfocusoutside(ev)
			}
		})
	}

	function isFocusVisible(target: EventTarget | null): boolean
	{
		if (target === null || !("matches" in target)) return false
		return (target as HTMLElement).matches(":focus-visible")
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span bind:this={root} onfocusin={onFocusIn} onfocusout={onFocusOut} onmouseenter={onmouseenter} onmouseleave={onmouseleave}>
	{@render children({ within })}
</span>
