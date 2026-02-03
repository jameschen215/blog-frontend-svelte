<script lang="ts">
	import type { PostDetail } from '$lib/types/data';
	import { format } from 'date-fns';

	interface Props {
		post: PostDetail;
	}

	let { post }: Props = $props();
</script>

<section class="my-20">
	<!-- title -->
	<h1 class="scroll-m-16 font-ibm text-4xl font-extrabold tracking-tight sm:text-5xl">
		{post.title}
	</h1>

	<!-- author -->
	<div class="my-12 flex items-baseline gap-3">
		<a href={`/users/${post.author.id}`} class="underline-offset-2 hover:underline">
			<span class="text-base font-medium">
				{post.author.username}
			</span>
		</a>

		<small class="text-sm leading-none font-medium text-zinc-500 dark:text-zinc-400">
			{format(post.createdAt, 'LLL d, yyyy')}
		</small>
	</div>

	<!-- content -->
	<div class="text-base font-normal text-zinc-800 sm:text-lg dark:text-zinc-200">
		{#each post.content.split('\n') as para, index (index)}
			<p class="leading-7 not-first:mt-6">
				{para}
			</p>
		{/each}
	</div>
</section>
