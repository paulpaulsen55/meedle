<script>
	import '../app.css';
	import '../map.css';
	import ThemeSwitch from '$lib/ThemeSwitch.svelte';
</script>

<div class="bg-magnum-400 dark:bg-neutral-900 h-screen">
	<div class="absolute top-0 right-0">
		<ThemeSwitch />
	</div>
	<slot />
</div>
