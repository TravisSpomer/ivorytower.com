<script lang="ts">
	import { formatDate } from "$lib/utils/date"

	export interface Props
	{
		/** The Date object to render. */
		value?: Date
		/** Which types of relative formatting to allow: "none", "dates" to allow "yesterday" and "today", or "times" to allow "in 15 minutes". */
		relative?: Parameters<typeof formatDate>[1]
	}

	const {
		value = new Date(),
		relative = "dates",
	}: Props = $props()
</script>

<time datetime={value.toISOString()} title={formatDate(value, "none")}>{formatDate(value, relative)}</time>
