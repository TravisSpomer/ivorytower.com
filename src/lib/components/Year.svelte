<script lang="ts">
	export interface Props
	{
		/** Optionally, if you want to render a year range, the year that the range should begin with. */
		from?: number | undefined
	}

	const { from }: Props = $props()

	const to = (new Date()).getUTCFullYear()
</script>

{(!from || to <= from) ? to.toString() : `${from}-${to}`}
