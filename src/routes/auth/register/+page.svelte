<script lang="ts">
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	import { cn } from '$lib/utils';
	import * as Field from '$lib/components/ui/field/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';

	let { form }: PageProps = $props();

	let submitting = $state(false);
	let localErrors = $state<Record<string, string[] | undefined>>({});
	let localFormError = $state<string | undefined>();
	let loginUrl = $derived.by(() => {
		const redirect = page.url.searchParams.get('redirect');
		return redirect ? `/auth/login?redirect=${encodeURIComponent(redirect)}` : '/auth/login';
	});

	$effect(() => {
		if (form?.errors) {
			localErrors = { ...form.errors };
		}

		if (form?.message) {
			localFormError = form.message;
		}
	});

	const clearError = (filedName: string) => {
		if (localErrors[filedName] || localFormError) {
			localErrors[filedName] = undefined;
			localFormError = undefined;
		}
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
				<AuthFormField
					name="username"
					label="username"
					value={form?.data?.username ?? ''}
					errors={localErrors?.username}
					onClearError={() => clearError('username')}
					autofocus
				/>

				<AuthFormField
					name="email"
					label="email"
					type="email"
					value={form?.data?.email ?? ''}
					errors={localErrors?.email}
					onClearError={() => clearError('email')}
				/>

				<AuthFormField
					name="password"
					label="password"
					type="password"
					value={form?.data?.password ?? ''}
					errors={localErrors?.password}
					onClearError={() => clearError('password')}
				/>

				<AuthFormField
					name="confirmPassword"
					label="confirmPassword"
					type="password"
					value={form?.data?.confirmPassword ?? ''}
					errors={localErrors?.confirmPassword}
					onClearError={() => clearError('confirmPassword')}
				/>

				<Field.Field class="gap-2">
					<Button type="submit" class="cursor-pointer" disabled={submitting}>
						{submitting ? 'Registering...' : 'Register'}
					</Button>

					{#if localFormError}
						<Field.FieldError id="form-message">{localFormError}</Field.FieldError>
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
