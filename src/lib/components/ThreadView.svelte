<script lang="ts">
	import type { Thread } from "$lib/sdk"
	import Divider from "./Divider.svelte"
	import PostView from "./PostView.svelte"
	
	/** The thread to render. */
	export let thread: Thread
	/** If true, the first unread post will be scrolled into view. */
	export let scrollIntoView: boolean = false
</script>

<style lang="scss">

	section
	{
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

</style>

<section>
	{#each thread.posts as post, i (`${thread.id}/${post.id}`)}
		{#if i > 0 && i === thread.posts.length - thread.unread }
			<Divider label={thread.unread > 1 ? `${thread.unread} new posts` : "new post"} />
		{/if}
		<PostView {post} scrollIntoView={scrollIntoView && i === thread.posts.length - thread.unread} unread={i >= thread.posts.length - thread.unread} on:reply />
	{/each}
</section>
