import { writable } from 'svelte/store';
import type { Form } from '../models';

export const forms = writable<Form[]>([]);

export async function loadFormsFromDB(
	platform: Readonly<App.Platform> | undefined
): Promise<Form[]> {
	const forms_res = await platform!.env.FORMS_DB.prepare('SELECT * FROM Form').run();

	forms.set(forms_res.results);

	return forms_res.results;
}

export function receiveForms(data: unknown) {
	if (typeof data === 'object' && data !== null && 'forms' in data) {
		forms.set(data.forms as Form[]);
	}
}
