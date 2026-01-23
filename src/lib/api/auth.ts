import { apiPost } from '$lib/api/client';
import type { AuthResult } from '$lib/types/data';
import type { LoginInput, RegisterInput } from '$lib/schema/auth';

export function login(credentials: LoginInput): Promise<AuthResult> {
	return apiPost<AuthResult>('/auth/login', credentials, {
		credentials: 'include'
	});
}

export function register(credentials: RegisterInput): Promise<AuthResult> {
	return apiPost<AuthResult>('/auth/register', credentials);
}
