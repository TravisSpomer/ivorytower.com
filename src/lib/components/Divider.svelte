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

<style lang="scss">
	@import "../../core.scss";

	.divider
	{
		display: flex;
		margin: 1em -1em;
		height: 1px;

		border-width: 0 0 1px 0;
		border-style: solid;
		border-color: var(--primary);

		&.highlight
		{
			border-color: var(--yellow);
		}
	}

	.label
	{
		margin: -14px 0 0 1em;
		height: 28px;
		padding: 2px 8px;

		border: 1px solid var(--primary);
		border-radius: 4px;

		color: black;
		font-size: 17px;
		line-height: 24px;
		font-weight: bold;

		user-select: text;

		transition: background-color 125ms ease;

		@include rest
		{
			background-color: var(--primary-light3);
		}

		&.interactive
		{
			cursor: pointer;

			@include hover
			{
				background-color: white;
			}

			@include pressed
			{
				background-color: var(--primary-light1);
			}
		}

		&.highlight
		{
			border: 1px solid var(--yellow);
			background-color: var(--yellow-light2);

			&.interactive
			{
				@include hover
				{
					background-color: var(--yellow-light3);
				}

				@include pressed
				{
					background-color: var(--yellow-light1);
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
