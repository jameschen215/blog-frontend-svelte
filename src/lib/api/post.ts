import { apiGet, apiPost } from '$lib/api/client';
import type { PostDetailResult, PostsResult } from '$lib/types/data';

// Pagination params interface
interface PaginationParams {
	page?: number;
	limit?: number;
}

export async function getPosts(
	params: PaginationParams,
	customFetch = fetch
): Promise<PostsResult> {
	const queryParams = new URLSearchParams();

	if (params.page) {
		queryParams.append('page', params.page.toString());
	}

	if (params.limit) {
		queryParams.append('limit', params.limit.toString());
	}

	const query = queryParams.toString();
	const endpoint = query ? `/api/posts?${query}` : '/api/posts';

	return apiGet<PostsResult>(endpoint, customFetch);
}

export async function getPost(id: number, customFetch = fetch): Promise<PostDetailResult> {
	return apiGet<PostDetailResult>(`/api/posts/${id}`, customFetch);
}

export async function likePost(id: number, customFetch = fetch) {
	return apiPost(`/api/posts/${id}/like`, undefined, customFetch);
}
