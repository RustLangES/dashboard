<script lang="ts">
	export let label: string = '';
	export let selected = false;
</script>

<button class="tag" class:tag--selected={selected} on:click>
	{label}
</button>

<style>
	.tag {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.625rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--n-400);
		transition:
			border-color 0.12s,
			color 0.12s,
			background-color 0.12s;
		font-family: inherit;
		letter-spacing: 0.01em;
	}

	.tag:hover {
		border-color: var(--p-600);
		color: var(--n-200);
	}

	.tag--selected {
		background: rgba(241, 94, 31, 0.15);
		border-color: var(--p-500);
		color: var(--p-300);
	}
</style>
