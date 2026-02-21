<script lang="ts">
	export interface Props
	{
		/** The size of the spinner, in pixels. If 0 or null, it will fill all available space. */
		size?: number | null
		/** A number of milliseconds to wait before the animation begins. */
		delay?: number
	}

	const {
		size = 64,
		delay = 0
	}: Props = $props()

	const effectiveSize = $derived(size || undefined)
	const begin = $derived(delay ? `${delay}ms` : undefined)
</script>

<svg width={effectiveSize} height={effectiveSize} viewBox="0 0 64 64" fill="none">

	<circle cx="0" cy="0" r="20" stroke="url(#gradient)" stroke-width="0" transform="translate(32 32)">
		<animateTransform attributeName="transform" type="scale" additive="sum" values="0; 1.05; 1" {begin} dur="0.250s" keyTimes="0; 0.5; 1" />
		<animate attributeName="stroke-width" values="0; 20; 8" {begin} dur="0.250s" keyTimes="0; 0.2; 1" fill="freeze" />
		<animateTransform attributeName="transform" type="rotate" additive="sum" from="0" to="360" {begin} dur="1s" repeatCount="indefinite" />
	</circle>

	<defs>
		<linearGradient id="gradient" x1="0" y1="-24" x2="0" y2="0" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#d9f4ff" />
			<stop offset="1" stop-color="#1e3263" />
		</linearGradient>
	</defs>

</svg>
