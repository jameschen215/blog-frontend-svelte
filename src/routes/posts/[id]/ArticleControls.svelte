<script lang="ts">
	import { Heart, MessageCircle } from '@lucide/svelte';
	import { formatCompactNum } from '@/utils';
	import type { AuthResultUser, PostDetail } from '$lib/types/data';
	import { enhance } from '$app/forms';

	interface Props {
		user: AuthResultUser;
		post: PostDetail;
		handleCommentClick: () => void;
	}

	let { user, post, handleCommentClick }: Props = $props();

	let isAuthenticated = $derived(!!user);
	let optimisticLikes = $derived(post._count?.likes ?? 0);

	// watch for server updates
	$effect(() => {
		optimisticLikes = post._count?.likes ?? 0;
	});

	function handleLike() {
		// optimistic update
		optimisticLikes += 1;
	}
</script>

<div class="my-10 flex items-center justify-end gap-5 text-zinc-500">
	<!-- like button -->
	<form
		method="post"
		action="?/like"
		use:enhance={() => {
			handleLike();

			return async ({ update }) => {
				// server response overwrites optimistic value
				await update();
			};
		}}
	>
		<button id="like-btn" type="submit" class="flex cursor-pointer items-center gap-1 p-0">
			<Heart size={16} fill="none" />
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
