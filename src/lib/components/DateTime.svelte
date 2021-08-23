<script lang="ts">
	import { formatDate } from "$lib/utils/date"

	/** The Date object to render. */
	export let value: Date = new Date()
	/** Which types of relative formatting to allow: "none", "dates" to allow "yesterday" and "today", or "times" to allow "in 15 minutes". */
	export let relative: Parameters<typeof formatDate>[1] = "dates"
</script>

<time datetime={value.toISOString()} title={formatDate(value, "none")}>{formatDate(value, relative)}</time>
