import { apiPost } from '$lib/api/client';
import type { LoginInput } from '$lib/schema/auth';
import type { AuthResult } from '$lib/types/data';

export function login(credentials: LoginInput): Promise<AuthResult> {
	return apiPost<AuthResult>('/auth/login', credentials, {
		credentials: 'include'
	});
}

export function logout(): Promise<AuthResult> {
	return apiPost<AuthResult>('/auth/logout', {
		credentials: 'include'
	});
}
