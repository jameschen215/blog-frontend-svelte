import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { getPosts } from '$lib/api/post';
import { APIError } from '$lib/api/client';

export const load: PageServerLoad = async ({ url }) => {
	const page = url.searchParams.get('page') ? Number(url.searchParams.get('page')) : undefined;
	const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : undefined;

	try {
		return {
			postsResult: await getPosts({ page, limit })
		};
	} catch (err) {
		if (err instanceof APIError) {
			error(err.status!, err.message);
		}

		throw err;
	}
};
