import { apiGet } from '$lib/api/client';
import type { UserResult } from '$lib/types/data';

// Pagination params interface
interface PaginationParams {
	page?: number;
	limit?: number;
}

export async function getUser(
	userId: number,
	params: PaginationParams = {},
	customFetch = fetch
): Promise<UserResult> {
	const queryParams = new URLSearchParams();

	if (params.page) {
		queryParams.append('page', params.page.toString());
	}

	if (params.limit) {
		queryParams.append('limit', params.limit.toString());
	}

	const query = queryParams.toString();
	const endpoint = query ? `/api/posts/authors/${userId}?${query}` : `/api/posts/authors/${userId}`;

	return apiGet<UserResult>(endpoint, customFetch);
}
