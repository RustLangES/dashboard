import { loadDetails } from '$lib/forms/service/stores/form';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ platform, params }) => {
	const { form, questions } = await loadDetails(platform, params.slug);

	if (!form) redirect(302, '/forms');

	return { form, questions };
};
