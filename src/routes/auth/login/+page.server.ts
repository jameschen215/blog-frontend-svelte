import { fail } from '@sveltejs/kit';
import * as z from 'zod';
import { loginSchema } from '@/schema/auth.js';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		// validate with zod
		const result = loginSchema.safeParse(data);

		if (!result.success) {
			return fail(400, {
				errors: z.flattenError(result.error).fieldErrors,
				data
			});
		}

		// TODO: call api

		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({ success: true });
			}, 1000);
		});
	}
};
