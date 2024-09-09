import { writable } from 'svelte/store';
import type { Form, Question } from '../../models';

export const form = writable<Form>();
export const questions = writable<Question[]>([]);

export async function loadDetails(
	platform: Readonly<App.Platform> | undefined,
	type_form: string
): Promise<{ form: Form; questions: Question }> {
	const form_res = await platform!.env.FORMS_DB.prepare('SELECT * FROM Form WHERE id = ?')
		.bind(type_form)
		.run();

	const questions_res = await platform!.env.FORMS_DB.prepare(
		'SELECT * FROM Question WHERE form_id = ?'
	)
		.bind(type_form)
		.run();

	const formData = form_res.results[0];
	const questionsData = questions_res.results;

	form.set(formData);
	questions.set(questionsData);

	return { form: formData, questions: questionsData };
}

export function receiveDetails(data: unknown) {
	if (typeof data === 'object' && data !== null) {
		if ('form' in data) {
			form.set(data.form as Form);
		}
		if ('questions' in data) {
			questions.set(data.questions as Question[]);
		}
	}
}
