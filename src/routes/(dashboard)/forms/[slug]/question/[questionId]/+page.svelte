<script lang="ts">
	import { Button, Input, InputWrapper, NativeSelect, Switch, Textarea } from '@svelteuidev/core';

	import { receiveQuestion } from '$lib/forms/service/stores/question';

	export let data;
	receiveQuestion(data);

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let dataAux =
		typeof data.question.data === 'string' ? JSON.parse(data.question.data) : data.question.data;

	dataAux = {
		canMultiple: dataAux.canMultiple ?? false,
		required: dataAux.required ?? false,
		options: dataAux.options ?? []
	};

	type Step<Type extends string, Data extends object> = {
		title: string;
		description: string;
		type: Type;
		data: Data;
	};

	type FormStep = FormStepText | FormStepQuestionText | FormStepOptions;
	type FormStepText = Step<'text', {}>;
	type FormStepQuestionText = Step<'questionText', { required: boolean }>;
	type FormStepOptions = Step<
		'options',
		{
			canMultiple: boolean;
			required: boolean;
			options: Array<string>;
		}
	>;

	let title = data.question.title;
	let description = data.question.description;
	let type = data.question.type;

	let newData = '';
	let newDataError = '';

	$: result = {
		title,
		description,
		type,
		data:
			type === 'options'
				? {
						canMultiple: dataAux.canMultiple,
						required: dataAux.required,
						options: dataAux.options
					}
				: type === 'questionText'
					? { required: dataAux.required }
					: {}
	} as FormStep;

	function handleClick() {
		if (!newData && type === 'options') {
			newDataError = 'Please enter a new option';
			return;
		}

		if (type === 'options') {
			(result.data as FormStepOptions['data']).options = [
				...(result.data as FormStepOptions['data']).options,
				newData
			];
			newData = '';
			newDataError = '';
		}
	}

	async function handleDelete() {
		try {
			const response = await fetch(window.location.href, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					question_id: parseInt($page.params.questionId)
				})
			});

			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			goto(`/forms/${$page.params.slug}`);
		} catch (error) {
			console.error(error);
		}
	}

	async function handleUpdate() {
		try {
			const dataToSend =
				type === 'options'
					? {
							canMultiple: (result.data as FormStepOptions['data']).canMultiple,
							required: (result.data as FormStepOptions['data']).required,
							options: (result.data as FormStepOptions['data']).options
						}
					: type === 'questionText'
						? { required: (result.data as FormStepQuestionText['data']).required }
						: {};

			await fetch(window.location.href, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id_question: parseInt($page.params.questionId),
					title,
					description,
					type,
					data: dataToSend
				})
			});
		} catch (error) {
			console.error('Error updating question:', error);
		}
	}
</script>

<Textarea placeholder="Once upon a time" label="Title" resize="vertical" bind:value={title} />
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
/>

{#if result.type === 'text'}
	<h2>{title}</h2>
	<p>{description}</p>
{:else if result.type === 'questionText'}
	<Switch label="Required" bind:checked={result.data.required} />
{:else if result.type === 'options'}
	<Switch label="Can Multiple" bind:checked={dataAux.canMultiple} />
	<Switch label="Required" bind:checked={dataAux.required} />

	<h3>Options</h3>
	{#each result.data.options as value, index (index)}
		<p>{value}</p>
	{/each}

	<h4>Add new option</h4>
	<InputWrapper
		id="new-value-input-wrapper"
		placeholder="Option"
		error={!newData ? newDataError : ''}
	>
		<Input id="new-value-input" bind:value={newData} />
	</InputWrapper>
	<Button on:click={handleClick}>Add option</Button>
{/if}

<div class="buttons">
	<Button on:click={handleDelete} color="red">Delete</Button>
	<Button on:click={handleUpdate} color="green">Update</Button>
</div>

<style>
	.buttons {
		display: flex;
		justify-content: space-between;
	}
</style>
