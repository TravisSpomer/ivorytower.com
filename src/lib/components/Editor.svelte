<script lang="ts">

	import { createEventDispatcher } from "svelte"
	import { fly } from "svelte/transition"
	import { uploadImage } from "$lib/sdk"
	import Button from "./Button.svelte"
	import FocusWithin from "./FocusWithin.svelte"
	import Upload from "./Upload.svelte"
	import Wait from "./Wait.svelte"
	
	const MaxInlineImageWidth = 800
	const MaxInlineImageHeight = 600

	/** If true, the editor should collapse into a single line when empty. */
	export let collapsible: boolean = false
	/** Is true, the editor is disabled. */
	export let disabled: boolean = false
	/** The placeholder for the textbox. */
	export let placeholder: string = ""
	/** The ARIA label for the textbox. */
	export let ariaLabel: string = ""
	/** The text in the textbox. */
	export let value: string = ""
	/** An optional amount of extra space to reserve for the "after" slot when it's not visible, specified in CSS units such as "40px". */
	export let afterHeight: string | undefined = undefined
	
	const dispatch = createEventDispatcher()
	let textarea: HTMLTextAreaElement
	let upload: Upload
	let isUploading: boolean = false

	/** Returns a rudimentary HTML version of the text, converting newlines to BR tags. The rest is performed by the server. */
	export function getHtml(): string
	{
		// TODO: Figure out how to do this in a more Svelte-y way. How do Svelte contentEditable wrappers work?
		return value.replaceAll(/\r\n|\r|\n/g, "<br />")
	}

	/** Focuses the editor. */
	export function focus(options?: Parameters<HTMLTextAreaElement["focus"]>[0]): void
	{
		textarea.focus(options)
	}

	/** Inserts a string at the current cursor position. Will not replace a selection if present. */
	export function insertText(text: string): void
	{
		const pos = Math.min(textarea.selectionStart, textarea.selectionEnd)
		textarea.setRangeText(text, pos, pos, "end")
		value = textarea.value
	}

	/** Replaces the currently selected text if there is any, or otherwise inserts a string at the current cursor position. */
	export function replaceSelection(text: string): void
	{
		textarea.setRangeText(text)
		value = textarea.value
	}

	function onChange(): void
	{
		dispatch("change")
	}

	async function onUpload(_e: CustomEvent): Promise<void>
	{
		const files = upload.getFiles()
		if (!files || files.length === 0) return

		const file = files[0]
		try
		{
			isUploading = true
			const response = await uploadImage(file)
			const img = document.createElement("img")
			img.src = response.image.imageUrl
			img.alt = response.image.title
			img.width = response.image.width
			img.height = response.image.height
			let tag: HTMLElement = img
			if (response.image.width > MaxInlineImageWidth || response.image.height > MaxInlineImageHeight)
			{
				// If the image is too big, wrap it in a link to the full version. Once image lightboxes are supported this won't be
				// necessary, but the old site already does this so we might as well continue for now.
				const link = document.createElement("a")
				link.href = response.image.imageUrl
				link.target = "_blank"
				link.appendChild(img)
				tag = link
			}
			insertText(tag.outerHTML)
		}
		catch (error)
		{
			console.error(error)
		}
		finally
		{
			isUploading = false
		}
	}

</script>

<style lang="scss">
	@import "../../core";

	.root
	{
		position: relative;
	}

	textarea
	{
		display: block;
		width: 100%;
	}

	.curtain
	{
		border: 3px solid var(--accent);
		background-color: var(--accent-glow);
		border-radius: 0.25em;
	}

	.uploading
	{
		position: absolute; 
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		background-color: var(--background-trans);
		border-radius: 0.25em;
	}

	.toolbarcontainer
	{
		min-height: 32px;
	}
	
	.toolbar
	{
		position: absolute;
		display: flex;
		width: 100%;
		align-items: baseline;

		font-size: $font-size-tiny;

		user-select: none;
	}

	.after
	{
		position: absolute;
		width: 100%;
	}

</style>
	
<FocusWithin let:within={isFocused}>
	<div class="root">
		<Upload bind:this={upload} accept="image/*" paste={isFocused} on:change={onUpload}>
			<div class="toolbarcontainer">
				{#if !collapsible || value || isFocused}
					<div class="toolbar" transition:fly|local={{ y: 8 }}>
						<span class="not-phone">
							&lt;a href="https://..."&gt;<u>Link</u>&lt;/a&gt; &nbsp; &lt;b&gt;<b>bold</b>&lt;/b&gt;
						</span>
						<div class="flexspacer"></div>
						<span>
							<Button tiny toolbar on:click={upload.open} {disabled}>Upload an image</Button> or paste or drop
						</span>
					</div>
				{/if}
			</div>
			<textarea
				bind:this={textarea}
				bind:value={value}
				rows={4}
				on:change={onChange}
				placeholder={isFocused ? "" : placeholder}
				disabled={disabled || isUploading}
				aria-label={ariaLabel}
			/>
			<div slot="curtain" class:curtain={true} />
		</Upload>
		{#if isUploading}
			<div class="uploading">
				<Wait />
			</div>
		{/if}
		{#if $$slots.after}
			{#if !collapsible || value || isFocused}
				<div class="after" transition:fly|local={{ y: -20 }}>
					<slot name="after" uploading={isUploading} />
				</div>
			{/if}
		{/if}
	</div>
	{#if afterHeight}
		<div style:height={afterHeight}></div>
	{/if}
</FocusWithin>
