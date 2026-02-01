import { error, fail } from '@sveltejs/kit';
import { commentPost, getPost, likePost } from '$lib/api/post.js';
import type { Actions } from './$types';
import { APIError } from '$lib/api/client.js';
import { createCommentSchema } from '$lib/schema/comment.js';
import { flattenError } from 'zod';

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
	comment: async ({ params, request, fetch }) => {
		const id = parseInt(params.id);

		if (isNaN(id) || id < 1) {
			error(404, 'Invalid post ID');
		}

		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		// validate with zod
		const validateResult = createCommentSchema.safeParse(data);

		if (!validateResult.success) {
			return fail(400, {
				errors: flattenError(validateResult.error).fieldErrors,
				data
			});
		}

		try {
			await commentPost(id, validateResult.data.content, fetch);

			return { success: true };
		} catch (error) {
			if (error instanceof APIError) {
				return fail(error.status!, {
					message: error.message,
					errors: error.fieldErrors
				});
			}

			throw error;
		}
	}
} satisfies Actions;
