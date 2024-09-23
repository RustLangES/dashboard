import type { PageServerLoad } from './$types';
import { loadSessionDetailsFromDB } from '$lib/forms/service/stores/session';

export const load: PageServerLoad = async ({ platform, params }) => {
	const sessionDetails = await loadSessionDetailsFromDB(platform, parseInt(params.session_id));

	return { sessionDetails };
};
