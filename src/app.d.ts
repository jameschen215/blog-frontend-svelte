// See https://svelte.dev/docs/kit/types#app.d.ts

import type { AuthResultUser } from '@/types/data';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			user: AuthResultUser | null;
		}
	}
}

export {};
