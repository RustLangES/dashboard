<script lang="ts">
	import '../../app.css';

	import ThemeProvider, { setDarkTheme } from '$lib/presentation/ThemeProvider.svelte';

	import Nav, { type NavItem } from './Nav.svelte';

	setDarkTheme();

	const links: NavItem[] = [
		{
			href: '/',
			label: 'Home'
		},

		{
			href: '/#sent',
			label: 'Sent',
			badge: '24'
		}
	];
</script>

<ThemeProvider>
	<Nav {links} />

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
	}
</style>
