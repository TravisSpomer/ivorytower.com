<script lang="ts">
	import { unreadThreads } from "$lib/data"

	/** If true (default), the pager will return the user home if there are no threads. If false, it will render nothing in that case. */
	export let thenHome: boolean = true
</script>

<style lang="scss">
	
	.root
	{
		display: flex;
		justify-content: flex-end;
		margin-top: 3em;

		/* TODO: Replace this with an "outline" button style */
		a
		{
			padding: 0.5em 1em;

			color: var(--primary-dark4);

			background-color: var(--primary-light4);
			border: 1px solid var(--primary-dark2);
			border-radius: 8px;

			transition: background-color 133ms;

			&:hover
			{
				background-color: var(--background);
			}
		}
	}

</style>

<nav class="root">
	{#if $unreadThreads.next}
		<a href="/threads/{$unreadThreads.next.id}" sveltekit:noscroll title="{$unreadThreads.length} unread">Next: {$unreadThreads.next.title}&nbsp;<strong>›</strong></a>
	{:else if thenHome}
		<a href="/" title="No unread threads"><strong>‹</strong>&nbsp;Back home</a>
	{/if}
</nav>
