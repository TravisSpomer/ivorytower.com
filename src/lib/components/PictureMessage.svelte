<script lang="ts">
	import Image from "./Image.svelte"
	
	/** The art to display. */
	export let picture: string
</script>

<style lang="scss">

	.root
	{
		margin: 2em 0;
		display: grid;
		grid-template-columns: (900fr - 250fr) 250fr;
		max-height: 300px;
		aspect-ratio: 900 / 300;

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

<div class="root">
	<div class="content"><div>
		<slot />
	</div></div>
	<Image src="https://images.ivorytower.com/site/art/{picture}" jpg avif hidpi={2}>
		<img src="https://images.ivorytower.com/site/art/{picture}.jpg" alt="" />
	</Image>
</div>
