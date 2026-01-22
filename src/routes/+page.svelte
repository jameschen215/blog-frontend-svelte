<script lang="ts">
	const { data } = $props();
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="The blog app" />
</svelte:head>

<section>
	<h1>The blog</h1>
	<p>Hello {data.user ? data.user.username : 'world'}!</p>
</section>
