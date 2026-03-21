<script lang="ts">
	import PageHeader from '$lib/presentation/PageHeader.svelte';
	import Button from '$lib/components/Button.svelte';
	import { Divider, Switch, TextInput, Tooltip } from '@svelteuidev/core';

	import type { Form, Question } from '$lib/forms/models';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data: { form: Form; questions: Question[] };

	let title = data.form.title;
	let require_login = data.form.require_login === 1;
	let edition = data.form.edition;
	let multiple_times = data.form.multiple_times === 1;
	let description = data.form.description;

	function handleClick() {
		goto(`/forms/${$page.params.slug}/question/create`);
	}

	async function handleDelete() {
		try {
			const response = await fetch(window.location.href, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ form_id: parseInt($page.params.slug) })
			});
			if (!response.ok) throw new Error(`${response.status}`);
			goto('/forms');
		} catch (error) {
			console.error(error);
		}
	}

	async function handleUpdate() {
		try {
			const response = await fetch(`/forms/${$page.params.slug}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id_form: parseInt($page.params.slug),
					title,
					require_login,
					edition,
					multiple_times,
					description
				})
			});
			if (!response.ok) throw new Error(`${response.status}`);
		} catch (error) {
			console.error('Error updating form:', error);
		}
	}
</script>

<PageHeader {title}>
	<Button variant="ghost" on:click={() => goto(`/forms/${$page.params.slug}/answers`)}>
		Answers
	</Button>
	<Button variant="primary" on:click={handleUpdate}>Update</Button>
	<Button variant="danger" on:click={handleDelete}>Delete</Button>
</PageHeader>

<div class="editor">
	<section class="editor__fields">
		<div class="field-group">
			<TextInput
				label="Description"
				size="xs"
				placeholder="Write a description"
				bind:value={description}
			/>
			<TextInput label="Edition" size="xs" placeholder="Write an edition" bind:value={edition} />
		</div>

		<div class="toggles">
			<Tooltip label="The user requires login to respond to this form">
				<Switch label="Require login" bind:checked={require_login} />
			</Tooltip>
			<Tooltip label="The user can respond multiple times">
				<Switch label="Multiple times" bind:checked={multiple_times} />
			</Tooltip>
		</div>

		<div class="questions-section">
			<div class="questions-section__header">
				<span class="questions-section__title">Questions</span>
				<Button on:click={handleClick}>+ New</Button>
			</div>
			<ul class="questions-list">
				{#each data.questions as question}
					<li>
						<a href={`/forms/${data.form.id}/question/${question.id}`} class="question-link">
							<span class="question-link__dot" />
							{question.title}
						</a>
					</li>
				{:else}
					<li class="questions-empty">No questions yet</li>
				{/each}
			</ul>
		</div>
	</section>

	<div class="editor__divider">
		<Divider orientation="vertical" />
	</div>

	<aside class="editor__preview">
		<slot />
	</aside>
</div>

<style>
	.editor {
		display: grid;
		grid-template-columns: 340px 1px 1fr;
		height: calc(100vh - 56px);
		overflow: hidden;
	}

	.editor__fields {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		overflow-y: auto;
	}

	.field-group {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}

	.toggles {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		padding: 0.875rem;
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: 8px;
	}

	.questions-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.questions-section__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.questions-section__title {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--n-400);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.questions-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.question-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.45rem 0.5rem;
		border-radius: 5px;
		color: var(--n-300);
		text-decoration: none;
		font-size: 0.82rem;
		transition:
			background-color 0.12s,
			color 0.12s;
	}

	.question-link:hover {
		background: rgba(255, 255, 255, 0.05);
		color: var(--n-100);
	}

	.question-link__dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--n-600);
		flex-shrink: 0;
	}

	.question-link:hover .question-link__dot {
		background: var(--p-500);
	}

	.questions-empty {
		font-size: 0.8rem;
		color: var(--n-600);
		padding: 0.5rem;
	}

	.editor__divider {
		background: var(--border);
	}

	.editor__preview {
		overflow: hidden;
		padding: 1.25rem;
	}
</style>
