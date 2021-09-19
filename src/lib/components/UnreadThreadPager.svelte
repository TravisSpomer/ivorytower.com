<script lang="ts">
	import { unreadThreads } from "$lib/data"

	/** If true (default), the pager will return the user home if there are no threads. If false, it will render nothing in that case. */
	export let thenHome: boolean = true
</script>

<style lang="scss">
	@import "../../core.scss";

	a
	{
		display: flex;
		justify-content: flex-end;
		margin: 2em (-$indent * 0.5) 1em (-$indent * 0.5);
		padding: 1em ($indent * 0.5);

		text-decoration: none;

		transition: background-color 125ms ease;

		&.back
		{
			justify-content: flex-start;

			.arrow
			{
				margin: 0 ($indent * 0.5);
			}
		}

		.arrow
		{
			margin: 0 ($indent * 0.5);

			color: var(--grey);
			font-size: 48px;

			user-select: none;

			transition: translate 125ms ease;
		}

		.vertical
		{
			display: flex;
			flex-direction: column;
		}

		.heading
		{
			color: var(--grey-dark1);
		}

		.thread-title
		{
			font-size: 28px;
			line-height: 40px;
			font-weight: $font-weight-bold;

			color: var(--primary-dark2);
		}

		&:hover, &:focus
		{
			background-color: var(--grey-light4);
			outline: none;

			.arrow
			{
				translate: 0.125em 0;

				color: var(--primary-dark2);
			}

			.heading
			{
				color: var(--foreground);
			}

			.thread-title
			{
				text-decoration: underline;
			}

			&.back
			{
				.arrow
				{
					translate: -0.125em 0;
				}
			}
		}

		&:focus:not(:focus-visible):not(:hover)
		{
			background-color: unset;

			.arrow
			{
				translate: 0;

				color: var(--grey);
			}

			.heading
			{
				color: var(--grey-dark1);
			}

			.thread-title
			{
				text-decoration: none;
			}

			&.back
			{
				.arrow
				{
					translate: 0;
				}
			}
		}
	}

</style>

{#if $unreadThreads.next}
	<a class="forward" href="/threads/{$unreadThreads.next.id}" sveltekit:noscroll title="{$unreadThreads.length} unread">
		<div class="vertical">
			<div class="heading">Next up</div>
			<div class="thread-title">{$unreadThreads.next.title}</div>
		</div>
		<div class="arrow">›</div>
	</a>
{:else if thenHome}
	<a class="back" href="/" title="No unread threads">
		<div class="arrow">‹</div>
		<div class="vertical">
			<div class="heading">That’s it for now</div>
			<div class="thread-title">Back home</div>
		</div>
	</a>
{/if}
