<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/presentation/PageHeader.svelte';
	import Button from '$lib/components/Button.svelte';
	import { Switch, Textarea, TextInput } from '@svelteuidev/core';

	let name = '';
	let nameError = '';
	let edition = '';
	let description = '';
	let require_login = false;
	let multiple_times = false;

	async function handleCreate() {
		if (!name) {
			nameError = 'Please enter the form name';
			return;
		}
		try {
			const response = await fetch(window.location.href, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: name, require_login, edition, multiple_times, description })
			});
			if (!response.ok) throw new Error(`${response.status}`);
			const id = await response.json();
			goto(`/forms/${id}`);
		} catch (error) {
			console.error(error);
		}
	}
</script>

<PageHeader title="Create Form" />

<div class="page">
	<div class="form-card">
		<div class="form-card__fields">
			<TextInput label="Name" bind:value={name} error={!name ? nameError : ''} required />
			<TextInput label="Edition" bind:value={edition} placeholder="e.g. 2025" />
			<Textarea
				label="Description"
				placeholder="Write a brief description"
				resize="vertical"
				bind:value={description}
			/>
		</div>

		<div class="form-card__toggles">
			<Switch label="Require login" bind:checked={require_login} />
			<Switch label="Allow multiple responses" bind:checked={multiple_times} />
		</div>

		<div class="form-card__footer">
			<Button variant="secondary" on:click={() => history.back()}>Cancel</Button>
			<Button on:click={handleCreate}>Create Form</Button>
		</div>
	</div>
</div>

<style>
	.page {
		display: flex;
		justify-content: center;
		padding: 2rem 1.5rem;
	}

	.form-card {
		width: 100%;
		max-width: 480px;
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-card__fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-card__toggles {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		padding: 0.875rem;
		background: var(--surface-3);
		border: 1px solid var(--border);
		border-radius: 7px;
	}

	.form-card__footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}
</style>
