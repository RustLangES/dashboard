<script lang="ts">
	import PageHeader from '$lib/presentation/PageHeader.svelte';
	import { Button, Divider, Switch, TextInput, Tooltip } from '@svelteuidev/core';

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
		const id = $page.params.slug;
		goto(`/forms/${id}/question/create`);
	}

	async function handleDelete() {
		try {
			const response = await fetch(window.location.href, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					form_id: parseInt($page.params.slug)
				})
			});

			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			goto(`/forms`);
		} catch (error) {
			console.error(error);
		}
	}

	async function handleUpdate() {
		try {
			const response = await fetch(`/forms/${$page.params.slug}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id_form: parseInt($page.params.slug),
					title,
					require_login,
					edition,
					multiple_times,
					description
				})
			});

			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}
		} catch (error) {
			console.error('Error updating form:', error);
		}
	}

	async function handleAnswers() {
		const id = $page.params.slug;
		goto(`/forms/${id}/answers`);
	}
</script>

<PageHeader {title}>
	<Button on:click={handleDelete} color="red">Delete</Button>
</PageHeader>

<div class="form-container">
	<section class="form-container__details">
		<TextInput
			label="Description"
			size="xs"
			placeholder="Write a description"
			bind:value={description}
		/>

		<TextInput
			label="Edition"
			size="xs"
			placeholder="Write a description"
			bind:value={edition}
		/>

		<Tooltip label="The user require login to response this form">
			<Switch label="Require login" bind:checked={require_login} />
		</Tooltip>

		<Tooltip label="The user can response this form multiple times">
			<Switch label="Multiple times" bind:checked={multiple_times} />
		</Tooltip>

		<div class="form-container__new-question">
			<h3 class="form-container__new-question-title">Questions</h3>
			<Button on:click={handleClick}>New question</Button>
		</div>
		<ul class="form-container__questions-list">
			{#each data.questions as question}
				<li>
					<a href={`/forms/${data.form.id}/question/${question.id}`}>{question.title}</a>
				</li>
			{:else}
				<li>No questions avilable</li>
			{/each}
		</ul>
		<div class="form-container__footer">
			<Button on:click={handleAnswers} color="orange">View Answers</Button>
			<Button on:click={handleUpdate} color="green">Update</Button>
		</div>
	</section>

	<Divider orientation="vertical" mx="xl" />

	<aside class="form-container__previewer">
		<slot />
	</aside>
</div>

<style>
	.form-container {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		padding-right: 20px;
		margin: 20px;
	}

	.form-container__details {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-container__questions-list {
		/* list-style: none; WHY */
		margin: 0 3rem;
	}

	.form-container__new-question {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.form-container__new-question-title {
		margin: 0;
	}

	.form-container__footer{
		display: flex;
		justify-content: space-between;
		align-items: center;

	}

	.form-container__previewer {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
</style>
