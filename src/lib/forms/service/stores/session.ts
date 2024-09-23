import { writable } from 'svelte/store';
import type { Answer, Session } from '../../models';

export const sessionDetails = writable<Session>();
export const answer = writable<Answer[]>();

export async function loadSessionDetailsFromDB(
	platform: Readonly<App.Platform> | undefined,
	params: number
): Promise<Session & { answers: Answer[] }> {
	const session_res = await platform!.env.FORMS_DB.prepare('SELECT * FROM Session WHERE id = ?')
		.bind(params)
		.run();
	sessionDetails.set(session_res.results[0]);

	const answer_res = await platform!.env.FORMS_DB.prepare(
		'SELECT * FROM Answer WHERE session_id = ?'
	)
		.bind(params)
		.run();
	answer.set(answer_res.results);

	const response = { answers: answer_res.results, ...session_res.results[0] };

	return response;
}

export function receiveSessionDetails(data: unknown) {
	if (typeof data === 'object' && data !== null && 'sessionDetails' in data) {
		sessionDetails.set(data.sessionDetails as Session & { answers: Answer[] });
	} else {
		console.error('Invalid data format in receiveSession:', data);
	}
}
