import type { ServerLoadEvent } from '@sveltejs/kit';

export async function POST({ platform, request }: ServerLoadEvent) {
	const { form_id, title, description, type, data } = await request.json();
	const created_at = Math.floor(Date.now() / 1000);
	const response = await platform!.env.FORMS_DB.prepare(
		'INSERT INTO Question (form_id, title, description, type, data, created_at) VALUES (?, ?, ?, ?, ?, ?)'
	)
		.bind(form_id, title, description, type, data, created_at)
		.all();

	console.log(response.meta.last_row_id);

	return new Response(response.meta.last_row_id);
}
