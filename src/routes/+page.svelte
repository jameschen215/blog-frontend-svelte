<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	const { data } = $props();
	const posts = $derived(data.postsResult.posts);
	const pagination = $derived(data.postsResult.pagination);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="The blog app" />
</svelte:head>

<div class="w-full scroll-mt-16">
	<div class="flex flex-col">
		{#if posts && posts.length > 0}
			{#each posts as post (post.id)}
				<ArticleCard {post} isHome={true} />
				<Separator class="mx-auto w-[calc(100%-32px)]! bg-zinc-100 dark:bg-zinc-900" />
			{/each}
		{:else}
			<p>No posts yet.</p>
		{/if}
	</div>

	<!-- pagination -->
	<div class="my-5">
		<Pagination {pagination} />
	</div>
</div>
