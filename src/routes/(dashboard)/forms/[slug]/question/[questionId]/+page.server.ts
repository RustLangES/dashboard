import type { PageServerLoad } from './$types';
import { loadQuestionFromDB } from '$lib/forms/service/stores/question';

export const load: PageServerLoad = async ({ platform, params }) => {
	const question = await loadQuestionFromDB(platform, parseInt(params.questionId));

	return { question };
};
