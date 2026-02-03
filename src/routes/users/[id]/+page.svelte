<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.user.username}'s posts</title>
	<meta name="description" content="Posts by {data.user.username}" />
</svelte:head>

<div class="w-full px-4">
	<!-- author header -->
	<div class="my-10 flex items-center gap-4">
		<Avatar username={data.user.username} className="size-15 text-3xl" />

		<h1 class="scroll-m-20 font-ibm text-4xl font-normal tracking-tight lg:text-5xl">
			{data.user.username}
		</h1>
	</div>

	<!-- posts list -->
	<div class="flex flex-col">
		{#if data.posts && data.posts.length > 0}
			{#each data.posts as post (post.id)}
				<ArticleCard {post} isHome={false} />
				<Separator class="mx-auto w-[calc(100%-32px)]! bg-zinc-100 dark:bg-zinc-900" />
			{/each}
		{:else}
			<p class="py-10 text-center text-muted-foreground">No posts yet.</p>
		{/if}
	</div>

	<!-- pagination -->
	<div class="my-5">
		<Pagination pagination={data.pagination} />
	</div>
</div>
