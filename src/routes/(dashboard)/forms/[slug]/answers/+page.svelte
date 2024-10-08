<script lang="ts">
	import { page } from '$app/stores';
	import type { Session } from '$lib/forms/models';
	import { receiveSessions } from '$lib/forms/service/stores/sessions';
	import { NativeSelect } from '@svelteuidev/core';

	enum FilterCompleted {
		Completed = 'Completed',
		NotCompleted = 'Not completed',
		All = 'All'
	}

	export let data;
	receiveSessions(data);
	let completed = FilterCompleted.All;

	function filterCompleted(session: Session & { completed: number }, completed: FilterCompleted) {
		return (
			(completed === FilterCompleted.Completed && session.completed === 1) ||
			(completed === FilterCompleted.NotCompleted && session.completed === 0) ||
			completed === FilterCompleted.All
		);
	}
</script>

<h1>ANSWERS</h1>

<NativeSelect
	data={[FilterCompleted.Completed, FilterCompleted.NotCompleted, FilterCompleted.All]}
	placeholder="Pick one"
	label="Select an option"
	bind:value={completed}
/>

<ul>
	{#each data.sessions as session, i}
		{#if filterCompleted(session, completed)}
			<li>
				<a href={`${$page.url.pathname}/${session.id}`}>
					Session #{i + 1}
				</a>

				<p>{session.external.email}</p>
			</li>
		{/if}
	{:else}
		<li>No sessions avilable</li>
	{/each}
</ul>

<style>
	ul {
		margin: 0 3rem;
	}
	ul li {
		margin-bottom: 10px;
	}
</style>

