import { flattenError } from 'zod';
import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { loginSchema } from '@/schema/auth.js';
import { login } from '@/api/auth.js';
import { APIError } from '@/api/client.js';

export async function load({ locals }) {
	if (locals.user) redirect(307, '/');
}

export const actions = {
	default: async ({ cookies, request }) => {
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

		// Call login API
		// Backend handles setting the JWT cookie, it's necessary to set token cookies here
		try {
			const loginResult = await login(validateResult.data);
			const token = btoa(JSON.stringify(loginResult.user));
			cookies.set('jwt', token, { path: '/' });

			redirect(307, '/?toast=login-success');
		} catch (error) {
			// let redirect pass through
			if (isRedirect(error)) {
				throw error;
			}

			return fail(401, {
				formError: { message: error instanceof APIError ? error.message : 'Invalid credentials' }
			});
		}
	}
};
