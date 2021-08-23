<script context="module" lang="ts">
	import type { Forum } from "$lib/sdk"
</script>

<script lang="ts">
	/** The forum to render. */
	export let forum: Forum
</script>

<style lang="scss">

	li.folder
	{
		font-weight: bold;
	}

	li.thread
	{
		&.unread::marker
		{
			color: var(--red-dark2);
		}

		span.count
		{
			color: var(--red-dark2);
			font-size: 79%;
		}
	}

</style>

{#if forum.forums}
	<ul>
		{#each forum.forums as childForum}
			<li class:folder={true}><a href="/forums/{childForum.id}">{childForum.title}</a></li>
		{/each}
	</ul>

	{#if forum.threads}
		<hr />
	{/if}
{/if}

{#if forum.threads}
	<ul>
		{#each forum.threads as thread}
			<li class:thread={true} class:unread={thread.unread > 0}>
				<a href="/threads/{thread.id}">{thread.title}</a>
				{#if thread.unread > 0}
					<span class="count">({thread.unread})</span>
				{/if}
			</li>
		{/each}
	</ul>
{/if}
