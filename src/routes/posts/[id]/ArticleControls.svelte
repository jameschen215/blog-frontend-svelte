<script lang="ts">
	import { Heart, MessageCircle } from '@lucide/svelte';
	import { formatCompactNum } from '$lib/utils/format';
	import type { AuthResultUser, PostDetail } from '$lib/types/data';
	import { enhance } from '$app/forms';
	import { scale } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		user: AuthResultUser | null;
		post: PostDetail;
		handleCommentClick: () => void;
	}

	let { user, post, handleCommentClick }: Props = $props();

	let isAuthenticated = $derived(!!user);

	let pendingRequests = $state(0);
	let optimisticLiked = $derived(post.isLikedByCurrentUser);
	let optimisticLikes = $derived(post._count?.likes ?? 0);

	let form: HTMLFormElement;

	onMount(() => {
		const hash = page.url.hash;

		if (hash) {
			setTimeout(() => {
				form?.scrollIntoView({ behavior: 'smooth', block: 'center' });
				form?.blur();
			}, 10);
		}
	});

	const handleLikeSubmit: SubmitFunction = ({ cancel }) => {
		if (!isAuthenticated) {
			goto(`/auth/login?redirect=${encodeURIComponent(`/posts/${post.id}#like-btn`)}`);

			cancel();
		} else {
			pendingRequests += 1;

			// Save original state in case we need to revert
			const originalLiked = optimisticLiked;
			const originalCount = optimisticLikes;

			// optimistic update
			optimisticLiked = !optimisticLiked;
			optimisticLikes += optimisticLiked ? 1 : -1;

			return async ({ result, update }) => {
				pendingRequests -= 1;
				if (result.type === 'failure') {
					// Revert optimistic update
					optimisticLiked = originalLiked;
					optimisticLikes = originalCount;

					// show error toast
					toast.error((result.data?.message as string) ?? 'Too many requests');
				} else if (result.type === 'success' && pendingRequests === 0) {
					// apply the last request result instead of validate all the responses
					await update();
				}
			};
		}
	};
</script>

<div class="my-10 flex items-center justify-end gap-5 text-zinc-500">
	<!-- like button -->
	<form method="post" action="?/like" use:enhance={handleLikeSubmit} bind:this={form}>
		{#key optimisticLiked}
			<button
				id="like-btn"
				type="submit"
				class="flex cursor-pointer scroll-mt-16 items-center gap-1 p-0"
				in:scale={{ start: 0.9, duration: 200, easing: cubicOut }}
			>
				<Heart size={16} fill={optimisticLiked ? 'currentColor' : 'none'} />
				<span class="text-sm">{formatCompactNum(optimisticLikes)}</span>
			</button>
		{/key}
	</form>

	<!-- comment button -->
	<button
		id="comment-btn"
		aria-label="Comment on article"
		onclick={handleCommentClick}
		class="flex cursor-pointer items-center gap-1 p-0"
	>
		<MessageCircle size={16} fill="none" />
		<span class="text-sm">{formatCompactNum(post.comments.length)}</span>
	</button>
</div>
