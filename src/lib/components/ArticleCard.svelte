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
