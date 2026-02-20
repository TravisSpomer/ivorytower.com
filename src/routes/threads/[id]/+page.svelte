<script lang="ts">
	import type { PageProps } from "./$types"
	import { browser } from "$app/environment"
	import type { Post, Thread } from "$lib/sdk"
	import { getThread, getThreadClipped, postThreadReply, ignoreThread } from "$lib/sdk"
	import { unreadThreads, users } from "$lib/data"
	import { Button, Editor, Heading, ThreadView, Title, UnreadThreadsPager, Wait } from "$lib/components"
	import { X } from "$lib/icons"

	const { data }: PageProps = $props()
	const id = $derived(data.id)
	const locationHashPresent = $derived(data.locationHashPresent)
	const lastReload = $derived(data.lastReload)

	let clip: boolean = $state(true)

	let thread: Thread | null = $state(null)
	let isLoading: boolean = $state(false)
	let error: Error | null = $state(null)

	let editor: Editor | undefined = $state()
	let editorIsEmpty: boolean = $state(true)
	let isPosting: boolean = $state(false)

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

	function onReply(ev: {post: Post | null}): void
	{
		if (!thread || !editor) return
		const post = ev.post
		if (post)
		{
			editor.insertHTML(`<a href="ForumThread.aspx?Thread=${thread.id}&amp;ShowAll=True#Post${post.index}">${$users.getOrPlaceholder(post.author).shortName} · ${post.index}</a>: `)
		}
		editor.focus()
	}

	function onShowAll(): void
	{
		clip = false
	}

	async function postReply()
	{
		if (!editor || isPosting || editorIsEmpty) return

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

	$effect(() =>
	{
		if (locationHashPresent && clip) clip = false
	})

	if (browser)
	{
		$effect.pre(() =>
		{
			id
			clip
			lastReload
			refresh()
		})
	}
</script>

<style>

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
		onnext={() => onReply({ post: null })}
	>
		{thread.title}
		{#snippet controls()}
			<div>
				<Button tiny ghost={!thread!.ignored} danger={thread!.ignored} onclick={toggleIgnore} disabled={isLoading} title={thread!.ignored ? "On second thought, I do have time for this shit" : "I don’t have time for this shit"}>
					{#if thread!.ignored}
						<X />
						Ignored
					{:else}
						<X />
						Ignore
					{/if}
				</Button>
			</div>
		{/snippet}
	</Heading>
	<ThreadView {thread} onreply={onReply} onshowall={onShowAll} loading={isLoading && !clip} scrollIntoView={location.hash.length === 0} showReplyButton />
	<div class="divider"></div>
	{#key id}
		<Editor bind:this={editor} bind:isEmpty={editorIsEmpty} placeholder="Post reply" disabled={isLoading || isPosting} collapsible afterHeight="64px" sitewideUniqueID="/threads/{id}">
			{#snippet after({ uploading })}
				<p>
					<Button onclick={postReply} disabled={isLoading || isPosting || uploading || editorIsEmpty}>Post reply</Button>
				</p>
			{/snippet}
		</Editor>
	{/key}
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
