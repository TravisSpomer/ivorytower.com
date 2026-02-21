<script lang="ts">
	import type { Snippet } from "svelte"
	import { onMount, onDestroy } from "svelte"
	import { fly } from "svelte/transition"
	import { throttle } from "@travisspomer/tidbits"
	import { Editor, Extension, getMarkRange, getMarkType, posToDOMRect } from "@tiptap/core"
	import BulletList from "@tiptap/extension-bullet-list"
	import Color from "@tiptap/extension-color"
	import FontFamily from "@tiptap/extension-font-family"
	import LinkExtension from "@tiptap/extension-link"
	import Image from "@tiptap/extension-image"
	import Placeholder from "@tiptap/extension-placeholder"
	import StarterKit from "@tiptap/starter-kit"
	import Table from "@tiptap/extension-table"
	import TableCell from "@tiptap/extension-table-cell"
	import TableHeader from "@tiptap/extension-table-header"
	import TableRow from "@tiptap/extension-table-row"
	import Typography from "@tiptap/extension-typography"
	import { Bold, Italic, ClearFormat, Link, UploadImage } from "$lib/icons"
	import { uploadImage } from "$lib/sdk"
	import { expandUserUrl } from "$lib/utils/url"
	import Button from "./Button.svelte"
	import FocusWithin from "./FocusWithin.svelte"
	import PopupFrame from "./PopupFrame.svelte"
	import Upload from "./Upload.svelte"
	import Wait from "./Wait.svelte"

	// IMPORTANT: When using this from a page component that can navigate to itself (/threads/1 to /threads/2),
	// you should wrap use of Editor in a {#key} block so that it is recreated instead of reused.

	const AutoSaveInterval = 5 * 1000 /* = 5 seconds */
	const MaxDraftAge = 1 * 24 * 60 * 60 * 1000 /* = 1 day */
	const MaxInlineImageWidth = 800
	const MaxInlineImageHeight = 600
	const LinkUXWidth = 200

	export interface Props
	{
		/** If true, the editor should collapse into a single line when empty. */
		collapsible?: boolean
		/** Is true, the editor is disabled. */
		disabled?: boolean
		/** The placeholder for the textbox. */
		placeholder?: string
		/** The ARIA label for the textbox. */
		ariaLabel?: string
		/** An optional amount of extra space to reserve for the "after" slot when it's not visible, specified in CSS units such as "40px". */
		afterHeight?: string | undefined
		/** A string that uniquely identifies this editor. If this is not specified, autosaving of drafts is not enabled. */
		sitewideUniqueID?: string | undefined
		/** True if there's no content in the editor. Read-only. */
		isEmpty?: Readonly<boolean>
		/** Raised immediately when the content changes. */
		onchange?: (() => void) | undefined
		/** Optional content to render after the editor. */
		after?: Snippet<[{ uploading: boolean }]> | undefined
	}

	let {
		collapsible = false,
		disabled = false,
		placeholder = "",
		ariaLabel = "",
		afterHeight,
		sitewideUniqueID,
		isEmpty = $bindable(true),
		onchange,
		after,
	}: Props = $props()

	let element: HTMLDivElement | undefined = $state()
	let editor: Editor | undefined = $state()
	let initialHTML: string | undefined
	let upload: Upload | undefined = $state()
	let isUploading: boolean = $state(false)

	let linkEditor: HTMLInputElement | undefined = $state()
	let isLinkEditorOpen: boolean = $state(false)
	let linkEditorHref: string = $state("")
	let linkEditorX: number = $state(0), linkEditorY: number = $state(0)

	const storageKeyPrefix = "Draft for "
	const storageAgeKeyPrefix = "Draft age of "

	onMount(() => setTimeout(clearStaleDrafts))
	onDestroy(saveDraft)

	const throttledSaveDraft = throttle(AutoSaveInterval, saveDraft)

	onMount(() =>
	{
		const LinkUXExtension = Extension.create({
			name: "LinkUXExtension",
			addKeyboardShortcuts()
			{
				return {
					"Mod-k": onLink,
				}
			},
			onTransaction(props)
			{
				if (props.editor.isActive("link"))
				{
					const linkRange = getMarkRange(props.editor.state.selection.$anchor, getMarkType("link", props.editor.state.schema))
					if (linkRange)
					{
						const linkRect = posToDOMRect(props.editor.view, linkRange.from, linkRange.to)
						const editorRect = element!.getBoundingClientRect()
						linkEditorX = Math.min(linkRect.left - editorRect.left, Math.max(0, editorRect.width - LinkUXWidth))
						linkEditorY = linkRect.bottom - editorRect.top

						linkEditorHref = props.editor.getAttributes("link").href

						isLinkEditorOpen = true
					}
					else
					{
						isLinkEditorOpen = false
					}
				}
				else
				{
					isLinkEditorOpen = false
					// FUTURE: Handle the case where we're inserting a link and the selection is empty
				}
			},
		})

		editor = new Editor({
			element: element,
			extensions: [
				StarterKit.configure({
					// We include the bulleted list extension manually later so we can configure it.
					bulletList: false,
				}),
				BulletList.extend({
					addKeyboardShortcuts()
					{
						return {
							"Mod-.": () => this.editor.chain().focus().toggleBulletList().run(),
						}
					},
				}),
				Color,
				FontFamily,
				Image,
				LinkExtension.extend({
					inclusive: false,
				}).configure({
					openOnClick: false,
					autolink: true,
					defaultProtocol: "https",
					protocols: ["http", "https"] }),
				LinkUXExtension,
				Placeholder.configure({
					placeholder: placeholder,
				}),
				Table,
				TableCell,
				TableHeader,
				TableRow,
				Typography,
			],
			content: initialHTML,
			onTransaction(props)
			{
				// Force re-render so things bound to editor.isActive are updated
				// https://tiptap.dev/docs/editor/getting-started/install/svelte
				editor = editor!

				if (!props.transaction.docChanged) return
				isEmpty = editor.isEmpty
				if (onchange) onchange()
				throttledSaveDraft()
			},
		})
		initialHTML = undefined
		isEmpty = editor.isEmpty
		loadDraft()
	})

	/**
		Returns the editor contents as HTML.
		If you use this value to perform an action that affects the server, you probably want to call discardDraft() after this.
	*/
	export function getHTML(): string
	{
		if (!editor || editor.isDestroyed)
		{
			console.warn("Tried to get Editor's contents but there was no contentEditable element")
			return ""
		}
		const html = editor.isEmpty ? "" : editor.getHTML()
		return html
	}

	/**
		Replaces the entire contents of the editor with new HTML.
		(In theory this is redundant to just setting the value property, but this component doesn't support changing the value after construction.)
	*/
	export function setHTML(html: string): void
	{
		if (!editor || editor.isDestroyed)
		{
			// If the editor hasn't been initialized yet, save the content until it is.
			initialHTML = html
			return
		}
		editor.commands.setContent(html)
	}

	/** Focuses the editor. */
	export function focus(options?: Parameters<HTMLDivElement["focus"]>[0]): void
	{
		if (!editor || !element) return
		const scrollIntoView = !(options && options.preventScroll)
		if (scrollIntoView) element.scrollIntoView()
		editor.commands.focus(undefined, { scrollIntoView: false })
	}

	/** Inserts HTML at the current cursor position. Will not replace a selection if present. */
	export function insertHTML(html: string): void
	{
		if (!editor) throw new Error("The editor content can't be updated before it's initialized.")
		const currentSelection = editor.state.selection
		const selectionEnd = Math.max(currentSelection.from, currentSelection.to)
		editor.chain().setTextSelection({ from: selectionEnd, to: selectionEnd }).insertContent(html).run()
	}

	/** Replaces the currently selected content if there is any, or otherwise inserts HTML at the current cursor position. */
	export function replaceHTML(html: string): void
	{
		if (!editor) throw new Error("The editor content can't be updated before it's initialized.")
		editor.commands.insertContent(html)
	}

	/** Discards the current draft and clears the text. */
	export function discardDraft(): void
	{
		initialHTML = undefined
		if (editor) editor.commands.clearContent()
		saveDraft()
	}

	async function onUpload(): Promise<void>
	{
		if (!upload) return
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
			insertHTML(tag.outerHTML)
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

	function loadDraft(options: { force?: boolean } = {}): void
	{
		if (!editor || editor.isDestroyed) return
		if (!storageKey) return
		if (!isEmpty && !(options?.force)) return

		try
		{
			const draft = localStorage.getItem(storageKey)
			if (draft) setHTML(draft)
		}
		catch(ex)
		{
			console.log(`Failed to load a draft for ${sitewideUniqueID}.`)
		}
	}

	function saveDraft(): void
	{
		if (!editor || editor.isDestroyed) return
		if (!storageKey) return

		try
		{
			const value = getHTML()
			if (value)
			{
				localStorage.setItem(storageKey, value)
				localStorage.setItem(storageAgeKey!, Date.now().toString())
			}
			else
			{
				localStorage.removeItem(storageKey)
				localStorage.removeItem(storageAgeKey!)
			}
		}
		catch(ex)
		{
			console.log(`Failed to save a draft for ${sitewideUniqueID}.`)
		}
	}

	function clearStaleDrafts(): void
	{
		let draftKeysToDelete: string[] | undefined = undefined
		const cutoff = Date.now() - MaxDraftAge
		for (let i = 0; i < localStorage.length; i++)
		{
			const key = localStorage.key(i)
			if (key?.startsWith(storageAgeKeyPrefix))
			{
				const when = parseInt(localStorage.getItem(key)!)
				if (when < cutoff)
				{
					const thisKeySitewiseUniqueId = key.substring(storageAgeKeyPrefix.length)
					if (!draftKeysToDelete) draftKeysToDelete = []
					draftKeysToDelete.push(storageKeyPrefix + thisKeySitewiseUniqueId)
					draftKeysToDelete.push(storageAgeKeyPrefix + thisKeySitewiseUniqueId)
				}
			}
		}
		if (draftKeysToDelete)
		{
			for (const key of draftKeysToDelete)
				localStorage.removeItem(key)
		}
	}

	onDestroy(() =>
	{
		if (editor) editor.destroy()
	})

	function onLink(): boolean
	{
		if (!editor) return false
		if (!editor.state.selection.empty)
		{
			editor.chain().focus().setLink({ href: "https://" }).run()
		}
		else
		{
			const DefaultLinkText = "Link"

			editor.chain().focus().insertContent(DefaultLinkText).run()
			const newPos = editor.state.selection
			editor.chain().setTextSelection({ from: newPos.to - DefaultLinkText.length, to: newPos.to }).setLink({ href:"https://" }).run()
		}
		// TODO: if (linkEditor) linkEditor.focus()
		return true // to indicate that the keyboard shortcut was handled
	}

	function onLinkChanged()
	{
		if (!editor) return
		const isEmptyLink = !linkEditorHref
		const linkRange = getMarkRange(editor.state.selection.$anchor, getMarkType("link", editor.state.schema))
		if (linkRange)
		{
			if (!isEmptyLink)
				editor.chain().setTextSelection(linkRange).unsetLink().setLink({ href: expandUserUrl(linkEditorHref) }).run()
			else
				editor.chain().setTextSelection(linkRange).unsetLink().run()
		}
		else
		{
			console.warn("Failed to set the link because we didn't know its range")
		}
	}

	const storageKey = $derived(sitewideUniqueID ? storageKeyPrefix + sitewideUniqueID : undefined)
	const storageAgeKey = $derived(sitewideUniqueID ? storageAgeKeyPrefix + sitewideUniqueID : undefined)

</script>

<style>
	.root
	{
		position: relative;
	}

	.editor
	{
		& > :global(*)
		{
			/* So there's always a place to click */
			padding-bottom: 1em;
		}

		/* Based on CSS from PostView.svelte */
		:global(img), :global(svg)
		{
			max-width: 100%;
			max-height: 80vh;
			width: auto;
			height: auto;
			object-fit: scale-down;
		}

		/* Temporary selection visuals */
		:global(img.ProseMirror-selectednode)
		{
			outline: 3px solid var(--accent-glow);
		}
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

		font-size: var(--font-size-tiny);

		user-select: none;
	}

	.after
	{
		position: absolute;
		width: 100%;
	}

	.linkpopup
	{
		font-size: var(--font-size-tiny);

		input
		{
			height: 28px;
			border-style: none;
			background-color: transparent;
		}
	}

</style>

<svelte:window onbeforeunload={storageKey ? saveDraft : undefined} />

<FocusWithin>
	{#snippet children({ within: isFocused })}
		<div class="root" style:scroll-margin-bottom={afterHeight}>
			<div class="toolbarcontainer">
				{#if !collapsible || !isEmpty || isFocused}
					<div class="toolbar" transition:fly|local={{ y: 8 }}>
						{#if editor}
							<Button tiny toolbar checked={editor.isActive("bold")}
								onclick={() => editor!.chain().focus().toggleBold().run()}
							>
								<Bold />
							</Button>
							<Button tiny toolbar checked={editor.isActive("italic")}
								onclick={() => editor!.chain().focus().toggleItalic().run()}
							>
								<Italic />
							</Button>
							<Button tiny toolbar checked={isLinkEditorOpen}
								onclick={onLink}
							>
								<Link />
							</Button>
							<Button tiny toolbar
								onclick={upload!.open} {disabled}
							>
								<UploadImage />
							</Button>
							<Button tiny toolbar
								onclick={() => editor!.chain().focus().unsetAllMarks().unsetLink().clearNodes().run()}
							>
								<ClearFormat />
							</Button>
						{/if}
					</div>
				{/if}
			</div>
			<Upload bind:this={upload} accept="image/*" paste={isFocused} onchange={onUpload}>
				<div bind:this={element} aria-label={ariaLabel} class="editor"></div>
				<div class="linkpopup"
					style:display={isLinkEditorOpen && isFocused ? "block" : "none"}
					style:position="absolute"
					style:left={`${linkEditorX}px`}
					style:top={`${linkEditorY}px`}
				>
					<PopupFrame style="Text">
						<input type="url" class="linkeditor"
							bind:this={linkEditor}
							bind:value={linkEditorHref}
							onchange={onLinkChanged}
						/>
					</PopupFrame>
				</div>
				{#snippet curtain()}
					<div class:curtain={true}></div>
				{/snippet}
			</Upload>
			{#if isUploading}
				<div class="uploading">
					<Wait />
				</div>
			{/if}
			{#if after}
				{#if !collapsible || !isEmpty || isFocused}
					<div class="after" transition:fly|local={{ y: -20 }}>
						{@render after({ uploading: isUploading })}
					</div>
				{/if}
			{/if}
		</div>
		{#if afterHeight}
			<div style:height={afterHeight}></div>
		{/if}
	{/snippet}
</FocusWithin>
