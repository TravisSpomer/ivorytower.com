<script lang="ts">
	import type { PageProps } from "./$types"
	import type { BasicUser } from "$lib/sdk"
	import { users } from "$lib/data"
	import { Title } from "$lib/components"

	const { params }: PageProps = $props()

	const username = $derived(params.username)
	const user: BasicUser = $derived($users.getOrPlaceholder(username))

</script>

<Title title={user.fullName} />

<h1>{user.fullName}</h1>

<p>
	<a href="https://old.ivorytower.com/ProfileShow.aspx?name={username}" class="external">See {user.shortName}'s profile on the old site</a>
</p>
