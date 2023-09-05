<script>
	import Logo from "$lib/Logo.svelte";
	import PlusGrid from "$lib/PlusGrid.svelte";
</script>

<div class="h-screen grid place-items-center">
	<div>
		<Logo />
	</div>
	<a
		href="/input"
		class="button-magnum self-start"
	>
		starten
	</a>
	<div class="fixed bottom-0 left-0 text-neutral-500 flex flex-wrap justify-center gap-5 overflow-hidden mb-5">
		<PlusGrid rows={5} sinFactor={0.05} />
	</div>
</div>