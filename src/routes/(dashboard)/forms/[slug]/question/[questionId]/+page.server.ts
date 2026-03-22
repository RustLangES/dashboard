import type { PageServerLoad } from './$types';
import { loadQuestionFromDB } from '$lib/forms/service/stores/question';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ platform, params }) => {
	const question = await loadQuestionFromDB(platform, parseInt(params.questionId));

	if (!question) redirect(302, `/forms/${params.slug}`);

	return { question };
};
