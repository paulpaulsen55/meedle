<script lang="ts">
	import '../app.css';
	import '../map.css';
	import PageTransition from '$lib/PageTransition.svelte';

	export let data;
</script>

<div class="dark:bg-slate-100 bg-neutral-900 h-screen font-lexend text-white overflow-x-hidden">
	{#key data.currentPath}
		<PageTransition>
			<slot />
		</PageTransition>
	{/key}
</div>
