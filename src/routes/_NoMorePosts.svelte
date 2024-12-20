<script context="module" lang="ts">
	interface ImageInfo
	{
		filename: string
		width: number
		height: number
	}

	const lightModeImages =
	[
		{ filename: "stanley-transhumans-roboto-light", width: 183, height: 300 },
		{ filename: "barbieri-turkish-woman-reading", width: 244, height: 300 },
		{ filename: "rosenthal-catorns-warbler", width: 245, height: 300 },
		{ filename: "waugh-levitation-in-dream", width: 203, height: 300 },
		{ filename: "posada-frivolous-frog", width: 235, height: 300 },
		{ filename: "de-groot-uit-overschie", width: 170, height: 300 },
	]
	const darkModeImages =
	[
		{ filename: "barney-medusa", width: 228, height: 300 },
		{ filename: "melville-jqa-ward", width: 242, height: 300 },
	]

	const messages =
	[
		"You have finished IvoryTower.",
		"Go doomscroll somewhere else.",
		"Tune in tomorrow for the shocking conclusion!",
		"Are you happy now?",
		"You deserve a gold star.",
		"Now it’s your turn to post something.",
		"Treat yourself to a laptop bag.",
		"Now all that is left is a cold emptiness.",
		"Was it worth it?",
		"In Soviet Russia, IvoryTower reads you.",
		"Now that’s what I call fanatical devotion!",
		"Too much leads to madness. Too little leads to confusion.",
		"IvoryTower is part of a balanced diet.",
		"Great, another thing you can be pretentious about.",
		"There were worse things you could have done with your time.",
		"Not great, not terrible.",
		"More posts coming soon!",
		"But does it ever truly end?",
		"Cherish this feeling, for it is fleeting.",
		"TODO: more posts",
		"Now rest up for tomorrow’s shift in the Content Mines.",
		"Sorry about the cliffhanger.",
		"But IvoryTower will return.",
		"Next time on IvoryTower:",
		"<awkward silence>",
		"It is no longer my job to entertain you.",
		"Just in time. Ninety more seconds and IvoryTower would have become sentient.",
		"Maybe you could search the couch cushions for a leftover post.",
		"Start over from the beginning: it’s better the second time.",
		"And now for a brief word from our sponsors.",
		"Be sure to like and subscribe!",
		"Now turn to side B.",
		"The real IvoryTower was the friends you made along the way.",
		"Achievement unlocked.",
		"And they said it couldn’t be done.",
		"That’s all, folks!",
	]
</script>

<script lang="ts">
	import { darkMode } from "$lib/utils/settings"
	import { PictureMessage } from "$lib/components"

	const finCount = 2
	const fin = Math.floor(Math.random() * finCount)

	let imageData: ImageInfo
	$:
	{
		const imageArray = $darkMode ? darkModeImages : lightModeImages
		imageData = imageArray[Math.floor(Math.random() * imageArray.length)]
	}

	const message = messages[Math.floor(Math.random() * messages.length)]
</script>

<style lang="scss">
	@import "../core";

	svg
	{
		margin: 0 auto 0.5em auto;
		display: block;
		max-height: min(96px, 12vw);
	}

	.text
	{
		margin-bottom: min(32px, 4vw);
		text-align: center;

		@include phone-only
		{
			font-size: $font-size-compact;
			line-height: $line-height-compact;
		}
	}

</style>

<PictureMessage picture={imageData.filename} width={imageData.width} height={imageData.height}>
	{#if fin === 0}
		<svg viewBox="0 0 89 87"><desc>fin.</desc><path fill="currentColor" d="M14.2 53.6c9 1.2 17.9-3.1 23-7.4 1.7-1.6 2-2.2 1.9-2.4-.3-.3-.7-.2-2 .8-5.7 4.8-14.4 8.9-22.3 7.7 1.5-3.1 3.6-7.3 6.6-12.2C35.6 33.6 58.8 6.4 53 3.7c-6.3-3-25.6 17-37 38.8-2.6 4.8-3.2 7.1-4.5 9.2-.7 0-.5 0-1.3-.5-.5-.3-1.5-.7-2 0-1 1.2 0 1.7 1.3 2.8.4.4.4 1 .4 1.3C5.8 64 .7 85.1 6 85.7c4 .7 11.4-15.8 7.3-30l1-2.1ZM28 30.3c5.7-7.6 20.4-26.8 23.7-25.1 3.7 2-16.7 26.6-29 32.7a124 124 0 0 1 5.3-7.6ZM12.3 56.8c.3 1 2.1 9 0 16.6-2.1 7.4-4.1 10.5-6 10.9-1.2.3-.5-5.9 1.9-14.3 2.4-8 3.5-12 4.1-13.2Zm-1.3-4-.5.9s-.4-.9-1-1.4c.7.3 1 .5 1.5.4Zm35-23c-.7 0-2.5.5-2.5 1.7 0 1.1.3 2.2 1.8 2.5 1.3.3 3-1.5 3-2.2 0-.6-.2-2-2.4-2Zm-6.9 23c5 0 11-4.5 14.7-7.8.9-.6.2-1.4-.6-.8-1.6 1.2-9.3 7.4-13.2 7.4-1.2 0-1.2-2 .5-5 1.6-3.1 4.2-6.4 3.8-7.1-.5-1-.7-1-2.1-1.4-1-.2-3 2.4-4 5.1-1.2 2.8-2.5 9.6 1 9.6Zm19-9c.2-.9-.2-2.9-1.4-2.9-1.3 0-6.5 7.9-6.2 10.9.3 1.8 2 1.4 2.5 1 4-3.3 14.7-13 17.5-13.2 1.3-.1-3 4.2-3.4 7.7-.5 3.6 1.4 6.6 3.5 6.4 1.3-.1 1.8-.4 1.8-.7 0-.8-.3 0-1.4 0-.8 0-2.2-2.6.6-7.1 2.8-4.5 3.2-6.5 1.4-7.2-3.5-1.3-8.6 3-20 12.6.2-.8 4.7-5.9 5.1-7.5ZM88.5 51c0-.4-.3-.9-.4-1.2-.5-.3-1-.6-1.6-.6-.8 0-2 1.2-2 1.9 0 1.1.9 1.8 2 1.8s2-.8 2-2Z" /></svg>
	{:else}
		<svg viewBox="0 0 68 23" height="23"><path fill="currentColor" d="M0 21c0-.3 0-.5.2-.6l.4-.3.6-.2.6-.2a293.6 293.6 0 0 0 1-1.5L3 18v-.3a5.3 5.3 0 0 1 .1-.5v-1.4a4.3 4.3 0 0 1 .2-.7 2.3 2.3 0 0 1 .1-.6v-2.7l.3-.5.1-.6A17.2 17.2 0 0 1 3.5 9 4.3 4.3 0 0 0 3 7.5V5H3l-.1-.2-.8-.5-.8-.6a5 5 0 0 1-.7-.7C.3 2.6.2 2.4.2 2c0-.3.1-.5.4-.6l2-.1.2-.1h.7l1.2.1.4-.1.3-.2 3.9.1h.4L10 1h.6l.8.1 1.2-.1 1.2-.2h1a47.5 47.5 0 0 1 1.3.4l.3.3.3.5v.7l-.1.1-.3.9.2.4.1.5v.1c0 .2 0 .3-.3.5a2 2 0 0 1-.5.2h-.2l-.1-.1-.4-.5-.9-.4-.1-.1-.2-.2c-.6-.3-1.3-.5-2-.6H8.3L8 4l-.3.2-.1.1v.2l-.1.3-.1.8-.1.1-.2.2-.1.2v1.4l-.2.3v2H7l.2.3.3.3.2.2.3.2h.2l1.5-.3h.2l.2.1h1.4l.4-.1v-.1a3.4 3.4 0 0 1 .1-1 4839.8 4839.8 0 0 0 1.4-1.8c.4 0 .7.2 1 .5.2.3.3.7.3 1v.5l-.1.5v1l-.2.5v2l-.2.3a1.8 1.8 0 0 1-.4.6l-.3.1c-.3 0-.5 0-.6-.3l-.3-.5a3 3 0 0 0-.3-.6.5.5 0 0 0-.5-.3l-1.5.2h-.7c-.4-.4-.8-.5-1.2-.5H8a815.7 815.7 0 0 1-.6.3l-.2.2-.2.3v4.5l.2.3.1.2v.3l.2.3v.1a104.8 104.8 0 0 0 .8.5h.3a8.2 8.2 0 0 1 .6.2h.2l.3.2.3.1h.4l.2.2c.1 0 .2 0 .3.2l.1.2.1.3v.2c-.3.4-.6.6-.9.7l-1 .1h-.7a61.7 61.7 0 0 0-6.2.2h-.4A8 8 0 0 1 .6 22a6 6 0 0 1-.4-.5A1 1 0 0 1 0 21Zm19.5.3c0-.3 0-.5.3-.6l.7-.3h1l.8-.3v-.2l.3-.3.2-.4a27.8 27.8 0 0 1 .6-1.1 6.3 6.3 0 0 0 0-1l-.2-.4v-.3l-.1-.3.4-2.4v-.3l-.1-.8v-1.1a2.6 2.6 0 0 1-.3-.9l.2-1.1V6.8l-.1-.6V4.5c0-.2-.1-.3-.3-.5l-.4-.4c-.3-.2-.6-.3-1-.3l-1-.1c-.3 0-.5-.1-.7-.3-.2-.1-.3-.5-.3-1 0-.3.1-.5.4-.6l.8-.2H22a92.9 92.9 0 0 0 5.1-.4H28.8l.3.1a8.2 8.2 0 0 1 .4.1h.7l.3.3v.2l.1.3a2.2 2.2 0 0 1 0 .5l-.3.3a4.2 4.2 0 0 1-1 .4l-1 .7-.4.2c-.2 0-.3.1-.4.3a10.3 10.3 0 0 1-.3.6V8l-.1.4a11.2 11.2 0 0 1-.2.6v2l-.1 2.6.4 2v1.7l.2.4a10.5 10.5 0 0 1 .3.5v.6l.2.5.2.5.6.2.4-.1.4-.1a2.5 2.5 0 0 1 1 .2l.4.3.2.4c0 .2 0 .4-.2.6l-.4.4-.6.2a3 3 0 0 1-.6 0H23l-1 .2h-.7a8.3 8.3 0 0 1-1.2-.1c-.2 0-.4-.1-.5-.3a.7.7 0 0 1-.2-.5Zm17 .7h-.7a4.9 4.9 0 0 1-1.1-.3v-.3c0-.4.1-.7.4-.9l1-.3h1.2l.2-.2a8.8 8.8 0 0 0 .6-.8V19l.1-.5a31.4 31.4 0 0 1 0-.9l-.1-1.8v-.5c0-.1 0-.2.2-.3v-1L38 11V9.7l.2-.4v-.6l-.1-1.5a37.1 37.1 0 0 0-1-2.4c-.1 0-.2 0-.3-.2a10.3 10.3 0 0 0-1-.8l-.7-.4c-.3 0-.5-.2-.7-.3-.3-.1-.4-.3-.6-.5-.2-.1-.3-.4-.3-.7v-.1l.1-.3.1-.1.2-.2h.5l.5-.1.5-.1h1a7.2 7.2 0 0 0 1.2.3 40.7 40.7 0 0 0 .9 0h.2l.4.3.3.2.8.9.9.7a66231.3 66231.3 0 0 1 1.3 1.1l.4.6 1 1v.3l.2.3.6.7.6.4a9.2 9.2 0 0 1 1.2 1l1 1.2a33.3 33.3 0 0 0 1 1.4l.3.3.2.2.4.4.4.4.3.2.2.2.2.1.3.4.4.4.3.4.3.1h.5a28.7 28.7 0 0 1 .6-.7v-.3l-.2-2 .1-2.1v-.1l-.1-.2-.1-.2v-.6l-.1-.3-.1-.2V5a27.8 27.8 0 0 0-.1-.6c0-.2-.2-.3-.3-.4a.5.5 0 0 0-.4-.2h-.5l-.6.2a11.1 11.1 0 0 1-1.4-.2l-.7-.2c-.2-.1-.3-.3-.3-.5V1.8l.1-.4.3-.3.6-.1h1.3a6 6 0 0 0 2 .2L53 1h3.3l.5.1h.5l.4.5v.8c0 .4-.2.7-.5 1l-1.4.8a4.6 4.6 0 0 1-.5.2h-.1c-.1 0-.2 0-.3.2l-.2.5a11.7 11.7 0 0 0-.3.8l.2.7v.1l-.1.3V7l-.1.6a10.2 10.2 0 0 1-.3 1.8v3.7c0 .4 0 .8.2 1.2l.2 1.1.2 2.6c0 .1 0 .3.2.5l.3 1v2c0 .2-.1.4-.3.5l-.5.1-.5-.1a5.2 5.2 0 0 1-1-.8l-.5-.4-.2-.2a4.7 4.7 0 0 0-.5-.6l-.2-.2v-.2l-.2-.3-.2-.2-.3-.3c-.1-.1-.2-.3-.4-.3l-.1-.3c-.5-.4-1-1-1.3-1.5l-.6-.6-.5-.5-.1-.2a10.2 10.2 0 0 1-.6-1l-.9-.7a5 5 0 0 1-.9-.6l-.4-.4-.2-.2v-.3l-1-.6-1.8-2-.3-.3a9.9 9.9 0 0 0-1.2-1.1h-.3l-.4.1v4l.2 2.1v.4l.1.3v1.6l.1.3.1.3.2 1 .1 1.2v.5l.1.1a23.9 23.9 0 0 0 2.3.3c.3 0 .4.1.5.2l.1.5c0 .4-.2.7-.5.8-.3.2-.6.2-1 .2h-.7l-.3-.2h-.4l-.4-.1-.3-.1h-1.2l-2.4.2Zm25.3-3.3c0-1 .2-1.7.6-2.2.4-.5 1.1-.7 2.1-.7a38 38 0 0 0 2.4 1l.4.5.2.7v2.3l-.3.5-.5.5-.6.5a1 1 0 0 1-.5.2l-1.5-.4-1.2-.5-.8-1c-.2-.3-.3-.8-.3-1.4Z" /></svg>
	{/if}
	<div class="text">
		{message}
	</div>
</PictureMessage>
