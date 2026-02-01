import { getPosts } from '$lib/api/post';
import type { PageServerLoad } from './$types';
import { handleLoadError } from '$lib/utils/error-handler';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const page = url.searchParams.get('page') ? Number(url.searchParams.get('page')) : undefined;
	const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : undefined;

	try {
		return {
			postsResult: await getPosts({ page, limit }, fetch)
		};
	} catch (err) {
		handleLoadError(err);
	}
};
