import type { ServerLoadEvent } from '@sveltejs/kit';

export async function POST({ platform, request }: ServerLoadEvent) {
	const { title, require_login, edition, multiple_times, description } = await request.json();
	const created_at = Math.floor(Date.now() / 1000);
	const response = await platform!.env.FORMS_DB.prepare(
		'INSERT INTO Form (title, require_login, edition, multiple_times, created_at, description) VALUES (?, ?, ?, ?, ?, ?)'
	)
		.bind(title, require_login, edition, multiple_times, created_at, description)
		.all();

	console.log(response.meta.last_row_id);

	return new Response(response.meta.last_row_id);
}
