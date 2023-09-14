<script lang="ts">
	import { goto } from '$app/navigation';
	import { locations } from '../store';
	import NavBar from '$lib/NavBar.svelte';

	let location1: string = 'tuxer steig 6',
		location2: string = 'Rheinbabenallee 47';

	function startClick() {
		locations.set({ location1, location2 });
		goto('/map');
	}
</script>

<div class="h-screen grid place-items-center">
	<NavBar />
	<img src="/logo.svg" alt="logo" />

	<div class="self-start flex flex-col items-center">
		<div class="space-x-3 flex">
			<div class="flex flex-col items-start justify-center relative">
				<label for="location1" class="input-label" data-melt-part="root">
					<span>Location 1</span>
				</label>
				<input bind:value={location1} type="text" id="location1" class="input" />
			</div>
			<div class="flex flex-col items-start justify-center relative">
				<label for="location2" class="input-label" data-melt-part="root">
					<span>Location 2</span>
				</label>
				<input bind:value={location2} type="text" id="location2" class="input" />
			</div>
		</div>
		<button on:click={() => startClick()} class="button-magnum w-64 mt-5 flex justify-center">
			start
		</button>
	</div>
</div>
