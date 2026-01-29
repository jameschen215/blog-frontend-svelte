<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import type { ActionData, PageData, PageProps } from './$types';
	import Article from './Article.svelte';
	import ArticleControls from './ArticleControls.svelte';
	import CommentSection from './CommentSection.svelte';

	let { data }: PageProps = $props();
	let post = $derived(data.post);

	let commentSection: CommentSection;

	function handleCommentClick() {
		commentSection?.scrollIntoView();
		commentSection?.focus();
	}
</script>

<svelte:head>
	<title>Article - {post.title}</title>
	<meta name="description" content="Article page" />
</svelte:head>

<div class="px-4">
	<Article {post} />

	<ArticleControls user={data.user} post={data.post} {handleCommentClick} />

	<CommentSection bind:this={commentSection} post={data.post} user={data.user} />
</div>
