<script lang="ts">
	/** A number to render on the badge. */
	export let value: number | undefined = undefined

	let renderedValue: string
	$: renderedValue = value === undefined ? "" : value >= 100 ? "*" : value.toString()
</script>

<style lang="scss">
	@import "../../core";

	.badge
	{
		display: inline-flex;
		width: 24px;
		height: 24px;
		align-items: center;
		justify-content: center;

		border-radius: 100%;
		background-color: var(--badge-background);

		color: var(--badge-foreground);
		font-size: $font-size-compact;
		font-weight: $font-weight-bold;

		& > *
		{
			flex: none;
		}

		&.none
		{
			visibility: hidden;
		}
	}

</style>

<div class:badge={true} class:none={!value}><div>{renderedValue}</div></div>
