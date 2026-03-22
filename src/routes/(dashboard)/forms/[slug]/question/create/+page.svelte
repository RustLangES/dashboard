<script lang="ts">
	import { NativeSelect, Switch, Textarea } from '@svelteuidev/core';
	import Button from '$lib/components/Button.svelte';
	import type { Question, QuestionOptions } from '$lib/forms/models';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { showSuccessToast, showErrorToast } from '../../../../../../utils/swalFunctions';

	let title = '';
	let titleError = '';
	let description = '';
	let type: 'text' | 'questionText' | 'options' | '' = '';
	let typeError = '';
	let newOption = '';
	let newOptionError = '';

	$: result = {
		title,
		description,
		type,
		data:
			type === 'options'
				? { canMultiple: false, required: false, options: [] as string[] }
				: type === 'questionText'
					? { required: false }
					: {}
	} as Question;

	$: optionsData = type === 'options' ? (result.data as QuestionOptions['data']) : null;

	function addOption() {
		if (!newOption) {
			newOptionError = 'Please enter an option';
			return;
		}
		if (optionsData) optionsData.options = [...optionsData.options, newOption];
		newOption = '';
		newOptionError = '';
	}

	function removeOption(i: number) {
		if (!optionsData) return;
		optionsData.options = optionsData.options.filter((_, idx) => idx !== i);
	}

	async function createQuestion() {
		titleError = '';
		typeError = '';
		if (!title) {
			titleError = 'Title is required';
		}
		if (!type) {
			typeError = 'Please select a type';
		}
		if (!title || !type) return;

		try {
			const res = await fetch(window.location.href, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					form_id: parseInt($page.params.slug),
					title,
					description,
					type,
					data: JSON.stringify(result.data)
				})
			});
			if (!res.ok) throw new Error(`${res.status}`);
			const questionId = await res.json();
			await showSuccessToast('Pregunta creada');
			goto(`/forms/${$page.params.slug}/question/${questionId}`);
		} catch (e) {
			console.error(e);
			showErrorToast('Error al crear la pregunta');
		}
	}
</script>

<div class="question-creator">
	<!-- Left: form -->
	<div class="editor-panel">
		<div class="section">
			<Textarea
				label="Title"
				placeholder="What is the question?"
				resize="vertical"
				bind:value={title}
				error={titleError}
				required
			/>
			<Textarea
				label="Description"
				placeholder="Optional context or instructions"
				resize="vertical"
				bind:value={description}
			/>
		</div>

		<div class="section">
			<NativeSelect
				data={['text', 'questionText', 'options']}
				placeholder="Pick one"
				label="Type"
				bind:value={type}
				error={typeError}
				required
			/>
			{#if type}
				<div class="type-hints">
					{#if type === 'text'}
						<span class="type-hint">Displays a title and paragraph — no user input.</span>
					{:else if type === 'questionText'}
						<span class="type-hint">Free-text answer from the user.</span>
					{:else if type === 'options'}
						<span class="type-hint">Multiple choice — define options below.</span>
					{/if}
				</div>
			{/if}
		</div>

		{#if type === 'questionText'}
			<div class="section section--toggles">
				<Switch label="Required" bind:checked={result.data.required} />
			</div>
		{:else if type === 'options'}
			<div class="section section--toggles">
				<Switch label="Allow multiple answers" bind:checked={optionsData.canMultiple} />
				<Switch label="Required" bind:checked={optionsData.required} />
			</div>

			<div class="section">
				<p class="section__label">Options</p>
				<ul class="options-list">
					{#each optionsData.options as opt, i}
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
						<li class="options-list__empty">No options yet — add one below</li>
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
			<Button variant="secondary" on:click={() => history.back()}>Cancel</Button>
			<Button variant="primary" on:click={createQuestion}>Create question</Button>
		</div>
	</div>

	<!-- Right: live preview -->
	<div class="preview-panel">
		<p class="preview-panel__label">Preview</p>

		{#if !type}
			<div class="preview-empty">
				<svg
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
				>
					<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
				</svg>
				<span>Select a type to see preview</span>
			</div>
		{:else}
			<div class="preview-card">
				{#if type === 'text'}
					<h2 class="preview__title">{title || 'Question title'}</h2>
					{#if description}<p class="preview__desc">{description}</p>{/if}
					<div class="preview__type-badge">Text block</div>
				{:else if type === 'questionText'}
					<h2 class="preview__title">{title || 'Question title'}</h2>
					{#if description}<p class="preview__desc">{description}</p>{/if}
					{#if result.data.required}
						<span class="preview__required">Required</span>
					{/if}
					<div class="preview__input-mock">Type your answer…</div>
				{:else if type === 'options'}
					<h2 class="preview__title">{title || 'Question title'}</h2>
					{#if description}<p class="preview__desc">{description}</p>{/if}
					<div class="preview__meta">
						{#if result.data.required}<span class="preview__required">Required</span>{/if}
						{#if result.data.canMultiple}<span class="preview__multi">Multiple</span>{/if}
					</div>
					<ul class="preview__options">
						{#each optionsData.options as opt}
							<li class="preview__option">
								<span class="preview__option-box" />
								{opt}
							</li>
						{:else}
							<li class="preview__option preview__option--empty">No options added yet</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.question-creator {
		display: grid;
		grid-template-columns: 360px 1fr;
		height: 100%;
		overflow: hidden;
	}

	/* Editor */
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

	.type-hints {
		margin-top: -0.25rem;
	}

	.type-hint {
		font-size: 0.75rem;
		color: var(--n-500);
		font-style: italic;
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

	.footer {
		display: flex;
		justify-content: space-between;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border);
		margin-top: auto;
	}

	/* Preview */
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

	.preview-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		height: 200px;
		color: var(--n-700);
		font-size: 0.82rem;
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
