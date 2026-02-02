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
	import AuthFormField from '$lib/components/AuthFormField.svelte';

	let { form } = $props();
	let submitting = $state(false);

	let registerUrl = $derived.by(() => {
		const redirect = page.url.searchParams.get('redirect');
		return redirect ? `/auth/register?redirect=${encodeURIComponent(redirect)}` : '/auth/register';
	});

	// Local error state for real-time clearing
	let localErrors = $state<Record<string, string[] | undefined>>({});
	let localFormError = $state<string | undefined>();

	// Sync form errors with local errors
	$effect(() => {
		if (form?.errors) {
			localErrors = { ...form.errors };
		}

		if (form?.message) {
			localFormError = form.message;
		}
	});

	// Clear error for a specific field
	function clearError(fieldName: string) {
		// Only clear if there's actually an error
		if (localErrors[fieldName] || localFormError) {
			localErrors[fieldName] = undefined;
			localFormError = undefined;
		}
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
				<!-- <Field.Field class="gap-2">
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
				</Field.Field> -->
				<AuthFormField
					name="username"
					label="username"
					value={form?.data?.username ?? ''}
					errors={localErrors?.username}
					onClearError={() => clearError('username')}
					autofocus
				/>

				<AuthFormField
					name="password"
					label="password"
					type="password"
					value={form?.data?.password ?? ''}
					errors={localErrors?.password}
					onClearError={() => clearError('password')}
				/>

				<Field.Field class="gap-2">
					<Button type="submit" class="cursor-pointer" disabled={submitting}>
						{submitting ? 'Logging in...' : 'Login'}
					</Button>

					{#if localFormError}
						<Field.FieldError id="form-message">{localFormError}</Field.FieldError>
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
