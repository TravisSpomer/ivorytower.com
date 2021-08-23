<script lang="ts">
	import { unreadThreads } from "$lib/data"
	import { UnreadThreadsPager } from "$lib/components"
</script>

<svelte:head>
	<title>{$unreadThreads.prefixText}IvoryTower 3</title>
</svelte:head>

<h1>Welcome to the IvoryTower 3 beta site!</h1>
<p>
	As you can probably see, this is very much a work in progress. The word “beta” in the URL is still a bit... aspirational.
</p>

<h2>What's done?</h2>
<ul>
	<li>This new website</li>
	<li>An incomplete, rough API hosted by the old site</li>
</ul>

<p>
	I've started using IvoryTower 3 as my main way of interacting with IvoryTower. You're welcome to as well, but there's no hurry. When I think it's <em>ready</em> to replace the old site, it will, and even then, I'll keep the old one around too.
</p>
<p>
	For now, I'd prefer it if you could keep suggestions and reports of missing features and the like to a minimum—just stuff that's either an obvious tiny fix like a typo, or stuff that's really blocking you from using the new site like some text being invisible in dark mode. That should help me keep this feeling like a fun, educational side project instead of just work I do after work. I'll start building out a list of known issues and unfinished work items relatively soon.
</p>

<h2>What are the priority features coming next?</h2>
<ul>
	<li>Starting a full project tracker on <a href="https://github.com/TravisSpomer/ivorytower.com" target="_blank" rel="nooopener">GitHub</a></li>
	<li>
		New designs for basically everything
		<ul>
			<li>The styling you see here currently is mostly just copied from another website I made</li>
		</ul>
	</li>
	<li>Returning classic IvoryTower features like clipping, ignoring, reverse ordering, and so on</li>
	<li>Improving dark mode</li>
</ul>

<p>
	There's <em>plenty</em> more to do after those. It's going to be a long project. Welcome aboard!
</p>

<hr />

<UnreadThreadsPager thenHome={false} />
