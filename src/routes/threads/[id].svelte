<script context="module" lang="ts">
	import type { Load } from "./[id]"
	type LoadInput = Parameters<Load>[0]
	type LoadOutput = Promise<ReturnType<Load>>

	import { browser } from "$app/env"

	export async function load({ params }: LoadInput): Promise<LoadOutput>
	{
		const { id } = params
		const threadID = Number.parseInt(id, 10)
		if (isNaN(threadID)) return { status: 404, error: new Error(`There's no thread "${id}".`) }
		const clip = browser && !location.hash.match(/^#Post\d+$/)

		return { props: { id: threadID, clip: clip, lastReload: new Date() } }
	}
</script>

<script lang="ts">
	import type { Post, Thread } from "$lib/sdk"
	import { getThread, getThreadClipped, postThreadReply, ignoreThread } from "$lib/sdk"
	import { unreadThreads, users } from "$lib/data"
	import { Button, Editor, Heading, ThreadView, Title, UnreadThreadsPager, Wait } from "$lib/components"
	import { X } from "$lib/icons"
	
	export let id: number
	export let clip: boolean = true
	export let lastReload: Date = new Date(0)

	let thread: Thread | null = null
	let isLoading: boolean = false
	let error: Error | null = null

	let editor: Editor
	let replyText: string = ""
	let isPosting: boolean = false

	$: if (browser)
	{
		id
		clip
		lastReload
		refresh()
	}

	async function refresh()
	{
		try
		{
			isLoading = true
			const response = clip ? await getThreadClipped(id) : await getThread(id)
			thread = response.thread
			if (response.unreadThreads)
			{
				$unreadThreads.refreshFromArray(response.unreadThreads)
			}
			// The server marks the thread as unread asynchronously, so this one may still be in the list. If so, remove it.
			$unreadThreads.remove(id)
		}
		catch (e)
		{
			error = e
		}
		finally
		{
			isLoading = false
		}
	}

	function onReply(ev: CustomEvent<{post?: Post}>): void
	{
		if (!thread) return
		const post = ev.detail?.post
		if (post)
		{
			editor.insertText(`<a href="ForumThread.aspx?Thread=${thread.id}&amp;ShowAll=True#Post${post.index}">${$users.getOrPlaceholder(post.author).shortName} · ${post.index}</a>: `)
		}
		editor.focus()
	}

	function onShowAll(_ev: CustomEvent): void
	{
		clip = false
	}

	async function postReply()
	{
		if (isPosting || replyText.length === 0) return

		try
		{
			isPosting = true
			thread = (await postThreadReply(id, { text: editor.getHtml() })).thread
			clip = false // because the API always returns the unclipped thread
			replyText = ""
		}
		finally
		{
			isPosting = false
		}
	}

	async function toggleIgnore()
	{
		if (!thread || isLoading) return

		try
		{
			isLoading = true
			const response = await ignoreThread(thread.id, !thread.ignored)
			thread.ignored = response.ignored
		}
		finally
		{
			isLoading = false
		}
	}

	function onBeforeUnload(ev: BeforeUnloadEvent)
	{
		// If they haven't typed anything of significance, don't block them from navigating away.
		if (!isPosting && (!replyText || replyText.length < 100)) return

		// Otherwise, warn them!
		ev.preventDefault()
		ev.returnValue = ""
		return ev.returnValue

		// IMPORTANT: This only covers navigations away from the site, not intra-site navigations.
		// TODO: Develop a solution for pausing intra-site navigations as well.
	}
</script>

<style lang="scss">
	@import "../../core";

	.divider
	{
		height: 1em;
	}

</style>

<Title title={thread ? thread.title : "Forums"} />

<svelte:window on:beforeunload={onBeforeUnload} />

{#if browser}{#if thread}
	<Heading
		previousHref="/forums/{thread.forum.id}"
		previousTitle={thread.forum.title}
		nextTitle="Reply"
		on:next={onReply}
	>
		{thread.title}
		<div slot="controls">
			<Button tiny ghost={!thread.ignored} danger={thread.ignored} on:click={toggleIgnore} disabled={isLoading} title={thread.ignored ? "On second thought, I do have time for this shit" : "I don’t have time for this shit"}>
				{#if thread.ignored}
					<X />
					Ignored
				{:else}
					<X />
					Ignore
				{/if}
			</Button>
		</div>
	</Heading>
	<ThreadView {thread} on:reply={onReply} on:showAll={onShowAll} loading={isLoading && !clip} scrollIntoView={location.hash.length === 0} showReplyButton />
	<div class="divider" />
	<Editor bind:this={editor} bind:value={replyText} placeholder="Post reply" disabled={isLoading || isPosting} collapsible afterHeight="64px">
		<p slot="after" let:uploading>
			<Button on:click={postReply} disabled={isLoading || isPosting || uploading || replyText.length === 0}>Post reply</Button>
		</p>
	</Editor>
	<UnreadThreadsPager />
{:else if error}
	<aside class="danger">
		{error.message}
	</aside>
{:else}
	<p>
		<Wait delay={1000} />
	</p>
{/if}{/if}
