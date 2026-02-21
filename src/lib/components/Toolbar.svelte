<script lang="ts">
	import type { Snippet } from "svelte"

	interface Props {
		/** The main content of the toolbar. */
		children: Snippet
		/** Additional optional content to be displayed right-aligned on the toolbar. */
		right?: Snippet | undefined
	}

	const {
		children,
		right,
	}: Props = $props()
</script>

<style>
	.toolbar
	{
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin: 2px var(--indent-half-negative) 2px var(--indent-half-negative);
		padding: 4px calc(var(--indent-half) + 16px) 3px calc(var(--indent-half) + 16px);
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
	{@render children()}
	{#if right}
		<div class="flexspacer"></div>
		{@render right()}
	{/if}
</div>
