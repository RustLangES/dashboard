<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { Divider, NativeSelect, Space } from '@svelteuidev/core';
	import { page } from '$app/stores';

	import TiHomeOutline from 'svelte-icons/ti/TiHomeOutline.svelte';
	import DiGithubBadge from 'svelte-icons/di/DiGithubBadge.svelte';

	import type { NavItem } from './NavBar';
	import { goto } from '$app/navigation';

	export let links: NavItem[];
	export let selectedProject: string;

	const routes = {
		RustLangES: '/',
		Forms: '/forms'
	};

	function onProjectChange(ev: Event) {
		const newSelectedProject = (ev.currentTarget as HTMLSelectElement).value;

		if (selectedProject !== newSelectedProject) {
			const route = routes[newSelectedProject as keyof typeof routes];
			selectedProject = newSelectedProject;
			goto(route);
		}
	}
</script>

<nav>
	<div class="nav__project">
		{#if $page.data.session}
			<NativeSelect
				value={selectedProject}
				on:change={onProjectChange}
				class="nav__project-switcher"
				data={['RustLangES', 'Forms']}
				placeholder="Pick one"
			/>
		{:else}
			<button on:click={() => signIn('github')} class="nav__project-login">
				<DiGithubBadge />
				<p>Login with GitHub</p>
			</button>
		{/if}
	</div>
	<Space h="xl" />
	<ul>
		{#each links as link}
			{#if link === 'separator'}
				<Divider />
			{:else}
				<li>
					<a href={link.href} class:active={$page.url.pathname === link.href}>
						<span class="nav__link-label">
							<TiHomeOutline />
							{link.label}
						</span>

						{#if link.badge}
							<span class="nav__link-badge">{link.badge}</span>
						{/if}
					</a>
				</li>
			{/if}
		{/each}
	</ul>
</nav>

<style>
	nav {
		width: 100%;
		max-width: 250px;
		height: 100vh;

		background: #141517;

		position: sticky;
		top: 0;

		display: flex;
		flex-direction: column;
	}

	/* TODO: Move to the svelteui theme file. (Not exist yet) */
	:global(.svelteui-Divider-root) {
		border-color: #777 !important;
	}

	.nav__project {
		height: 52px;
		padding: 0.5rem 0;
		margin: 0 0.5rem;
	}

	:global(.nav__project-switcher select) {
		height: 42px !important;
	}

	.nav__project-login {
		padding: 0.25rem 0.75rem;
		width: 100%;
		height: 42px;
		gap: 0.5rem;

		color: white;
		border: 1px solid rgb(44, 46, 51);
		background-color: rgb(20, 21, 23);

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.nav__project-login > :global(svg) {
		width: 32px;
		height: 32px;
	}

	ul {
		display: flex;
		flex-direction: column;

		list-style: none;
	}

	a {
		padding: 0.5rem 0.75rem;
		margin: 0 0.5rem;

		border-radius: 5px;

		display: flex;
		justify-content: space-between;
		align-items: center;

		color: white;
		text-decoration: none;
	}

	a.active {
		background: #333;
	}

	.nav__link-label {
		display: flex;
		gap: 0.5rem;
		font-size: 0.9rem;
		font-weight: normal;
	}

	.nav__link-label > :global(svg) {
		width: 18px;
		height: 18px;
	}

	.nav__link-badge {
		font-size: 0.85rem;
	}
</style>
