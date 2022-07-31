<script lang="ts">
	/** Determines the visual style of the frame. */
	export let style: "HoverLink" | undefined
	/** If true, the frame will appear using styling appropriate for a persistent inline UI that only looks like a popup. */
	export let inline: boolean = false
</script>

<style lang="scss">
	@import "../../core";

	.frame
	{
		max-width: 700px;
		max-height: 400px;
		overflow: auto;
		padding: .5em 1em;

		background-color: var(--background);
		border-color: var(--grey);
		border-style: solid;
		border-width: 1px;
		border-radius: .25em;
		box-shadow: 0 2px 3px rgba(black, 0.1);
	}

	.inline
	{
		margin: 0.5em 0 1em 0;
		max-width: unset;
		max-height: unset;
	}

	.HoverLink
	{
		border-color: var(--link-special);
		background-color: var(--link-special-popup-background);
	}

</style>

<div class:frame={true} class:inline class:HoverLink={style === "HoverLink"}><slot /></div>
