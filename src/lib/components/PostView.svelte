<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import { castVote, isSameUser, editPost, deletePost, getPostByID } from "$lib/sdk"
	import type { Post } from "$lib/sdk"
	import { currentUser } from "$lib/data"
	import { scrollIntoView as scrollIntoViewAction } from "$lib/utils/actions"
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
			editedContent = (await getPostByID(post.id, { original: true })).post.html
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

	function onReply(): void
	{
		dispatch("reply", { post: post })
	}
</script>

<style lang="scss">
	@import "../../core.scss";

	article
	{
		position: relative;
		margin: 0 -1em;
		padding: 0.5em 1em;

		&.compact
		{
			font-size: $font-size-compact;
			line-height: $line-height-compact;
			font-weight: $font-weight-compact;

			h3
			{
				font-size: $font-size;
				line-height: $line-height-multiple;
				font-weight: $font-weight-bold;
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
				max-width: 800px;
				max-height: 600px;
				object-fit: contain;
			}
		}
	}

	.post-header
	{
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		gap: 12px;

		h3
		{
			flex: 1;
			margin: 0 0 0.25em 0;

			color: var(--grey);
			font-size: $font-size-compact;
			line-height: $line-height-multiple-compact;

			.user
			{
				font-size: 21px;
			}
		}

		a.index
		{
			flex: none;
			position: absolute;

			left: -32px;
			top: 14px;
			width: 40px;
			margin: -4px;
			padding: 4px;

			color: var(--grey);
			text-align: right;
			font-size: $font-size-tiny;
			line-height: $line-height-multiple-tiny;
			text-decoration: none;

			@media (max-width: ($full-width + 160px))
			{
				position: unset;
				order: 1;
				margin: 3px 0 0 0;

				&::before
				{
					content: "#";
					margin-right: 2px;
					opacity: 0.6;
				}
			}

			@include rest
			{
				color: var(--grey);
				background-color: transparent;
			}

			@include hover
			{
				color: var(--primary);
				background-color: var(--primary-light4);
			}
		}

		.controls
		{
			flex: none;
			margin: 6px 0 0 0;
			display: flex;
			flex-direction: row;

			font-size: 15px;
			line-height: 20px;

			@media (max-width: ($full-width + 160px))
			{
				right: 60px;
			}

			button
			{
				all: initial;
				box-sizing: border-box;

				height: 22px;
				padding: 0 4px;
				margin-right: 16px;

				border: 1px solid transparent;

				color: var(--grey);
				font: inherit;
				font-size: 15px;
				line-height: 20px;

				cursor: pointer;
				user-select: none;

				@include rest
				{
					color: var(--grey);
					background-color: transparent;
				}

				@include hover
				{
					color: var(--background);
					background-color: var(--grey-dark1);
				}

				@include disabled
				{
					color: var(--grey);
					background-color: transparent;
					opacity: 0.3;
					cursor: default;
				}
			}
		}

	}

	.toolbar
	{
		display: flex;
		gap: 16px;
	}

</style>

<article id={readonly ? undefined : `Post${post.index}`} class:unread class:compact use:scrollIntoViewAction={{ enabled: scrollIntoView, defer: true }}>
	<div class="post-header">
		{#if !readonly}
			<a id="Post{post.index}" href="#Post{post.index}" class="index" on:click|preventDefault={onReply} title="Reply">{post.index}</a>
		{/if}
		<h3>
			<span class="user"><User username={post.author} color={unread ? "highlight" : true} /></span> ·&nbsp;<DateTime value={post.posted} relative="times" />
			{#if post.modified}
				{#if post.modifier && post.modifier !== post.author}
					<span class="nobr">(<User username={post.modifier} color={unread ? "highlight" : true} /></span> edited
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
						<button on:click|preventDefault={onStartEdit}>Edit</button>
					{/if}
				{/if}
				<Vote value={post.rating} vote={post.vote} disabled={isSameUser($currentUser, post.author)} on:vote={onVote} />
			</div>
		{/if}
	</div>
	{#if isEditing}
		<Editor bind:this={editor} bind:value={editedContent} disabled={isWaiting}>
			<div class="toolbar" slot="after" let:uploading>
				<button class:button={true} on:click={onCommitEdit} disabled={isWaiting || uploading || editedContent.length === 0}>Edit post</button>
				<button class:button={true} on:click={onCancelEdit} disabled={isWaiting}>Cancel</button>
				<div class="flexspacer"></div>
				<button class:button={true} class:danger={true} on:click={onDelete} disabled={isWaiting}>Delete</button>
			</div>
		</Editor>
	{:else}
		<div class:userContent={true}>
			<UserHtml html={post.html} />
		</div>
	{/if}
</article>
