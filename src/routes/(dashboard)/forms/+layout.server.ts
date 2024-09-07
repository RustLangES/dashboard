import { loadFormsFromDB } from '$lib/forms/service/stores';
import { loadNavbar } from '$lib/presentation/NavBar';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ platform }) => {
	const forms = await loadFormsFromDB(platform);

	const navbar = loadNavbar([
		{
			href: '/forms',
			label: 'Home'
		},
		...forms.map((form) => ({
			href: '/forms/' + form.id,
			label: form.title,
			badge: form.deleted === 1 ? 'X' : undefined
		}))
	]);

	return {
		...navbar,
		forms
	};
};
