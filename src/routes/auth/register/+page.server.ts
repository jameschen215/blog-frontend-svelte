import { flattenError } from 'zod';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { register } from '$lib/api/auth';
import { APIError } from '$lib/api/client';
import { registerSchema } from '$lib/schema/auth';

export const actions = {
	default: async ({ request, url, fetch }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		const validateResult = registerSchema.safeParse(data);

		if (!validateResult.success) {
			return fail(400, {
				errors: flattenError(validateResult.error).fieldErrors,
				data
			});
		}

		try {
			await register(validateResult.data, fetch);

			const to = url.searchParams.has('redirect') ? `${url.searchParams.get('redirect')}` : '/';

			redirect(307, to);
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
