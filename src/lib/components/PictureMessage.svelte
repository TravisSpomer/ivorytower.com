<script lang="ts">
	import type { Snippet } from "svelte"
	import Image from "./Image.svelte"

	export interface Props
	{
		/** The art to display. */
		picture: string
		/** The width of the image. */
		width?: number
		/** The height of the image. */
		height?: number
		/** The text and other content to display next to the picture. */
		children: Snippet
	}

	const {
		picture,
		width = 250,
		height = 300,
		children,
	}: Props = $props()
</script>

<style>

	.root
	{
		margin: 2em 0;
		display: grid;

		.content
		{
			display: grid;
			justify-content: center;
			align-items: center;
			padding: 0 24px;
		}
	}

	/* Styling the <img> requires re-including it as a child of the <Image>. */
	img
	{
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: right;
	}

</style>

<div class="root" style:grid-template-columns="{900 - width}fr {width}fr" style:aspect-ratio="900 / {height}">
	<div class="content"><div>
		{@render children()}
	</div></div>
	<Image src="https://images.ivorytower.com/site/art/{picture}" jpg avif hidpi={2} {width} {height}>
		<img src="https://images.ivorytower.com/site/art/{picture}.jpg" alt="" {width} {height} />
	</Image>
</div>
