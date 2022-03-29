<script context="module" lang="ts">
	import type { Forum } from "$lib/sdk"
	import Badge from "./Badge.svelte"
	import DateTime from "./DateTime.svelte"
</script>

<script lang="ts">
	/** The forum to render. */
	export let forum: Forum
</script>

<style lang="scss">
	@import "../../core";

	ul
	{
		margin: 0 ($indent * -0.5);
		padding: 0;
	}

	li
	{
		list-style: none;
		margin: 0;

		a
		{
			text-decoration: none;
			padding: 0 ($indent * 0.5);
		}
	}

	li.folder
	{
		margin: 0 0 2px 0;

		& > a
		{
			display: flex;
			flex-direction: column;
			height: 78px;
			justify-content: center;

			transition: background-color 125ms ease;

			@include rest
			{
				background-color: var(--alt-listitem-background);
			}

			@include hover
			{
				background-color: var(--alt-listitem-background-hover);

				.title
				{
					text-decoration: underline;
				}
				.title::after
				{
					color: var(--alt-listitem-foreground);
					text-decoration: none;
					opacity: 1;

					translate: 0.125em 0;
				}
			}

			@include pressed
			{
				background-color: var(--alt-listitem-background-pressed);
			}
		}

		.title
		{
			color: var(--alt-listitem-foreground);

			font-size: 28px;
			line-height: 40px;
			font-weight: $font-weight-bold;

			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			&::after
			{
				display: inline-block;
				content: "›";
				margin-left: 0.25em;

				color: var(--alt-listitem-secondary-foreground);
				opacity: 0.5;

				transition: translate 125ms ease;
			}
		}

		.description
		{
			margin-bottom: 0.25em; /* Helps balance the large inherent spacing of the title text */

			color: var(--alt-listitem-secondary-foreground);

			font-size: $font-size-compact;
			line-height: $line-height-compact;

			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	li.thread
	{
		& > a
		{
			display: grid;
			grid-template-columns: [icon] 24px [title] 1fr [modified] auto;
			gap: 12px;
			height: 40px;
			align-items: center;

			border-width: 0 0 1px 0;
			border-style: solid;
			border-color: var(--listitem-border);

			@include phone-only
			{
				grid-template-columns: [icon] 24px [title] 1fr;
			}

			@include rest
			{
				background-color: var(--listitem-background);
			}

			@include hover
			{
				background-color: var(--listitem-background-hover);
			}

			@include pressed
			{
				background-color: var(--listitem-background-pressed);
			}
		}

		&.unread > a
		{
			border-color: var(--highlight-listitem-border);

			@include rest
			{
				background-color: var(--highlight-listitem-background);
			}

			@include hover
			{
				background-color: var(--highlight-listitem-background-hover);
			}

			@include pressed
			{
				background-color: var(--highlight-listitem-background-pressed);
			}

			.title
			{
				color: var(--highlight-listitem-foreground);
			}

			.modified
			{
				color: var(--highlight-listitem-secondary-foreground);
			}
		}

		.count
		{
			grid-column: icon;
		}

		.title
		{
			grid-column: title;
			color: var(--listitem-foreground);

			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.modified
		{
			grid-column: modified;
			color: var(--listitem-secondary-foreground);
			font-size: $font-size-compact;

			@include phone-only
			{
				display: none;
			}
		}

	}

</style>

<ul>
	{#if forum.forums}
		{#each forum.forums as childForum (forum.id)}
			<li class="folder"><a href="/forums/{childForum.id}">
				<div class="title">{childForum.title}</div>
				<div class="description">{childForum.description || ""}</div>
			</a></li>
		{/each}
	{/if}

	{#if forum.threads}
		{#each forum.threads as thread (thread.id)}
			<li class:thread={true} class:unread={thread.unread > 0}><a href="/threads/{thread.id}">
				{#if thread.unread > 0}
					<div class="count"><Badge value={thread.unread} /></div>
				{/if}
				<div class="title">{thread.title}</div>
				<div class="modified"><DateTime value={thread.modified} relative="times" /></div>
			</a></li>
		{/each}
	{/if}
</ul>