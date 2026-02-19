<script lang="ts">
	import type { Snippet } from "svelte"

	export interface Props
	{
		/**
			A list of file types to accept when the file picker dialog is used, as a string in the same format as the HTML "accept" attribute.
			For example, ".ecw" or "image/*" or ".js,.jsx,.mjs,.ts,.tsx".
			IMPORTANT: This does not affect the files that can be dragged and dropped onto the component; only when the file picker is used.
			@see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
		*/
		accept?: string
		/** If true, the user can also paste anywhere on the page to choose an image. */
		paste?: boolean
		/** If true, just clicking the background also opens the picker. */
		backgroundClick?: boolean
		/** Allows a phone user to capture an image with their camera. Best combined with accept="image/*". On iOS, this will bypass the popup offering choices of file sources and immediately open the camera instead. */
		capture?: "user" | "environment" | undefined
		/** If true, multiple files can be chosen or dropped at once. */
		multiple?: boolean
		/** The text to be shown on the button, if the UI has not been otherwise customized. */
		buttonText?: string | undefined
		/** The text to be shown beneath the button, if the UI has not been otherwise customized. */
		summaryText?: string | undefined
		/** Raised when a file is uploaded or selected by any means. */
		onchange?: () => void
		/** Optional custom content to render in the upload area. */
		children?: Snippet<[{ dragging: boolean, fileCount: number }]>
		/** An optional element to use as the drop curtain instead of the default visuals. */
		curtain?: Snippet
	}

	const {
		accept = "",
		paste = true,
		backgroundClick = false,
		capture,
		multiple = false,
		buttonText,
		summaryText,
		onchange,
		children,
		curtain,
	}: Props = $props()

	// TODO: Pull the drag tracking bits out into its own Action to be used without any visuals

	let root: HTMLElement | undefined = $state()
	let curtainElement: HTMLElement | undefined = $state()
	let filePicker: HTMLInputElement | undefined = $state()
	let files: FileList | null = $state(null)
	let dragging: boolean = $state(false)

	const actualButtonText: string = $derived(buttonText ? buttonText : multiple ? "Choose files" : "Choose a file")

	// @ts-ignore: seems like there's a TypeScript or Svelte bug here causing files to be typed "never"
	const actualSummaryText: string = $derived(summaryText ? summaryText : files ? files.length > 1 ? `${files.length} files` : files[0].name : multiple ? "or drag and drop some here" : "or drag and drop one here")

	/** Programmatically opens the file picker dialog. */
	export function open(): void
	{
		filePicker!.click()
	}

	/** Returns the list of files that were chosen in the file picker or dropped onto the component. */
	export function getFiles(): FileList | null
	{
		return files
	}

	function onClickUpload(ev: MouseEvent)
	{
		ev.preventDefault()
		ev.stopPropagation()
		open()
	}

	function onDragEnter(ev: DragEvent)
	{
		ev.preventDefault()
		ev.stopPropagation()
	}

	function onDragOver(ev: DragEvent)
	{
		if (ev.dataTransfer)
		{
			// To prevent malicious websites from stealing files through accidental drags, the files list isn't available until the drop event.
			const items = ev.dataTransfer.items
			let fileCount: number = 0
			if (items)
			{
				for (let i = 0; i < items.length; i++)
				{
					if (items[i].kind === "file") fileCount++
				}
			}

			if (multiple ? fileCount >= 1 : fileCount === 1)
			{
				ev.dataTransfer.dropEffect = "copy"
				dragging = true
				ev.preventDefault()
				ev.stopPropagation()
			}
		}
	}

	function onDragLeave(ev: DragEvent)
	{
		if (ev.target !== curtainElement) return
		dragging = false

		ev.preventDefault()
		ev.stopPropagation()
	}

	function onDrop(ev: DragEvent)
	{
		dragging = false

		if (ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files.length)
		{
			files = ev.dataTransfer.files
			if (onchange) onchange()

			ev.preventDefault()
			ev.stopPropagation()
		}
	}

	function onPaste(ev: ClipboardEvent): void
	{
		if (ev.clipboardData && ev.clipboardData.files && ev.clipboardData.files.length)
		{
			files = (multiple ? Array.from(ev.clipboardData.files) : [ev.clipboardData.files[0]]) as unknown as FileList
			if (onchange) onchange()

			ev.preventDefault()
			ev.stopPropagation()
		}
	}

	function onFilePickerChange(): void
	{
		if (!filePicker) return

		if (!filePicker.files && !files) return
		files = filePicker.files
		if (onchange) onchange()
	}

</script>

<style>

.drop-zone
{
	display: flex;
	flex-direction: column;
	padding: 2em;

	align-items: center;
	justify-content: center;
	gap: 0.5em;

	border: 3px dashed #c3c3c3;
	background-color: #f6f6f6;

	user-select: none;
}

.curtain
{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	display: flex;

	& > :global(*)
	{
		flex: 1;
		pointer-events: none;
	}
}

.curtain-default
{
	border: 3px solid #81bdeb;
	background-color: #81bdeb30;
}

.root
{
	position: relative;
}

</style>

<svelte:window
	onpaste={paste ? onPaste : undefined}
/>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={root}
	ondragenter={onDragEnter}
	ondragover={onDragOver}
	ondragleave={onDragLeave}
	ondrop={onDrop}
	onclick={backgroundClick ? onClickUpload : undefined}
	class:root={true}
>
	{#if children}{@render children({ dragging, fileCount: files ? files.length : 0 })}{:else}
		<div class:drop-zone={true} class:dragging>
			<button class="button" onclick={onClickUpload}>{actualButtonText}</button>
			<div>{actualSummaryText}</div>
		</div>
	{/if}
	{#if dragging}
		<div bind:this={curtainElement} class:curtain={true}>
			{#if curtain}{@render curtain()}{:else}
				<div class:curtain-default={true}></div>
			{/if}
		</div>
	{/if}
</div>
<input bind:this={filePicker} type="file" {accept} {multiple} {capture} style:display="none" onchange={onFilePickerChange} />
