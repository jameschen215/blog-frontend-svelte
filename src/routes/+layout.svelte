<script lang="ts">
	import './layout.css';
	import Header from './Header.svelte';

	let { children } = $props();
</script>

<div class="app">
	<Header />
	<main>{@render children()}</main>
</div>
