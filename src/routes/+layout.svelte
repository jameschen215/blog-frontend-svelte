<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import Header from './Header.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	let { children } = $props();
</script>

<ModeWatcher />

<div class="flex min-h-screen flex-col items-center">
	<Header />

	<main class="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center">
		{@render children()}
	</main>

	<Toaster position="top-right" />
</div>
