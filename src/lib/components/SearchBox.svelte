<script lang="ts">

	export interface Props
	{
		/** If true, a smaller visual style will be used. */
		small?: boolean
		/** If true, the search box should collapse into an icon when not in use. */
		collapsed?: boolean
		/** The placeholder for the textbox. */
		placeholder?: string
		/** The ARIA label for the textbox. */
		ariaLabel?: string
		/** The text in the textbox. */
		value?: string
		/** Raised when the text in the search box is changed. */
		onchange?: ((ev: { value: string }) => void) | undefined
		/** Raised when the search button is clicked or Enter is pressed. */
		onsubmit?: ((ev: { value: string }) => void) | undefined
	}

	let {
		small = false,
		collapsed = false,
		placeholder = "",
		ariaLabel = "",
		value = $bindable(""),
		onchange,
		onsubmit,
	}: Props = $props()

	function onChange(): void
	{
		if (onchange) onchange({ value: value })
	}

	function onSubmit(ev: Event): void
	{
		ev.preventDefault()
		if (onsubmit) onsubmit({ value: value })
	}

</script>

<style>

	input[type=search]
	{
		width: 12em;
		padding-right: 34px;
		vertical-align: middle;

		background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkiIGhlaWdodD0iMTkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYuNSAwQTYuNSA2LjUgMCAwMDEgMy4yYTYuNSA2LjUgMCAwMDAgNi42IDYuNiA2LjYgMCAwMDUuNiAzLjMgNi40IDYuNCAwIDAwNC4yLTEuNWw3LjMgNy4yLjQuMmMuMiAwIC4zIDAgLjQtLjJsLjItLjRjMC0uMiAwLS4zLS4yLS40bC03LjItNy4zQTYuNyA2LjcgMCAwMDEzIDYuNSA2LjUgNi41IDAgMDA5LjggMSA2LjUgNi41IDAgMDA2LjUgMHptMCAxMS45YTUuMiA1LjIgMCAwMS0zLjctMS42IDUuNCA1LjQgMCAwMTMuNy05LjEgNS40IDUuNCAwIDAxNSA3LjQgNS41IDUuNSAwIDAxLTIuOSAyLjljLS42LjItMS4zLjQtMiAuNHoiIGZpbGw9IiMwMDAiLz48L3N2Zz4=);
		background-size: 18px;
		background-position: right 8px center;
		background-repeat: no-repeat;

		transition:
			width 133ms ease,
			box-shadow .2s cubic-bezier(.1, .7, .3, 1);

		:global(.theme-dark) &
		{
			background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkiIGhlaWdodD0iMTkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYuNSAwQTYuNSA2LjUgMCAwMDEgMy4yYTYuNSA2LjUgMCAwMDAgNi42IDYuNiA2LjYgMCAwMDUuNiAzLjMgNi40IDYuNCAwIDAwNC4yLTEuNWw3LjMgNy4yLjQuMmMuMiAwIC4zIDAgLjQtLjJsLjItLjRjMC0uMiAwLS4zLS4yLS40bC03LjItNy4zQTYuNyA2LjcgMCAwMDEzIDYuNSA2LjUgNi41IDAgMDA5LjggMSA2LjUgNi41IDAgMDA2LjUgMHptMCAxMS45YTUuMiA1LjIgMCAwMS0zLjctMS42IDUuNCA1LjQgMCAwMTMuNy05LjEgNS40IDUuNCAwIDAxNSA3LjQgNS41IDUuNSAwIDAxLTIuOSAyLjljLS42LjItMS4zLjQtMiAuNHoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=);
		}

		@media (prefers-reduced-motion)
		{
			transition: none;
		}

		&.small
		{
			height: 28px;
			padding-right: 26px;

			border-color: var(--grey-light1);
			background-size: 14px;
			background-position: right 6px center;

			font-size: var(--font-size-tiny);
			line-height: var(--line-height-tiny);
		}
	}

	input[type=submit]
	{
		all: unset;
		margin: 0 0 0 -32px;
		width: 32px;
		height: 36px;
		vertical-align: middle;

		opacity: 0;

		cursor: pointer;

		&.small
		{
			margin: 0 0 0 -24px;
			width: 24px;
			height: 28px;
		}
	}

	form
	{
		display: inline-block;
	}

	form.collapsed:not(:focus-within)
	{
		input[type=search]
		{
			width: 36px;
			padding-right: unset;

			color: transparent;
			background-color: transparent;
			border-color: transparent;

			cursor: pointer;

			&::placeholder
			{
				opacity: 0;
			}

			&.small
			{
				width: 28px;
			}
		}

		input[type=submit]
		{
			pointer-events: none;
		}
	}

</style>

<form class:collapsed onsubmit={onSubmit}>
	<input type="search"
		bind:value={value}
		onchange={onChange}
		class:small
		placeholder={placeholder}
		aria-label={ariaLabel}
	/><input type="submit"
		value=""
		class:small
		aria-label="Search"
	/>
</form>
