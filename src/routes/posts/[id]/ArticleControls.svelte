<script lang="ts">
	import { Heart, MessageCircle } from '@lucide/svelte';
	import { formatCompactNum } from '@/utils';
	import type { AuthResultUser, PostDetail } from '$lib/types/data';
	import { enhance } from '$app/forms';
	import { scale } from 'svelte/transition';
	import type { ActionData, PageProps } from './$types';
	import { toast } from 'svelte-sonner';

	interface Props {
		user: AuthResultUser | null;
		post: PostDetail;
		handleCommentClick: () => void;
	}

	let { user, post, handleCommentClick }: Props = $props();

	let isAuthenticated = $derived(!!user);
	let pendingRequests = $state(0);

	let liked = $derived(post.isLikedByCurrentUser);
	let optimisticLikes = $derived(post._count?.likes ?? 0);

	// Sync with server state only when no pending requests
	$effect(() => {
		if (pendingRequests === 0) {
			liked = post.isLikedByCurrentUser;
			optimisticLikes = post._count?.likes ?? 0;
		}
	});

	$inspect({ pendingRequests });
</script>

<div class="my-10 flex items-center justify-end gap-5 text-zinc-500">
	<!-- like button -->
	<form
		method="post"
		action="?/like"
		use:enhance={() => {
			pendingRequests += 1;

			// Save original state in case we need to revert
			const originalLiked = liked;
			const originalCount = optimisticLikes;

			// optimistic update
			if (liked) {
				optimisticLikes -= 1;
			} else {
				optimisticLikes += 1;
			}

			liked = !liked;

			return async ({ result, update }) => {
				if (result.type === 'failure') {
					// Revert optimistic update
					liked = originalLiked;
					optimisticLikes = originalCount;

					// show error toast
					toast.error((result.data?.message as string) ?? 'Too many requests');
				} else if (result.type === 'success') {
					await update();
				}

				pendingRequests -= 1;

				// When pendingRequests hits 0, $effect syncs with server state
			};
		}}
	>
		<button id="like-btn" type="submit" class="flex cursor-pointer items-center gap-1 p-0">
			{#key liked}
				<Heart size={16} fill={liked ? 'currentColor' : 'none'} class="transition-all" />
			{/key}
			<span class="text-sm">{formatCompactNum(optimisticLikes)}</span>
		</button>
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
