<script>
	import PageHeader from '$lib/presentation/PageHeader.svelte';
	import { Center, Divider, Switch, TextInput, Tooltip } from '@svelteuidev/core';
</script>

<PageHeader title="Form 0" />

<div>
	<section class="form-details">
		<TextInput label="Description" variant="unstyled" size="xs" placeholder="Write a description" />

		<TextInput label="Edition" variant="unstyled" size="xs" placeholder="Write a description" />

		<Tooltip label="The user require login to response this form">
			<Switch label="Require login" />
		</Tooltip>

		<Tooltip label="The user can response this form multiple times">
			<Switch label="Multiple times" />
		</Tooltip>
	</section>

	<Divider orientation="vertical" mx="xl" />

	<aside class="question-previewer">
		<Center override={{ height: '100%' }}>Previewer</Center>
	</aside>
</div>

<style>
	div {
		padding: 0 1rem;
		min-height: 100vh;

		display: grid;
		grid-template-columns: 1fr auto 1fr;

		border-right: 1px solid #777;
	}

	.form-details {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.question-previewer {
		min-height: 100vh;
	}
</style>
