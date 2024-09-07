<script lang="ts">
	import { Button, Input, InputWrapper, NativeSelect, Switch, Textarea } from '@svelteuidev/core';

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

	let title = 'Question title';
	let description = 'Description of the question';
	let type: 'text' | 'questionText' | 'options' | '' = '';

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
	<Switch label="Can Multiple" bind:checked={result.data.canMultiple} />
	<Switch label="Required" bind:checked={result.data.required} />

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
