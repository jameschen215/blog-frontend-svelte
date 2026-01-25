import { jwtVerify } from 'jose';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import type { AuthResultUser, Role } from '$lib/types/data';
import { SECRET_KEY } from '$env/static/private';

const JWT_SECRET = new TextEncoder().encode(SECRET_KEY ?? 'JWT_SECRET');

export const handle: Handle = async ({ event, resolve }) => {
	console.log(event.url.pathname);

	const token = event.cookies.get('jwt');

	if (token) {
		try {
			const { payload } = await jwtVerify(token, JWT_SECRET);

			event.locals.user = {
				id: payload.id as number,
				username: payload.username as string,
				email: payload.email as string,
				role: payload.role as Role
			} as AuthResultUser;
		} catch {
			event.locals.user = null;
		}
	}

	return resolve(event);
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.includes('/api/')) {
		request.headers.set('cookie', event.request.headers.get('cookie') ?? '');
	}
	return fetch(request);
};
