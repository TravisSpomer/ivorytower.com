<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import { castVote, isSameUser, editPost, deletePost, getPostByID } from "$lib/sdk"
	import type { Post } from "$lib/sdk"
	import { currentUser } from "$lib/data"
	import { scrollIntoView as scrollIntoViewAction } from "$lib/utils/actions"
	import Button from "./Button.svelte"
	import DateTime from "./DateTime.svelte"
	import Editor from "./Editor.svelte"
	import UserHtml from "./UserHtml.svelte"
	import User from "./User.svelte"
	import Vote from "./Vote.svelte"
	import Wait from "./Wait.svelte"
	
	/** The post to render. */
	export let post: Post
	/** If true, render the post as unread. */
	export let unread: boolean = false
	/** If true, don't show any interactive UI. */
	export let readonly: boolean = false
	/** If true, show the post in a compact view. */
	export let compact: boolean = false
	/** If true, scroll the post into view when rendered. */
	export let scrollIntoView: boolean = false

	const dispatch = createEventDispatcher()
	let editor: Editor
	let isEditing: boolean = false
	let isWaiting: boolean = false
	let editedContent: string

	function onVote(e: CustomEvent<{vote: -1 | 1 | null}>): void
	{
		castVote(post.id, e.detail.vote)
	}

	async function onStartEdit(): Promise<void>
	{
		try
		{
			isEditing = true
			isWaiting = true
			editedContent = (await getPostByID(post.id, { original: true })).post.html.replaceAll(/<br ?\/?>/gi, "\n")
		}
		finally
		{
			isWaiting = false
		}
	}

	async function onCommitEdit(): Promise<void>
	{
		try
		{
			isWaiting = true
			post = (await editPost(post.id, { html: editor.getHtml() })).post
		}
		finally
		{
			isWaiting = false
		}
		isEditing = false
	}

	function onCancelEdit(): void
	{
		isEditing = false
	}

	async function onDelete(): Promise<void>
	{
		try
		{
			isWaiting = true
			await deletePost(post.id)
			// TODO: better visuals here
			post.html = "<p><em>Deleted</em></p>"
		}
		finally
		{
			isWaiting = false
		}
		isEditing = false
	}

	function onReply(ev: MouseEvent): void
	{
		ev.preventDefault()
		dispatch("reply", { post: post })
	}
</script>

<style lang="scss">
	@import "../../core";

	article
	{
		position: relative;
		margin: 0 -20px 0 -64px;
		padding: 16px 20px 20px 64px;

		scroll-margin-top: 160px; /* More than usual to give more context and show the "new posts" divider */

		@media (max-width: ($full-width + 160px))
		{
			margin: 0 -20px;
			padding: 16px 20px 20px 20px;
		}

		&.readonly
		{
			margin: 0;
			padding: 8px 0;
		}

		&.alt
		{
			background-color: var(--background-alt);
		}

		&.compact
		{
			font-size: $font-size-compact;
			line-height: $line-height-compact;
			font-weight: $font-weight-compact;

			h3 .user
			{
				font-size: $font-size-compact;
				line-height: $line-height-compact;
				font-weight: $font-weight-compact;
			}
		}

		& > .userContent
		{
			max-height: 300vh;
			overflow: auto;

			:global(:first-child)
			{
				margin-top: 0;
			}

			:global(:last-child)
			{
				margin-bottom: 0;
			}

			:global(img), :global(svg)
			{
				max-width: 100%;
				max-height: 80vh;
				width: auto;
				height: auto;
				object-fit: scale-down;
			}
		}
	}

	.post-header
	{
		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-template-rows: auto auto;
		align-items: start;
		gap: 0 4px;
		justify-items: start;
		margin: 0 0 0.25em 0;

		h3
		{
			grid-column: 1 / 2;
			grid-row: 1;
			margin: 0;

			color: var(--grey);
			font-size: $font-size-compact;
			line-height: $line-height-compact;

			@media (max-width: ($full-width + 160px))
			{
				grid-column: 2;
			}

			.user
			{
				font-size: 21px;
			}

			@include phone-only
			{
				grid-column: 1 / -1;
				grid-row: 2;
			}
		}

		.index
		{
			position: absolute;

			margin: -4px;
			left: 8px;
			top: 21px;

			@media (max-width: ($full-width + 160px))
			{
				position: unset;
				grid-column: 1;
				grid-row: 1;
				margin: 0 0 -4px -9px;
			}

			@include phone-only
			{
				position: unset;
				grid-column: 1 / 2;
				grid-row: 1;
				margin: 0 -4px 0 -9px;
				align-self: center;
			}
		}

		.controls
		{
			grid-column: 3;
			grid-row: 1;
			margin: 0 0 0 8px;
			display: flex;
			flex-direction: row;
			gap: 16px;

			font-size: 15px;
			line-height: 20px;

			@include phone-only
			{
				margin: 0;
			}
		}

	}

	.toolbar
	{
		display: flex;
		gap: 16px;
		margin: $paragraph-spacing 0;
	}

</style>

<article id={readonly ? undefined : `Post${post.index}`} class:unread class:compact class:readonly class:alt={post.index % 2 === 0 && !readonly} use:scrollIntoViewAction={{ enabled: scrollIntoView, defer: true }}>
	<div class="post-header">
		{#if !readonly}
			<span class="index"><Button tiny ghost align="left" id="Post{post.index}" href="#Post{post.index}" selectable on:click={onReply} title="Reply">{post.index}</Button></span>
		{/if}
		<h3>
			<span class="user"><User username={post.author} color={unread ? "highlight" : true} /></span> ·&nbsp;<a href="#Post{post.index}" class="stealth" tabindex="-1" on:click|preventDefault><DateTime value={post.posted} relative="times" /></a>
			{#if post.modified}
				{#if post.modifier && post.modifier !== post.author}
					<span class="nobr">(<User username={post.modifier} color /></span> edited
				{:else}
					(edited
				{/if}
				<DateTime value={post.modified} relative="times" />)
			{/if}
		</h3>
		{#if !readonly}
			<div class="controls">
				{#if isWaiting}
					<Wait size={22} />
				{:else if isEditing}
					<!-- Hidden -->
				{:else}
					{#if post.canEdit}
						<Button tiny ghost on:click={onStartEdit}>Edit</Button>
					{/if}
				{/if}
				<Vote value={post.rating} vote={post.vote} disabled={isSameUser($currentUser, post.author)} on:vote={onVote} />
			</div>
		{/if}
	</div>
	{#if isEditing}
		<Editor bind:this={editor} bind:value={editedContent} disabled={isWaiting} afterHeight="56px">
			<div class="toolbar" slot="after" let:uploading>
				<Button on:click={onCommitEdit} disabled={isWaiting || uploading || editedContent.length === 0}>Edit post</Button>
				<Button on:click={onCancelEdit} disabled={isWaiting}>Cancel</Button>
				<div class="flexspacer"></div>
				<Button danger on:click={onDelete} disabled={isWaiting}>Delete</Button>
			</div>
		</Editor>
	{:else}
		<div class:userContent={true}>
			<UserHtml html={post.html} />
		</div>
	{/if}
</article>
