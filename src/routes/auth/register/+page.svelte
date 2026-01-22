<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';

	import * as Field from '$lib/components/ui/field/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import { page } from '$app/state';
	import { cn } from '@/utils';

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
