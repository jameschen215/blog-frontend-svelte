import { error, fail } from '@sveltejs/kit';
import { getPost, likePost } from '$lib/api/post.js';
import type { Actions } from './$types';
import { APIError } from '@/api/client.js';

export async function load({ params, fetch }) {
	const id = Number(params.id);

	if (!Number.isInteger(id) || id < 1) {
		error(400, 'Invalid post ID');
	}

	return await getPost(id, fetch);
}

export const actions = {
	like: async ({ params, fetch }) => {
		const id = parseInt(params.id);

		if (isNaN(id) || id < 1) {
			error(404, 'Invalid post ID');
		}

		try {
			await likePost(id, fetch);
		} catch (err) {
			if (err instanceof APIError) {
				if (err.status === 429) {
					return fail(err.status, {
						message: err.message
					});
				} else {
					error(err.status!, err.message);
				}
			}

			throw err;
		}
	},
	comment: async () => {
		console.log('commenting...');
	}
} satisfies Actions;
