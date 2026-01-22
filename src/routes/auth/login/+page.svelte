<script lang="ts">
	import { enhance, applyAction } from '$app/forms';

	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Button from '@/components/ui/button/button.svelte';

	let { form } = $props();

	let loading = $state(false);
</script>

<div class="mt-10 flex w-full max-w-md flex-1 sm:mt-20">
	<form
		class="w-full px-4 sm:px-8"
		method="post"
		novalidate
		use:enhance={() => {
			loading = true;

			return async ({ result }) => {
				loading = false;

				await applyAction(result);
			};
		}}
	>
		<h1 class="mb-12 scroll-m-20 font-ibm text-3xl font-extrabold tracking-tight lg:text-4xl">
			Login
		</h1>

		<Field.Set>
			<Field.Group>
				<Field.Field>
					<Field.FieldLabel for="username">Username</Field.FieldLabel>

					<Input
						type="text"
						name="username"
						id="username"
						value={form?.data?.username ?? ''}
						class="rounded-sm"
					/>

					{#if form?.errors?.username}
						<Field.FieldError id="username-error">{form.errors.username[0]}</Field.FieldError>
					{/if}
				</Field.Field>

				<Field.Field>
					<Field.FieldLabel for="password">Password</Field.FieldLabel>

					<Input
						type="password"
						name="password"
						id="password"
						value={form?.data?.password ?? ''}
						class="rounded-sm"
					/>

					{#if form?.errors?.password}
						<Field.FieldError id="password-error">{form.errors.password[0]}</Field.FieldError>
					{/if}
				</Field.Field>

				<Field.Field>
					<Button type="submit" class="cursor-pointer">
						{loading ? 'Logging in...' : 'Login'}
					</Button>

					{#if form?.formError}
						<Field.FieldError id="password-error">{form?.formError.message}</Field.FieldError>
					{/if}
				</Field.Field>
			</Field.Group>
		</Field.Set>
	</form>
</div>
