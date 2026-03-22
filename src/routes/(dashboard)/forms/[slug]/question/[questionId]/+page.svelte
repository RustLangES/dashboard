<script lang="ts">
	import { NativeSelect, Textarea } from '@svelteuidev/core';
	import Button from '$lib/components/Button.svelte';
	import { receiveQuestion } from '$lib/forms/service/stores/question';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { showSuccessToast, showErrorToast } from '../../../../../../utils/swalFunctions';

	export let data;

	let title: string;
	let description: string;
	let type: string;
	let required = false;
	let canMultiple = false;
	let newOption = '';
	let newOptionError = '';
	let options: string[] = [];
	let lastQuestionId: number | undefined;

	let savedTitle: string;
	let savedDescription: string;
	let savedType: string;
	let savedRequired = false;
	let savedCanMultiple = false;
	let savedOptions: string[] = [];

	// Only re-initialize state when navigating to a different question
	$: if (data.question.id !== lastQuestionId) {
		lastQuestionId = data.question.id;
		receiveQuestion(data);
		const raw =
			typeof data.question.data === 'string' ? JSON.parse(data.question.data) : data.question.data;
		required = raw.required ?? false;
		canMultiple = raw.canMultiple ?? false;
		title = data.question.title;
		description = data.question.description;
		type = data.question.type;
		options = raw.options ?? [];
		newOption = '';
		newOptionError = '';
		savedTitle = title;
		savedDescription = description;
		savedType = type;
		savedRequired = required;
		savedCanMultiple = canMultiple;
		savedOptions = [...options];
	}

	$: isDirty =
		title !== savedTitle ||
		description !== savedDescription ||
		type !== savedType ||
		required !== savedRequired ||
		canMultiple !== savedCanMultiple ||
		JSON.stringify(options) !== JSON.stringify(savedOptions);

	function addOption() {
		if (!newOption) {
			newOptionError = 'Please enter an option';
			return;
		}
		options = [...options, newOption];
		newOption = '';
		newOptionError = '';
	}

	function removeOption(i: number) {
		options = options.filter((_, idx) => idx !== i);
	}

	async function handleDelete() {
		try {
			const res = await fetch(window.location.href, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ question_id: parseInt($page.params.questionId) })
			});
			if (!res.ok) throw new Error(`${res.status}`);
			await showSuccessToast('Pregunta eliminada');
			goto(`/forms/${$page.params.slug}`);
		} catch (e) {
			console.error(e);
			showErrorToast('Error al eliminar la pregunta');
		}
	}

	async function handleUpdate() {
		try {
			const dataToSend =
				type === 'options'
					? { canMultiple, required, options }
					: type === 'questionText'
						? { required }
						: {};
			const res = await fetch(window.location.href, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id_question: parseInt($page.params.questionId),
					title,
					description,
					type,
					data: dataToSend
				})
			});
			if (!res.ok) throw new Error(`${res.status}`);
			savedTitle = title;
			savedDescription = description;
			savedType = type;
			savedRequired = required;
			savedCanMultiple = canMultiple;
			savedOptions = [...options];
			showSuccessToast('Pregunta guardada');
		} catch (e) {
			console.error(e);
			showErrorToast('Error al guardar la pregunta');
		}
	}
</script>

<div class="question-editor">
	<!-- Left: edit form -->
	<div class="editor-panel">
		<div class="section">
			<Textarea label="Title" placeholder="Question title" resize="vertical" bind:value={title} />
			<Textarea
				label="Description"
				placeholder="Optional description"
				resize="vertical"
				bind:value={description}
			/>
		</div>

		<div class="section">
			<NativeSelect data={['text', 'questionText', 'options']} label="Type" bind:value={type} />
		</div>

		{#if type === 'questionText'}
			<div class="section section--toggles">
				<label class="toggle-row">
					<input type="checkbox" bind:checked={required} />
					Required
				</label>
			</div>
		{:else if type === 'options'}
			<div class="section section--toggles">
				<label class="toggle-row">
					<input type="checkbox" bind:checked={canMultiple} />
					Allow multiple answers
				</label>
				<label class="toggle-row">
					<input type="checkbox" bind:checked={required} />
					Required
				</label>
			</div>

			<div class="section">
				<p class="section__label">Options</p>
				<ul class="options-list">
					{#each options as opt, i}
						<li class="options-list__item">
							<span class="options-list__dot" />
							<span class="options-list__text">{opt}</span>
							<button
								class="options-list__remove"
								on:click={() => removeOption(i)}
								aria-label="Remove"
							>
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
								>
									<path d="M18 6L6 18M6 6l12 12" />
								</svg>
							</button>
						</li>
					{:else}
						<li class="options-list__empty">No options yet</li>
					{/each}
				</ul>

				<div class="add-option">
					<input
						class="add-option__input"
						class:add-option__input--error={newOptionError}
						placeholder="New option…"
						bind:value={newOption}
						on:keydown={(e) => e.key === 'Enter' && addOption()}
					/>
					<Button on:click={addOption}>Add</Button>
				</div>
				{#if newOptionError}
					<span class="error-msg">{newOptionError}</span>
				{/if}
			</div>
		{/if}

		<div class="footer">
			<Button variant="danger" on:click={handleDelete}>Delete</Button>
			<Button variant="primary" disabled={!isDirty} on:click={handleUpdate}>Save changes</Button>
		</div>
	</div>

	<!-- Right: live preview -->
	<div class="preview-panel">
		<p class="preview-panel__label">Preview</p>

		<div class="preview-card">
			{#if type === 'text'}
				<h2 class="preview__title">{title || 'Question title'}</h2>
				{#if description}
					<p class="preview__desc">{description}</p>
				{/if}
				<div class="preview__type-badge">Text block</div>
			{:else if type === 'questionText'}
				<h2 class="preview__title">{title || 'Question title'}</h2>
				{#if description}
					<p class="preview__desc">{description}</p>
				{/if}
				{#if required}
					<span class="preview__required">Required</span>
				{/if}
				<div class="preview__input-mock">Type your answer…</div>
			{:else if type === 'options'}
				<h2 class="preview__title">{title || 'Question title'}</h2>
				{#if description}
					<p class="preview__desc">{description}</p>
				{/if}
				<div class="preview__meta">
					{#if required}<span class="preview__required">Required</span>{/if}
					{#if canMultiple}<span class="preview__multi">Multiple</span>{/if}
				</div>
				<ul class="preview__options">
					{#each options as opt}
						<li class="preview__option">
							<span class="preview__option-box" />
							{opt}
						</li>
					{:else}
						<li class="preview__option preview__option--empty">No options added</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>

<style>
	.question-editor {
		display: grid;
		grid-template-columns: 360px 1fr;
		height: 100%;
		overflow: hidden;
	}

	/* ── Editor panel ── */
	.editor-panel {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow-y: auto;
		border-right: 1px solid var(--border);
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.toggle-row {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--n-200);
		cursor: pointer;
		user-select: none;
	}

	.toggle-row input[type='checkbox'] {
		appearance: none;
		position: relative;
		width: 36px;
		height: 20px;
		min-width: 36px;
		border-radius: 9999px;
		background: var(--n-700);
		border: 1px solid rgba(255, 255, 255, 0.1);
		cursor: pointer;
		transition:
			background 0.15s,
			border-color 0.15s;
	}

	.toggle-row input[type='checkbox']::before {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--n-400);
		transition:
			transform 0.15s,
			background 0.15s;
	}

	.toggle-row input[type='checkbox']:checked {
		background: var(--p-500);
		border-color: var(--p-600);
	}

	.toggle-row input[type='checkbox']:checked::before {
		transform: translateX(16px);
		background: #fff;
	}

	.section--toggles {
		padding: 0.875rem;
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: 8px;
	}

	.section__label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--n-500);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	/* Options list */
	.options-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.options-list__item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.5rem;
		border-radius: 5px;
		background: var(--surface-2);
		border: 1px solid var(--border);
		font-size: 0.82rem;
		color: var(--n-200);
	}

	.options-list__dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--n-600);
		flex-shrink: 0;
	}

	.options-list__text {
		flex: 1;
	}

	.options-list__remove {
		display: flex;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--n-600);
		padding: 0.1rem;
		border-radius: 3px;
		transition:
			color 0.1s,
			background-color 0.1s;
		line-height: 0;
	}

	.options-list__remove:hover {
		color: var(--e-400);
		background: var(--e-950);
	}

	.options-list__empty {
		font-size: 0.78rem;
		color: var(--n-600);
		padding: 0.4rem 0.5rem;
	}

	/* Add option */
	.add-option {
		display: flex;
		gap: 0.5rem;
	}

	.add-option__input {
		flex: 1;
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.45rem 0.625rem;
		font-size: 0.82rem;
		color: var(--n-100);
		font-family: inherit;
		outline: none;
		transition: border-color 0.12s;
	}

	.add-option__input:focus {
		border-color: var(--p-500);
	}

	.add-option__input--error {
		border-color: var(--e-600);
	}

	.error-msg {
		font-size: 0.72rem;
		color: var(--e-400);
	}

	/* Footer */
	.footer {
		display: flex;
		justify-content: space-between;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border);
		margin-top: auto;
	}

	/* ── Preview panel ── */
	.preview-panel {
		padding: 1.5rem;
		overflow-y: auto;
		background: var(--bg);
	}

	.preview-panel__label {
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--n-600);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 1rem;
	}

	.preview-card {
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 560px;
	}

	.preview__title {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--n-100);
		line-height: 1.35;
		margin: 0;
	}

	.preview__desc {
		font-size: 0.85rem;
		color: var(--n-400);
		line-height: 1.5;
		margin: 0;
	}

	.preview__type-badge {
		display: inline-flex;
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		background: rgba(122, 91, 247, 0.12);
		color: var(--s-400);
		border: 1px solid rgba(122, 91, 247, 0.2);
		width: fit-content;
	}

	.preview__meta {
		display: flex;
		gap: 0.4rem;
	}

	.preview__required {
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
		background: var(--e-950);
		color: var(--e-400);
		border: 1px solid rgba(249, 116, 128, 0.2);
		width: fit-content;
	}

	.preview__multi {
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
		background: rgba(241, 94, 31, 0.1);
		color: var(--p-400);
		border: 1px solid rgba(241, 94, 31, 0.2);
		width: fit-content;
	}

	.preview__input-mock {
		background: var(--surface-3);
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.5rem 0.75rem;
		font-size: 0.82rem;
		color: var(--n-600);
		font-style: italic;
	}

	.preview__options {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.preview__option {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		font-size: 0.85rem;
		color: var(--n-200);
		padding: 0.4rem 0.5rem;
		border-radius: 5px;
		border: 1px solid var(--border);
		background: var(--surface-3);
	}

	.preview__option-box {
		width: 14px;
		height: 14px;
		border-radius: 3px;
		border: 1.5px solid var(--n-600);
		flex-shrink: 0;
	}

	.preview__option--empty {
		color: var(--n-600);
		font-style: italic;
		font-size: 0.78rem;
		background: none;
		border-color: transparent;
	}
</style>
