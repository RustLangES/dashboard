<script lang="ts" context="module">
	import { colorScheme, SvelteUIProvider } from '@svelteuidev/core';

	export function toggleTheme() {
		colorScheme.update((v) => (v === 'light' ? 'dark' : 'light'));
	}

	export function setDarkTheme() {
		colorScheme.update(() => 'dark');
	}

	export function setLightTheme() {
		colorScheme.update(() => 'light');
	}
</script>

<SvelteUIProvider withGlobalStyles themeObserver={$colorScheme}>
	<slot />
</SvelteUIProvider>
