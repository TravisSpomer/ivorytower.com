<script lang="ts">

	import { createEventDispatcher } from "svelte"

	/**
		A list of file types to accept when the file picker dialog is used, as a string in the same format as the HTML "accept" attribute.
		For example, ".ecw" or "image/*" or ".js,.jsx,.mjs,.ts,.tsx".
		IMPORTANT: This does not affect the files that can be dragged and dropped onto the component; only when the file picker is used.
		@see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
	*/
	export let accept: string = ""
	/** If true, the user can also paste anywhere on the page to choose an image. */
	export let paste: boolean = true
	/** If true, just clicking the background also opens the picker. */
	export let backgroundClick: boolean = false
	/** Allows a phone user to capture an image with their camera. Best combined with accept="image/*". On iOS, this will bypass the popup offering choices of file sources and immediately open the camera instead. */
	export let capture: "user" | "environment" | undefined = undefined
	/** If true, multiple files can be chosen or dropped at once. */
	export let multiple: boolean = false
	/** The text to be shown on the button, if the UI has not been otherwise customized. */
	export let buttonText: string | undefined = undefined
	/** The text to be shown beneath the button, if the UI has not been otherwise customized. */
	export let summaryText: string | undefined = undefined

	// TODO: Pull the drag tracking bits out into its own Action to be used without any visuals

	let root: HTMLElement
	let curtainElement: HTMLElement
	let filePicker: HTMLInputElement
	let files: FileList | null = null
	let dragging: boolean = false

	let actualButtonText: string
	$: actualButtonText = buttonText ? buttonText : multiple ? "Choose files" : "Choose a file"
	let actualSummaryText: string
	$: actualSummaryText = summaryText ? summaryText : files ? files.length > 1 ? `${files.length} files` : files[0].name : multiple ? "or drag and drop some here" : "or drag and drop one here"

	const dispatch = createEventDispatcher()

	/** Programmatically opens the file picker dialog. */
	export function open(): void
	{
		filePicker.click()
	}

	/** Returns the list of files that were chosen in the file picker or dropped onto the component. */
	export function getFiles(): FileList | null
	{
		return files
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
			raiseOnChange()

			ev.preventDefault()
			ev.stopPropagation()
		}
	}

	function onPaste(ev: ClipboardEvent): void
	{
		if (ev.clipboardData && ev.clipboardData.files && ev.clipboardData.files.length)
		{
			files = (multiple ? Array.from(ev.clipboardData.files) : [ev.clipboardData.files[0]]) as unknown as FileList
			raiseOnChange()

			ev.preventDefault()
			ev.stopPropagation()
		}
	}

	function onFilePickerChange(): void
	{
		if (!filePicker.files && !files) return
		files = filePicker.files
		raiseOnChange()
	}

	function raiseOnChange(): void
	{
		dispatch("change")
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
	on:paste={paste ? onPaste : undefined}
/>

<div
	bind:this={root}
	on:dragenter={onDragEnter}
	on:dragover={onDragOver}
	on:dragleave={onDragLeave}
	on:drop={onDrop}
	on:click|preventDefault|stopPropagation={backgroundClick ? open : undefined}
	class:root={true}
>
	<slot dragging={dragging} fileCount={files ? files.length : 0}>

		<div class:drop-zone={true} class:dragging>
			<button class="button" on:click|preventDefault|stopPropagation={open}>{actualButtonText}</button>
			<div>{actualSummaryText}</div>
		</div>

	</slot>
	{#if dragging}
		<div bind:this={curtainElement} class:curtain={true}>
			<slot name="curtain">
				<div class:curtain-default={true}></div>
			</slot>
		</div>
	{/if}
</div>
<input bind:this={filePicker} type="file" {accept} {multiple} {capture} style="display: none;" on:change={onFilePickerChange} />
