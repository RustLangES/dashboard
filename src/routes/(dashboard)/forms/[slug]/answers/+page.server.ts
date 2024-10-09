import type { PageServerLoad } from './$types';
import { loadSessionsFromDB, sessions } from '$lib/forms/service/stores/sessions';

export const load: PageServerLoad = async ({ platform, params, parent }) => {
  const formId = +params.slug;
  const parentData = await parent();
  const lastQuestion = parentData.questions.at(-1).id

	const query = `
		SELECT 
			s.*,
      (s.token ISNULL AND a.question_id = ?) as completed,
			e.external_id as e_external_id,
			e.kind as e_kind,
			e.email as e_email,
			e.token as e_token
		FROM Session s
		LEFT JOIN External e ON s.external_id = e.id
    LEFT JOIN Answer a ON s.last_answer = a.id
		WHERE s.form_id = ?
	`;

	const sessions_res = await platform!.env.FORMS_DB.prepare(query).bind(lastQuestion, formId).all();

	const sessionsWithExternal = sessions_res.results.map((row) => ({
		id: row.id,
		device_id: row.device_id,
		form_id: row.form_id,
		external_id: row.external_id,
		token: row.token,
		last_answer: row.last_answer,
		steps: row.steps,
		created_at: row.created_at,
    completed: row.completed,
		external: {
			id: row.external_id,
			external_id: row.e_external_id,
			kind: row.e_kind,
			email: row.e_email,
			token: row.e_token
		}
	}));

	sessions.set(sessionsWithExternal);

  console.log(parentData)
  console.log(sessionsWithExternal)
  console.log(lastQuestion)
  
	return { sessions: sessionsWithExternal };
};
