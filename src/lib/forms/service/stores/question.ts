import { writable } from 'svelte/store';
import type { Question } from '../../models';

export const question = writable<Question>();

export async function loadQuestionFromDB(
	platform: Readonly<App.Platform> | undefined,
	params: number
): Promise<Question> {
	const question_res = await platform!.env.FORMS_DB.prepare('SELECT * FROM Question WHERE id = ?')
		.bind(params)
		.run();

	question.set(question_res.results[0]);

	return question_res.results[0];
}

export function receiveQuestion(data: unknown) {
	if (typeof data === 'object' && data !== null && 'question' in data) {
		question.set(data.question as Question);
	} else {
		console.error('Invalid data format in receiveQuestion:', data);
	}
}
