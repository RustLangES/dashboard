<script lang="ts">
	export let variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon' = 'primary';
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
</script>

<button {type} {disabled} class="btn btn--{variant}" on:click>
	<slot />
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		border-radius: 6px;
		font-size: 0.8rem;
		font-weight: 550;
		font-family: inherit;
		cursor: pointer;
		transition:
			background-color 0.12s,
			border-color 0.12s,
			opacity 0.12s,
			box-shadow 0.12s;
		border: 1px solid transparent;
		padding: 0.45rem 0.875rem;
		letter-spacing: 0.01em;
		line-height: 1;
		white-space: nowrap;
	}

	.btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		pointer-events: none;
	}

	/* primary — naranja */
	.btn--primary {
		background: var(--p-500);
		color: #fff;
		border-color: var(--p-500);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	}
	.btn--primary:hover {
		background: var(--p-600);
		border-color: var(--p-600);
	}

	/* secondary — outline naranja */
	.btn--secondary {
		background: transparent;
		color: var(--n-200);
		border-color: var(--n-700);
	}
	.btn--secondary:hover {
		border-color: var(--p-500);
		color: var(--p-400);
	}

	/* ghost — sin fondo */
	.btn--ghost {
		background: transparent;
		color: var(--p-400);
		border-color: transparent;
	}
	.btn--ghost:hover {
		background: rgba(241, 94, 31, 0.1);
	}

	/* danger — rojo */
	.btn--danger {
		background: transparent;
		color: var(--e-400);
		border-color: var(--e-800);
	}
	.btn--danger:hover {
		background: var(--e-950);
		border-color: var(--e-600);
	}

	/* icon — solo icono */
	.btn--icon {
		background: transparent;
		color: var(--n-300);
		border-color: transparent;
		padding: 0.4rem;
		border-radius: 6px;
	}
	.btn--icon:hover {
		background: rgba(255, 255, 255, 0.06);
		color: var(--n-100);
	}
</style>
