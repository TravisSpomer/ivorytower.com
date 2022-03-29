<style lang="scss">
	@import "../../core";

	.toolbar
	{
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin: 0 (-$indent * 0.5) 1em (-$indent * 0.5);
		padding: 4px 4px 3px 4px;
		align-items: baseline;

		background-color: var(--toolbar-background);
		border-width: 0 0 1px 0;
		border-style: solid;
		border-color: var(--toolbar-border);
		border-radius: 0.25em;

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
