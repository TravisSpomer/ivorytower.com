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
	@import "../../core";

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
				max-width: 800px;
				max-height: 600px;
				object-fit: contain;
			}
		}
	}

	.ghost-button
	{
		margin: -4px;
		padding: 2px 7px;
	
		border: 1px solid transparent;
		border-radius: 0.25em;

		font: inherit;
		font-size: $font-size-tiny;
		line-height: $line-height-tiny;
		text-decoration: none;

		cursor: pointer;

		transition: background-color 750ms cubic-bezier(.1, .7, .3, 1);

		@include rest
		{
			color: var(--ghost-control-foreground);
			background-color: var(--ghost-control-background);
			border-color: var(--ghost-control-border);
		}

		@include hover
		{
			color: var(--ghost-control-foreground-hover);
			background-color: var(--ghost-control-background-hover);
			border-color: var(--ghost-control-border-hover);

			transition: background-color 67ms cubic-bezier(.1, .7, .3, 1);
		}

		@include pressed
		{
			color: var(--ghost-control-foreground-pressed);
			background-color: var(--ghost-control-background-pressed);
			border-color: var(--ghost-control-border-pressed);
		}

		@include disabled
		{
			color: var(--ghost-control-foreground);
			background-color: var(--ghost-control-background);
			border-color: var(--ghost-control-border);
			opacity: 0.3;

			cursor: not-allowed;
		}
	}

	.post-header
	{
		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-template-rows: auto auto;
		align-items: start;
		gap: 0 4px;
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

		a.index
		{
			position: absolute;

			left: -36px;
			top: 17px;
			width: 48px;

			text-align: right;

			@media (max-width: ($full-width + 160px))
			{
				position: unset;
				grid-column: 1;
				grid-row: 1;
				margin: 3px -4px -2px -4px;
				
				text-align: left;
			}

			@include phone-only
			{
				position: unset;
				grid-column: 1 / 2;
				grid-row: 1;
				margin: 0 -4px;
				padding: 0 4px;
				align-self: center;
				
				text-align: left;
			}
		}

		.controls
		{
			grid-column: 3;
			grid-row: 1;
			margin: 6px 0 0 8px;
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
	}

	button
	{
		all: initial;
		box-sizing: border-box;

		user-select: none;
	}

</style>

<article id={readonly ? undefined : `Post${post.index}`} class:unread class:compact use:scrollIntoViewAction={{ enabled: scrollIntoView, defer: true }}>
	<div class="post-header">
		{#if !readonly}
			<a id="Post{post.index}" href="#Post{post.index}" class="index ghost-button" on:click|preventDefault={onReply} title="Reply">{post.index}</a>
		{/if}
		<h3>
			<span class="user"><User username={post.author} color={unread ? "highlight" : true} /></span> ·&nbsp;<DateTime value={post.posted} relative="times" />
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
						<button class="ghost-button" on:click|preventDefault={onStartEdit}>Edit</button>
					{/if}
				{/if}
				<Vote value={post.rating} vote={post.vote} disabled={isSameUser($currentUser, post.author)} on:vote={onVote} />
			</div>
		{/if}
	</div>
	{#if isEditing}
		<Editor bind:this={editor} bind:value={editedContent} disabled={isWaiting}>
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
