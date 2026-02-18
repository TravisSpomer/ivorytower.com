<script lang="ts">
	/** The destination of the link. */
	export let href: string
	/** Optionally, child elements to render. */
	export let childNodes: NodeList | undefined = undefined
	/** If false, the link won't actually navigate to the link on click. */
	export let navigate: boolean = true

	let element: Readonly<HTMLAnchorElement>
	let childrenCopy: Node[] | undefined

	$: if (element && childNodes)
	{
		// Important: A NodeList won't survive hot reloads, so you need to reload the whole page each time you change this component's code.
		childrenCopy = Array.from(childNodes)
		childrenCopy.forEach(child => element.appendChild(child))
	}
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
	<a bind:this={element} {href} on:click>
		{#if element && !childNodes}<slot>{href}</slot>{/if}
	</a>
{:else}
	<a bind:this={element} {href} on:click|preventDefault>
		{#if element && !childNodes}<slot>{href}</slot>{/if}
	</a>
{/if}
