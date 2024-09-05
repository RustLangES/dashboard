<script lang="ts">
	export let title: string;
</script>

<svelte:head>
	<title>{title} - RustLangES Dashboard</title>
</svelte:head>

<header>
	<h1>
		{title}
	</h1>
</header>

<style>
	header {
		width: 100%;
		height: calc(42px + 1rem);
		padding: 0 1.5rem;
    margin-bottom: 1rem;

		background: #141517;

		display: flex;
		align-items: center;
	}

	h1 {
		font-weight: bold;
		font-size: 1.5rem;
	}
</style>
