<script lang="ts">

</script>

<style lang="scss">
	@import "../../core";

	$size: 8px;

	.root
	{
		position: relative;
		margin: 0 (-$indent * 0.5);
		padding: ($indent * 0.5);

		&::before
		{
			content: "";
			display: block;
			position: absolute;
			left: 0;
			right: 0;
			top: -$size;
			height: $size;

			background: radial-gradient(ellipse farthest-side at bottom, var(--border-subtle-trans), transparent);
		}

		&::after
		{
			content: "";
			display: block;
			position: absolute;
			left: 0;
			right: 0;
			bottom: -$size;
			height: $size;

			background: radial-gradient(ellipse farthest-side at top, var(--border-subtle-trans), transparent);
		}
	}

</style>

<div class="root"><slot /></div>
