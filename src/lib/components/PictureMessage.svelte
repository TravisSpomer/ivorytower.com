<script lang="ts">
	import Image from "./Image.svelte"
	
	/** The art to display. */
	export let picture: string
	/** The width of the image. */
	export let width: number = 250
	/** The height of the image. */
	export let height: number = 300
</script>

<style lang="scss">

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

		:global(.theme-dark) &
		{
			opacity: 0.8;
		}
	}

</style>

<div class="root" style:grid-template-columns="{900 - width}fr {width}fr" style:aspect-ratio="900 / {height}">
	<div class="content"><div>
		<slot />
	</div></div>
	<Image src="https://images.ivorytower.com/site/art/{picture}" jpg avif hidpi={2}>
		<img src="https://images.ivorytower.com/site/art/{picture}.jpg" alt="" />
	</Image>
</div>
