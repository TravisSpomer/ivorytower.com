<script lang="ts">
	import { DateTime, Title } from "$lib/components"
	import { formatDate } from "$lib/utils/date"
	
	const now = new Date()
	const tests =
	[
		new Date(1994, 4, 10, 15, 0, 0),
		new Date(2021, 4, 10, 15, 0, 0),
		new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
		new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, now.getHours(), now.getMinutes(), now.getSeconds()),
		new Date(now.getFullYear(), now.getMonth(), now.getDate()),
		new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() - 15, now.getSeconds()),
		now,
		new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 16, now.getSeconds()),
		new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
	]
</script>

<Title title="Date tests" />

<h1>Date tests</h1>

<p>
	Let's format a bunch of dates.
</p>

<table>
	<thead>
		<tr>
			<th><code>toString</code></th>
			<th>Date-relative</th>
			<th>Time-relative</th>
		</tr>
	</thead>
	{#each tests as date}
		<tr>
			<td>{date.toLocaleString()}</td>
			<td><DateTime value={date} /></td>
			<td>{formatDate(date, "times") !== formatDate(date) ? formatDate(date, "times") : ""}</td>
		</tr>
	{/each}
</table>
