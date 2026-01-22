import { BASE_URL, DEFAULT_TIMEOUT } from '@/constants';

// custom api error class
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

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

	try {
		const res = await fetch(BASE_URL + endpoint, {
			...options,
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

export function apiGet<T>(endpoint: string, headers: HeadersInit = {}) {
	return apiFetch<T>(endpoint, {
		method: 'GET',
		headers
	});
}

export function apiPost<T>(endpoint: string, data?: unknown, headers: HeadersInit = {}) {
	return apiFetch<T>(endpoint, {
		method: 'POST',
		headers,
		body: data ? JSON.stringify(data) : undefined
	});
}

export function apiPut<T>(endpoint: string, data: unknown, headers: HeadersInit = {}) {
	return apiFetch<T>(endpoint, {
		method: 'PUT',
		headers,
		body: JSON.stringify(data)
	});
}

export function apiDelete<T>(endpoint: string, headers: HeadersInit = {}) {
	return apiFetch<T>(endpoint, {
		method: 'DELETE',
		headers
	});
}
