<script lang="ts">
	import './layout.css';

	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	import Header from './Header.svelte';

	let { children, data } = $props();

	onMount(() => {
		const type = page.url.searchParams.get('toast');

		if (type === 'login-success') {
			toast.success('You are logged in successfully!');
		}
	});
</script>

<ModeWatcher />

<div class="flex min-h-screen flex-col items-center">
	<Header user={data.user} />

	<main class="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center">
		{@render children()}
	</main>

	<Toaster position="top-right" />
</div>
