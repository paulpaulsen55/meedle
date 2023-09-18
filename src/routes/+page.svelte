<script lang="ts">
	import { goto } from '$app/navigation';
	import { locations } from '../store';
	import NavBar from '$lib/NavBar.svelte';
	import AddressInput from '$lib/AddressInput.svelte';

	export let data;

	let location1 = '',
		location2 = '';

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
			<AddressInput bind:location={location1} sessionToken={data.sessionToken} />
			<AddressInput bind:location={location2} sessionToken={data.sessionToken} />
		</div>
		<button on:click={() => startClick()} class="button-magnum w-64 mt-5 flex justify-center">
			start
		</button>
	</div>
</div>
