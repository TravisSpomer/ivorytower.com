<script lang="ts">
	import Wait from "./Wait.svelte"

	/** The label for the divider. */
	export let label: string | undefined = undefined
	/** If true, the divider (and label if present) should appear with highlighted visuals. */
	export let highlight: boolean = false
	/** If true, the divider label should be interactive. */
	export let interactive: boolean = false
	/** If true, the divider label should show a wait icon. */
	export let waiting: boolean = false
</script>

<style>
	.divider
	{
		display: flex;
		margin: 1em -1em;
		height: 1px;

		border-width: 0 0 1px 0;
		border-style: solid;
		border-color: var(--accent-tag-border);

		&.highlight
		{
			border-color: var(--highlight-tag-border);
		}
	}

	.label
	{
		margin: -14px 0 0 1em;
		height: 28px;
		padding: 2px 8px;

		border: 1px solid var(--accent-tag-border);
		border-radius: 4px;

		color: var(--accent-tag-foreground);
		font-size: 17px;
		line-height: 24px;
		font-weight: bold;

		user-select: text;

		transition: background-color 125ms ease;

		&
		{
			background-color: var(--accent-tag-background);
		}

		&.interactive
		{
			cursor: pointer;

			@media (hover: hover) { &:hover
			{
				background-color: var(--accent-tag-background-hover);
			}}
			&:focus-visible, &:active
			{
				background-color: var(--accent-tag-background-hover);
			}

			&:active:hover
			{
				background-color: var(--accent-tag-background-pressed);
			}
		}

		&.highlight
		{
			border: 1px solid var(--highlight-tag-border);

			&
			{
				background-color: var(--highlight-tag-background);
			}

			&.interactive
			{
				@media (hover: hover) { &:hover
				{
					background-color: var(--highlight-tag-background-hover);
				}}
				&:focus-visible, &:active
				{
					background-color: var(--highlight-tag-background-hover);
				}

				&:active:hover
				{
					background-color: var(--highlight-tag-background-pressed);
				}
			}
		}
	}

</style>

<div class:divider={true} class:highlight role={interactive ? "" : "separator"}>
{#if label || waiting}
	{#if interactive}
		<button class:label={true} class:interactive={true} class:highlight on:click>
			{#if waiting}
				<Wait size={22} />
			{/if}
			{label}
		</button>
	{:else}
		<div class:label={true} class:highlight>
			{#if waiting}
				<Wait size={22} />
			{/if}
			{label}
		</div>
	{/if}
{/if}
</div>
