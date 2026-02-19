<script lang="ts">

	export interface Props
	{
		/** A number to render on the badge. */
		value?: number | undefined;
	}

	const { value = undefined }: Props = $props()

	const renderedValue: string = $derived(value === undefined ? "" : value >= 100 ? "*" : value.toString())

</script>

<style>
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
		font-size: var(--font-size-compact);
		font-weight: var(--font-weight-bold);

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
