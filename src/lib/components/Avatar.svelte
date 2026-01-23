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
	{username[0].toUpperCase()}
</div>
