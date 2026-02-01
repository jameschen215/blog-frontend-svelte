// custom api error class
import { CONSTANTS } from '$lib/constants';

const TIMEOUT = CONSTANTS.API.TIMEOUT;
const BASE_URL = CONSTANTS.API.BASE_URL;

export class APIError extends Error {
	status?: number;
	response?: Response;
	fieldErrors?: Record<string, string[]>;

	constructor(
		message: string,
		status?: number,
		response?: Response,
		fieldErrors?: Record<string, string[]>
	) {
		super(message);

		this.name = 'APIError';
		this.status = status;
		this.response = response;
		this.fieldErrors = fieldErrors;
	}
}

async function apiFetch<T>(
	endpoint: string,
	customFetch = fetch,
	options: RequestInit = {}
): Promise<T> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

	try {
		const res = await customFetch(BASE_URL + endpoint, {
			...options,
			credentials: 'include',
			signal: controller.signal,
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			}
		});

		clearTimeout(timeoutId);

		if (!res.ok) {
			let message = `API request failed: ${res.status} ${res.statusText}`;
			let fieldErrors: Record<string, string[]> | undefined;

			try {
				const data = await res.json();
				message = data.message ?? message;

				if (Array.isArray(data.errors)) {
					fieldErrors = data.errors.reduce(
						(acc: Record<string, string[]>, err: { field: string; message: string }) => {
							if (!acc[err.field]) {
								acc[err.field] = [];
							}
							acc[err.field].push(err.message);

							return acc;
						},
						{}
					);
				}
			} catch {
				// non-JSON error body
			}

			throw new APIError(message, res.status, res, fieldErrors);
		}

		return await res.json();
	} catch (error) {
		clearTimeout(timeoutId);

		if (error instanceof DOMException && error.name === 'AbortError') {
			throw new APIError('Request timeout', 408);
		}

		if (error instanceof APIError) throw error;

		throw new APIError(error instanceof Error ? error.message : 'Unknown error');
	}
}

export function apiGet<T>(endpoint: string, customFetch = fetch, options?: RequestInit) {
	return apiFetch<T>(endpoint, customFetch, {
		method: 'GET',
		...options
	});
}

export function apiPost<T>(
	endpoint: string,
	data?: unknown,
	customFetch = fetch,
	options?: RequestInit
) {
	return apiFetch<T>(endpoint, customFetch, {
		method: 'POST',
		body: data ? JSON.stringify(data) : undefined,
		...options
	});
}

export function apiPut<T>(
	endpoint: string,
	data: unknown,
	customFetch = fetch,
	options?: RequestInit
) {
	return apiFetch<T>(endpoint, customFetch, {
		method: 'PUT',
		body: JSON.stringify(data),
		...options
	});
}

export function apiDelete<T>(endpoint: string, customFetch = fetch, options?: RequestInit) {
	return apiFetch<T>(endpoint, customFetch, {
		method: 'DELETE',
		...options
	});
}
