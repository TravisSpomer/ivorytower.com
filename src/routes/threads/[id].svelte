<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page"

	export async function load({ page }: LoadInput): Promise<LoadOutput<{id: number}>>
	{
		const { id } = page.params
		const threadID = Number.parseInt(id, 10)
		if (isNaN(threadID)) return { status: 404, error: new Error(`There's no thread "${threadID}".`) }

		return { props: { id: threadID } }
	}
</script>

<script lang="ts">
	import { browser } from "$app/env"
	import { getThread, postThreadReply } from "$lib/sdk"
	import type { Post, Thread } from "$lib/sdk"
	import { unreadThreads, users } from "$lib/data"
	import { Editor, ThreadView, UnreadThreadsPager, Wait } from "$lib/components"
	
	export let id: number

	let thread: Thread | null = null
	let error: Error | null = null

	let editor: Editor
	let replyText: string = ""
	let isPosting: boolean = false

	$: if (browser)
	{
		id
		refresh()
	}

	async function refresh()
	{
		try
		{
			const response = await getThread(id)
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
	}

	function onReply(ev: CustomEvent<{post: Post}>): void
	{
		if (!thread) return
		const { post } = ev.detail
		editor.insertText(`<a href="ForumThread.aspx?Thread=${thread.id}&amp;ShowAll=True#Post${post.index}">${$users.getOrPlaceholder(post.author).shortName} · ${post.index}</a>: `)
		editor.focus()
	}

	async function postReply()
	{
		if (isPosting || replyText.length === 0) return

		try
		{
			isPosting = true
			thread = (await postThreadReply(id, { text: editor.getHtml() })).thread
			replyText = ""
		}
		finally
		{
			isPosting = false
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

	.divider
	{
		height: 2em;
	}

</style>

<svelte:head>
	<title>{$unreadThreads.prefixText}{thread ? thread.title : "Forums"} - IvoryTower</title>
</svelte:head>

<svelte:window on:beforeunload={onBeforeUnload} />

{#if browser}{#if thread}
	<h1>{thread.title}</h1>
	<ThreadView {thread} on:reply={onReply} scrollIntoView={location.hash.length === 0} />
	<div class="divider" />
	<Editor bind:this={editor} bind:value={replyText} placeholder="Post reply" disabled={isPosting} collapsible>
		<p slot="after" let:uploading>
			<button class:button={true} on:click={postReply} disabled={isPosting || uploading || replyText.length === 0}>Post reply</button>
		</p>
	</Editor>
	<UnreadThreadsPager />
{:else if error}
	<aside class="danger">
		{error.message}
	</aside>
{:else}
	<p>
		<Wait />
	</p>
{/if}{/if}
