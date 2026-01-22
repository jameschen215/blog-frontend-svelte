import { apiPost } from '$lib/api/client';
import type { LoginInput, RegisterInput } from '$lib/schema/auth';
import type { AuthResult } from '$lib/types/data';

export function login(credentials: LoginInput): Promise<AuthResult> {
	return apiPost<AuthResult>('/auth/login', credentials, {
		credentials: 'include'
	});
}

export function register(credentials: RegisterInput): Promise<AuthResult> {
	return apiPost<AuthResult>('/auth/register', credentials);
}

// export function logout(): Promise<AuthResult> {
// 	return apiPost<AuthResult>('/auth/logout', {
// 		credentials: 'include'
// 	});
// }
