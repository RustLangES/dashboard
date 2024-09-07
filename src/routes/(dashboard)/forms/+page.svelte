<script lang="ts" context="module">
	import MdAdd from 'svelte-icons/md/MdAdd.svelte';

	import PageHeader from '$lib/presentation/PageHeader.svelte';

  import {forms} from "$lib/forms/service/stores"

	export type FormListItem = {
		id: number;
		title: string;
		description?: string;
	};

</script>

<PageHeader title="Forms" />

<ul>
	<li class="create-form">
		<a href="/forms/create">
			<MdAdd />
		</a>
	</li>

	{#each $forms as form}
		<li>
			<a href={'/forms/' + form.id}>
				<h2>{form.title}</h2>
				<p>{form.description ?? ''}</p>
			</a>
		</li>
	{/each}
</ul>

<style>
	ul {
		margin-top: 1rem;

		display: grid;
		grid-template-columns: repeat(auto-fit, 250px);
		place-content: center;
		gap: 0.5rem;

		list-style: none;
	}

	li {
		width: 100%;

		display: flex;
	}

	a {
		width: 100%;
		padding: 1rem;

		color: white;
		text-decoration: none;

		border: solid 1px #602f01ff;
		border-radius: 5px;
		background: #141517;
	}

	a:hover {
		border: solid 1px #b55702ff;
	}

	h2 {
		font-size: 1.15rem;
	}

	p {
		font-size: 0.75rem;
	}

	.create-form > a {
		display: flex;
		justify-content: center;
	}

	.create-form :global(svg) {
		width: 36px;
	}
</style>
