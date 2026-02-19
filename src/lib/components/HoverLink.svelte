<script lang="ts">
	import type { Snippet } from "svelte"
	import { run, createBubbler, preventDefault } from "svelte/legacy"

	const bubble = createBubbler()

	export interface Props
	{
		/** The destination of the link. */
		href: string
		/** Optionally, runtime child elements to render. */
		childNodes?: NodeList | undefined
		/** If false, the link won't actually navigate to the link on click. */
		navigate?: boolean
		/** The content to render in the link. */
		children?: Snippet
	}

	const {
		href,
		childNodes,
		navigate = true,
		children,
	}: Props = $props()

	let element: Readonly<HTMLAnchorElement> | undefined = $state()
	let childrenCopy: Node[] | undefined = $state()

	run(() =>
	{
		if (element && childNodes)
		{
			// Important: A NodeList won't survive hot reloads, so you need to reload the whole page each time you change this component's code.
			childrenCopy = Array.from(childNodes)
			childrenCopy.forEach(child => element!.appendChild(child))
		}
	})
</script>

<style>
	a, a:visited
	{
		text-underline-offset: 0.1em;

		&
		{
			color: var(--link-special);
			text-decoration-style: dotted;
			text-decoration-color: var(--link-special);
		}

		@media (hover: hover) { &:hover
		{
			color: var(--link-special);
			text-decoration-style: solid;
			text-decoration-color: var(--link-special);
		}}
		&:focus-visible, &:active
		{
			color: var(--link-special);
			text-decoration-style: solid;
			text-decoration-color: var(--link-special);
		}
	}

</style>

{#if navigate}
	<a bind:this={element} {href} onclick={bubble("click")}>
		{#if element && !childNodes}{#if children}{@render children()}{:else}{href}{/if}{/if}
	</a>
{:else}
	<a bind:this={element} {href} onclick={preventDefault(bubble("click"))}>
		{#if element && !childNodes}{#if children}{@render children()}{:else}{href}{/if}{/if}
	</a>
{/if}
