<script lang="ts">
	/** The destination of the link. */
	export let href: string
	/** Optionally, child elements to render. */
	export let children: NodeList | undefined = undefined

	let element: Readonly<HTMLAnchorElement>
	let childrenCopy: Node[] | undefined

	$: if (element && children)
	{
		// Important: A NodeList won't survive hot reloads, so you need to reload the whole page each time you change this component's code.
		childrenCopy = Array.from(children)
		childrenCopy.forEach(child => element.appendChild(child))
	}
</script>

<style lang="scss">
	@import "../../core";

	a, a:visited
	{
		text-underline-offset: 0.1em;

		@include rest
		{
			color: var(--link-special);
			text-decoration-style: dotted;
			text-decoration-color: var(--link-special);
		}

		@include hover
		{
			color: var(--link-special);
			text-decoration-style: solid;
			text-decoration-color: var(--link-special);
		}
	}

</style>

<a bind:this={element} {href}>
	{#if element && !children}<slot>{href}</slot>{/if}
</a>
