<script lang="ts">

import { backOut } from "svelte/easing"
import { fly } from "svelte/transition"
import { animations } from "$lib/utils/settings"
import { sizeToCss } from "$lib/utils/size"

/** The current value to display. */
export let value: string | number
/** The number of milliseconds to animate between each item and the next one. */
export let animateDuration: number = 300
/** The height of each item, in pixels. Typically this should be equal fo the line height. */
export let itemHeight: number
/** The alignment of each item, as a valid align-items value. */
export let alignItems: "center" | "flex-start" | "flex-end" = "center"
/** The minimum width of the container. */
export let minWidth: number | string | undefined = undefined

let valueArray: (string | number)[] = []
let translationMultiplier: number
const numberFormat = new Intl.NumberFormat().format

$:
{
	const oldValue = valueArray.length ? valueArray[0] : null
	translationMultiplier = typeof value !== "number" || typeof oldValue !== "number" || value >= oldValue ? 1 : -1

	valueArray.pop()
	valueArray.push(value)
	valueArray = valueArray
}

</script>

<style lang="scss">

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
