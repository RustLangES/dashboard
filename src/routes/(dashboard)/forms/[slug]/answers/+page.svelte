<script lang="ts">
	import { page } from '$app/stores';
	import type { Session } from '$lib/forms/models';
	import { receiveSessions } from '$lib/forms/service/stores/sessions';
	import Badge from '$lib/components/Badge.svelte';
	import Tag from '$lib/components/Tag.svelte';

	enum Filter {
		All = 'All',
		Completed = 'Completed',
		Pending = 'Pending'
	}

	export let data;
	receiveSessions(data);
	let filter: Filter = Filter.All;

	$: visible = data.sessions
		.map(
			(
				session: Session & { completed: number; external: { email: string }; id: number },
				i: number
			) => ({ session, i })
		)
		.filter(
			({ session }) =>
				filter === Filter.All ||
				(filter === Filter.Completed && session.completed === 1) ||
				(filter === Filter.Pending && session.completed === 0)
		);
</script>

<svelte:head><title>Answers - RustLangES Dashboard</title></svelte:head>

<div class="page">
	<h2 class="page__title">Answers</h2>

	<div class="toolbar">
		<span class="toolbar__count">{visible.length} sessions</span>
		<div class="toolbar__filters">
			{#each Object.values(Filter) as f}
				<Tag label={f} selected={filter === f} on:click={() => (filter = f)} />
			{/each}
		</div>
	</div>

	<ul class="list">
		{#each visible as { session, i }}
			<li>
				<a href={`${$page.url.pathname}/${session.id}`} class="session-row">
					<div class="session-row__info">
						<span class="session-row__label">Session #{i + 1}</span>
						<span class="session-row__email">{session.external.email}</span>
					</div>
					<Badge variant={session.completed === 1 ? 'completed' : 'pending'} type="text" />
				</a>
			</li>
		{:else}
			<li class="empty">No sessions found.</li>
		{/each}
	</ul>
</div>

<style>
	.page {
		padding: 1.5rem;
		max-width: 760px;
	}

	.page__title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--n-100);
		letter-spacing: -0.01em;
		margin-bottom: 1.25rem;
	}

	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.toolbar__count {
		font-size: 0.78rem;
		color: var(--n-500);
		font-weight: 500;
	}

	.toolbar__filters {
		display: flex;
		gap: 0.375rem;
	}

	.list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.session-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: 7px;
		text-decoration: none;
		transition:
			border-color 0.12s,
			background-color 0.12s;
	}

	.session-row:hover {
		border-color: var(--border-hover);
		background: var(--surface-3);
	}

	.session-row__info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.session-row__label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--n-200);
	}

	.session-row__email {
		font-size: 0.72rem;
		color: var(--n-500);
	}

	.empty {
		font-size: 0.85rem;
		color: var(--n-600);
		padding: 1rem 0;
	}
</style>
