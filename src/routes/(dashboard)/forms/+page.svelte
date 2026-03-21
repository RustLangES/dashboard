<script lang="ts" context="module">
	import PageHeader from '$lib/presentation/PageHeader.svelte';
	import Card from '$lib/components/Card.svelte';
	import { forms } from '$lib/forms/service/stores/forms';
</script>

<PageHeader title="Forms" />

<div class="page">
	<ul class="grid">
		<!-- Create card -->
		<li>
			<Card href="/forms/create" clickable>
				<div class="create-card">
					<div class="create-card__icon">
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M12 5v14M5 12h14" />
						</svg>
					</div>
					<span>New Form</span>
				</div>
			</Card>
		</li>

		{#each $forms as form}
			<li>
				<Card href={'/forms/' + form.id} clickable>
					<div class="form-card">
						<div class="form-card__header">
							<h2 class="form-card__title">{form.title}</h2>
							{#if form.deleted === 1}
								<span class="form-card__deleted">Deleted</span>
							{/if}
						</div>
						{#if form.description}
							<p class="form-card__desc">{form.description}</p>
						{/if}
						{#if form.edition}
							<span class="form-card__edition">{form.edition}</span>
						{/if}
					</div>
				</Card>
			</li>
		{:else}
			<li class="empty">No forms yet — create your first one.</li>
		{/each}
	</ul>
</div>

<style>
	.page {
		padding: 1.5rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 0.75rem;
		list-style: none;
		max-width: 900px;
	}

	.grid li {
		display: flex;
	}

	.grid li :global(.card) {
		width: 100%;
	}

	/* Create card */
	.create-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: 80px;
		color: var(--p-500);
		font-size: 0.8rem;
		font-weight: 500;
	}

	.create-card__icon {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 1.5px dashed var(--p-700);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: border-color 0.15s;
	}

	.grid li:hover .create-card__icon {
		border-color: var(--p-400);
	}

	/* Form card */
	.form-card {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		min-height: 80px;
	}

	.form-card__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.form-card__title {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--n-100);
		line-height: 1.3;
		margin: 0;
	}

	.form-card__desc {
		font-size: 0.75rem;
		color: var(--n-500);
		line-height: 1.4;
		margin: 0;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.form-card__edition {
		display: inline-block;
		font-size: 0.65rem;
		font-weight: 600;
		color: var(--s-400);
		background: rgba(122, 91, 247, 0.12);
		border: 1px solid rgba(122, 91, 247, 0.2);
		border-radius: 4px;
		padding: 0.1rem 0.4rem;
		letter-spacing: 0.03em;
		margin-top: auto;
		width: fit-content;
	}

	.form-card__deleted {
		font-size: 0.65rem;
		font-weight: 600;
		color: var(--e-400);
		background: var(--e-950);
		border: 1px solid rgba(249, 116, 128, 0.2);
		border-radius: 4px;
		padding: 0.1rem 0.4rem;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.empty {
		font-size: 0.85rem;
		color: var(--n-600);
		padding: 0.75rem 0;
		grid-column: 1 / -1;
	}
</style>
