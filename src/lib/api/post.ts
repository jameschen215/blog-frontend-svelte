import { apiGet } from '$lib/api/client';
import type { PostsResult } from '$lib/types/data';

// Pagination params interface
interface PaginationParams {
	page?: number;
	limit?: number;
}

export async function getPosts(params: PaginationParams): Promise<PostsResult> {
	const queryParams = new URLSearchParams();

	if (params.page) {
		queryParams.append('page', params.page.toString());
	}

	if (params.limit) {
		queryParams.append('limit', params.limit.toString());
	}

	const query = queryParams.toString();
	const endpoint = query ? `/posts?${query}` : '/posts';

	return apiGet<PostsResult>(endpoint);
}
