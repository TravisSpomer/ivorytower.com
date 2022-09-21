<script lang="ts">
	/*
		This class can be used as a drop-in replacement for the <img> tag. Just replace <img> with <Image> and
		move the file extensions to attributes. That's all you need to do if you don't need to style the <img>.

		<Image src="/images/nyan-cat" jpg avif alt="Alt text" width={200} height={200} />

		If you do need to style the image, *wrap* the <img> tag in <Image>, and include the filename and file
		extensions on the wrapper <Image>.

		<Image src="/images/nyan-cat" jpg avif>
			<img class="style-me" src="/images/nyan-cat.jpg" alt="Alt text" width="200" height="200" />
		</Image>

		REVIEW: Other components work around this by letting you supply a class name and/or fit and position properties.
	*/

	/** The path to the image, without an extension. */
	export let src: string
	/** Alternative text. */
	export let alt: string = ""
	/** The image width. */
	export let width: number | null = null
	/** The image height. */
	export let height: number | null = null
	/** If true, the base image is available in JPEG format. */
	export let jpg: boolean = false
	/** If true, the base image is available in PNG format. */
	export let png: boolean = false
	/** If true, the image is also available in AVIF format. */
	export let avif: boolean = false
	/** If true, the image is also available in WebP format. */
	export let webp: boolean = false
	/** If 2, the image is also available in 2x high-DPI formats. */
	export let hidpi: 2 | null = null

	$: encodedSrc = src.replace(/ /g, "%20")
	$: ext = jpg ? ".jpg" : png ? ".png" : ""
</script>

<picture>
	{#if avif}
		<source srcset={hidpi ? `${encodedSrc}-2x.avif 2x, ${encodedSrc}.avif` : `${encodedSrc}.avif`} type="image/avif" />
	{/if}
	{#if webp}
		<source srcset={hidpi ? `${encodedSrc}-2x.webp 2x, ${encodedSrc}.webp` : `${encodedSrc}.webp`} type="image/webp" />
	{/if}
	<slot>
		<img srcset={hidpi ? `${encodedSrc}-2x${ext} 2x` : undefined} src="{src}{ext}" {alt} {width} {height} />
	</slot>
</picture>
