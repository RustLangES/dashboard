import type { ServerLoadEvent } from '@sveltejs/kit';

export async function DELETE({ platform, request }: ServerLoadEvent) {
	const { form_id } = await request.json();
	const response = await platform!.env.FORMS_DB.prepare('DELETE FROM Form WHERE id = ?')
		.bind(form_id)
		.all();

	console.log(response.meta.last_row_id);

	return new Response(response.meta.last_row_id);
}
