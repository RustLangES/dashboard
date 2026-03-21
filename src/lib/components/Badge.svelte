<script lang="ts">
	export let variant: 'completed' | 'reading' | 'pending' | 'unread' = 'unread';
	export let type: 'default' | 'numeric' | 'text' = 'default';
	export let count: number = 0;

	const LABELS: Record<string, string> = {
		completed: 'Completo',
		reading: 'Leyendo',
		pending: 'Pendiente',
		unread: 'No leído'
	};

	$: displayValue = type === 'numeric' ? (count > 9 ? '+9' : String(count)) : LABELS[variant];
</script>

<span class="badge badge--{variant}">
	{#if type !== 'numeric'}
		<div class="badge__dot" />
	{/if}
	<span>{displayValue}</span>
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.2rem 0.55rem;
		border-radius: 9999px;
		font-size: 0.7rem;
		font-weight: 600;
		white-space: nowrap;
		border: 1px solid transparent;
		letter-spacing: 0.02em;
	}

	.badge__dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	/* completed — éxito */
	.badge--completed {
		background: var(--x-950);
		color: var(--x-400);
		border-color: rgba(69, 232, 127, 0.2);
	}
	.badge--completed .badge__dot {
		background: var(--x-500);
	}

	/* reading — alerta */
	.badge--reading {
		background: var(--a-950);
		color: var(--a-300);
		border-color: rgba(240, 176, 66, 0.2);
	}
	.badge--reading .badge__dot {
		background: var(--a-400);
	}

	/* pending — error */
	.badge--pending {
		background: var(--e-950);
		color: var(--e-400);
		border-color: rgba(249, 116, 128, 0.2);
	}
	.badge--pending .badge__dot {
		background: var(--e-500);
	}

	/* unread — neutral */
	.badge--unread {
		background: var(--surface-3);
		color: var(--n-400);
		border-color: var(--border);
	}
	.badge--unread .badge__dot {
		background: var(--n-500);
	}
</style>
