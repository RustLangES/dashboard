<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
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
		const next = (ev.currentTarget as HTMLSelectElement).value as keyof typeof routes;
		if (selectedProject !== next) {
			selectedProject = next;
			goto(routes[next]);
		}
	}
</script>

<nav>
	<!-- Brand -->
	<div class="nav__brand">
		<span class="nav__brand-crab">🦀</span>
		<div class="nav__brand-text">
			<span class="nav__brand-name">RustLangES</span>
			<span class="nav__brand-sub">Dashboard</span>
		</div>
	</div>

	<!-- Project / Auth -->
	<div class="nav__project">
		{#if $page.data.session}
			<select class="nav__select" value={selectedProject} on:change={onProjectChange}>
				<option value="RustLangES">RustLangES</option>
				<option value="Forms">Forms</option>
			</select>
		{:else}
			<button class="nav__login" on:click={() => signIn('github')}>
				<span class="nav__login-icon"><DiGithubBadge /></span>
				<span>Login with GitHub</span>
			</button>
		{/if}
	</div>

	<!-- Separator -->
	<div class="nav__sep" />

	<!-- Links -->
	<ul class="nav__links">
		{#each links as link}
			{#if link === 'separator'}
				<li><div class="nav__sep" /></li>
			{:else}
				<li>
					<a href={link.href} class="nav__link" class:active={$page.url.pathname === link.href}>
						<span class="nav__link-icon"><TiHomeOutline /></span>
						<span class="nav__link-label">{link.label}</span>
						{#if link.badge}
							<span class="nav__link-badge">{link.badge}</span>
						{/if}
					</a>
				</li>
			{/if}
		{/each}
	</ul>

	<!-- Session user -->
	{#if $page.data.session?.user}
		<div class="nav__user">
			{#if $page.data.session.user.image}
				<img src={$page.data.session.user.image} alt="avatar" class="nav__avatar" />
			{/if}
			<span class="nav__user-email">{$page.data.session.user.email ?? ''}</span>
		</div>
	{/if}
</nav>

<style>
	nav {
		width: 100%;
		max-width: 240px;
		min-width: 240px;
		height: 100vh;
		background: var(--surface-1);
		border-right: 1px solid var(--border);
		position: sticky;
		top: 0;
		display: flex;
		flex-direction: column;
		gap: 0;
		overflow: hidden;
	}

	/* Brand */
	.nav__brand {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 1.25rem 1rem 1rem;
	}

	.nav__brand-crab {
		font-size: 1.5rem;
		line-height: 1;
		filter: drop-shadow(0 0 6px rgba(241, 94, 31, 0.5));
	}

	.nav__brand-text {
		display: flex;
		flex-direction: column;
		gap: 0.05rem;
	}

	.nav__brand-name {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--n-100);
		letter-spacing: -0.01em;
	}

	.nav__brand-sub {
		font-size: 0.65rem;
		font-weight: 500;
		color: var(--p-500);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	/* Project switcher */
	.nav__project {
		padding: 0 0.75rem 0.75rem;
	}

	.nav__select {
		width: 100%;
		background: var(--surface-3);
		border: 1px solid var(--border);
		border-radius: 6px;
		color: var(--n-200);
		font-family: inherit;
		font-size: 0.8rem;
		padding: 0.45rem 0.625rem;
		cursor: pointer;
		appearance: none;
		outline: none;
		transition: border-color 0.15s;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.6rem center;
		padding-right: 1.75rem;
	}

	.nav__select:hover,
	.nav__select:focus {
		border-color: var(--p-600);
	}

	/* Login */
	.nav__login {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.5rem 0.625rem;
		background: var(--surface-3);
		border: 1px solid var(--border);
		border-radius: 6px;
		color: var(--n-200);
		font-family: inherit;
		font-size: 0.8rem;
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.nav__login:hover {
		border-color: var(--p-500);
		color: #fff;
	}

	.nav__login-icon {
		display: flex;
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	.nav__login-icon :global(svg) {
		width: 16px;
		height: 16px;
	}

	/* Separator */
	.nav__sep {
		height: 1px;
		background: var(--border);
		margin: 0 0.75rem;
	}

	/* Links */
	.nav__links {
		list-style: none;
		padding: 0.5rem 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
	}

	.nav__link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.45rem 0.625rem;
		border-radius: 6px;
		color: var(--n-300);
		text-decoration: none;
		font-size: 0.85rem;
		font-weight: 450;
		transition:
			background-color 0.12s,
			color 0.12s;
		border-left: 2px solid transparent;
	}

	.nav__link:hover {
		background: rgba(255, 255, 255, 0.05);
		color: var(--n-100);
	}

	.nav__link.active {
		background: rgba(241, 94, 31, 0.12);
		color: var(--p-400);
		border-left-color: var(--p-500);
	}

	.nav__link-icon {
		display: flex;
		width: 15px;
		height: 15px;
		flex-shrink: 0;
		opacity: 0.7;
	}

	.nav__link.active .nav__link-icon {
		opacity: 1;
	}

	.nav__link-icon :global(svg) {
		width: 15px;
		height: 15px;
	}

	.nav__link-label {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.nav__link-badge {
		font-size: 0.65rem;
		padding: 0.1rem 0.4rem;
		border-radius: 9999px;
		background: var(--e-950);
		color: var(--e-400);
		font-weight: 600;
	}

	/* User */
	.nav__user {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--border);
		margin-top: auto;
	}

	.nav__avatar {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: 1px solid var(--border);
		flex-shrink: 0;
	}

	.nav__user-email {
		font-size: 0.72rem;
		color: var(--n-400);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
