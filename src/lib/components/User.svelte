<script lang="ts">
	import type { BasicUser } from "$lib/sdk"
	import { isSameUser } from "$lib/sdk"
	import { users, currentUser } from "$lib/data"

	/** The username of the user to link to. */
	export let username: string
	/** If true, the link will get a colored background. If "highlight", it also gets a special highlight color. */
	export let color: boolean | "highlight" = false

	let user: BasicUser
	$: user = $users.getOrPlaceholder(username)
	let isMe: boolean
	$: isMe = $currentUser !== null && isSameUser($currentUser.username, username)

	/*
		Tip: This component forwards the click event from the link to the parent component. You can use
		<User on:click={ev => ev.preventDefault()} /> to prevent the link from navigating to the user's profile normally.
	*/
</script>

<style lang="scss">
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
		color: var(--link-special);

		&:hover
		{
			background-color: var(--link-special-background);
		}
	}

	a.highlight
	{
		color: var(--link-highlight);
		
		&:hover
		{
			background-color: var(--link-highlight-background);
		}
	}

	a.me
	{
		color: var(--link-me);

		&:hover
		{
			background-color: var(--link-me-background);
		}
	}

</style>

<a href="/users/{username}"
	class:color
	class:normal={color === true && !isMe}
	class:highlight={color === "highlight"}
	class:me={color === true && isMe}
	title={$$slots.default ? user.fullName : undefined}
	on:click
><slot>{user.fullName}</slot></a>
