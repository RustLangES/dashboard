import type { PageServerLoad } from './$types';
import { loadSessionsFromDB } from '$lib/forms/service/stores/sessions';

export const load: PageServerLoad = async ({ platform, params }) => {
	const sessions = await loadSessionsFromDB(platform, parseInt(params.slug));

	return { sessions };
};
