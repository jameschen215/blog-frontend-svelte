# .gitignore

```
node_modules

# Output
.output
.vercel
.netlify
.wrangler
/.svelte-kit
/build

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.*
!.env.example
!.env.test

# Vite
vite.config.js.timestamp-*
vite.config.ts.timestamp-*

```

# .npmrc

```
engine-strict=true

```

# .prettierignore

```
# Package Managers
package-lock.json
pnpm-lock.yaml
yarn.lock
bun.lock
bun.lockb

# Miscellaneous
/static/

```

# .prettierrc

```
{
	"useTabs": true,
	"singleQuote": true,
	"trailingComma": "none",
	"printWidth": 100,
	"plugins": ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
	"overrides": [
		{
			"files": "*.svelte",
			"options": {
				"parser": "svelte"
			}
		}
	],
	"tailwindStylesheet": "./src/routes/layout.css"
}

```

# .vscode\settings.json

```json
{
	"files.associations": {
		"*.css": "tailwindcss"
	}
}

```

# components.json

```json
{
	"$schema": "https://shadcn-svelte.com/schema.json",
	"tailwind": {
		"css": "src/routes/layout.css",
		"baseColor": "zinc"
	},
	"aliases": {
		"components": "$lib/components",
		"utils": "$lib/utils",
		"ui": "$lib/components/ui",
		"hooks": "$lib/hooks",
		"lib": "$lib"
	},
	"typescript": true,
	"registry": "https://shadcn-svelte.com/registry"
}

```

# eslint.config.js

```js
import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },

		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],

		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	}
);

```

# package.json

```json
{
	"name": "blog-frontend-svelte",
	"private": true,
	"version": "0.0.1",
	"type": "module",
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"preview": "vite preview",
		"prepare": "svelte-kit sync || echo ''",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
		"format": "prettier --write .",
		"lint": "prettier --check . && eslint ."
	},
	"devDependencies": {
		"@eslint/compat": "^1.4.0",
		"@eslint/js": "^9.39.1",
		"@fontsource/fira-mono": "^5.2.7",
		"@internationalized/date": "^3.10.1",
		"@lucide/svelte": "^0.561.0",
		"@neoconfetti/svelte": "^2.2.2",
		"@sveltejs/adapter-auto": "^7.0.0",
		"@sveltejs/kit": "^2.49.1",
		"@sveltejs/vite-plugin-svelte": "^6.2.1",
		"@tailwindcss/vite": "^4.1.17",
		"@types/jsonwebtoken": "^9.0.10",
		"@types/node": "^22",
		"bits-ui": "^2.15.4",
		"clsx": "^2.1.1",
		"eslint": "^9.39.1",
		"eslint-config-prettier": "^10.1.8",
		"eslint-plugin-svelte": "^3.13.1",
		"globals": "^16.5.0",
		"prettier": "^3.7.4",
		"prettier-plugin-svelte": "^3.4.0",
		"prettier-plugin-tailwindcss": "^0.7.2",
		"svelte": "^5.45.6",
		"svelte-check": "^4.3.4",
		"svelte-sonner": "^1.0.7",
		"tailwind-merge": "^3.4.0",
		"tailwind-variants": "^3.2.2",
		"tailwindcss": "^4.1.17",
		"tw-animate-css": "^1.4.0",
		"typescript": "^5.9.3",
		"typescript-eslint": "^8.48.1",
		"vite": "^7.2.6",
		"vite-plugin-devtools-json": "^1.0.0"
	},
	"dependencies": {
		"date-fns": "^4.1.0",
		"jose": "^6.1.3",
		"jsonwebtoken": "^9.0.3",
		"mode-watcher": "^1.1.0",
		"zod": "^4.3.5"
	}
}

```

# README.md

```md
## What I've learned

### Passing Refs Between Components in Svelte

Unlike React's `useRef` and `forwardRef`, Svelte uses a simpler pattern for managing references across components:

1. `bind:this` for component/element references: Use `bind:this={variable}` to get a direct reference to DOM elements or component instances.

\`\`\`svelte
  import CommentSection from './CommentSection.svelte';
  let commentSection: CommentSection;

	function handleCommentClick() {
		commentSection?.scrollIntoView();
		commentSection?.focus();
	}
\`\`\`

2. Exposing component methods: Child components can export functions that parents can call, similar to React's `useImperativeHandle`:

\`\`\`svelte
  // Child component
  export function focus() {
    textarea?.focus();
  }
\`\`\`

3. Parent coordinates between siblings: The parent component holds references to child components and orchestrates interactions between them, rather than passing refs down as props.

4. shadcn-svelte specific: When using shadcn-svelte components like `InputGroup.Textarea`, use `bind:ref` instead of `bind:this` to access the underlying DOM element.

5. Svelte 5 runes and TypeScript:
   - Initialize ref variables with `$state<HTMLElement | null>(null)` instead of `undefined`
   - Svelte's bind system requires `null` (intentional empty value) rather than `undefined` (uninitialized)
   - Use optional chaining (`?.`) when calling methods on refs to handle null cases safely

This pattern keeps component internals encapsulated while allowing controlled access to specific functionality.

```

# src\app.d.ts

```ts
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

```

# src\app.html

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.ico" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>

```

# src\hooks.server.ts

```ts
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

```

# src\lib\api\auth.ts

```ts
import { apiPost } from '$lib/api/client';
import type { AuthResult } from '$lib/types/data';
import type { LoginInput, RegisterInput } from '$lib/schema/auth';

export function login(credentials: LoginInput, customFetch = fetch): Promise<AuthResult> {
	return apiPost<AuthResult>('/api/auth/login', credentials, customFetch);
}

export function register(credentials: RegisterInput, customFetch = fetch): Promise<AuthResult> {
	return apiPost<AuthResult>('/api/auth/register', credentials, customFetch);
}

export function logout(customFetch = fetch) {
	return apiPost('/api/auth/logout', undefined, customFetch);
}

```

# src\lib\api\client.ts

```ts
import { BASE_URL, DEFAULT_TIMEOUT } from '$lib/constants';

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

async function apiFetch<T>(
	endpoint: string,
	customFetch = fetch,
	options: RequestInit = {}
): Promise<T> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

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

```

# src\lib\api\post.ts

```ts
import { apiGet, apiPost } from '$lib/api/client';
import type { PostDetailResult, PostsResult } from '$lib/types/data';

// Pagination params interface
interface PaginationParams {
	page?: number;
	limit?: number;
}

export async function getPosts(
	params: PaginationParams,
	customFetch = fetch
): Promise<PostsResult> {
	const queryParams = new URLSearchParams();

	if (params.page) {
		queryParams.append('page', params.page.toString());
	}

	if (params.limit) {
		queryParams.append('limit', params.limit.toString());
	}

	const query = queryParams.toString();
	const endpoint = query ? `/api/posts?${query}` : '/api/posts';

	return apiGet<PostsResult>(endpoint, customFetch);
}

export async function getPost(id: number, customFetch = fetch): Promise<PostDetailResult> {
	return apiGet<PostDetailResult>(`/api/posts/${id}`, customFetch);
}

export async function likePost(id: number, customFetch = fetch) {
	return apiPost(`/api/posts/${id}/like`, undefined, customFetch);
}

export async function commentPost(postId: number, content: string, customFetch = fetch) {
	return apiPost(`/api/posts/${postId}/comments`, { content }, customFetch);
}

```

# src\lib\components\ArticleCard.svelte

```svelte
<script lang="ts">
	import { format } from 'date-fns';
	import { Heart, MessageCircle } from '@lucide/svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import type { PostWithAuthor } from '$lib/types/data';
	import { formatCompactNum } from '$lib/utils';
	import { goto } from '$app/navigation';

	let { post, isHome }: { post: PostWithAuthor; isHome: boolean } = $props();

	const handleCardClick = (ev: MouseEvent | KeyboardEvent) => {
		// Ignore if clicking on interactive elements
		const target = ev.target as HTMLElement;
		if (target.closest('[data-card-action]')) return;

		goto(`/posts/${post.id}`);
	};

	const handleCardKeyDown = (ev: KeyboardEvent) => {
		if (ev.key === 'Enter' || ev.key === ' ') {
			ev.preventDefault();
			handleCardClick(ev);
		}
	};

	const handleCardActionClick = (ev: MouseEvent | KeyboardEvent) => {
		ev.stopPropagation();
		ev.preventDefault();

		goto(`/users/${post.author.id}`);
	};

	const handleCardActionKeyDown = (ev: KeyboardEvent) => {
		if (ev.key === 'Enter' || ev.key === ' ') {
			handleCardActionClick(ev);
		}
	};
</script>

<Card.Root
	role="article"
	tabindex={0}
	class="my-5 flex cursor-pointer flex-col gap-3 rounded-sm border-none bg-transparent px-4 shadow-none"
	onclick={handleCardClick}
	onkeydown={handleCardKeyDown}
>
	<Card.Header class="flex flex-col px-0">
		{#if isHome}
			<Card.Action
				tabindex={0}
				class="group"
				data-card-action
				onclick={handleCardActionClick}
				onkeydown={handleCardActionKeyDown}
			>
				<span class="text-foreground/70 italic underline-offset-2 group-hover:underline">
					{post.author.username}
				</span>
			</Card.Action>
		{/if}

		<Card.Title>
			{#if isHome}
				<h1 class="scroll-m-16 font-ibm text-2xl font-semibold tracking-tight sm:text-3xl">
					{post.title}
				</h1>
			{:else}
				<h2
					class="scroll-m-16 border-none font-ibm text-2xl font-semibold tracking-tight sm:text-3xl"
				>
					{post.title}
				</h2>
			{/if}
		</Card.Title>
	</Card.Header>

	<Card.Content class="px-0">
		<p class="line-clamp-3 text-lg leading-7 text-zinc-600 not-first:mt-6 dark:text-zinc-400">
			{post.content.split('\n')[0]}
		</p>
	</Card.Content>

	<Card.Footer class="flex items-center justify-end gap-5 px-0 text-zinc-500">
		<div class="text-sm">{format(post.createdAt, 'LLL d')}</div>

		<div class="flex items-center gap-1">
			<Heart size={16} fill="currentColor" class="text-zinc-400 dark:text-zinc-600" />
			<span class="text-sm">
				{formatCompactNum(post._count?.likes || 0)}
			</span>
		</div>

		<div class="flex items-center gap-1">
			<MessageCircle size={16} fill="currentColor" class="text-zinc-400 dark:text-zinc-600" />
			<span class="text-sm">
				{formatCompactNum(post._count?.comments || 0)}
			</span>
		</div>
	</Card.Footer>
</Card.Root>

```

# src\lib\components\Avatar.svelte

```svelte
<script>
	import { cn } from '$lib/utils';

	let { username, className = '' } = $props();
</script>

<div
	class={cn(
		'flex size-full items-center justify-center rounded-full border border-zinc-100 text-lg font-semibold dark:border-zinc-900',
		className
	)}
>
	<span>
		{username[0].toUpperCase()}
	</span>
	<span class="sr-only">User avatar - {username[0]}</span>
</div>

```

# src\lib\components\Pagination.svelte

```svelte
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import type { PaginationMeta } from '$lib/types/data';

	type PostsPaginationProps = {
		pagination: PaginationMeta;
	};

	let { pagination }: PostsPaginationProps = $props();

	const handlePageChange = (nextPage: number) => {
		const url = new URL(page.url);
		url.searchParams.set('page', String(nextPage));
		goto(url);
	};
</script>

<Pagination.Root
	count={pagination.total}
	perPage={pagination.limit}
	page={pagination.page}
	onPageChange={handlePageChange}
>
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.Previous />
			</Pagination.Item>

			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link {page} isActive={currentPage === page.value}>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}

			<Pagination.Item>
				<Pagination.Next />
			</Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>

```

# src\lib\components\ui\button\button.svelte

```svelte
<script lang="ts" module>
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";

	export const buttonVariants = tv({
		base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
				destructive:
					"bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white shadow-xs",
				outline:
					"bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs",
				ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? "link" : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}

```

# src\lib\components\ui\button\index.ts

```ts
import Root, {
	type ButtonProps,
	type ButtonSize,
	type ButtonVariant,
	buttonVariants,
} from "./button.svelte";

export {
	Root,
	type ButtonProps as Props,
	//
	Root as Button,
	buttonVariants,
	type ButtonProps,
	type ButtonSize,
	type ButtonVariant,
};

```

# src\lib\components\ui\card\card-action.svelte

```svelte
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-action"
	class={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
	{...restProps}
>
	{@render children?.()}
</div>

```

# src\lib\components\ui\card\card-content.svelte

```svelte
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} data-slot="card-content" class={cn("px-6", className)} {...restProps}>
	{@render children?.()}
</div>

```

# src\lib\components\ui\card\card-description.svelte

```svelte
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props();
</script>

<p
	bind:this={ref}
	data-slot="card-description"
	class={cn("text-muted-foreground text-sm", className)}
	{...restProps}
>
	{@render children?.()}
</p>

```

# src\lib\components\ui\card\card-footer.svelte

```svelte
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-footer"
	class={cn("flex items-center px-6 [.border-t]:pt-6", className)}
	{...restProps}
>
	{@render children?.()}
</div>

```

# src\lib\components\ui\card\card-header.svelte

```svelte
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-header"
	class={cn(
		"@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>

```

# src\lib\components\ui\card\card-title.svelte

```svelte
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-title"
	class={cn("leading-none font-semibold", className)}
	{...restProps}
>
	{@render children?.()}
</div>

```

# src\lib\components\ui\card\card.svelte

```svelte
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	class={cn(
		"bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>

```

# src\lib\components\ui\card\index.ts

```ts
import Root from "./card.svelte";
import Content from "./card-content.svelte";
import Description from "./card-description.svelte";
import Footer from "./card-footer.svelte";
import Header from "./card-header.svelte";
import Title from "./card-title.svelte";
import Action from "./card-action.svelte";

export {
	Root,
	Content,
	Description,
	Footer,
	Header,
	Title,
	Action,
	//
	Root as Card,
	Content as CardContent,
	Description as CardDescription,
	Footer as CardFooter,
	Header as CardHeader,
	Title as CardTitle,
	Action as CardAction,
};

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-checkbox-group.svelte

```svelte
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		value = $bindable([]),
		...restProps
	}: DropdownMenuPrimitive.CheckboxGroupProps = $props();
</script>

<DropdownMenuPrimitive.CheckboxGroup
	bind:ref
	bind:value
	data-slot="dropdown-menu-checkbox-group"
	{...restProps}
/>

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-checkbox-item.svelte

```svelte
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import CheckIcon from "@lucide/svelte/icons/check";
	import MinusIcon from "@lucide/svelte/icons/minus";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import type { Snippet } from "svelte";

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		class: className,
		children: childrenProp,
		...restProps
	}: WithoutChildrenOrChild<DropdownMenuPrimitive.CheckboxItemProps> & {
		children?: Snippet;
	} = $props();
</script>

<DropdownMenuPrimitive.CheckboxItem
	bind:ref
	bind:checked
	bind:indeterminate
	data-slot="dropdown-menu-checkbox-item"
	class={cn(
		"focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 ps-8 pe-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		<span
			class="pointer-events-none absolute start-2 flex size-3.5 items-center justify-center"
		>
			{#if indeterminate}
				<MinusIcon class="size-4" />
			{:else}
				<CheckIcon class={cn("size-4", !checked && "text-transparent")} />
			{/if}
		</span>
		{@render childrenProp?.()}
	{/snippet}
</DropdownMenuPrimitive.CheckboxItem>

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-content.svelte

```svelte
<script lang="ts">
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import DropdownMenuPortal from "./dropdown-menu-portal.svelte";
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		sideOffset = 4,
		portalProps,
		class: className,
		...restProps
	}: DropdownMenuPrimitive.ContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof DropdownMenuPortal>>;
	} = $props();
</script>

<DropdownMenuPortal {...portalProps}>
	<DropdownMenuPrimitive.Content
		bind:ref
		data-slot="dropdown-menu-content"
		{sideOffset}
		class={cn(
			"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--bits-dropdown-menu-content-available-height) min-w-[8rem] origin-(--bits-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md outline-none",
			className
		)}
		{...restProps}
	/>
</DropdownMenuPortal>

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-group-heading.svelte

```svelte
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		inset,
		...restProps
	}: ComponentProps<typeof DropdownMenuPrimitive.GroupHeading> & {
		inset?: boolean;
	} = $props();
</script>

<DropdownMenuPrimitive.GroupHeading
	bind:ref
	data-slot="dropdown-menu-group-heading"
	data-inset={inset}
	class={cn("px-2 py-1.5 text-sm font-semibold data-[inset]:ps-8", className)}
	{...restProps}
/>

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-group.svelte

```svelte
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let { ref = $bindable(null), ...restProps }: DropdownMenuPrimitive.GroupProps = $props();
</script>

<DropdownMenuPrimitive.Group bind:ref data-slot="dropdown-menu-group" {...restProps} />

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-item.svelte

```svelte
<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		class: className,
		inset,
		variant = "default",
		...restProps
	}: DropdownMenuPrimitive.ItemProps & {
		inset?: boolean;
		variant?: "default" | "destructive";
	} = $props();
</script>

<DropdownMenuPrimitive.Item
	bind:ref
	data-slot="dropdown-menu-item"
	data-inset={inset}
	data-variant={variant}
	class={cn(
		"data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive/10 dark:data-[variant=destructive]:data-highlighted:bg-destructive/20 data-[variant=destructive]:data-highlighted:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:ps-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...restProps}
/>

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-label.svelte

```svelte
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		inset,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		inset?: boolean;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="dropdown-menu-label"
	data-inset={inset}
	class={cn("px-2 py-1.5 text-sm font-semibold data-[inset]:ps-8", className)}
	{...restProps}
>
	{@render children?.()}
</div>

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-portal.svelte

```svelte
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let { ...restProps }: DropdownMenuPrimitive.PortalProps = $props();
</script>

<DropdownMenuPrimitive.Portal {...restProps} />

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-radio-group.svelte

```svelte
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		value = $bindable(),
		...restProps
	}: DropdownMenuPrimitive.RadioGroupProps = $props();
</script>

<DropdownMenuPrimitive.RadioGroup
	bind:ref
	bind:value
	data-slot="dropdown-menu-radio-group"
	{...restProps}
/>

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-radio-item.svelte

```svelte
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import CircleIcon from "@lucide/svelte/icons/circle";
	import { cn, type WithoutChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children: childrenProp,
		...restProps
	}: WithoutChild<DropdownMenuPrimitive.RadioItemProps> = $props();
</script>

<DropdownMenuPrimitive.RadioItem
	bind:ref
	data-slot="dropdown-menu-radio-item"
	class={cn(
		"focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 ps-8 pe-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...restProps}
>
	{#snippet children({ checked })}
		<span
			class="pointer-events-none absolute start-2 flex size-3.5 items-center justify-center"
		>
			{#if checked}
				<CircleIcon class="size-2 fill-current" />
			{/if}
		</span>
		{@render childrenProp?.({ checked })}
	{/snippet}
</DropdownMenuPrimitive.RadioItem>

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-separator.svelte

```svelte
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DropdownMenuPrimitive.SeparatorProps = $props();
</script>

<DropdownMenuPrimitive.Separator
	bind:ref
	data-slot="dropdown-menu-separator"
	class={cn("bg-border -mx-1 my-1 h-px", className)}
	{...restProps}
/>

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-shortcut.svelte

```svelte
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="dropdown-menu-shortcut"
	class={cn("text-muted-foreground ms-auto text-xs tracking-widest", className)}
	{...restProps}
>
	{@render children?.()}
</span>

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-sub-content.svelte

```svelte
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DropdownMenuPrimitive.SubContentProps = $props();
</script>

<DropdownMenuPrimitive.SubContent
	bind:ref
	data-slot="dropdown-menu-sub-content"
	class={cn(
		"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--bits-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
		className
	)}
	{...restProps}
/>

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-sub-trigger.svelte

```svelte
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		inset,
		children,
		...restProps
	}: DropdownMenuPrimitive.SubTriggerProps & {
		inset?: boolean;
	} = $props();
</script>

<DropdownMenuPrimitive.SubTrigger
	bind:ref
	data-slot="dropdown-menu-sub-trigger"
	data-inset={inset}
	class={cn(
		"data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:ps-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronRightIcon class="ms-auto size-4" />
</DropdownMenuPrimitive.SubTrigger>

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-sub.svelte

```svelte
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let { open = $bindable(false), ...restProps }: DropdownMenuPrimitive.SubProps = $props();
</script>

<DropdownMenuPrimitive.Sub bind:open {...restProps} />

```

# src\lib\components\ui\dropdown-menu\dropdown-menu-trigger.svelte

```svelte
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let { ref = $bindable(null), ...restProps }: DropdownMenuPrimitive.TriggerProps = $props();
</script>

<DropdownMenuPrimitive.Trigger bind:ref data-slot="dropdown-menu-trigger" {...restProps} />

```

# src\lib\components\ui\dropdown-menu\dropdown-menu.svelte

```svelte
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let { open = $bindable(false), ...restProps }: DropdownMenuPrimitive.RootProps = $props();
</script>

<DropdownMenuPrimitive.Root bind:open {...restProps} />

```

# src\lib\components\ui\dropdown-menu\index.ts

```ts
import Root from "./dropdown-menu.svelte";
import Sub from "./dropdown-menu-sub.svelte";
import CheckboxGroup from "./dropdown-menu-checkbox-group.svelte";
import CheckboxItem from "./dropdown-menu-checkbox-item.svelte";
import Content from "./dropdown-menu-content.svelte";
import Group from "./dropdown-menu-group.svelte";
import Item from "./dropdown-menu-item.svelte";
import Label from "./dropdown-menu-label.svelte";
import RadioGroup from "./dropdown-menu-radio-group.svelte";
import RadioItem from "./dropdown-menu-radio-item.svelte";
import Separator from "./dropdown-menu-separator.svelte";
import Shortcut from "./dropdown-menu-shortcut.svelte";
import Trigger from "./dropdown-menu-trigger.svelte";
import SubContent from "./dropdown-menu-sub-content.svelte";
import SubTrigger from "./dropdown-menu-sub-trigger.svelte";
import GroupHeading from "./dropdown-menu-group-heading.svelte";
import Portal from "./dropdown-menu-portal.svelte";

export {
	CheckboxGroup,
	CheckboxItem,
	Content,
	Portal,
	Root as DropdownMenu,
	CheckboxGroup as DropdownMenuCheckboxGroup,
	CheckboxItem as DropdownMenuCheckboxItem,
	Content as DropdownMenuContent,
	Portal as DropdownMenuPortal,
	Group as DropdownMenuGroup,
	Item as DropdownMenuItem,
	Label as DropdownMenuLabel,
	RadioGroup as DropdownMenuRadioGroup,
	RadioItem as DropdownMenuRadioItem,
	Separator as DropdownMenuSeparator,
	Shortcut as DropdownMenuShortcut,
	Sub as DropdownMenuSub,
	SubContent as DropdownMenuSubContent,
	SubTrigger as DropdownMenuSubTrigger,
	Trigger as DropdownMenuTrigger,
	GroupHeading as DropdownMenuGroupHeading,
	Group,
	GroupHeading,
	Item,
	Label,
	RadioGroup,
	RadioItem,
	Root,
	Separator,
	Shortcut,
	Sub,
	SubContent,
	SubTrigger,
	Trigger,
};

```

# src\lib\components\ui\field\field-content.svelte

```svelte
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="field-content"
	class={cn("group/field-content flex flex-1 flex-col gap-1.5 leading-snug", className)}
	{...restProps}
>
	{@render children?.()}
</div>

```

# src\lib\components\ui\field\field-description.svelte

```svelte
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props();
</script>

<p
	bind:this={ref}
	data-slot="field-description"
	class={cn(
		"text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
		"last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
		"[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</p>

```

# src\lib\components\ui\field\field-error.svelte

```svelte
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		errors,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		children?: Snippet;
		errors?: { message?: string }[];
	} = $props();

	const hasContent = $derived.by(() => {
		// has slotted error
		if (children) return true;

		// no errors
		if (!errors) return false;

		// has an error but no message
		if (errors.length === 1 && !errors[0]?.message) {
			return false;
		}

		return true;
	});

	const isMultipleErrors = $derived(errors && errors.length > 1);
	const singleErrorMessage = $derived(errors && errors.length === 1 && errors[0]?.message);
</script>

{#if hasContent}
	<div
		bind:this={ref}
		role="alert"
		data-slot="field-error"
		class={cn("text-destructive text-sm font-normal", className)}
		{...restProps}
	>
		{#if children}
			{@render children()}
		{:else if singleErrorMessage}
			{singleErrorMessage}
		{:else if isMultipleErrors}
			<ul class="ms-4 flex list-disc flex-col gap-1">
				{#each errors ?? [] as error, index (index)}
					{#if error?.message}
						<li>{error.message}</li>
					{/if}
				{/each}
			</ul>
		{/if}
	</div>
{/if}

```

# src\lib\components\ui\field\field-group.svelte

```svelte
<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="field-group"
	class={cn(
		'group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>

```

# src\lib\components\ui\field\field-label.svelte

```svelte
<script lang="ts">
	import { Label } from "$lib/components/ui/label/index.js";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof Label> = $props();
</script>

<Label
	bind:ref
	data-slot="field-label"
	class={cn(
		"group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
		"has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
		"has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</Label>

```

# src\lib\components\ui\field\field-legend.svelte

```svelte
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		variant = "legend",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLLegendElement>> & {
		variant?: "legend" | "label";
	} = $props();
</script>

<legend
	bind:this={ref}
	data-slot="field-legend"
	data-variant={variant}
	class={cn(
		"mb-3 font-medium",
		"data-[variant=legend]:text-base",
		"data-[variant=label]:text-sm",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</legend>

```

# src\lib\components\ui\field\field-separator.svelte

```svelte
<script lang="ts">
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		children?: Snippet;
	} = $props();

	const hasContent = $derived(!!children);
</script>

<div
	bind:this={ref}
	data-slot="field-separator"
	data-content={hasContent}
	class={cn(
		"relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
		className
	)}
	{...restProps}
>
	<Separator class="absolute inset-0 top-1/2" />
	{#if children}
		<span
			class="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
			data-slot="field-separator-content"
		>
			{@render children()}
		</span>
	{/if}
</div>

```

# src\lib\components\ui\field\field-set.svelte

```svelte
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLFieldsetAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLFieldsetAttributes> = $props();
</script>

<fieldset
	bind:this={ref}
	data-slot="field-set"
	class={cn(
		"flex flex-col gap-6",
		"has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</fieldset>

```

# src\lib\components\ui\field\field-title.svelte

```svelte
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="field-title"
	class={cn(
		"flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>

```

# src\lib\components\ui\field\field.svelte

```svelte
<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const fieldVariants = tv({
		base: "group/field data-[invalid=true]:text-destructive flex w-full gap-3",
		variants: {
			orientation: {
				vertical: "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
				horizontal: [
					"flex-row items-center",
					"[&>[data-slot=field-label]]:flex-auto",
					"has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
				],
				responsive: [
					"flex-col @md/field-group:flex-row @md/field-group:items-center [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto",
					"@md/field-group:[&>[data-slot=field-label]]:flex-auto",
					"@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
				],
			},
		},
		defaultVariants: {
			orientation: "vertical",
		},
	});

	export type FieldOrientation = VariantProps<typeof fieldVariants>["orientation"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		orientation = "vertical",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		orientation?: FieldOrientation;
	} = $props();
</script>

<div
	bind:this={ref}
	role="group"
	data-slot="field"
	data-orientation={orientation}
	class={cn(fieldVariants({ orientation }), className)}
	{...restProps}
>
	{@render children?.()}
</div>

```

# src\lib\components\ui\field\index.ts

```ts
import Field from "./field.svelte";
import Set from "./field-set.svelte";
import Legend from "./field-legend.svelte";
import Group from "./field-group.svelte";
import Content from "./field-content.svelte";
import Label from "./field-label.svelte";
import Title from "./field-title.svelte";
import Description from "./field-description.svelte";
import Separator from "./field-separator.svelte";
import Error from "./field-error.svelte";

export {
	Field,
	Set,
	Legend,
	Group,
	Content,
	Label,
	Title,
	Description,
	Separator,
	Error,
	//
	Set as FieldSet,
	Legend as FieldLegend,
	Group as FieldGroup,
	Content as FieldContent,
	Label as FieldLabel,
	Title as FieldTitle,
	Description as FieldDescription,
	Separator as FieldSeparator,
	Error as FieldError,
};

```

# src\lib\components\ui\input-group\index.ts

```ts
import Root from "./input-group.svelte";
import Addon from "./input-group-addon.svelte";
import Button from "./input-group-button.svelte";
import Input from "./input-group-input.svelte";
import Text from "./input-group-text.svelte";
import Textarea from "./input-group-textarea.svelte";

export {
	Root,
	Addon,
	Button,
	Input,
	Text,
	Textarea,
	//
	Root as InputGroup,
	Addon as InputGroupAddon,
	Button as InputGroupButton,
	Input as InputGroupInput,
	Text as InputGroupText,
	Textarea as InputGroupTextarea,
};

```

# src\lib\components\ui\input-group\input-group-addon.svelte

```svelte
<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";
	export const inputGroupAddonVariants = tv({
		base: "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
		variants: {
			align: {
				"inline-start":
					"order-first ps-3 has-[>button]:ms-[-0.45rem] has-[>kbd]:ms-[-0.35rem]",
				"inline-end":
					"order-last pe-3 has-[>button]:me-[-0.45rem] has-[>kbd]:me-[-0.35rem]",
				"block-start":
					"order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-3",
				"block-end":
					"order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-3",
			},
		},
		defaultVariants: {
			align: "inline-start",
		},
	});

	export type InputGroupAddonAlign = VariantProps<typeof inputGroupAddonVariants>["align"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		align = "inline-start",
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		align?: InputGroupAddonAlign;
	} = $props();
</script>

<div
	bind:this={ref}
	role="group"
	data-slot="input-group-addon"
	data-align={align}
	class={cn(inputGroupAddonVariants({ align }), className)}
	onclick={(e) => {
		if ((e.target as HTMLElement).closest("button")) {
			return;
		}
		e.currentTarget.parentElement?.querySelector("input")?.focus();
	}}
	{...restProps}
>
	{@render children?.()}
</div>

```

# src\lib\components\ui\input-group\input-group-button.svelte

```svelte
<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	const inputGroupButtonVariants = tv({
		base: "flex items-center gap-2 text-sm shadow-none",
		variants: {
			size: {
				xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
				sm: "h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5",
				"icon-xs": "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
				"icon-sm": "size-8 p-0 has-[>svg]:p-0",
			},
		},
		defaultVariants: {
			size: "xs",
		},
	});

	export type InputGroupButtonSize = VariantProps<typeof inputGroupButtonVariants>["size"];
</script>

<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";
	import { Button } from "$lib/components/ui/button/index.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		type = "button",
		variant = "ghost",
		size = "xs",
		...restProps
	}: Omit<ComponentProps<typeof Button>, "href" | "size"> & {
		size?: InputGroupButtonSize;
	} = $props();
</script>

<Button
	bind:ref
	{type}
	data-size={size}
	{variant}
	class={cn(inputGroupButtonVariants({ size }), className)}
	{...restProps}
>
	{@render children?.()}
</Button>

```

# src\lib\components\ui\input-group\input-group-input.svelte

```svelte
<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";
	import { Input } from "$lib/components/ui/input/index.js";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...props
	}: ComponentProps<typeof Input> = $props();
</script>

<Input
	bind:ref
	data-slot="input-group-control"
	class={cn(
		"flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
		className
	)}
	bind:value
	{...props}
/>

```

# src\lib\components\ui\input-group\input-group-text.svelte

```svelte
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	class={cn(
		"text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>

```

# src\lib\components\ui\input-group\input-group-textarea.svelte

```svelte
<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...props
	}: ComponentProps<typeof Textarea> = $props();
</script>

<Textarea
	bind:ref
	data-slot="input-group-control"
	class={cn(
		"flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent",
		className
	)}
	bind:value
	{...props}
/>

```

# src\lib\components\ui\input-group\input-group.svelte

```svelte
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...props
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="input-group"
	role="group"
	class={cn(
		"group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none",
		"h-9 has-[>textarea]:h-auto",

		// Variants based on alignment.
		"has-[>[data-align=inline-start]]:[&>input]:ps-2",
		"has-[>[data-align=inline-end]]:[&>input]:pe-2",
		"has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
		"has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

		// Focus state.
		"has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]",

		// Error state.
		"has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",

		className
	)}
	{...props}
>
	{@render children?.()}
</div>

```

# src\lib\components\ui\input\index.ts

```ts
import Root from "./input.svelte";

export {
	Root,
	//
	Root as Input,
};

```

# src\lib\components\ui\input\input.svelte

```svelte
<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	type InputType = Exclude<HTMLInputTypeAttribute, "file">;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, "type"> &
			({ type: "file"; files?: FileList } | { type?: InputType; files?: undefined })
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		"data-slot": dataSlot = "input",
		...restProps
	}: Props = $props();
</script>

{#if type === "file"}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(
			"selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 pt-1.5 text-sm font-medium shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
			"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
			"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(
			"border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
			"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
			"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
			className
		)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}

```

# src\lib\components\ui\label\index.ts

```ts
import Root from "./label.svelte";

export {
	Root,
	//
	Root as Label,
};

```

# src\lib\components\ui\label\label.svelte

```svelte
<script lang="ts">
	import { Label as LabelPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: LabelPrimitive.RootProps = $props();
</script>

<LabelPrimitive.Root
	bind:ref
	data-slot="label"
	class={cn(
		"flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
		className
	)}
	{...restProps}
/>

```

# src\lib\components\ui\pagination\index.ts

```ts
import Root from "./pagination.svelte";
import Content from "./pagination-content.svelte";
import Item from "./pagination-item.svelte";
import Link from "./pagination-link.svelte";
import PrevButton from "./pagination-prev-button.svelte";
import NextButton from "./pagination-next-button.svelte";
import Ellipsis from "./pagination-ellipsis.svelte";
import Previous from "./pagination-previous.svelte";
import Next from "./pagination-next.svelte";

export {
	Root,
	Content,
	Item,
	Link,
	PrevButton, //old
	NextButton, //old
	Ellipsis,
	Previous,
	Next,
	//
	Root as Pagination,
	Content as PaginationContent,
	Item as PaginationItem,
	Link as PaginationLink,
	PrevButton as PaginationPrevButton, //old
	NextButton as PaginationNextButton, //old
	Ellipsis as PaginationEllipsis,
	Previous as PaginationPrevious,
	Next as PaginationNext,
};

```

# src\lib\components\ui\pagination\pagination-content.svelte

```svelte
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLUListElement>> = $props();
</script>

<ul
	bind:this={ref}
	data-slot="pagination-content"
	class={cn("flex flex-row items-center gap-1", className)}
	{...restProps}
>
	{@render children?.()}
</ul>

```

# src\lib\components\ui\pagination\pagination-ellipsis.svelte

```svelte
<script lang="ts">
	import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
	import { cn, type WithElementRef, type WithoutChildren } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLAttributes<HTMLSpanElement>>> = $props();
</script>

<span
	bind:this={ref}
	aria-hidden="true"
	data-slot="pagination-ellipsis"
	class={cn("flex size-9 items-center justify-center", className)}
	{...restProps}
>
	<EllipsisIcon class="size-4" />
	<span class="sr-only">More pages</span>
</span>

```

# src\lib\components\ui\pagination\pagination-item.svelte

```svelte
<script lang="ts">
	import type { HTMLLiAttributes } from "svelte/elements";
	import type { WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		children,
		...restProps
	}: WithElementRef<HTMLLiAttributes> = $props();
</script>

<li bind:this={ref} data-slot="pagination-item" {...restProps}>
	{@render children?.()}
</li>

```

# src\lib\components\ui\pagination\pagination-link.svelte

```svelte
<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { type Props, buttonVariants } from "$lib/components/ui/button/index.js";

	let {
		ref = $bindable(null),
		class: className,
		size = "icon",
		isActive,
		page,
		children,
		...restProps
	}: PaginationPrimitive.PageProps &
		Props & {
			isActive: boolean;
		} = $props();
</script>

{#snippet Fallback()}
	{page.value}
{/snippet}

<PaginationPrimitive.Page
	bind:ref
	{page}
	aria-current={isActive ? "page" : undefined}
	data-slot="pagination-link"
	data-active={isActive}
	class={cn(
		buttonVariants({
			variant: isActive ? "outline" : "ghost",
			size,
		}),
		className
	)}
	children={children || Fallback}
	{...restProps}
/>

```

# src\lib\components\ui\pagination\pagination-next-button.svelte

```svelte
<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: PaginationPrimitive.NextButtonProps = $props();
</script>

{#snippet Fallback()}
	<span>Next</span>
	<ChevronRightIcon class="size-4" />
{/snippet}

<PaginationPrimitive.NextButton
	bind:ref
	aria-label="Go to next page"
	class={cn(
		buttonVariants({
			size: "default",
			variant: "ghost",
			class: "gap-1 px-2.5 sm:pe-2.5",
		}),
		className
	)}
	children={children || Fallback}
	{...restProps}
/>

```

# src\lib\components\ui\pagination\pagination-next.svelte

```svelte
<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: PaginationPrimitive.NextButtonProps = $props();
</script>

<PaginationPrimitive.NextButton
	bind:ref
	aria-label="Go to next page"
	class={cn(
		buttonVariants({
			size: "default",
			variant: "ghost",
			class: "gap-1 px-2.5 sm:pe-2.5",
		}),
		className
	)}
	{...restProps}
>
	<span class="hidden sm:block">Next</span>
	<ChevronRightIcon /></PaginationPrimitive.NextButton
>

```

# src\lib\components\ui\pagination\pagination-prev-button.svelte

```svelte
<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: PaginationPrimitive.PrevButtonProps = $props();
</script>

{#snippet Fallback()}
	<ChevronLeftIcon class="size-4" />
	<span>Previous</span>
{/snippet}

<PaginationPrimitive.PrevButton
	bind:ref
	aria-label="Go to previous page"
	class={cn(
		buttonVariants({
			size: "default",
			variant: "ghost",
			class: "gap-1 px-2.5 sm:ps-2.5",
		}),
		className
	)}
	children={children || Fallback}
	{...restProps}
/>

```

# src\lib\components\ui\pagination\pagination-previous.svelte

```svelte
<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: PaginationPrimitive.PrevButtonProps = $props();
</script>

<PaginationPrimitive.PrevButton
	bind:ref
	aria-label="Go to previous page"
	class={cn(
		buttonVariants({
			size: "default",
			variant: "ghost",
			class: "gap-1 px-2.5 sm:ps-2.5",
		}),
		className
	)}
	{...restProps}
>
	<ChevronLeftIcon />
	<span class="hidden sm:block">Previous</span></PaginationPrimitive.PrevButton
>

```

# src\lib\components\ui\pagination\pagination.svelte

```svelte
<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";

	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		count = 0,
		perPage = 10,
		page = $bindable(1),
		siblingCount = 1,
		...restProps
	}: PaginationPrimitive.RootProps = $props();
</script>

<PaginationPrimitive.Root
	bind:ref
	bind:page
	role="navigation"
	aria-label="pagination"
	data-slot="pagination"
	class={cn("mx-auto flex w-full justify-center", className)}
	{count}
	{perPage}
	{siblingCount}
	{...restProps}
/>

```

# src\lib\components\ui\separator\index.ts

```ts
import Root from "./separator.svelte";

export {
	Root,
	//
	Root as Separator,
};

```

# src\lib\components\ui\separator\separator.svelte

```svelte
<script lang="ts">
	import { Separator as SeparatorPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		"data-slot": dataSlot = "separator",
		...restProps
	}: SeparatorPrimitive.RootProps = $props();
</script>

<SeparatorPrimitive.Root
	bind:ref
	data-slot={dataSlot}
	class={cn(
		"bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:min-h-full data-[orientation=vertical]:w-px",
		className
	)}
	{...restProps}
/>

```

# src\lib\components\ui\sonner\index.ts

```ts
export { default as Toaster } from "./sonner.svelte";

```

# src\lib\components\ui\sonner\sonner.svelte

```svelte
<script lang="ts">
	import CircleCheckIcon from "@lucide/svelte/icons/circle-check";
	import InfoIcon from "@lucide/svelte/icons/info";
	import Loader2Icon from "@lucide/svelte/icons/loader-2";
	import OctagonXIcon from "@lucide/svelte/icons/octagon-x";
	import TriangleAlertIcon from "@lucide/svelte/icons/triangle-alert";

	import { Toaster as Sonner, type ToasterProps as SonnerProps } from "svelte-sonner";
	import { mode } from "mode-watcher";

	let { ...restProps }: SonnerProps = $props();
</script>

<Sonner
	theme={mode.current}
	class="toaster group"
	style="--normal-bg: var(--color-popover); --normal-text: var(--color-popover-foreground); --normal-border: var(--color-border);"
	{...restProps}
	>{#snippet loadingIcon()}
		<Loader2Icon class="size-4 animate-spin" />
	{/snippet}
	{#snippet successIcon()}
		<CircleCheckIcon class="size-4" />
	{/snippet}
	{#snippet errorIcon()}
		<OctagonXIcon class="size-4" />
	{/snippet}
	{#snippet infoIcon()}
		<InfoIcon class="size-4" />
	{/snippet}
	{#snippet warningIcon()}
		<TriangleAlertIcon class="size-4" />
	{/snippet}
</Sonner>

```

# src\lib\components\ui\textarea\index.ts

```ts
import Root from "./textarea.svelte";

export {
	Root,
	//
	Root as Textarea,
};

```

# src\lib\components\ui\textarea\textarea.svelte

```svelte
<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren } from "$lib/utils.js";
	import type { HTMLTextareaAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		"data-slot": dataSlot = "textarea",
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();
</script>

<textarea
	bind:this={ref}
	data-slot={dataSlot}
	class={cn(
		"border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
		className
	)}
	bind:value
	{...restProps}
></textarea>

```

# src\lib\constants.ts

```ts
import { NODE_ENV } from '$env/static/private';
import { PUBLIC_API_URL } from '$env/static/public';

export const DEFAULT_TIMEOUT = 1000 * 10;

export const BASE_URL = NODE_ENV === 'development' ? '' : PUBLIC_API_URL;

```

# src\lib\schema\auth.ts

```ts
import * as z from 'zod';

export const loginSchema = z.object({
	username: z.string().min(3, 'Username must be at least 3 characters'),
	password: z.string().min(6, 'Password must be at least 6 characters')
});

export const registerSchema = z
	.object({
		username: z
			.string()
			.min(3, 'Username must be at least 3 characters.')
			.max(20, 'Username must be at most 20 characters')
			.regex(
				/^[a-zA-Z0-9._-]+$/,
				'Username can only contain letters, numbers, dots, underscores, and hyphens'
			),
		email: z.email('Invalid email'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Password do not match'
	});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

```

# src\lib\schema\comment.ts

```ts
import * as z from 'zod';

export const createCommentSchema = z.object({
	content: z
		.string()
		.min(1, 'Content is required')
		.max(500, 'Comment must be 500 characters or less')
		.trim()
});

export const updateCommentSchema = z.object({
	content: z
		.string()
		.min(1, 'Content is required')
		.max(500, 'Comment must be 500 characters or less')
		.trim()
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;

```

# src\lib\types\data.ts

```ts
export type Role = 'USER' | 'ADMIN';

export interface User {
	id: number;
	username: string;
	email: string;
	role: Role;
	createdAt: string;
	updatedAt: string;
}

export interface Post {
	id: number;
	title: string;
	content: string;
	published: boolean;
	authorId: number;
	createdAt: string;
	updatedAt: string;
}

// Post for homepage - /posts
export interface PostWithAuthor extends Post {
	author: Pick<User, 'id' | 'username' | 'role'>;
	_count?: { comments: number; likes: number };
}

// Post for post page - /posts/:postId
export interface PostDetail extends PostWithAuthor {
	comments: CommentWithAuthor[];
	isLikedByCurrentUser: boolean;
}

export interface Comment {
	id: number;
	content: string;
	postId: number;
	authorId: number | null;
	guestName: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CommentWithAuthor extends Comment {
	author: Pick<User, 'id' | 'username' | 'role'> | null;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export type PostsResult = {
	posts: PostWithAuthor[];
	pagination: PaginationMeta;
};

export type UserResult = {
	user: Pick<User, 'id' | 'username' | 'role'>;
	posts: PostWithAuthor[];
	pagination: PaginationMeta;
};

export type PostDetailResult = { post: PostDetail };

export interface CommentCreateInput {
	content: string;
}

export interface AuthResultUser {
	id: number;
	username: string;
	email: string;
	role: Role;
}

export interface AuthResult {
	user: AuthResultUser;
}

```

# src\lib\utils.ts

```ts
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function formatCompactNum(num: number) {
	return new Intl.NumberFormat('en', {
		notation: 'compact',
		compactDisplay: 'short' // 'short' for 'K', 'long' for 'thousand'
	}).format(num);
}

```

# src\routes\+layout.server.ts

```ts
export async function load({ locals }) {
	return {
		user: locals.user
	};
}

```

# src\routes\+layout.svelte

```svelte
<script lang="ts">
	import './layout.css';

	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	import Header from './Header.svelte';

	let { children, data } = $props();
</script>

<ModeWatcher />

<div class="flex min-h-screen flex-col items-center">
	<Header user={data.user} />

	<main class="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center">
		{@render children()}
	</main>

	<Toaster position="bottom-right" />
</div>

```

# src\routes\+page.server.ts

```ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { getPosts } from '$lib/api/post';
import { APIError } from '$lib/api/client';

export const load: PageServerLoad = async ({ url, fetch }) => {
	console.log('🔵 Server load function called');

	const page = url.searchParams.get('page') ? Number(url.searchParams.get('page')) : undefined;
	const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : undefined;

	try {
		return {
			postsResult: await getPosts({ page, limit }, fetch)
		};
	} catch (err) {
		if (err instanceof APIError) {
			console.error(err);
			error(err.status!, err.message);
		}

		throw err;
	}
};

```

# src\routes\+page.svelte

```svelte
<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	const { data } = $props();
	const posts = $derived(data.postsResult.posts);
	const pagination = $derived(data.postsResult.pagination);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="The blog app" />
</svelte:head>

<div class="w-full scroll-mt-16">
	<div class="flex flex-col">
		{#if posts && posts.length > 0}
			{#each posts as post (post.id)}
				<ArticleCard {post} isHome={true} />
				<Separator class="mx-auto w-[calc(100%-32px)]! bg-zinc-100 dark:bg-zinc-900" />
			{/each}
		{:else}
			<p>No posts yet.</p>
		{/if}
	</div>

	<!-- pagination -->
	<div class="my-5">
		<Pagination {pagination} />
	</div>
</div>

```

# src\routes\about\+page.svelte

```svelte
<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>About this app</h1>

	<p>
		This is a <a href="https://svelte.dev/docs/kit">SvelteKit</a> app. You can make your own by typing
		the following into your command line and following the prompts:
	</p>

	<pre>npx sv create</pre>

	<p>
		The page you're looking at is purely static HTML, with no client-side interactivity needed.
		Because of that, we don't need to load any JavaScript. Try viewing the page's source, or opening
		the devtools network panel and reloading.
	</p>
</div>

```

# src\routes\about\+page.ts

```ts
import { dev } from '$app/environment';

// we don't need any JS on this page, though we'll load
// it in dev so that we get hot module replacement
export const csr = dev;

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

```

# src\routes\auth\login\+page.server.ts

```ts
import { flattenError } from 'zod';
import { fail, redirect } from '@sveltejs/kit';

import { loginSchema } from '$lib/schema/auth.js';
import { APIError } from '$lib/api/client.js';
import { login } from '$lib/api/auth.js';

export async function load({ locals }) {
	if (locals.user) redirect(307, '/');
}

export const actions = {
	default: async ({ request, fetch, url }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		// validate with zod
		const validateResult = loginSchema.safeParse(data);

		if (!validateResult.success) {
			return fail(400, {
				errors: flattenError(validateResult.error).fieldErrors,
				data
			});
		}

		try {
			await login(validateResult.data, fetch);

			const to = url.searchParams.has('redirect') ? `${url.searchParams.get('redirect')}` : '/';

			redirect(307, to);
		} catch (error) {
			// expected, user-facing error
			if (error instanceof APIError) {
				return fail(error.status!, {
					message: error.message,
					errors: error.fieldErrors
				});
			}

			throw error;
		}
	}
};

```

# src\routes\auth\login\+page.svelte

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import { enhance, applyAction } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	import { cn } from '$lib/utils.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let { form } = $props();
	let submitting = $state(false);

	let registerUrl = $derived.by(() => {
		const redirect = page.url.searchParams.get('redirect');
		return redirect ? `/auth/register?redirect=${encodeURIComponent(redirect)}` : '/auth/register';
	});

	// Local error state for real-time clearing
	let localErrors = $state<Record<string, string[] | undefined>>({});

	// Sync form errors with local errors
	$effect(() => {
		if (form?.errors) {
			localErrors = { ...form.errors };
		}
	});

	// Clear error for a specific field
	function clearError(fieldName: string) {
		localErrors[fieldName] = undefined;
	}

	const handleSubmit: SubmitFunction = () => {
		submitting = true;

		return async ({ result }) => {
			submitting = false;

			if (result.type === 'redirect') {
				toast.message('You are logged in successfully!');
				goto(result.location, { invalidateAll: true });
			} else {
				await applyAction(result);

				// Focus first error field after submission
				if (result.type === 'failure' && result.data) {
					const data = result.data as Record<string, any>;

					if (data.errors && typeof data.errors === 'object') {
						setTimeout(() => {
							const firstErrorField = Object.keys(data.errors)[0];
							if (firstErrorField) {
								const input = document.getElementById(firstErrorField) as HTMLInputElement;
								input?.focus();
							}
						}, 0);
					}
				}
			}
		};
	};
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login to the blog" />
</svelte:head>

<div class="mt-10 flex w-full max-w-md flex-1 sm:mt-20">
	<form class="w-full px-4 sm:px-8" method="post" novalidate use:enhance={handleSubmit}>
		<h1 class="mb-12 scroll-m-20 font-ibm text-3xl font-extrabold tracking-tight lg:text-4xl">
			Login
		</h1>

		<Field.Set>
			<Field.Group class="gap-5">
				<Field.Field class="gap-2">
					<Field.FieldLabel for="username">Username</Field.FieldLabel>

					<Input
						type="text"
						name="username"
						id="username"
						value={form?.data?.username ?? ''}
						class="rounded-sm"
						oninput={() => clearError('username')}
						autofocus
					/>

					{#if localErrors?.username}
						<Field.FieldError id="username-error">{localErrors.username[0]}</Field.FieldError>
					{/if}
				</Field.Field>

				<Field.Field class="gap-2">
					<Field.FieldLabel for="password">Password</Field.FieldLabel>

					<Input
						type="password"
						name="password"
						id="password"
						value={form?.data?.password ?? ''}
						class="rounded-sm"
						oninput={() => clearError('password')}
					/>

					{#if localErrors?.password}
						<Field.FieldError id="password-error">{localErrors.password[0]}</Field.FieldError>
					{/if}
				</Field.Field>

				<Field.Field class="gap-2">
					<Button type="submit" class="cursor-pointer" disabled={submitting}>
						{submitting ? 'Logging in...' : 'Login'}
					</Button>

					{#if form?.message}
						<Field.FieldError id="form-message">{form.message}</Field.FieldError>
					{/if}
				</Field.Field>
			</Field.Group>
		</Field.Set>

		<p class="text-sm leading-7 not-first:mt-6">
			<span>Don't have an account yet?</span>
			<a
				href={registerUrl}
				class={cn(
					'font-medium italic underline transition-all hover:underline-offset-2',
					submitting && 'pointer-events-none cursor-not-allowed opacity-50'
				)}
				aria-disabled={submitting}
			>
				Register
			</a>
			here.
		</p>
	</form>
</div>

```

# src\routes\auth\logout\+page.server.ts

```ts
import { logout } from '$lib/api/auth';
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ url, fetch }) => {
		await logout(fetch);

		const to = url.searchParams.has('redirect') ? `${url.searchParams.get('redirect')}` : '/';

		redirect(303, to);
	}
} satisfies Actions;

```

# src\routes\auth\register\+page.server.ts

```ts
import { flattenError } from 'zod';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { register } from '$lib/api/auth';
import { APIError } from '$lib/api/client';
import { registerSchema } from '$lib/schema/auth';

export const actions = {
	default: async ({ request, url }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		const validateResult = registerSchema.safeParse(data);

		if (!validateResult.success) {
			return fail(400, {
				errors: flattenError(validateResult.error).fieldErrors,
				data
			});
		}

		try {
			// const registerResult = await register(validateResult.data);
			// const token = btoa(JSON.stringify(registerResult.user));
			// cookies.set('jwt', token, { path: '/' });
			await register(validateResult.data);

			const to = url.searchParams.has('redirect') ? `${url.searchParams.get('redirect')}` : '/';

			redirect(307, to);
		} catch (error) {
			if (error instanceof APIError) {
				return fail(error.status!, {
					message: error.message,
					errors: error.fieldErrors
				});
			}

			throw error;
		}
	}
} satisfies Actions;

```

# src\routes\auth\register\+page.svelte

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	import { cn } from '$lib/utils';
	import * as Field from '$lib/components/ui/field/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let { form }: PageProps = $props();

	let submitting = $state(false);
	let localErrors = $state<Record<string, string[] | undefined>>({});
	let loginUrl = $derived.by(() => {
		const redirect = page.url.searchParams.get('redirect');
		return redirect ? `/auth/login?redirect=${encodeURIComponent(redirect)}` : '/auth/login';
	});

	$effect(() => {
		if (form?.errors) {
			localErrors = { ...form.errors };
		}
	});

	const clearError = (filedName: string) => {
		localErrors[filedName] = undefined;
	};

	const handleSubmit: SubmitFunction = () => {
		submitting = true;

		return async ({ result }) => {
			submitting = false;

			await applyAction(result);

			// focus on first error field after submission
			if (result.type === 'failure' && result.data) {
				const data = result.data as Record<string, any>;

				if (data.errors && typeof data.errors === 'object') {
					setTimeout(() => {
						const firstErrorField = Object.keys(data.errors)[0];
						if (firstErrorField) {
							document.getElementById(firstErrorField)?.focus();
						}
					}, 0);
				}
			}
		};
	};
</script>

<svelte:head>
	<title>Register</title>
	<meta name="description" content="Register to the blog" />
</svelte:head>

<div class="mt-10 flex w-full max-w-md flex-1 sm:mt-20">
	<form class="w-full px-4 sm:px-8" method="post" novalidate use:enhance={handleSubmit}>
		<h1 class="mb-12 scroll-m-20 font-ibm text-3xl font-extrabold tracking-tight lg:text-4xl">
			Register
		</h1>

		<Field.Set>
			<Field.Group class="gap-5">
				<Field.Field class="gap-2">
					<Field.FieldLabel for="username" class="capitalize">username</Field.FieldLabel>
					<Input
						type="text"
						id="username"
						name="username"
						value={form?.data?.username ?? ''}
						oninput={() => clearError('username')}
						autofocus
						class="rounded-sm"
					/>

					{#if localErrors.username}
						<Field.FieldError id="username-error">{localErrors.username[0]}</Field.FieldError>
					{/if}
				</Field.Field>

				<Field.Field class="gap-2">
					<Field.FieldLabel for="email" class="capitalize">email</Field.FieldLabel>
					<Input
						type="email"
						id="email"
						name="email"
						value={form?.data?.email ?? ''}
						oninput={() => clearError('email')}
						class="rounded-sm"
					/>

					{#if localErrors.email}
						<Field.FieldError id="email-error">{localErrors.email[0]}</Field.FieldError>
					{/if}
				</Field.Field>

				<Field.Field class="gap-2">
					<Field.FieldLabel for="password" class="capitalize">password</Field.FieldLabel>
					<Input
						type="password"
						id="password"
						name="password"
						value={form?.data?.password ?? ''}
						oninput={() => clearError('password')}
						class="rounded-sm"
					/>

					{#if localErrors.password}
						<Field.FieldError id="password-error">{localErrors.password[0]}</Field.FieldError>
					{/if}
				</Field.Field>

				<Field.Field class="gap-2">
					<Field.FieldLabel for="confirmPassword" class="capitalize">
						Confirm Password
					</Field.FieldLabel>
					<Input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						value={form?.data?.confirmPassword ?? ''}
						oninput={() => clearError('confirmPassword')}
						class="rounded-sm"
					/>

					{#if localErrors.confirmPassword}
						<Field.FieldError id="confirmPassword-error">
							{localErrors.confirmPassword[0]}
						</Field.FieldError>
					{/if}
				</Field.Field>

				<Field.Field class="gap-2">
					<Button type="submit" class="cursor-pointer" disabled={submitting}>
						{submitting ? 'Registering...' : 'Register'}
					</Button>

					{#if form?.message}
						<Field.FieldError id="form-message">{form.message}</Field.FieldError>
					{/if}
				</Field.Field>
			</Field.Group>
		</Field.Set>

		<p class="text-sm leading-7 not-first:mt-6">
			<span>Have an account already?</span>
			<a
				href={loginUrl}
				class={cn(
					'font-medium italic underline transition-all hover:underline-offset-2',
					submitting && 'pointer-events-none cursor-not-allowed opacity-50'
				)}
				aria-disabled={submitting}
			>
				Login
			</a>
			here.
		</p>
	</form>
</div>

```

# src\routes\Header.svelte

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { toggleMode } from 'mode-watcher';

	import Menu from '@lucide/svelte/icons/menu';
	import SunIcon from '@lucide/svelte/icons/sun';
	import LogIn from '@lucide/svelte/icons/log-in';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import Logout from '@lucide/svelte/icons/log-out';
	import PenLine from '@lucide/svelte/icons/pen-line';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';

	import type { AuthResultUser } from '$lib/types/data';
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	interface Props {
		user: AuthResultUser | null;
	}

	let { user }: Props = $props();
	let isAuthenticated = $derived(!!user);

	let redirect = $derived(page.url.pathname + page.url.hash);

	function handleWriteClick() {
		toast.info('Functionality coming soon...');
	}
</script>

<header
	class="sticky top-0 z-20 w-full border-b border-zinc-100 bg-background/50 backdrop-blur dark:border-zinc-900"
>
	<div class="mx-auto flex h-16 w-full max-w-2xl items-center justify-between px-4">
		<!-- brand -->
		<Button variant="link" class="p-0 hover:no-underline">
			<a href="/" aria-label="The blog homepage">
				<!-- logo -->
				<span role="img" aria-hidden="true" aria-label="The blog logo" class="font-anton text-xl">
					The blog
				</span>

				<span class="sr-only">The Blog - Go to homepage</span>
			</a>
		</Button>

		<div class="flex items-center gap-2">
			<!-- write button -->
			<Button
				variant={'ghost'}
				size="icon"
				onclick={handleWriteClick}
				class="cursor-pointer rounded-full"
			>
				<PenLine class="h-[1.2rem] w-[1.2rem]" />

				<span class="sr-only">Create a post</span>
			</Button>

			<!-- theme toggle -->
			<Button
				onclick={toggleMode}
				variant={'ghost'}
				size="icon"
				class="cursor-pointer rounded-full"
			>
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
				/>

				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
				/>

				<span class="sr-only">Toggle theme</span>
			</Button>

			<!-- dropdown menu -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							variant="ghost"
							size="icon"
							class="group cursor-pointer rounded-full px-0!"
						>
							{#if isAuthenticated}
								<Avatar username="James" className="group-hover:border-transparent" />
							{:else}
								<Menu class="h-[1.2rem] w-[1.2rem]" />
							{/if}
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>

				<DropdownMenu.Content class="w-40 rounded-sm p-2" align="start">
					{#if isAuthenticated}
						<DropdownMenu.Label>My Account</DropdownMenu.Label>
						<DropdownMenu.Separator class="mb-2" />
					{/if}

					<DropdownMenu.Group class="space-y-1">
						{#if isAuthenticated}
							<DropdownMenu.Item
								class="cursor-pointer"
								onclick={() => toast.message('Coming soon...')}
							>
								<LayoutDashboard /> Dashboard
							</DropdownMenu.Item>

							<form action="/auth/logout" method="post" use:enhance>
								<DropdownMenu.Item class="w-full cursor-pointer">
									{#snippet child({ props })}
										<button {...props} type="submit">
											<Logout /> Logout
										</button>
									{/snippet}
								</DropdownMenu.Item>
							</form>
						{:else}
							<DropdownMenu.Item
								class="cursor-pointer"
								onclick={() => goto(`/auth/login?redirect=${encodeURIComponent(redirect)}`)}
							>
								<LogIn /> Login
							</DropdownMenu.Item>

							<DropdownMenu.Item
								class="cursor-pointer"
								onclick={() => goto(`/auth/register?redirect=${encodeURIComponent(redirect)}`)}
							>
								<UserPlus /> Register
							</DropdownMenu.Item>
						{/if}
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
</header>

```

# src\routes\layout.css

```css
@import url('https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Quicksand:wght@300..700&display=swap');

@import 'tailwindcss';

@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

:root {
	--radius: 0.625rem;
	--background: oklch(1 0 0);
	--foreground: oklch(0.141 0.005 285.823);
	--card: oklch(1 0 0);
	--card-foreground: oklch(0.141 0.005 285.823);
	--popover: oklch(1 0 0);
	--popover-foreground: oklch(0.141 0.005 285.823);
	--primary: oklch(0.21 0.006 285.885);
	--primary-foreground: oklch(0.985 0 0);
	--secondary: oklch(0.967 0.001 286.375);
	--secondary-foreground: oklch(0.21 0.006 285.885);
	--muted: oklch(0.967 0.001 286.375);
	--muted-foreground: oklch(0.552 0.016 285.938);
	--accent: oklch(0.967 0.001 286.375);
	--accent-foreground: oklch(0.21 0.006 285.885);
	--destructive: oklch(0.577 0.245 27.325);
	--border: oklch(0.92 0.004 286.32);
	--input: oklch(0.92 0.004 286.32);
	--ring: oklch(0.705 0.015 286.067);
	--chart-1: oklch(0.646 0.222 41.116);
	--chart-2: oklch(0.6 0.118 184.704);
	--chart-3: oklch(0.398 0.07 227.392);
	--chart-4: oklch(0.828 0.189 84.429);
	--chart-5: oklch(0.769 0.188 70.08);
	--sidebar: oklch(0.985 0 0);
	--sidebar-foreground: oklch(0.141 0.005 285.823);
	--sidebar-primary: oklch(0.21 0.006 285.885);
	--sidebar-primary-foreground: oklch(0.985 0 0);
	--sidebar-accent: oklch(0.967 0.001 286.375);
	--sidebar-accent-foreground: oklch(0.21 0.006 285.885);
	--sidebar-border: oklch(0.92 0.004 286.32);
	--sidebar-ring: oklch(0.705 0.015 286.067);
}

.dark {
	--background: oklch(0.141 0.005 285.823);
	--foreground: oklch(0.985 0 0);
	--card: oklch(0.21 0.006 285.885);
	--card-foreground: oklch(0.985 0 0);
	--popover: oklch(0.21 0.006 285.885);
	--popover-foreground: oklch(0.985 0 0);
	--primary: oklch(0.92 0.004 286.32);
	--primary-foreground: oklch(0.21 0.006 285.885);
	--secondary: oklch(0.274 0.006 286.033);
	--secondary-foreground: oklch(0.985 0 0);
	--muted: oklch(0.274 0.006 286.033);
	--muted-foreground: oklch(0.705 0.015 286.067);
	--accent: oklch(0.274 0.006 286.033);
	--accent-foreground: oklch(0.985 0 0);
	--destructive: oklch(0.704 0.191 22.216);
	--border: oklch(1 0 0 / 10%);
	--input: oklch(1 0 0 / 15%);
	--ring: oklch(0.552 0.016 285.938);
	--chart-1: oklch(0.488 0.243 264.376);
	--chart-2: oklch(0.696 0.17 162.48);
	--chart-3: oklch(0.769 0.188 70.08);
	--chart-4: oklch(0.627 0.265 303.9);
	--chart-5: oklch(0.645 0.246 16.439);
	--sidebar: oklch(0.21 0.006 285.885);
	--sidebar-foreground: oklch(0.985 0 0);
	--sidebar-primary: oklch(0.488 0.243 264.376);
	--sidebar-primary-foreground: oklch(0.985 0 0);
	--sidebar-accent: oklch(0.274 0.006 286.033);
	--sidebar-accent-foreground: oklch(0.985 0 0);
	--sidebar-border: oklch(1 0 0 / 10%);
	--sidebar-ring: oklch(0.552 0.016 285.938);
}

@theme inline {
	--radius-sm: calc(var(--radius) - 4px);
	--radius-md: calc(var(--radius) - 2px);
	--radius-lg: var(--radius);
	--radius-xl: calc(var(--radius) + 4px);
	--color-background: var(--background);
	--color-foreground: var(--foreground);
	--color-card: var(--card);
	--color-card-foreground: var(--card-foreground);
	--color-popover: var(--popover);
	--color-popover-foreground: var(--popover-foreground);
	--color-primary: var(--primary);
	--color-primary-foreground: var(--primary-foreground);
	--color-secondary: var(--secondary);
	--color-secondary-foreground: var(--secondary-foreground);
	--color-muted: var(--muted);
	--color-muted-foreground: var(--muted-foreground);
	--color-accent: var(--accent);
	--color-accent-foreground: var(--accent-foreground);
	--color-destructive: var(--destructive);
	--color-border: var(--border);
	--color-input: var(--input);
	--color-ring: var(--ring);
	--color-chart-1: var(--chart-1);
	--color-chart-2: var(--chart-2);
	--color-chart-3: var(--chart-3);
	--color-chart-4: var(--chart-4);
	--color-chart-5: var(--chart-5);
	--color-sidebar: var(--sidebar);
	--color-sidebar-foreground: var(--sidebar-foreground);
	--color-sidebar-primary: var(--sidebar-primary);
	--color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
	--color-sidebar-accent: var(--sidebar-accent);
	--color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
	--color-sidebar-border: var(--sidebar-border);
	--color-sidebar-ring: var(--sidebar-ring);

	/* Custom font family */
	--font-anton: 'Anton', sans-serif;
	--font-ibm: 'IBM Plex Sans', sans-serif;
}

@layer base {
	* {
		@apply border-border outline-ring/50;
	}
	body {
		@apply bg-background text-foreground;

		font-family:
			'Quicksand',
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
	}
}

```

# src\routes\posts\[id]\+page.server.ts

```ts
import { error, fail } from '@sveltejs/kit';
import { commentPost, getPost, likePost } from '$lib/api/post.js';
import type { Actions } from './$types';
import { APIError } from '$lib/api/client.js';
import { createCommentSchema } from '$lib/schema/comment.js';
import { flattenError } from 'zod';

export async function load({ params, fetch }) {
	const id = Number(params.id);

	if (!Number.isInteger(id) || id < 1) {
		error(400, 'Invalid post ID');
	}

	return await getPost(id, fetch);
}

export const actions = {
	like: async ({ params, fetch }) => {
		const id = parseInt(params.id);

		if (isNaN(id) || id < 1) {
			error(404, 'Invalid post ID');
		}

		try {
			await likePost(id, fetch);
		} catch (err) {
			if (err instanceof APIError) {
				if (err.status === 429) {
					return fail(err.status, {
						message: err.message
					});
				} else {
					error(err.status!, err.message);
				}
			}

			throw err;
		}
	},
	comment: async ({ params, request, fetch }) => {
		const id = parseInt(params.id);

		if (isNaN(id) || id < 1) {
			error(404, 'Invalid post ID');
		}

		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		// validate with zod
		const validateResult = createCommentSchema.safeParse(data);

		if (!validateResult.success) {
			return fail(400, {
				errors: flattenError(validateResult.error).fieldErrors,
				data
			});
		}

		try {
			await commentPost(id, validateResult.data.content, fetch);

			return { success: true };
		} catch (error) {
			if (error instanceof APIError) {
				return fail(error.status!, {
					message: error.message,
					errors: error.fieldErrors
				});
			}

			throw error;
		}
	}
} satisfies Actions;

```

# src\routes\posts\[id]\+page.svelte

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import type { ActionData, PageData, PageProps } from './$types';
	import Article from './Article.svelte';
	import ArticleControls from './ArticleControls.svelte';
	import CommentSection from './CommentSection.svelte';

	let { data }: PageProps = $props();
	let post = $derived(data.post);

	let commentSection: CommentSection;

	function handleCommentClick() {
		commentSection?.scrollIntoView();
		commentSection?.focus();
	}
</script>

<svelte:head>
	<title>Article - {post.title}</title>
	<meta name="description" content="Article page" />
</svelte:head>

<div class="px-4">
	<Article {post} />

	<ArticleControls user={data.user} post={data.post} {handleCommentClick} />

	<CommentSection bind:this={commentSection} post={data.post} user={data.user} />
</div>

```

# src\routes\posts\[id]\Article.svelte

```svelte
<script lang="ts">
	import type { PostDetail } from '$lib/types/data';
	import { format } from 'date-fns';

	interface Props {
		post: PostDetail;
	}

	let { post }: Props = $props();
</script>

<section class="my-20">
	<!-- title -->
	<h1 class="scroll-m-16 font-ibm text-4xl font-extrabold tracking-tight sm:text-5xl">
		{post.title}
	</h1>

	<!-- author -->
	<div class="my-12 flex items-baseline gap-3">
		<a href={`/author/${post.author.id}`} class="underline-offset-2 hover:underline">
			<span class="text-base font-medium">
				{post.author.username}
			</span>
		</a>

		<small class="text-sm leading-none font-medium text-zinc-500 dark:text-zinc-400">
			{format(post.createdAt, 'LLL d, yyyy')}
		</small>
	</div>

	<!-- content -->
	<div class="text-base font-normal text-zinc-800 sm:text-lg dark:text-zinc-200">
		{#each post.content.split('\n') as para, index (index)}
			<p class="leading-7 not-first:mt-6">
				{para}
			</p>
		{/each}
	</div>
</section>

```

# src\routes\posts\[id]\ArticleControls.svelte

```svelte
<script lang="ts">
	import { Heart, MessageCircle } from '@lucide/svelte';
	import { formatCompactNum } from '@/utils';
	import type { AuthResultUser, PostDetail } from '$lib/types/data';
	import { enhance } from '$app/forms';
	import { scale } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		user: AuthResultUser | null;
		post: PostDetail;
		handleCommentClick: () => void;
	}

	let { user, post, handleCommentClick }: Props = $props();

	let isAuthenticated = $derived(!!user);
	let pendingRequests = $state(0);

	let optimisticLiked = $derived(post.isLikedByCurrentUser);
	let optimisticLikes = $derived(post._count?.likes ?? 0);

	let form: HTMLFormElement;

	onMount(() => {
		const hash = page.url.hash;

		if (hash) {
			setTimeout(() => {
				form?.scrollIntoView({ behavior: 'smooth', block: 'center' });
				form?.blur();
			}, 10);
		}
	});

	const handleLikeSubmit: SubmitFunction = ({ cancel }) => {
		if (!isAuthenticated) {
			goto(`/auth/login?redirect=${encodeURIComponent(`/posts/${post.id}#like-btn`)}`);

			cancel();
		} else {
			pendingRequests += 1;

			// Save original state in case we need to revert
			const originalLiked = optimisticLiked;
			const originalCount = optimisticLikes;

			// optimistic update
			if (optimisticLiked) {
				optimisticLikes -= 1;
			} else {
				optimisticLikes += 1;
			}

			optimisticLiked = !optimisticLiked;

			return async ({ result, update }) => {
				pendingRequests -= 1;
				if (result.type === 'failure') {
					// Revert optimistic update
					optimisticLiked = originalLiked;
					optimisticLikes = originalCount;

					// show error toast
					toast.error((result.data?.message as string) ?? 'Too many requests');
				} else if (result.type === 'success' && pendingRequests === 0) {
					// apply the last request result instead of validate all the responses
					await update();
				}
			};
		}
	};
</script>

<div class="my-10 flex items-center justify-end gap-5 text-zinc-500">
	<!-- like button -->
	<form method="post" action="?/like" use:enhance={handleLikeSubmit} bind:this={form}>
		{#key optimisticLiked}
			<button
				id="like-btn"
				type="submit"
				class="flex cursor-pointer scroll-mt-16 items-center gap-1 p-0"
				in:scale={{ start: 0.9, duration: 200, easing: cubicOut }}
			>
				<Heart size={16} fill={optimisticLiked ? 'currentColor' : 'none'} />
				<span class="text-sm">{formatCompactNum(optimisticLikes)}</span>
			</button>
		{/key}
	</form>

	<!-- comment button -->
	<button
		id="comment-btn"
		aria-label="Comment on article"
		onclick={handleCommentClick}
		class="flex cursor-pointer items-center gap-1 p-0"
	>
		<MessageCircle size={16} fill="none" />
		<span class="text-sm">{formatCompactNum(post.comments.length)}</span>
	</button>
</div>

```

# src\routes\posts\[id]\CommentSection.svelte

```svelte
<script lang="ts">
	import { format } from 'date-fns';
	import type { AuthResultUser, PostDetail } from '$lib/types/data';
	import { cn, formatCompactNum } from '$lib/utils';
	import Avatar from '@/components/Avatar.svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	const MAX_COMMENT = 500;

	interface Props {
		user: AuthResultUser | null;
		post: PostDetail;
	}

	let { post, user }: Props = $props();

	let isAuthenticated = $derived(!!user);
	let content = $state('');
	const contentRemaining = $derived.by(() => Math.max(0, MAX_COMMENT - content.length));

	let textarea = $state<HTMLTextAreaElement | null>(null);
	let submitting = $state(false);

	export function focus() {
		textarea?.focus();
	}

	export function scrollIntoView() {
		textarea?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
</script>

<div class="my-20">
	<!-- title -->
	<h2 class="scroll-m-20 pb-2 font-ibm text-3xl font-medium tracking-tight first:mt-0">
		Comments ({formatCompactNum(post.comments.length)})
	</h2>

	<!-- form -->
	<form
		action="?/comment"
		method="post"
		class="my-5 flex flex-col gap-5"
		use:enhance={({ cancel }) => {
			submitting = true;

			if (!isAuthenticated) {
				goto(`/auth/login?redirect=${encodeURIComponent(`/posts/${post.id}#content`)}`);

				cancel();
			} else {
				return async ({ update }) => {
					submitting = false;

					await update();
				};
			}
		}}
	>
		{#if isAuthenticated}
			<div class="flex items-center gap-2">
				<Avatar username={user!.username} className="size-9" />
				<span class="font-semibold">{user!.username}</span>
			</div>
		{/if}

		<InputGroup.Root class="rounded-sm">
			<InputGroup.Textarea
				id="content"
				name="content"
				placeholder="What are your thoughts?'"
				maxlength={MAX_COMMENT}
				minlength={1}
				class="min-h-20"
				bind:ref={textarea}
				bind:value={content}
			/>
			<InputGroup.Addon align="block-end">
				<InputGroup.Text
					class={cn(
						'text-xs text-muted-foreground',
						contentRemaining === 0 && 'text-red-500 dark:text-red-400'
					)}
				>
					{contentRemaining}
					{contentRemaining === 1 ? 'character' : 'characters'} left
				</InputGroup.Text>
				<InputGroup.Button
					class="ml-auto cursor-pointer"
					size="sm"
					variant="default"
					type="submit"
					disabled={!content.trim() || submitting}
				>
					Submit
				</InputGroup.Button>
			</InputGroup.Addon>
		</InputGroup.Root>
	</form>

	<!-- comments list -->
	{#if post.comments.length > 0}
		<ul>
			{#each post.comments as comment (comment.id)}
				<li class="flex flex-col gap-5 border-b border-zinc-100 py-10 dark:border-zinc-900">
					<div class="flex items-center gap-2">
						<Avatar username={comment.author?.username} className="size-9" />

						<div class="space-y-1.5">
							<small class="text-sm leading-none font-medium">
								{comment.author?.username}
							</small>
							<small class="text-sm leading-none font-medium">
								{format(comment.createdAt, 'LLL d, yyyy')}
							</small>
						</div>
					</div>

					<small class="ml-4 text-sm leading-5 font-medium text-zinc-800 dark:text-zinc-200">
						{comment.content}
					</small>
				</li>
			{/each}
		</ul>
	{/if}
</div>

```

# static\favicon.ico

This is a binary file of the type: Binary

# static\robots.txt

```txt
# allow crawling everything by default
User-agent: *
Disallow:

```

# svelte.config.js

```js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			'@/*': './src/lib'
		}
	}
};

export default config;

```

# tsconfig.json

```json
{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"rewriteRelativeImportExtensions": true,
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"moduleResolution": "bundler"
	}
	// Path aliases are handled by https://svelte.dev/docs/kit/configuration#alias
	// except $lib which is handled by https://svelte.dev/docs/kit/configuration#files
	//
	// To make changes to top-level options such as include and exclude, we recommend extending
	// the generated config; see https://svelte.dev/docs/kit/configuration#typescript
}

```

# vite.config.ts

```ts
import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	server: {
		proxy: {
			'/api': {
				target: 'http://192.168.0.107:8000',
				changeOrigin: true,
				secure: false
			}
		}
	}
});

```

