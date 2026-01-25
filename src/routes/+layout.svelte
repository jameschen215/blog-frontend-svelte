<script lang="ts">
	import './layout.css';

	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	import Header from './Header.svelte';

	let { children, data } = $props();
	let toastShown = false;

	$effect(() => {
		console.log({ toastShown });

		const type = page.url.searchParams.get('toast');

		if (type === 'login-success' && !toastShown) {
			toast.success('You are logged in successfully!');

			toastShown = true;

			// clean URL, avoid duplicate toasts
			goto(page.url.pathname, { replaceState: true });
			toastShown = false;
		} else if (type === 'logout-success' && !toastShown) {
			toast.message('You are logged out.');
			toastShown = true;

			goto(page.url.pathname, { replaceState: true });
			toastShown = false;
		}
	});
</script>

<ModeWatcher />

<div class="flex min-h-screen flex-col items-center">
	<Header user={data.user} />

	<main class="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center">
		{@render children()}
	</main>

	<Toaster position="bottom-right" />
</div>
