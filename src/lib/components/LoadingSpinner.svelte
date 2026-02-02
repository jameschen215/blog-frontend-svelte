<script lang="ts">
	import { navigating } from '$app/state';
	import { LoaderCircle } from '@lucide/svelte';

	import { fade } from 'svelte/transition';
</script>

{#if navigating.to}
	<div
		class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
	>
		<LoaderCircle strokeWidth={1.25} class="h-8 w-8 animate-spin text-primary" />
		Loading...
	</div>
{/if}

<style>
	@keyframes slide {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(400%);
		}
	}
</style>
