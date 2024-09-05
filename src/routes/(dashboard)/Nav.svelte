<script lang="ts" context="module">
	export type NavItem =
		| {
				badge?: string;
				href: string;
				label: string;
		  }
		| 'separator';
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { Divider, NativeSelect } from '@svelteuidev/core';

	import TiHomeOutline from 'svelte-icons/ti/TiHomeOutline.svelte';

	export let links: NavItem[];
</script>

<nav>
	<div>
		<NativeSelect class="nav__project-switcher" data={['RustLangES', 'Forms']} />
	</div>
	<Divider />
	<ul>
		{#each links as link}
			{#if link === 'separator'}
				<Divider />
			{:else}
				<li>
					<a href={link.href} class:active={$page.url.pathname === link.href}>
						<span class="nav__link-label">
							<TiHomeOutline class="nav__link-icon" />
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
		padding: 0.5rem 0;
		width: 100%;
		max-width: 250px;

		background: #141517;
		border-right: 1px #777 solid;

		display: flex;
		flex-direction: column;
	}

	/* TODO: Move to the svelteui theme file. (Not exist yet) */
	:global(.svelteui-Divider-root) {
		border-color: #333;
	}

	:global(.nav__project-switcher) {
		margin: 0 0.5rem;
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
	}

	.nav__link-label > :global(svg) {
		width: 18px;
		height: 18px;
	}

	.nav__link-badge {
		font-size: 0.85rem;
	}
</style>
