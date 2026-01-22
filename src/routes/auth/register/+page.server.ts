import { registerSchema } from '@/schema/auth';
import type { Actions } from './$types';
import { flattenError } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { register } from '@/api/auth';
import { APIError } from '@/api/client';

export const actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		const validateResult = registerSchema.safeParse(data);

		console.log('validation');

		if (!validateResult.success) {
			console.log('validation failed');
			return fail(400, {
				errors: flattenError(validateResult.error).fieldErrors,
				data
			});
		}

		console.log('validation success');
		try {
			const registerResult = await register(validateResult.data);
			const token = btoa(JSON.stringify(registerResult.user));
			cookies.set('jwt', token, { path: '/' });

			redirect(307, '/?toast=login-success');
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
