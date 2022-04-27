<script lang="ts">

</script>

<style lang="scss">
	@import "../../core";

	.root
	{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: -1;

		/* background-color: var(--accent-light4); */

		:global(.theme-dark) &
		{
			display: none;
		}
	}
</style>

<div class="root"></div>
