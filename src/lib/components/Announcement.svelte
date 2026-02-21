<script lang="ts">
	import type { Snippet }	from "svelte"

	export interface Props
	{
		children: Snippet
	}

	const { children }: Props = $props()

</script>

<style>
	.root
	{
		position: relative;
		margin: 0 var(--indent-half-negative);
		padding: var(--indent-half);

		&::before
		{
			content: "";
			display: block;
			position: absolute;
			left: 0;
			right: 0;
			top: -8px;
			height: 8px;

			background: radial-gradient(ellipse farthest-side at bottom, var(--border-subtle-trans), transparent);
		}

		&::after
		{
			content: "";
			display: block;
			position: absolute;
			left: 0;
			right: 0;
			bottom: -8px;
			height: 8px;

			background: radial-gradient(ellipse farthest-side at top, var(--border-subtle-trans), transparent);
		}
	}

</style>

<div class="root">{@render children()}</div>
