// src/lib/constants/index.ts
import { dev } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';

export const CONSTANTS = {
	COMMENT: {
		MAX_LENGTH: 500,
		MIN_LENGTH: 1
	},
	API: {
		TIMEOUT: 10 * 1000,
		BASE_URL: dev ? '' : PUBLIC_API_URL
	},
	PAGINATION: {
		DEFAULT_PAGE: 1,
		DEFAULT_LIMIT: 10
	}
} as const;
