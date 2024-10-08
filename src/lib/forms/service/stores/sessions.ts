import { writable } from 'svelte/store';
import type { External, Session } from '../../models';

export const sessions = writable<(Session & { external: External })[]>();

export async function loadSessionsFromDB(
	platform: Readonly<App.Platform> | undefined,
	formId: number,
): Promise<(Session & { external: External })[]> {
	const query = `
		SELECT 
			s.*,
			e.external_id as e_external_id,
			e.kind as e_kind,
			e.email as e_email,
			e.token as e_token
		FROM Session s
		LEFT JOIN External e ON s.external_id = e.id
		WHERE s.form_id = ?
	`;

	const sessions_res = await platform!.env.FORMS_DB.prepare(query).bind(formId).all();

	const sessionsWithExternal = sessions_res.results.map((row) => ({
		id: row.id,
		device_id: row.device_id,
		form_id: row.form_id,
		external_id: row.external_id,
		token: row.token,
		last_answer: row.last_answer,
		steps: row.steps,
		created_at: row.created_at,
		external: {
			id: row.external_id,
			external_id: row.e_external_id,
			kind: row.e_kind,
			email: row.e_email,
			token: row.e_token
		}
	}));

	sessions.set(sessionsWithExternal);

	return sessionsWithExternal;
}

export function receiveSessions(data: unknown) {
	if (typeof data === 'object' && data !== null && 'sessions' in data) {
		sessions.set(data.sessions as (Session & { external: External })[]);
	} else {
		console.error('Invalid data format in receiveSessions:', data);
	}
}
