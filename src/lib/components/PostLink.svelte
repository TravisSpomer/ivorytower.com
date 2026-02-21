<script lang="ts">
	import type { Post } from "$lib/sdk"
	import { browser } from "$app/environment"
	import { getPostByIndex } from "$lib/sdk"
	import HoverLink from "./HoverLink.svelte"
	import MiniNavLink from "./MiniNavLink.svelte"
	import Popup from "./Popup.svelte"
	import PopupFrame from "./PopupFrame.svelte"
	import PostView from "./PostView.svelte"
	import Wait from "./Wait.svelte"

	export interface Props
	{
		/** The ID of the thread. */
		threadID: number | undefined
		/** The ID of the post. */
		postIndex: number | undefined
		/** Optionally, child elements to render. */
		childNodes?: NodeList | undefined
	}

	const {
		threadID,
		postIndex,
		childNodes,
	}: Props = $props()

	let isPopupOpen: boolean = $state(false)
	let hasTriedLoading: boolean = $state(false)
	let errorLoading: boolean = $state(false)
	let post: Post | undefined = $state()
	let lockedOpen: boolean = $state(false)

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

	$effect(() =>
	{
		if (threadID && postIndex && !hasTriedLoading && isPopupOpen) load()
	})
</script>

<style>

	.go
	{
		position: relative;
		margin: 0.5em 0 0.5em 1em;
	}

</style>

{#if browser}
	<Popup onHover={!errorLoading && !lockedOpen} bind:isOpen={isPopupOpen}>
		{#snippet anchor()}
			<HoverLink href={`/threads/${threadID}#Post${postIndex}`} childNodes={childNodes} navigate={false} onclick={onClick} />
		{/snippet}
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
