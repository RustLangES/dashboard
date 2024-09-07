import { writable } from 'svelte/store';

export type NavItem =
	| {
			badge?: string;
			href: string;
			label: string;
	  }
	| 'separator';

export let navbar = writable<NavItem[]>([]);

export function loadNavbar(links: NavItem[]): { navbar: NavItem[] } {
	navbar.set(links);

	return {
		navbar: links
	};
}

export function receiveNavbar(data: unknown) {
	if (typeof data === 'object' && data !== null && 'navbar' in data) {
		navbar.set(data.navbar as NavItem[]);
	}
}
