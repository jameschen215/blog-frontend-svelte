import { error, fail } from '@sveltejs/kit';
import { APIError } from '$lib/api/client';

/**
 * For load functions - throws error (shows error page)
 */
export function handleLoadError(err: unknown): never {
	if (err instanceof APIError) {
		error(err.status ?? 500, err.message);
	}

	throw err;
}

/**
 * For form actions - returns fail (stays on page)
 * Handles ALL API errors including rate limits, validation, etc.
 */
export function handleActionError(err: unknown) {
	if (err instanceof APIError) {
		return fail(err.status ?? 500, {
			message: err.message,
			errors: err.fieldErrors
		});
	}

	throw err;
}
