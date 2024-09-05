<script lang="ts">
	import PageHeader from '$lib/presentation/PageHeader.svelte';

	import { Button, Center, Flex, Switch, Textarea, TextInput } from '@svelteuidev/core';

	let name = '';
	let nameError = '';
	let edition = '';
	let require_login = false;
	let multiple_times = false;

	function handleCreate() {
		if (!name) {
			nameError = 'Please enter the name of the form';
			return;
		}

		console.log('Data enviada');
	}
</script>

<PageHeader title="Create Form" />

<Center override={{ height: 'calc(100dvh - 52px)' }}>
	<Flex direction="column" gap="xl" override={{ width: '100%', maxWidth: '450px' }}>
		<TextInput label="Name" bind:value={name} error={!name ? nameError : ''} required={true} />
		<TextInput label="Edition" bind:value={edition} />
		<Textarea
			label="Description"
			placeholder="Write a description about of form"
			resize="vertical"
		/>
		<Switch label="Require login" bind:checked={require_login} />
		<Switch label="Multiple times" bind:checked={multiple_times} />
		<Button override={{ width: '100%' }} on:click={handleCreate}>Create</Button>
	</Flex>
</Center>
