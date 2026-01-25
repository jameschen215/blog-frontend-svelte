import { error } from '@sveltejs/kit';
import { getPost, likePost } from '$lib/api/post.js';
import type { Actions } from './$types.js';
import { APIError } from '@/api/client.js';

export async function load({ params, fetch }) {
	const id = Number(params.id);

	if (!Number.isInteger(id) || id < 1) {
		error(400, 'Invalid post ID');
	}

	return await getPost(id, fetch);
}

export const actions = {
	like: async ({ params }) => {
		const id = Number(params.id);

		if (!Number.isInteger(id) || id < 1) {
			error(404, 'Invalid post ID');
		}

		try {
			return await likePost(id);
		} catch (err) {
			if (err instanceof APIError) {
				error(err.status!, err.message);
			}
			throw err;
		}
	}
} satisfies Actions;
