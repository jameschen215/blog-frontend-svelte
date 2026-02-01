<script lang="ts">
	import { format } from 'date-fns';
	import type { AuthResultUser, PostDetail } from '$lib/types/data';
	import { cn, formatCompactNum } from '$lib/utils';
	import Avatar from '@/components/Avatar.svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';

	const MAX_COMMENT = 500;

	interface Props {
		user: AuthResultUser | null;
		post: PostDetail;
	}

	let { post, user }: Props = $props();

	let isAuthenticated = $derived(!!user);
	let content = $state('');
	const contentRemaining = $derived.by(() => Math.max(0, MAX_COMMENT - content.length));

	let textarea = $state<HTMLTextAreaElement | null>(null);

	export function focus() {
		textarea?.focus();
	}

	export function scrollIntoView() {
		textarea?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
</script>

<div class="my-20">
	<!-- title -->
	<h2 class="scroll-m-20 pb-2 font-ibm text-3xl font-medium tracking-tight first:mt-0">
		Comments ({formatCompactNum(post.comments.length)})
	</h2>

	<!-- form -->
	<form action="?/comment" method="post" class="my-5 flex flex-col gap-5">
		{#if isAuthenticated}
			<div class="flex items-center gap-2">
				<Avatar username={user!.username} className="size-9" />
				<span class="font-semibold">{user!.username}</span>
			</div>
		{/if}

		<InputGroup.Root class="rounded-sm">
			<InputGroup.Textarea
				id="content"
				name="content"
				placeholder="What are your thoughts?'"
				maxlength={MAX_COMMENT}
				minlength={1}
				class="min-h-20"
				bind:ref={textarea}
				bind:value={content}
			/>
			<InputGroup.Addon align="block-end">
				<InputGroup.Text
					class={cn(
						'text-xs text-muted-foreground',
						contentRemaining === 0 && 'text-red-500 dark:text-red-400'
					)}
				>
					{contentRemaining}
					{contentRemaining === 1 ? 'character' : 'characters'} left
				</InputGroup.Text>
				<InputGroup.Button
					class="ml-auto cursor-pointer"
					size="sm"
					variant="default"
					type="submit"
					disabled={!content.trim()}
				>
					Submit
				</InputGroup.Button>
			</InputGroup.Addon>
		</InputGroup.Root>
	</form>

	<!-- comments list -->
	{#if post.comments.length > 0}
		<ul>
			{#each post.comments as comment (comment.id)}
				<li class="flex flex-col gap-5 border-b border-zinc-100 py-10 dark:border-zinc-900">
					<div class="flex items-center gap-2">
						<Avatar username={comment.author?.username} className="size-9" />

						<div class="space-y-1.5">
							<small class="text-sm leading-none font-medium">
								{comment.author?.username}
							</small>
							<small class="text-sm leading-none font-medium">
								{format(comment.createdAt, 'LLL d, yyyy')}
							</small>
						</div>
					</div>

					<small class="ml-4 text-sm leading-5 font-medium text-zinc-800 dark:text-zinc-200">
						{comment.content}
					</small>
				</li>
			{/each}
		</ul>
	{/if}
</div>
