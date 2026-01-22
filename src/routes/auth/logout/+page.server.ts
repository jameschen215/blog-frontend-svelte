import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: (event) => {
		event.cookies.delete('jwt', { path: '/' });

		redirect(302, '/');
	}
} satisfies Actions;
