<script lang="ts">
	import '../../app.css';

	import ThemeProvider, { setDarkTheme } from '$lib/presentation/ThemeProvider.svelte';

	import Nav from '$lib/presentation/NavBar.svelte';
	import { navbar } from '$lib/presentation/NavBar';

	setDarkTheme();

	$: selectedProject = $navbar.selectedProject ?? '';
	$: links = $navbar.links ?? [];
</script>

<ThemeProvider>
	<Nav {selectedProject} {links} />

	<main>
		<slot />
	</main>
</ThemeProvider>

<style>
	:global(body) {
		display: flex;
	}

	main {
		width: 100%;
		background-color: var(--svelteui-colors-dark700);
	}
</style>
