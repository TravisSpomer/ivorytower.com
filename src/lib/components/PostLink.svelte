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
	export let childNodes: NodeList | undefined = undefined

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
		<HoverLink slot="anchor" href={`/threads/${threadID}#Post${postIndex}`} childNodes={childNodes} navigate={false} on:click={onClick} />
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
