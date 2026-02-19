<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import { run } from "svelte/legacy"
	import { preferences } from "$lib/data"
	import type { Thread } from "$lib/sdk"
	import Button from "./Button.svelte"
	import Divider from "./Divider.svelte"
	import PostView from "./PostView.svelte"

	export interface Props
	{
		/** The thread to render. */
		thread: Thread
		/** If true, the first unread post will be scrolled into view. */
		scrollIntoView?: boolean
		/** If true, and the user prefers to see posts in reverse order, a reply button will be added that fires the "reply" event when clicked. */
		showReplyButton?: boolean
		/** If true, the thread is currently reloading. */
		loading?: boolean
	}

	const {
		thread,
		scrollIntoView = false,
		showReplyButton = false,
		loading = false
	}: Props = $props()

	const dispatch = createEventDispatcher()

	let clipped: number = $state(0)
	run(() =>
	{
		if (thread) clipped = thread.postsInThread - thread.posts.length
	})

	function onShowAll(): void
	{
		dispatch("showAll")
	}

	function onReply(): void
	{
		// This should match the reply event from PostView.
		dispatch("reply")
	}
</script>

<style>

	section
	{
		display: flex;
		flex-direction: column;
	}

</style>

<section>
	{#if !$preferences.threadsShowNewestPostsFirst}
		{#each thread.posts as post, i (`${thread.id}/${post.id}`)}
			{@const firstUnreadPost = thread.posts.length - thread.unread}
			{#if i > 0 && i === firstUnreadPost}
				<Divider label={thread.unread > 1 ? `${thread.unread} new posts` : "new post"} highlight />
			{/if}
			<PostView {post} scrollIntoView={scrollIntoView && i === firstUnreadPost} unread={i >= firstUnreadPost} on:reply />
			{#if i === 0 && clipped > 0}
				<Divider interactive={!loading} waiting={loading} label="{loading ? "Getting " : "See "}{clipped} older posts" on:click={onShowAll} />
			{/if}
		{/each}
	{:else}
		{#each [thread.posts[0], ...thread.posts.slice(1).reverse()] as post, i (`${thread.id}/${post.id}`)}
			{#if i === 1 && thread.unread}
				<Divider label={thread.unread > 1 ? `${thread.unread} new posts` : "new post"} highlight />
			{:else if i === 1}
				<Divider />
			{/if}
			<PostView {post} unread={(i === 0 && thread.unread === thread.posts.length) || (i > 0 && i <= thread.unread)} on:reply />
			{#if i === thread.unread}
				{#if showReplyButton}
					<div>
						<Button toolbar on:click={onReply}>Post reply</Button>
					</div>
				{/if}
				{#if i > 0}
					<Divider label="older posts" />
				{/if}
			{/if}
		{/each}
		{#if clipped > 0}
			<Divider interactive={!loading} waiting={loading} label="{loading ? "Getting " : "See "}{clipped} more posts" on:click={onShowAll} />
		{/if}
	{/if}
</section>
