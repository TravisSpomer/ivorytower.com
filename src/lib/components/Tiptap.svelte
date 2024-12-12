<script lang="ts">

	import { onMount, onDestroy } from "svelte"
	import Button from "./Button.svelte"
	import { Editor } from "@tiptap/core"
	import BulletList from "@tiptap/extension-bullet-list"
	import Link from "@tiptap/extension-link"
	import Placeholder from "@tiptap/extension-placeholder"
	import StarterKit from "@tiptap/starter-kit"
	import Typography from "@tiptap/extension-typography"

	let element: Element
	let editor: Editor

	onMount(() =>
	{
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
				Link.extend({
					inclusive: false,
				}).configure({
					openOnClick: false,
					autolink: true,
					defaultProtocol: "https",
					protocols: ["http", "https"] }),
				Placeholder.configure({
					placeholder: "Post a reply",
				}),
				Typography,
			],
			content: "",
			onTransaction: () =>
			{
				// Force re-render so editor.isActive works
				// https://tiptap.dev/docs/editor/getting-started/install/svelte
				editor = editor
			},
		})
	})

	onDestroy(() =>
	{
		if (editor) editor.destroy()
	})

	function onLink()
	{
		// TODO: Allow linking to websites other than MessageSend.aspx

		editor.chain().focus().setLink({ href: "/MessageSend.aspx?name=csmolinsky" }).run()
	}
</script>

{#if editor}
	<!-- TODO: Add a checked property to Button and then use that instead of accent on these -->
	<Button tiny toolbar accent={editor.isActive("bold")}
		on:click={() => editor.chain().focus().toggleBold().run()}
	>
		<strong>B</strong>
	</Button>
	<Button tiny toolbar accent={editor.isActive("italic")}
		on:click={() => editor.chain().focus().toggleItalic().run()}
	>
		<em>I</em>
	</Button>
	<Button tiny toolbar accent={editor.isActive("link")}
		on:click={onLink}
	>
		<u>Link</u>
	</Button>
	<Button tiny toolbar
		on:click={() => editor.chain().focus().unsetAllMarks().unsetLink().clearNodes().run()}
	>
		Clear formatting
	</Button>
{/if}

<div bind:this={element} />
