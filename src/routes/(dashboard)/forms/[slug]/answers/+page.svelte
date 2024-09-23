<script lang="ts">
	import { page } from '$app/stores';
	import { receiveSessions } from '$lib/forms/service/stores/sessions';

	export let data;
	receiveSessions(data);

	console.log(data);
</script>

<h1>ANSWERS</h1>

<ul>
	{#each data.sessions as session, i}
		<li>
			<a href={`${$page.url.pathname}/${session.id}`}>
				Session #{i + 1}
			</a>

			<p>{session.external.email}</p>
		</li>
	{:else}
		<li>No sessions avilable</li>
	{/each}
</ul>
