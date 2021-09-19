<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import type { Thread } from "$lib/sdk"
	import Divider from "./Divider.svelte"
	import PostView from "./PostView.svelte"
	
	/** The thread to render. */
	export let thread: Thread
	/** If true, the first unread post will be scrolled into view. */
	export let scrollIntoView: boolean = false
	/** If true, the thread is currently reloading. */
	export let loading: boolean = false

	const dispatch = createEventDispatcher()

	let clipped: number = 0
	$: if (thread) clipped = thread.postsInThread - thread.posts.length

	function onShowAll()
	{
		dispatch("showAll")
	}
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
			<Divider label={thread.unread > 1 ? `${thread.unread} new posts` : "new post"} highlight />
		{/if}
		<PostView {post} scrollIntoView={scrollIntoView && i === thread.posts.length - thread.unread} unread={i >= thread.posts.length - thread.unread} on:reply />
		{#if i === 0 && clipped > 0}
			<Divider interactive={!loading} waiting={loading} label="{loading ? "Getting " : "See "}{clipped} older posts" on:click={onShowAll} />
		{/if}
	{/each}
</section>
