<script>
	import PageHeader from '$lib/presentation/PageHeader.svelte';
	import { Anchor, Button, Center, Divider, Switch, TextInput, Tooltip } from '@svelteuidev/core';
</script>

<PageHeader title="Form 0" />

<div class="form-container">
	<section class="form-container__details">
		<TextInput label="Description" variant="unstyled" size="xs" placeholder="Write a description" />

		<TextInput label="Edition" variant="unstyled" size="xs" placeholder="Write a description" />

		<Tooltip label="The user require login to response this form">
			<Switch label="Require login" />
		</Tooltip>

		<Tooltip label="The user can response this form multiple times">
			<Switch label="Multiple times" />
		</Tooltip>

		<div class="form-container__new-question">
			<h3 class="form-container__new-question-title">Questions</h3>
			<Button>New question</Button>
		</div>
		<ul class="form-container__questions-list">
			<li>
				<a href={`/forms/0/question/1`}>Question 1</a>
			</li>
			<li>
				<a href={`/forms/0/question/2`}>Question 2</a>
			</li>
			<li>
				<a href={`/forms/0/question/3`}>Question 3</a>
			</li>
		</ul>
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
	}

	.form-container__details {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-container__questions-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.form-container__new-question {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.form-container__new-question-title {
		margin: 0;
	}

	.form-container__previewer {
		min-height: 100vh;
	}
</style>
