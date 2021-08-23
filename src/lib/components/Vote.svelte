<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import AnimateValue from "./AnimateValue.svelte"
	
	/** If true, the user can't vote. */
	export let disabled: boolean = false
	/** The base vote count. */
	export let value: number | undefined | null
	/** The user's vote. */
	export let vote: -1 | 1 | null

	let displayValue: number | null
	$: displayValue = vote ? ((value || 0) + vote) : ((value !== null && value !== undefined) ? value : null)

	const dispatch = createEventDispatcher()

	function doVote(newVote: -1 | 1): void
	{
		if (vote === newVote)
			vote = null
		else
			vote = newVote

		raiseOnVote()
	}

	function raiseOnVote(): void
	{
		dispatch("vote", { vote: vote })
	}
</script>

<style lang="scss">

	.votebox
	{
		height: 22px;
		display: flex;

		border: 1px solid transparent;

		font-size: 15px;
		line-height: 20px;

		user-select: none;

		transition: border-color 150ms, background-color 150ms;

		&:hover:not(.inactive), &:focus-within:not(.inactive)
		{
			border-color: var(--grey);
			background-color: var(--background);
		}
	}

	.score
	{
		min-width: 32px;
		padding: 0 4px;

		text-align: center;

		&.value
		{
			color: var(--foreground);
		}
	}

	button.vote
	{
		all: initial;
		box-sizing: border-box;

		width: 28px;
		height: 20px;
		padding: 0 4px;

		stroke: var(--foreground);
		stroke-width: 2px;
		fill: none;

		cursor: pointer;

		&.inactive
		{
			stroke: var(--grey);
		}

		&:hover, &:focus
		{
			stroke: var(--background);
			background-color: var(--grey-dark1);
		}

		&:focus:not(:focus-visible):not(:hover)
		{
			stroke: var(--foreground);
			background-color: transparent;

			&.inactive
			{
				stroke: var(--grey);
			}
		}

		&:disabled, &:disabled:hover
		{
			stroke: var(--grey);
			background-color: transparent;
			opacity: 0.3;
			cursor: default;
		}
	}

</style>

<div class="votebox" class:inactive={disabled}>
	<button class:vote={true} class:inactive={disabled || vote === null || vote < 0} {disabled} on:click|preventDefault={() => doVote(1)}>
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
			<path d="M5,12,9.5,7,14,12" />
		</svg>
	</button>
	<div class="score" class:value={displayValue !== null}>
		<AnimateValue value={displayValue !== null ? displayValue : "/"} itemHeight={20} />
	</div>
	<button class:vote={true} class:inactive={disabled || vote === null || vote > 0} {disabled} on:click|preventDefault={() => doVote(-1)}>
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
			<path d="M5,8,9.5,13,14,8" />
		</svg>
	</button>
</div>
