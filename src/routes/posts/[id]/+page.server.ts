import { flattenError } from 'zod';
import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { createCommentSchema } from '$lib/schema/comment.js';
import { commentPost, getPost, likePost } from '$lib/api/post.js';
import { handleLoadError, handleActionError } from '$lib/utils/error-handler.js';

export async function load({ params, fetch }) {
	const id = parseInt(params.id);

	if (isNaN(id) || id < 1) {
		error(400, 'Invalid post ID');
	}

	try {
		return await getPost(id, fetch);
	} catch (err) {
		handleLoadError(err);
	}
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
			return handleActionError(err);
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
		} catch (err) {
			return handleActionError(err);
		}
	}
} satisfies Actions;
