<script lang="ts">

	import { onMount, onDestroy, createEventDispatcher } from "svelte"
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
	import { navigating } from "$app/stores"
	import { Bold, Italic, ClearFormat, Link, UploadImage, X } from "$lib/icons"
	import { uploadImage } from "$lib/sdk"
	import Button from "./Button.svelte"
	import FocusWithin from "./FocusWithin.svelte"
	import Upload from "./Upload.svelte"
	import Wait from "./Wait.svelte"

	const AutoSaveInterval = 5 * 1000 /* = 5 seconds */
	const UpdateValueInterval = 2 * 1000 /* = 2 seconds */
	const MaxDraftAge = 1 * 24 * 60 * 60 * 1000 /* = 1 day */
	const MaxInlineImageWidth = 800
	const MaxInlineImageHeight = 600
	const LinkUXWidth = 200

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
	/** A string that uniquely identifies this editor. If this is not specified, autosaving of drafts is not enabled. */
	export let sitewideUniqueID: string | undefined = undefined

	const dispatch = createEventDispatcher()
	let element: HTMLDivElement
	let editor: Editor
	let upload: Upload
	let isUploading: boolean = false
	let isLinkEditorOpen: boolean = false
	let linkEditorHref: string = ""
	let linkEditorX: number = 0, linkEditorY: number = 0

	const storageKeyPrefix = "Draft for "
	$: storageKey = sitewideUniqueID ? storageKeyPrefix + sitewideUniqueID : undefined
	const storageAgeKeyPrefix = "Draft age of "
	$: storageAgeKey = sitewideUniqueID ? storageAgeKeyPrefix + sitewideUniqueID : undefined

	onMount(loadDraft)
	onMount(() => setTimeout(clearStaleDrafts))
	onDestroy(saveDraft)
	$: if ($navigating)
	{
		saveDraft()
	}
	else
	{
		loadDraft({ force: true })
	}

	const throttledSaveDraft = throttle(AutoSaveInterval, saveDraft)
	const throttledUpdateValue = throttle(UpdateValueInterval, () => value = getHTML())

	$:
	{
		value
		storageKey
		throttledSaveDraft()
	}

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
						const editorRect = element.getBoundingClientRect()
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
			content: value,
			onTransaction(props)
			{
				// Force re-render so things bound to editor.isActive are updated
				// https://tiptap.dev/docs/editor/getting-started/install/svelte
				editor = editor

				if (!props.transaction.docChanged) return
				throttledUpdateValue()
				onChange()
			},
		})
	})

	/**
		Returns the editor contents as HTML.
		If you use this value to perform an action that affects the server, you probably want to call discardDraft() after this.
	*/
	export function getHTML(): string
	{
		if (!editor)
		{
			console.warn("Tried to get Editor's contents but there was no contentEditable element")
			return ""
		}
		const html = editor.getHTML()
		if (html === "<p></p>") return ""
		return html
	}

	/**
		Replaces the entire contents of the editor with new HTML.
		(In theory this is redundant to just setting the value property, but this component doesn't support changing the value after construction.)
	*/
	export function setHTML(html: string): void
	{
		if (!editor)
		{
			// If the editor hasn't been initialized yet, setting value is sufficient, since we use that to initialize the editor.
			value = html
			return
		}
		editor.commands.setContent(html)
	}

	/** Focuses the editor. */
	export function focus(options?: Parameters<HTMLDivElement["focus"]>[0]): void
	{
		if (!editor) return
		const scrollIntoView = !(options && options.preventScroll)
		if (scrollIntoView) element.scrollIntoView()
		editor.commands.focus(undefined, { scrollIntoView: false })
	}

	/** Inserts HTML at the current cursor position. Will not replace a selection if present. */
	export function insertHTML(html: string): void
	{
		if (!editor) return
		const currentSelection = editor.state.selection
		const selectionEnd = Math.max(currentSelection.from, currentSelection.to)
		editor.chain().setTextSelection({ from: selectionEnd, to: selectionEnd }).insertContent(html).run()
	}

	/** Replaces the currently selected content if there is any, or otherwise inserts HTML at the current cursor position. */
	export function replaceHTML(html: string): void
	{
		if (!editor) return
		editor.commands.insertContent(html)
	}

	/** Discards the current draft and clears the text. */
	export function discardDraft(): void
	{
		value = ""
		// HACK: This component doesn't respond to changes in value, so update the content directly.
		if (editor) editor.commands.clearContent()
		saveDraft()
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
		if (!storageKey) return
		if (value && !(options?.force)) return // Don't try to load a draft if there's already text present, unless we're forcing.
		try
		{
			const draft = localStorage.getItem(storageKey)
			if (draft) value = draft
		}
		catch(ex)
		{
			console.log(`Failed to load a draft for ${sitewideUniqueID}.`)
		}
	}

	function saveDraft(): void
	{
		if (!storageKey) return
		try
		{
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

	function onLink()
	{
		editor.chain().focus().setLink({ href: "https://" }).run()
		return true // to indicate that the keyboard shortcut was handled
		// TODO: Automatically move focus into the textbox
	}

	function onLinkChanged()
	{
		const isEmptyLink = !linkEditorHref || linkEditorHref === "https://"
		const linkRange = getMarkRange(editor.state.selection.$anchor, getMarkType("link", editor.state.schema))
		if (linkRange)
		{
			if (!isEmptyLink)
				editor.chain().setTextSelection(linkRange).unsetLink().setLink({ href: linkEditorHref }).run()
			else
				editor.chain().setTextSelection(linkRange).unsetLink().run()
		}
		else
		{
			console.warn("Failed to set the link because we didn't know its range")
		}
	}

</script>

<style lang="scss">
	@import "../../core";

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

		font-size: $font-size-tiny;

		user-select: none;
	}

	.after
	{
		position: absolute;
		width: 100%;
	}

	.linkpopup
	{
		font-size: $font-size-tiny;
		background-color: var(--control-background-disabled); /* yes this is wildly inappropriate */
	}

</style>

<svelte:window on:beforeunload={storageKey ? saveDraft : undefined} />

<FocusWithin let:within={isFocused}>
	<div class="root" style:scroll-margin-bottom={afterHeight}>
		<div class="toolbarcontainer">
			{#if !collapsible || value || isFocused}
				<div class="toolbar" transition:fly|local={{ y: 8 }}>
					{#if editor}
						<Button tiny toolbar checked={editor.isActive("bold")}
							on:click={() => editor.chain().focus().toggleBold().run()}
						>
							<Bold />
						</Button>
						<Button tiny toolbar checked={editor.isActive("italic")}
							on:click={() => editor.chain().focus().toggleItalic().run()}
						>
							<Italic />
						</Button>
						<Button tiny toolbar checked={isLinkEditorOpen}
							on:click={onLink}
						>
							<Link />
						</Button>
						<Button tiny toolbar
							on:click={upload.open} {disabled}
						>
							<UploadImage />
						</Button>
						<Button tiny toolbar
							on:click={() => editor.chain().focus().unsetAllMarks().unsetLink().clearNodes().run()}
						>
							<ClearFormat />
						</Button>
					{/if}
				</div>
			{/if}
		</div>
		<Upload bind:this={upload} accept="image/*" paste={isFocused} on:change={onUpload}>
			<div bind:this={element} aria-label={ariaLabel} class="editor" />
			<input type="url" class="linkpopup"
				bind:value={linkEditorHref}
				on:change={onLinkChanged}
				style:display={isLinkEditorOpen && isFocused ? "block" : "none"}
				style:position="absolute"
				style:left={`${linkEditorX}px`}
				style:top={`${linkEditorY}px`}
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
