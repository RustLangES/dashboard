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
	<div class="layout">
		<Nav {selectedProject} {links} />
		<main>
			<slot />
		</main>
	</div>
</ThemeProvider>

<style>
	:global(body) {
		background: var(--bg);
	}

	.layout {
		display: flex;
		min-height: 100vh;
	}

	main {
		flex: 1;
		min-width: 0;
		background: var(--bg);
	}
</style>
