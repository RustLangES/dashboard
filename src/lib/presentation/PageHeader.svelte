<script lang="ts">
	export let title: string;
</script>

<svelte:head>
	<title>{title} - RustLangES Dashboard</title>
</svelte:head>

<header>
	<div class="header__title-wrap">
		<h1>{title}</h1>
	</div>
	<div class="header__actions">
		<slot />
	</div>
</header>

<style>
	header {
		width: 100%;
		height: 56px;
		padding: 0 1.5rem;
		background: var(--surface-1);
		border-bottom: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.header__title-wrap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.header__title-wrap::before {
		content: '';
		display: block;
		width: 3px;
		height: 1.2rem;
		background: var(--p-500);
		border-radius: 9999px;
	}

	h1 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--n-100);
		letter-spacing: -0.01em;
	}

	.header__actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
