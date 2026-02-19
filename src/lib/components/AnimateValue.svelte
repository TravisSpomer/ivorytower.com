<script lang="ts">
	import { backOut } from "svelte/easing"
	import { fly } from "svelte/transition"
	import { animations } from "$lib/utils/settings"
	import { sizeToCss } from "$lib/utils/size"
	import { untrack } from "svelte"

	export interface Props
	{
		/** The current value to display. */
		value: string | number
		/** The number of milliseconds to animate between each item and the next one. */
		animateDuration?: number
		/** The height of each item, in pixels. Typically this should be equal fo the line height. */
		itemHeight: number
		/** The alignment of each item, as a valid align-items value. */
		alignItems?: "center" | "flex-start" | "flex-end"
		/** The minimum width of the container. */
		minWidth?: number | string | undefined
	}

	const {
		value,
		animateDuration = 300,
		itemHeight,
		alignItems = "center",
		minWidth,
	}: Props = $props()

	let oldValue: string | number = ""
	const valueArray: (string | number)[] = $state([])
	let translationMultiplier: number = $state(0)
	const numberFormat = new Intl.NumberFormat().format

	$effect(() =>
	{
		translationMultiplier = typeof value !== "number" || typeof oldValue !== "number" || value >= oldValue ? 1 : -1
		oldValue = value

		untrack(() =>
		{
			valueArray.pop()
			valueArray.push(value)
		})
	})

</script>

<style>

.text-cycler
{
	display: inline-grid;
	overflow: hidden;
	white-space: nowrap;

	& > *
	{
		grid-column: 1 / 1;
		grid-row: 1 / 1;
	}
}

</style>

<span class="text-cycler" style={`justify-items: ${alignItems}; ${sizeToCss("min-width", minWidth)}`}>
	{#each valueArray as item (item)}
		<span
			in:fly|local={$animations ? { y: itemHeight * translationMultiplier, duration: animateDuration, easing: backOut } : { duration: 0 }}
			out:fly|local={$animations ? { y: -itemHeight * translationMultiplier, duration: animateDuration, easing: backOut } : { duration: 0 }}
		>{typeof item === "number" ? numberFormat(item) : item}</span>
	{/each}
</span>
