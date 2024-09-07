import { loadNavbar, type NavItem } from '$lib/presentation/NavBar';

const LINKS: NavItem[] = [
	{
		href: '/',
		label: 'Home'
	}
];

export function load() {
	const navbar = loadNavbar(LINKS);

	return {
		...navbar
	};
}
