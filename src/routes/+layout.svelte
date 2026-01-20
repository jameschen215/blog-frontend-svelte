<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import Header from './Header.svelte';

	let { children } = $props();
</script>

<ModeWatcher />

<div class="app">
	<Header />
	<main>{@render children()}</main>
</div>
