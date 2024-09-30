<script lang="ts">
	import { Button, Input, InputWrapper, NativeSelect, Switch, Textarea } from '@svelteuidev/core';
	import { receiveQuestion } from '$lib/forms/service/stores/question';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;
	receiveQuestion(data);

	let dataAux =
		typeof data.question.data === 'string' ? JSON.parse(data.question.data) : data.question.data;

	dataAux = {
		canMultiple: dataAux.canMultiple ?? false,
		required: dataAux.required ?? false,
		options: dataAux.options ?? []
	};

	let title = data.question.title;
	let description = data.question.description;
	let type = data.question.type;

	let newData = '';
	let newDataError = '';
	let options = dataAux.options ?? [];

	let result = {
		title,
		description,
		type,
		data:
			type === 'options'
				? { canMultiple: dataAux.canMultiple, required: dataAux.required, options }
				: type === 'questionText'
					? { required: dataAux.required }
					: {}
	};

	$: result.title = title;
	$: result.description = description;
	$: result.type = type;

	function handleClick() {
		if (!newData && type === 'options') {
			newDataError = 'Please enter a new option';
			return;
		}

		if (type === 'options') {
			options = [...options, newData];
			newData = '';
			newDataError = '';
		}
	}

	async function handleDelete() {
		try {
			const response = await fetch(window.location.href, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ question_id: parseInt($page.params.questionId) })
			});
			if (!response.ok) throw new Error(`Response status: ${response.status}`);
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
							canMultiple: dataAux.canMultiple,
							required: dataAux.required,
							options
						}
					: type === 'questionText'
						? {
								required: result.data.required
							}
						: {};
			await fetch(window.location.href, {
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
	<ul>
		{#each options as value, index (index)}
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
	ul{
		margin: 0 3rem;
	}
</style>