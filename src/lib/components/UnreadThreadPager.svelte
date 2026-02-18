<script lang="ts">
	import { unreadThreads } from "$lib/data"

	/** If true (default), the pager will return the user home if there are no threads. If false, it will render nothing in that case. */
	export let thenHome: boolean = true
</script>

<style>

	a
	{
		display: flex;
		justify-content: flex-end;
		margin: 1em var(--indent-half-negative) 1em var(--indent-half-negative);
		padding: 1em var(--indent-half);

		text-decoration: none;

		transition: background-color 125ms ease;

		&.back
		{
			justify-content: flex-start;

			.arrow
			{
				margin: 0 var(--indent-half);
			}
		}

		.arrow
		{
			margin: 0 var(--indent-half);

			font-size: 48px;

			user-select: none;

			transition: transform 125ms ease;
		}

		.vertical
		{
			display: flex;
			flex-direction: column;
		}

		.thread-title
		{
			font-size: 28px;
			line-height: 40px;
			font-weight: var(--font-weight-bold);

			color: var(--accent-dark2);
		}

		:global(.theme-dark) &
		{
			.heading
			{
				color: var(--grey-light1);
			}

			.thread-title
			{
				color: var(--accent-light1);
			}
		}

		&
		{
			background-color: unset;

			.arrow
			{
				transform: translate(0, 0);

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
					transform: translate(0, 0);
				}
			}
		}

		@media (hover: hover) { &:hover
		{
			background-color: var(--grey-light4);
			outline: none;

			.arrow
			{
				transform: translate(0.125em, 0);

				color: var(--accent-dark2);
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
					transform: translate(-0.125em, 0);
				}
			}

			:global(.theme-dark) &
			{
				background-color: black;

				.arrow
				{
					color: var(--accent-light2);
				}
			}
		}}
		&:focus-visible, &:active
		{
			background-color: var(--grey-light4);
			outline: none;

			.arrow
			{
				transform: translate(0.125em, 0);

				color: var(--accent-dark2);
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
					transform: translate(-0.125em, 0);
				}
			}

			:global(.theme-dark) &
			{
				background-color: black;

				.arrow
				{
					color: var(--accent-light2);
				}
			}
		}
	}

</style>

{#if $unreadThreads.next}
	<a class="forward" href="/threads/{$unreadThreads.next.id}" data-sveltekit-noscroll title="{$unreadThreads.length} unread">
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
