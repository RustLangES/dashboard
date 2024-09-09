import { loadDetails } from '$lib/forms/service/stores/form';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ platform, params }) => {
	const { form, questions } = await loadDetails(platform, params.slug);

	return { form, questions };
};
