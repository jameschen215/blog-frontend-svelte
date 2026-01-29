import { flattenError } from 'zod';
import { fail, redirect } from '@sveltejs/kit';

import { loginSchema } from '$lib/schema/auth.js';
import { APIError } from '$lib/api/client.js';
import { login } from '$lib/api/auth.js';

export async function load({ locals }) {
	if (locals.user) redirect(307, '/');
}

export const actions = {
	default: async ({ request, fetch, url }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		// validate with zod
		const validateResult = loginSchema.safeParse(data);

		if (!validateResult.success) {
			return fail(400, {
				errors: flattenError(validateResult.error).fieldErrors,
				data
			});
		}

		try {
			await login(validateResult.data, fetch);

			const to = url.searchParams.has('redirect') ? `${url.searchParams.get('redirect')}` : '/';

			redirect(307, to);
		} catch (error) {
			// expected, user-facing error
			if (error instanceof APIError) {
				return fail(error.status!, {
					message: error.message,
					errors: error.fieldErrors
				});
			}

			throw error;
		}
	}
};
