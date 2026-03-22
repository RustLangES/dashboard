import type { ServerLoadEvent } from '@sveltejs/kit';

export async function DELETE({ platform, request }: ServerLoadEvent) {
	const { form_id } = await request.json();

	await platform!.env.FORMS_DB.batch([
		platform!.env.FORMS_DB.prepare('DELETE FROM Answer WHERE form_id = ?').bind(form_id),
		platform!.env.FORMS_DB.prepare('DELETE FROM Session WHERE form_id = ?').bind(form_id),
		platform!.env.FORMS_DB.prepare('DELETE FROM Form WHERE id = ?').bind(form_id)
	]);

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
}

export async function PATCH({ platform, request }: ServerLoadEvent) {
	try {
		const { id_form, title, require_login, edition, multiple_times, description } =
			await request.json();

		const response = await platform!.env.FORMS_DB.prepare(
			'UPDATE Form SET title = ?, require_login = ?, edition = ?, multiple_times = ?, description = ? WHERE id = ?'
		)
			.bind(title, require_login, edition, multiple_times, description, id_form)
			.run();

		return new Response(JSON.stringify({ success: true, id: id_form }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error in PATCH:', error);
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
