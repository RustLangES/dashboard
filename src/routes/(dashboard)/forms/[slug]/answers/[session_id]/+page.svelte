<script lang="ts">
	import { receiveSessionDetails } from '$lib/forms/service/stores/session';
	import { page } from '$app/stores';
	import type { Answer, Question } from '$lib/forms/models';

	export let data: {
		sessionDetails: {
			token: string;
			answers: Answer[];
			created_at: number;
			external: { email: string };
		};
		questions: Question[];
	};

	receiveSessionDetails(data);

	const completed = !data.sessionDetails.token;
	const email = data.sessionDetails.external?.email ?? '—';
	const createdAt = new Date(data.sessionDetails.created_at * 1000).toLocaleString();

	function getQuestion(id: number): Question | undefined {
		return data.questions.find((q) => q.id === id);
	}

	function answersForQuestion(questionId: number): Answer | undefined {
		return data.sessionDetails.answers.find((a) => a.question_id === questionId);
	}

	$: answersListUrl = `/forms/${$page.params.slug}/answers`;
</script>

<div class="detail">
	<div class="detail__header">
		<a href={answersListUrl} class="back-link">
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M19 12H5M12 5l-7 7 7 7" />
			</svg>
			Back to sessions
		</a>

		<div class="session-card">
			<div class="session-card__info">
				<span class="session-card__email">{email}</span>
				<span class="session-card__date">{createdAt}</span>
			</div>
			<span class="badge" class:badge--completed={completed} class:badge--pending={!completed}>
				{completed ? 'Completed' : 'In progress'}
			</span>
		</div>
	</div>

	<div class="answers">
		{#each data.questions as question, i}
			{@const answer = answersForQuestion(question.id)}
			{#if question.type !== 'text'}
				<div class="answer-card" class:answer-card--empty={!answer?.data}>
					<div class="answer-card__meta">
						<span class="answer-card__index">#{i + 1}</span>
						<span class="answer-card__type">{question.type === 'options' ? 'Options' : 'Text'}</span
						>
					</div>
					<p class="answer-card__question">{question.title}</p>
					{#if answer?.data}
						<div class="answer-card__answer">{answer.data}</div>
					{:else}
						<div class="answer-card__empty">No answer</div>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.detail {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 680px;
	}

	/* ── Back + session card ── */
	.detail__header {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.78rem;
		color: var(--n-500);
		text-decoration: none;
		transition: color 0.12s;
		width: fit-content;
	}

	.back-link:hover {
		color: var(--n-200);
	}

	.session-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem;
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: 10px;
	}

	.session-card__info {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.session-card__email {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--n-100);
	}

	.session-card__date {
		font-size: 0.72rem;
		color: var(--n-500);
	}

	/* ── Status badge ── */
	.badge {
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.25rem 0.625rem;
		border-radius: 9999px;
	}

	.badge--completed {
		background: rgba(14, 169, 85, 0.12);
		color: #4ade80;
		border: 1px solid rgba(14, 169, 85, 0.25);
	}

	.badge--pending {
		background: var(--a-950);
		color: var(--a-300);
		border: 1px solid rgba(240, 176, 66, 0.25);
	}

	/* ── Answers list ── */
	.answers {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.answer-card {
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 1rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.answer-card--empty {
		opacity: 0.6;
	}

	.answer-card__meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.answer-card__index {
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--n-600);
	}

	.answer-card__type {
		font-size: 0.68rem;
		font-weight: 600;
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		background: rgba(122, 91, 247, 0.1);
		color: var(--s-400);
		border: 1px solid rgba(122, 91, 247, 0.18);
	}

	.answer-card__question {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--n-200);
		line-height: 1.35;
	}

	.answer-card__answer {
		font-size: 0.85rem;
		color: var(--n-100);
		background: var(--surface-3);
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.5rem 0.75rem;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.answer-card__empty {
		font-size: 0.78rem;
		color: var(--n-600);
		font-style: italic;
	}
</style>
