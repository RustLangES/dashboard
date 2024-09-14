import * as env from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth();

	const isNotAdmin =
		!session?.user || !session.user.email || !env.ADMINS.split(';').includes(session.user.email);

	if (event.url.pathname !== '/' && isNotAdmin) {
		return error(403);
	}

	if (isNotAdmin) {
		event.cookies.delete('sessionToken', { path: '/' });
		event.cookies.delete('authjs.session-token', { path: '/' });
		return {};
	}

	return { session };
};
