<script lang="ts">
	// TODO: Manually upgrade to Svelte 5

	import { createEventDispatcher } from "svelte"
	import AnimateValue from "./AnimateValue.svelte"
	import ButtonBorder from "./ButtonBorder.svelte"
	import FocusWithin from "./FocusWithin.svelte"

	/** If true, the user can't vote. */
	export let disabled: boolean = false
	/** The base vote count. */
	export let value: number | undefined | null
	/** The user's vote. */
	export let vote: -1 | 1 | null
	/** A pair of tooltips for the upvote and downvote buttons, respectively. */
	export let tooltips: Readonly<[string, string]> | undefined = undefined

	const dispatch = createEventDispatcher()

	function doVote(newVote: -1 | 1): void
	{
		const newVoteInt = (vote === newVote) ? 0 : newVote
		value = ((value || 0) - (vote || 0) + newVoteInt)
		vote = newVoteInt || null
		// NOTE: Since the total score already includes the user vote, when unsetting a vote that causes the total score to return to 0,
		// this code can't tell the difference between 0 and null.
		// We can address that when the server is able to give upvote and downvote counts.

		raiseOnVote()
	}

	function raiseOnVote(): void
	{
		dispatch("vote", { vote: vote })
	}
</script>

<style>

	.votebox
	{
		height: 30px;
		display: flex;

		font-size: 15px;
		line-height: 30px;

		user-select: none;
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
		height: 30px;
		padding: 0 4px;

		stroke: var(--foreground);
		stroke-width: 2px;
		fill: none;

		cursor: pointer;

		&.left
		{
			border-radius: 3px 0 0 3px;
		}

		&.right
		{
			border-radius: 0 3px 3px 0;
		}

		&
		{
			stroke: var(--foreground);
			background-color: transparent;

			&.inactive
			{
				stroke: var(--ghost-control-foreground);
			}
		}

		@media (hover: hover) { &:hover
		{
			stroke: var(--control-foreground-hover);
			background-color: var(--ghost-control-alt-background-hover);
		}}
		&:focus-visible, &:active
		{
			stroke: var(--control-foreground-hover);
			background-color: var(--ghost-control-alt-background-hover);
		}

		&:active:hover
		{
			stroke: var(--control-foreground-pressed);
			background-color: var(--ghost-control-alt-background-pressed);
		}

		&:disabled
		{
			stroke: var(--control-foreground-disabled);
			background-color: transparent;
			opacity: 0.3;
			cursor: not-allowed;
		}
	}

</style>

<FocusWithin let:within visibleOnly>
	<ButtonBorder ghost tag="div" clickable={false} focus={within} {disabled}>
		<div class:votebox={true} class:inactive={disabled}>
			<button class:vote={true} class:left={true} class:inactive={disabled || vote === null || vote < 0} {disabled} title={tooltips ? tooltips[0] : undefined} on:click|preventDefault={() => doVote(1)}>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
					<path d="M5,12,9.5,7,14,12" />
				</svg>
			</button>
			<div class="score" class:value={value !== null}>
				<AnimateValue value={value !== null && value !== undefined ? value : "/"} itemHeight={30} />
			</div>
			<button class:vote={true} class:right={true} class:inactive={disabled || vote === null || vote > 0} {disabled} title={tooltips ? tooltips[1] : undefined} on:click|preventDefault={() => doVote(-1)}>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
					<path d="M5,8,9.5,13,14,8" />
				</svg>
			</button>
		</div>
	</ButtonBorder>
</FocusWithin>
