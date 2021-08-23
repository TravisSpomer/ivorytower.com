<script lang="ts">
	/** Optionally, if you want to render a year range, the year that the range should begin with. */
	export let from: number | undefined

	const to = (new Date()).getUTCFullYear()
</script>

{(!from || to <= from) ? to.toString() : `${from}-${to}`}
