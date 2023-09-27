<script lang="ts">
	import { goto } from '$app/navigation';
	import { locations } from '../store';
	import NavBar from '$lib/NavBar.svelte';
	import AddressInput from '$lib/AddressInput.svelte';
	import AdressSettings from '$lib/AdressSettings.svelte';
	import { radius as r } from '../store';
	import { poi as p } from '../store';

	export let data;

	let location1: string = 'tuxer steig 6',
		location2: string = 'Rheinbabenallee 47';
	let radius = 5;
	let poi = 5;

	function startClick() {
		locations.set({ location1, location2 });
		r.set(radius);
		p.set(poi);
		goto('/map');
	}
</script>

<div class="h-screen grid place-items-center">
	<NavBar />
	<img src="/logo.svg" alt="logo" />

	<div class="self-start flex flex-col items-center">
		<div class="space-x-3 flex">
			<AddressInput bind:location={location1} sessionToken={data.sessionToken} />
			<AddressInput bind:location={location2} sessionToken={data.sessionToken} />
		</div>
		<div class="space-x-3 flex mt-5">
			<AdressSettings bind:radius bind:poi class="button-magnum" />
			<button on:click={() => startClick()} class="button-magnum w-80 justify-center">
				meet me in the middle
			</button>
		</div>
	</div>
</div>