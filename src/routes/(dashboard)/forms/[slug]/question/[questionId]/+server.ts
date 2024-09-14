import type { ServerLoadEvent } from '@sveltejs/kit';

export async function DELETE({ platform, request }: ServerLoadEvent) {
	const { question_id } = await request.json();
	const response = await platform!.env.FORMS_DB.prepare('DELETE FROM Question WHERE id = ?')
		.bind(question_id)
		.all();

	console.log(response.meta.last_row_id);

	return new Response(response.meta.last_row_id);
}

export async function PATCH({ platform, request }: ServerLoadEvent) {
	try {
		const { id_question, title, description, type, data } = await request.json();
		const dataString = JSON.stringify(data);

		const response = await platform!.env.FORMS_DB.prepare(
			'UPDATE Question SET title = ?, description = ?, type = ?, data = ? WHERE id = ?'
		)
			.bind(title, description, type, dataString, id_question)
			.run();

		console.log('Update response:', response);

		return new Response(JSON.stringify({ success: true, id: id_question }), {
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
