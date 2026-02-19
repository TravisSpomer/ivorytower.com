<script lang="ts">
	import type { Snippet } from "svelte"
	import type { BasicUser } from "$lib/sdk"
	import { isSameUser } from "$lib/sdk"
	import { users, currentUser } from "$lib/data"

	export interface Props
	{
		/** The username of the user to link to. */
		username: string
		/** If true, the link will get a colored background. If "highlight", it also gets a special highlight color. */
		color?: boolean | "highlight"
		/**
			Raised when the link is clicked. You can use <User onclick={ev => ev.preventDefault()} />
			to prevent the link from navigating to the user's profile normally.
		*/
		onclick?: ((ev: MouseEvent) => void) | undefined
		/** Optional text or other content to render instead of the user's full name. */
		children?: Snippet | undefined
	}

	const {
		username,
		color = false,
		onclick,
		children,
	}: Props = $props()

	const user: BasicUser = $derived($users.getOrPlaceholder(username))
	const isMe: boolean = $derived($currentUser !== null && isSameUser($currentUser.username, username))

</script>

<style>
	a.color
	{
		display: inline-block;
		margin: -.125em;
		padding: .125em;

		font-weight: 600;
		text-decoration: none;
	}

	a.normal
	{
		&
		{
			color: var(--link-special);
			background-color: unset;
		}

		@media (hover: hover) { &:hover
		{
			color: var(--link-special);
			background-color: var(--link-special-background);
		}}
		&:focus-visible, &:active
		{
			color: var(--link-special);
			background-color: var(--link-special-background);
		}
	}

	a.highlight
	{
		&
		{
			color: var(--link-highlight);
			background-color: unset;
		}

		@media (hover: hover) { &:hover
		{
			color: var(--link-highlight);
			background-color: var(--link-highlight-background);
		}}
		&:focus-visible, &:active
		{
			color: var(--link-highlight);
			background-color: var(--link-highlight-background);
		}
	}

	a.me
	{
		&
		{
			color: var(--link-me);
			background-color: unset;
		}

		@media (hover: hover) { &:hover
		{
			color: var(--link-me);
			background-color: var(--link-me-background);
		}}
		&:focus-visible, &:active
		{
			color: var(--link-me);
			background-color: var(--link-me-background);
		}
	}

</style>

<a href="/users/{username}"
	class:color
	class:normal={color === true && !isMe}
	class:highlight={color === "highlight"}
	class:me={color === true && isMe}
	title={children ? user.fullName : undefined}
	{onclick}
>{#if children}{@render children()}{:else}{user.fullName}{/if}</a>
