<script lang="ts">
	// TODO: Manually upgrade to Svelte 5

	import { onMount } from "svelte"

	/** When the current page location matches this href, the "current" prop on the outer component is set to true. */
	export let href: string
	/** If true, the "current" prop will also be true if the link points to a parent of the current page. */
	export let allowChildren: boolean = false
	/** If true, the query strings (searches) of the URLs will be ignored. */
	export let ignoreQuery: boolean = true
	/** If true, the hashes (anchors) of the URLs will be ignored. */
	export let ignoreHash: boolean = true

	let current: boolean = false

	function checkMatch(): void
	{
		current = urlsMatch(location.href, href, allowChildren, ignoreQuery, ignoreHash)
	}
	onMount(checkMatch)

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

<svelte:window on:sveltekit:navigation-end={checkMatch} />

<slot current={current} />
