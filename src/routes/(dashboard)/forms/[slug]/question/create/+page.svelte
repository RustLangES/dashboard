<script lang="ts">
	import { Button, Input, InputWrapper, NativeSelect, Switch, Textarea } from '@svelteuidev/core';
	import type { Question, QuestionOptions } from '$lib/forms/models';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let title = '';
	let titleError = '';
	let description = '';
	let type: 'text' | 'questionText' | 'options' | '' = '';
	let typeError = '';

	let newData = '';
	let newDataError = '';

	$: result = {
		title,
		description,
		type,
		data:
			type === 'options'
				? { canMultiple: false, required: false, options: [] }
				: type === 'questionText'
					? { required: false }
					: {}
	} as Question;

	function handleClick() {
		if (!newData && type === 'options') {
			newDataError = 'Please enter a new option';
			return;
		}

		if (type === 'options') {
			(result.data as QuestionOptions['data']).options = [
				...(result.data as QuestionOptions['data']).options,
				newData
			];
			newData = '';
			newDataError = '';
		}
	}

	async function createQuestion() {
		if (!title || !type) {
			if (!title) {
				titleError = 'Please write a title babosx';
			}

			if (!type) {
				typeError = 'Please select a type';
			}

			return;
		}

		try {
			const response = await fetch(window.location.href, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					form_id: parseInt($page.params.slug),
					title,
					description,
					type,
					data: JSON.stringify(result.data)
				})
			});

			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			const questionId = await response.json();

			goto(`/forms/${$page.params.slug}/question/${questionId}`);
		} catch (error) {
			console.error(error);
		}
	}
</script>

<Textarea
	placeholder="Once upon a time"
	label="Title"
	resize="vertical"
	bind:value={title}
	error={titleError}
	required
/>
<Textarea
	placeholder="Once upon a time"
	label="Description"
	resize="vertical"
	bind:value={description}
/>

<NativeSelect
	data={['text', 'questionText', 'options']}
	placeholder="Pick one"
	label="Select your type"
	size="md"
	bind:value={type}
	error={typeError}
	required
/>

{#if result.type === 'text'}
	<h2>{title}</h2>
	<p>{description}</p>
{:else if result.type === 'questionText'}
	<Switch label="Required" bind:checked={result.data.required} />
{:else if result.type === 'options'}
	<Switch label="Can Multiple" bind:checked={result.data.canMultiple} />
	<Switch label="Required" bind:checked={result.data.required} />

	<h3>Options</h3>
	<ul>
	{#each result.data.options as value, index (index)}
		<li>
			<p>{value}</p>
		</li>
	{/each}
	</ul>

	<InputWrapper
		id="new-value-input-wrapper"
		placeholder="Option"
		label="Add new option"
		override={{".label__add_new_option": { fontWeight: "bold" }}}
		labelProps={{class: "label__add_new_option"}}
		error={!newData ? newDataError : ''}
	>
		<Input id="new-value-input" bind:value={newData} />
	</InputWrapper>
	<Button on:click={handleClick}>Create option</Button>
{/if}

<Button on:click={createQuestion}>Create question</Button>

<style>
	ul{
		margin: 0 3rem;
	}
</style>