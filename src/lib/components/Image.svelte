<script lang="ts">
	import type { Snippet } from "svelte"

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

	export interface Props
	{
		/** The path to the image, without an extension. */
		src: string
		/** Alternative text. */
		alt?: string
		/** The image width. */
		width?: number | null
		/** The image height. */
		height?: number | null
		/** If true, the base image is available in JPEG format. */
		jpg?: boolean
		/** If true, the base image is available in PNG format. */
		png?: boolean
		/** If true, the image is also available in AVIF format. */
		avif?: boolean
		/** If true, the image is also available in WebP format. */
		webp?: boolean
		/** If 2, the image is also available in 2x high-DPI formats. */
		hidpi?: 2 | null
		/** Optionally, a custom-styled img tag to render. */
		children?: Snippet
	}

	const {
		src,
		alt = "",
		width = null,
		height = null,
		jpg = false,
		png = false,
		avif = false,
		webp = false,
		hidpi = null,
		children
	}: Props = $props()

	const encodedSrc = $derived(src.replace(/ /g, "%20"))
	const ext = $derived(jpg ? ".jpg" : png ? ".png" : "")
</script>

<picture>
	{#if avif}
		<source srcset={hidpi ? `${encodedSrc}-2x.avif 2x, ${encodedSrc}.avif` : `${encodedSrc}.avif`} type="image/avif" />
	{/if}
	{#if webp}
		<source srcset={hidpi ? `${encodedSrc}-2x.webp 2x, ${encodedSrc}.webp` : `${encodedSrc}.webp`} type="image/webp" />
	{/if}
	{#if children}{@render children()}{:else}
		<img srcset={hidpi ? `${encodedSrc}-2x${ext} 2x` : undefined} src="{src}{ext}" {alt} {width} {height} />
	{/if}
</picture>
