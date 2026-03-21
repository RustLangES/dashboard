<script lang="ts">
	export let clickable = false;
	export let disabled = false;
	export let href: string | undefined = undefined;
</script>

{#if href}
	<a {href} class="card" class:card--clickable={clickable} class:card--disabled={disabled}>
		<slot />
	</a>
{:else}
	<div
		class="card"
		class:card--clickable={clickable}
		class:card--disabled={disabled}
		on:click
		role={clickable ? 'button' : undefined}
		tabindex={clickable ? 0 : undefined}
	>
		<slot />
	</div>
{/if}

<style>
	.card {
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 1rem;
		color: var(--n-100);
		text-decoration: none;
		display: block;
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
	}

	.card--clickable {
		cursor: pointer;
	}

	.card--clickable:hover {
		border-color: var(--border-hover);
		box-shadow:
			0 0 0 1px rgba(241, 94, 31, 0.15),
			0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.card--disabled {
		opacity: 0.4;
		cursor: not-allowed;
		pointer-events: none;
	}
</style>
