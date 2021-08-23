<script lang="ts">
	export let style: "HoverLink" | undefined
</script>

<style lang="scss">
	@import "../../core.scss";

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

	.HoverLink
	{
		border-color: var(--link-special);
		background-color: var(--link-special-popup-background);
	}

</style>

<div class:frame={true} class:HoverLink={style === "HoverLink"}><slot /></div>
