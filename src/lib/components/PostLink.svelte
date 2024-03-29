<script lang="ts" context="module">

	const postPath = /^ForumThread\.aspx\?Thread=(\d+)(?:&ShowAll=True)?#Post(\d+)$/i

	interface PostLinkProps
	{
		threadID: number
		postIndex: number
	}

	/**
		Tests a link to see if it's a forums post link.
		Returns props that can be passed to PostLink if so, and null if not.
	*/
	export function parseLink(href: string): PostLinkProps | null
	{
		const match = postPath.exec(href)
		if (match)
		{
			const threadID = parseInt(match[1], 10)
			const postIndex = parseInt(match[2], 10)
			if (!isNaN(threadID) && !isNaN(postIndex))
				return { threadID, postIndex }
		}
		return null
	}

</script>

<script lang="ts">
	import { browser } from "$app/environment"
	import type { Post } from "$lib/sdk"
	import { getPostByIndex } from "$lib/sdk"
	import HoverLink from "./HoverLink.svelte"
	import MiniNavLink from "./MiniNavLink.svelte"
	import Popup from "./Popup.svelte"
	import PopupFrame from "./PopupFrame.svelte"
	import PostView from "./PostView.svelte"
	import Wait from "./Wait.svelte"

	/** The ID of the thread. */
	export let threadID: number | undefined
	/** The ID of the post. */
	export let postIndex: number | undefined
	/** Optionally, child elements to render. */
	export let children: NodeList | undefined = undefined

	let isPopupOpen: boolean
	let hasTriedLoading: boolean
	let errorLoading: boolean
	let post: Post | undefined
	let lockedOpen: boolean

	$: if (threadID && postIndex && !hasTriedLoading && isPopupOpen) load()
	
	async function load(): Promise<void>
	{
		hasTriedLoading = true
		try
		{
			post = (await getPostByIndex(threadID!, postIndex!)).post
		}
		catch
		{
			errorLoading = true
		}
	}

	function onClick(): void
	{
		isPopupOpen = false
		lockedOpen = !lockedOpen
	}
</script>

<style lang="scss">

	.go
	{
		position: relative;
		margin: 0.5em 0 0.5em 1em;
	}

</style>

{#if browser}
	<Popup onHover={!errorLoading && !lockedOpen} bind:isOpen={isPopupOpen}>
		<HoverLink slot="anchor" href={`/threads/${threadID}#Post${postIndex}`} {children} navigate={false} on:click={onClick} />
		<PopupFrame style="HoverLink">
			{#if post}
				<PostView {post} readonly compact scrollIntoView={false} />
			{:else if hasTriedLoading && !errorLoading}
				<Wait />
			{/if}
		</PopupFrame>
	</Popup><!--
	-->{#if lockedOpen}
		<span class="go">
			<MiniNavLink href={`/threads/${threadID}#Post${postIndex}`} special next>go</MiniNavLink>
		</span>
		{#if !post && hasTriedLoading && !errorLoading}
			<Wait size={28} />
		{/if}
		{#if post}
			<PopupFrame inline style="HoverLink">
				<PostView {post} readonly compact scrollIntoView={false} />
			</PopupFrame>
		{/if}
	{/if}
{/if}
