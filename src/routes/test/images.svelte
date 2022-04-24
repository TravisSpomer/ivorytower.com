<script lang="ts">
	import { PostView } from "$lib/components"
	import { currentUser } from "$lib/data"

	const testCases: string[] =
	[
		`<p>Large landscape without width and height</p><p><img src="https://images.unsplash.com/photo-1648737119359-510d4f551382" /></p>`,
		`<p>Large landscape with explicit width and height</p><p><img src="https://images.unsplash.com/photo-1648737119359-510d4f551382" width="6048" height="4024" /></p>`,
		`<p>Large portrait without width and height</p><p><img src="https://images.unsplash.com/photo-1621569898825-ef12e7592f94" /></p>`,
		`<p>Large portrait with explicit width and height</p><p><img src="https://images.unsplash.com/photo-1621569898825-ef12e7592f94" width="3456" height="4608" /></p>`,
	]
</script>

<style lang="scss">

.posts
{
	:global(img)
	{
		background-image: repeating-linear-gradient(-45deg, var(--grey-light4), var(--grey-light4) 8px, var(--grey-light2) 8px, var(--grey-light2) 16px);
	}
}

</style>

<h1>Images big and small</h1>

<div class="posts">

{#each testCases as html, i (i)}
	<PostView readonly post={{
		index: i,
		id: i,
		author: $currentUser?.username || "",
		html: html,
		posted: new Date(),
		vote: null,
		canEdit: false,
	}} />
{/each}

</div>