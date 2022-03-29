<style lang="scss">
	@import "../../core";

	.toolbar
	{
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin: 2px (-$indent * 0.5) 2px (-$indent * 0.5);
		padding: 4px ($indent * 0.5 + 16px) 3px ($indent * 0.5 + 16px);
		align-items: baseline;

		background-color: var(--toolbar-background);
		border-width: 0 0 1px 0;
		border-style: solid;
		border-color: var(--toolbar-border);

		color: var(--toolbar-foreground);

		user-select: none;
	}
</style>

<div class="toolbar">
	<slot />
	{#if $$slots.right}
		<div class="flexspacer"></div>
		<slot name="right" />
	{/if}
</div>
