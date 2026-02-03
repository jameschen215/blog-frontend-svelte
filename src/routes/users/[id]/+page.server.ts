import { error } from '@sveltejs/kit';
import { getUser } from '$lib/api/user.js';
import { handleLoadError } from '$lib/utils/error-handler.js';

export const load = async ({ params, url, fetch }) => {
	const id = parseInt(params.id);

	if (isNaN(id) || id < 1) {
		error(400, 'Invalid user ID');
	}

	const page = url.searchParams.get('page') ? Number(url.searchParams.get('page')) : undefined;
	const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : undefined;

	try {
		return await getUser(id, { page, limit }, fetch);
	} catch (err) {
		handleLoadError(err);
	}
};
