<!--
	Lets you quickly make styling choices in a layout based on the user's current location. For example, you could make nav bar links bold when the user
	is already in that section of the site.

	Usage:
	<WhenAt href="/help" allowChildren>
		{#snippet children({ current })}
			<div style:font-weight={current ? "bold" : "unset"}>Help</div>
		{/snippet}
	</WhenAt>

	Note that the content is rendered regardless of the match! (allowChildren tests for /help and /help/page1; if false, it would only test for /help.)
-->

<script lang="ts">
	import type { Snippet } from "svelte"
	import type { AfterNavigate } from "@sveltejs/kit"
	import { onMount } from "svelte"
	import { afterNavigate } from "$app/navigation"

	interface Props {
		/** When the current page location matches this href, the "current" prop on the snippet is set to true. */
		href: string
		/** If true, the "current" prop will also be true if the link points to a parent of the current page. */
		allowChildren?: boolean
		/** If true, the query strings (searches) of the URLs will be ignored. */
		ignoreQuery?: boolean
		/** If true, the hashes (anchors) of the URLs will be ignored. */
		ignoreHash?: boolean
		/** The content to render, regardless of whether the current page location is a match. */
		children: Snippet<[{current: boolean}]>
	}

	const {
		href,
		allowChildren = false,
		ignoreQuery = true,
		ignoreHash = true,
		children,
	}: Props = $props()

	let current: boolean = $state(false)

	function checkMatch(_navigation?: AfterNavigate): void
	{
		current = urlsMatch(location.href, href, allowChildren, ignoreQuery, ignoreHash)
		console.log("checkMatch", current)
	}
	onMount(checkMatch)
	afterNavigate(checkMatch)

	/**
		Tests to see if two URLs are approximately equal.
		@param base The "base" URL to use in the test, most likely location.href. It should ideally be an absolute URL.
		@param test The URL to test, such as one from a nav bar link. It can be absolute or relative.
		@param allowChildren If true, the function will return true if the base path is a child of the test path.
		@param ignoreQuery If false, query strings (searches) will be ignored.
		@param ignoreHash If false, hashes (anchors) will be ignored.
		@returns True if the two URLs are approximately equal.
	*/
	// eslint-disable-next-line @typescript-eslint/no-shadow
	function urlsMatch(base: string, test: string, allowChildren: boolean = false, ignoreQuery: boolean = true, ignoreHash: boolean = true): boolean
	{
		const baseUrl = new URL(base)
		if (baseUrl.pathname.endsWith("/")) baseUrl.pathname = baseUrl.pathname.substring(0, baseUrl.pathname.length - 1)
		const testUrl = new URL(test, baseUrl)
		if (testUrl.pathname.endsWith("/")) testUrl.pathname = testUrl.pathname.substring(0, testUrl.pathname.length - 1)

		return (
			baseUrl.host === testUrl.host &&
			(allowChildren ? baseUrl.pathname.startsWith(testUrl.pathname) && (baseUrl.pathname.length === testUrl.pathname.length || baseUrl.pathname[testUrl.pathname.length] === "/") : baseUrl.pathname === testUrl.pathname) &&
			(ignoreQuery || baseUrl.search === testUrl.search) &&
			(ignoreHash || baseUrl.hash === testUrl.hash)
		)
	}
</script>

{@render children({ current })}
