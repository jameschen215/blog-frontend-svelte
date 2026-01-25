import { logout } from '$lib/api/auth';
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ fetch }) => {
		await logout(fetch);

		redirect(303, '/');
	}
} satisfies Actions;
