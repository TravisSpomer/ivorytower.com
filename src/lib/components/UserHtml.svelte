<script lang="ts">
	import { upgradeLink } from "./upgradeLink"

	const emoPath = /^Bitmaps\/Emo\/([a-zA-Z]+)\.png$/
	const emoEquivalents: Record<string, string> =
	{
		Cylon: "🤖",
		Emo: "😞",
		Frown: "🙁",
		Gasp: "😮",
		Grin: "😁",
		Glare: "😑",
		Harlequin: "🤡",
		Heart: "♥",
		HeartBroken: "💔",
		Jmote: "😇",
		Nyan: "🌈",
		Pleased: "😊",
		Silly: "😝",
		Smiley: "🙂",
		TMYK: "🌈🌟",
		USA: "🇺🇸",
		Unsure: "😕",
		Wince: "😣",
		Wink: "😉",
	}

	/**
		The HTML to render (fancily).
		IMPORTANT: Never use this with untrusted input, just as with Svelte's {@html} expression.
	*/
	export let html: string

	let root: HTMLDivElement
	let nodes: Node[] | undefined

	$: if (html)
	{
		const tempDoc = (new DOMParser()).parseFromString(html, "text/html")

		// Process images
		tempDoc.querySelectorAll<HTMLImageElement>("img").forEach(img =>
		{
			// Fix up emojis from old versions of IvoryTower.
			// This code is temporary until the old posts are replaced in the database.
			if (img.classList.contains("emo"))
			{
				const src = img.getAttribute("src") // img.src is an absolute URL thus harder to match
				if (src)
				{
					const match = emoPath.exec(src)
					if (match)
					{
						const emoji = emoEquivalents[match[1]]
						if (emoji)
						{
							img.replaceWith(document.createTextNode(emoji))
							// Since this node is now dead, bail out of the forEach and continue onward without doing more processing.
							return
						}
					}
				}
			}

			// For all user images, add a few properties for performance.
			img.decoding = "async"
			img.loading = "lazy"
		})

		// Activate magic forums hover links
		tempDoc.querySelectorAll("a").forEach(upgradeLink)

		// Once all fancification is complete, move all of the elements we have left to the real tree.
		// Note that appendChild modifies childNodes while iterating, so we need to make a copy of the list before changing it or we end up losing half of the nodes.
		nodes = Array.from(tempDoc.body.childNodes)
	}

	$: if (root && nodes)
	{
		nodes.forEach(child => root.appendChild(child))
	}
</script>

<style lang="scss">

</style>

<div bind:this={root} />
