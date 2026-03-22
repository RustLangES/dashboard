<script lang="ts">
	import type { Form, Question } from '$lib/forms/models';

	export let data: { form: Form; questions: Question[] };

	function parsed(q: Question): Record<string, unknown> {
		if (typeof q.data === 'string') {
			try {
				return JSON.parse(q.data);
			} catch {
				return {};
			}
		}
		return (q.data as Record<string, unknown>) ?? {};
	}
</script>

<div class="preview">
	<div class="preview__form">
		<!-- Form header -->
		<div class="form-header">
			{#if data.form.edition}
				<span class="form-header__edition">{data.form.edition}</span>
			{/if}
			<h1 class="form-header__title">{data.form.title}</h1>
			{#if data.form.description}
				<p class="form-header__desc">{data.form.description}</p>
			{/if}
			<div class="form-header__meta">
				{#if data.form.require_login === 1}
					<span class="meta-tag">
						<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
						Requires login
					</span>
				{/if}
				{#if data.form.multiple_times === 1}
					<span class="meta-tag">
						<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
						</svg>
						Multiple responses allowed
					</span>
				{/if}
			</div>
		</div>

		<!-- Questions -->
		{#if data.questions.length === 0}
			<div class="empty">No questions added yet.</div>
		{:else}
			{#each data.questions as question, i}
				{@const d = parsed(question)}
				<div class="question-card" class:question-card--text={question.type === 'text'}>
					{#if question.type === 'text'}
						<!-- Text block (no input) -->
						<h2 class="text-block__title">{question.title}</h2>
						{#if question.description}
							<p class="text-block__desc">{question.description}</p>
						{/if}
					{:else}
						<div class="question-card__header">
							<span class="question-card__num">#{i + 1}</span>
							{#if d.required}
								<span class="required-badge">Required</span>
							{/if}
						</div>
						<p class="question-card__title">{question.title}</p>
						{#if question.description}
							<p class="question-card__desc">{question.description}</p>
						{/if}

						{#if question.type === 'questionText'}
							<div class="input-mock">Type your answer…</div>
						{:else if question.type === 'options'}
							{@const opts = Array.isArray(d.options) ? d.options : []}
							{#if d.canMultiple}
								<span class="multi-hint">Select all that apply</span>
							{/if}
							{#if opts.length === 0}
								<p class="options-empty">No options defined</p>
							{:else}
								<ul class="options">
									{#each opts as opt}
										<li class="options__item">
											<span class="options__box" class:options__box--round={!d.canMultiple} />
											{opt}
										</li>
									{/each}
								</ul>
							{/if}
						{/if}
					{/if}
				</div>
			{/each}

			<button class="submit-btn" disabled>Submit</button>
		{/if}
	</div>
</div>

<style>
	.preview {
		height: 100%;
		overflow-y: auto;
		padding: 2rem 1.5rem;
		background: var(--bg);
	}

	.preview__form {
		max-width: 600px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* ── Form header ── */
	.form-header {
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-top: 3px solid var(--p-500);
		border-radius: 10px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-header__edition {
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--p-400);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.form-header__title {
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--n-100);
		line-height: 1.3;
		margin: 0;
	}

	.form-header__desc {
		font-size: 0.875rem;
		color: var(--n-400);
		line-height: 1.6;
		margin: 0;
	}

	.form-header__meta {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 0.25rem;
	}

	.meta-tag {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--n-500);
		background: var(--surface-3);
		border: 1px solid var(--border);
		border-radius: 9999px;
		padding: 0.2rem 0.6rem;
	}

	/* ── Question cards ── */
	.question-card {
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.question-card--text {
		background: transparent;
		border-color: transparent;
		padding: 0.25rem 0;
	}

	.question-card__header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.question-card__num {
		font-size: 0.68rem;
		font-weight: 600;
		color: var(--n-600);
	}

	.required-badge {
		font-size: 0.65rem;
		font-weight: 600;
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		background: var(--e-950);
		color: var(--e-400);
		border: 1px solid rgba(249, 116, 128, 0.2);
	}

	.question-card__title {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--n-100);
		line-height: 1.4;
		margin: 0;
	}

	.question-card__desc {
		font-size: 0.82rem;
		color: var(--n-400);
		line-height: 1.5;
		margin: 0;
	}

	/* Text block */
	.text-block__title {
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--n-200);
		margin: 0;
	}

	.text-block__desc {
		font-size: 0.85rem;
		color: var(--n-400);
		line-height: 1.6;
		margin: 0;
	}

	/* Input mock */
	.input-mock {
		background: var(--surface-3);
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.6rem 0.75rem;
		font-size: 0.82rem;
		color: var(--n-600);
		font-style: italic;
		min-height: 2.5rem;
	}

	/* Options */
	.multi-hint {
		font-size: 0.72rem;
		color: var(--n-500);
		font-style: italic;
	}

	.options {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.options__item {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: var(--surface-3);
		font-size: 0.85rem;
		color: var(--n-200);
	}

	.options__box {
		width: 14px;
		height: 14px;
		border: 1.5px solid var(--n-600);
		border-radius: 3px;
		flex-shrink: 0;
	}

	.options__box--round {
		border-radius: 50%;
	}

	.options-empty {
		font-size: 0.78rem;
		color: var(--n-600);
		font-style: italic;
		margin: 0;
	}

	/* Submit */
	.submit-btn {
		align-self: flex-end;
		padding: 0.55rem 1.5rem;
		border-radius: 6px;
		border: none;
		background: var(--p-500);
		color: #fff;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: not-allowed;
		opacity: 0.5;
		font-family: inherit;
	}

	.empty {
		font-size: 0.85rem;
		color: var(--n-600);
		text-align: center;
		padding: 3rem 0;
	}
</style>
