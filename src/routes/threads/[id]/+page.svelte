<script lang="ts">
	import type { PageData } from "./$types"
	import { browser } from "$app/environment"
	import type { Post, Thread } from "$lib/sdk"
	import { getThread, getThreadClipped, postThreadReply, ignoreThread } from "$lib/sdk"
	import { unreadThreads, users } from "$lib/data"
	import { Button, Editor, Heading, ThreadView, Title, UnreadThreadsPager, Wait } from "$lib/components"
	import { X } from "$lib/icons"

	export let data: PageData
	let id: number
	let clip: boolean
	let lastReload: Date
	$: ({ id, clip, lastReload } = data)

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
			editor.insertHTML(`<a href="ForumThread.aspx?Thread=${thread.id}&amp;ShowAll=True#Post${post.index}">${$users.getOrPlaceholder(post.author).shortName} · ${post.index}</a>: `)
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
			thread = (await postThreadReply(id, { text: editor.getHTML() })).thread
			clip = false // because the API always returns the unclipped thread
			editor.discardDraft()
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
</script>

<style lang="scss">
	@import "../../../core";

	.divider
	{
		height: 1em;
	}

</style>

<Title title={thread ? thread.title : "Forums"} />

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
	<div class="divider"></div>
	<Editor bind:this={editor} bind:value={replyText} placeholder="Post reply" disabled={isLoading || isPosting} collapsible afterHeight="64px" sitewideUniqueID="/threads/{id}">
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
