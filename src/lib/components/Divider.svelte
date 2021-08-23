<script lang="ts">
	/** The label for the divider. */
	export let label: string | undefined = undefined
</script>

<style lang="scss">

	.divider
	{
		display: flex;
		margin: 1em -1em;
		height: 1px;

		border-width: 0 0 1px 0;
		border-style: solid;
		border-color: var(--yellow);

		user-select: none;
	}

	.label
	{
		margin: -14px 0 0 1em;
		height: 28px;
		padding: 2px 8px;

		border: 1px solid var(--yellow);
		background-color: var(--yellow-light2);
		border-radius: 4px;

		color: black;
		font-size: 17px;
		line-height: 24px;
		font-weight: bold;
	}

</style>

<div class="divider" role="separator">
{#if label}
	<div class="label">{label}</div>
{/if}
</div>
