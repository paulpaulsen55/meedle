<script lang="ts">
	import Map from '$lib/Map.svelte';
	import type { SearchBoxCategoryResponse } from '@mapbox/search-js-core';
	import type { Coordinate } from '../../app';
	import AddressInput from '$lib/AddressInput.svelte';
	import Accordion from '$lib/Accordion.svelte';
	import { locations as lol } from '../../store';
	import type { Unsubscriber } from 'svelte/store';
	import { onMount } from 'svelte';
	import { pointToCoordinates, pointToFeatures } from '$lib/helpers/mapbox';

	export let data;
	let hoverdPointId: string | null;

	let loc = { location1: '', location2: '' };
	const unsubscribe: Unsubscriber = lol.subscribe((value) => (loc = value));

	let location1 = loc.location1,
		location2 = loc.location2,
		average: Coordinate,
		points: Array<Coordinate>,
		category = 'food_and_drink',
		features: SearchBoxCategoryResponse,
		edit = true;

	async function handleSubmit() {
		if (!location1 || !location2) return;

		const point1 = await pointToCoordinates(location1);
		const point2 = await pointToCoordinates(location2);
		points = [point1, point2];
		average = {
			lng: (point1.lng + point2.lng) / 2,
			lat: (point1.lat + point2.lat) / 2
		};
		features = await pointToFeatures(category, average);
	}

	// loads data only when both locations are set through the store - prevents unnecessary api calls
	onMount(() => {
		if (location1 && location2){
			handleSubmit();
			edit = false;
		}
	});

	function updateHoveredPointFunc(newValue:string | null) {
			hoverdPointId = newValue;
  	}

	$:console.log(hoverdPointId);

</script>

<div class="fixed bottom-0 left-0 w-96 h-40 dotted-bg p-2"></div>
<div class="flex">
	<aside class="w-96 p-6">
		<a href="/">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5" style="transform: scale(2);">
				<path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd" />
			</svg>
		</a>
		{#if edit}
			<div class="mt-5">
				<AddressInput bind:location={location1} sessionToken={data.sessionToken} />
				<p>between</p>
				<AddressInput bind:location={location2} sessionToken={data.sessionToken} />
				<div class="mt-4 flex justify-center items-center relative">
					<button class="absolute left-0 grid place-content-center h-full pl-2">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
						</svg>
					</button>
					<button on:click={() => {edit = false; handleSubmit()}} class="button-magnum self-center w-3/4" >meet me in the middle</button>
				</div>
			</div>
		{:else}
			<div class="flex justify-between items-end mt-5">
				<div>
					<p>{location1}</p>
					<p>between</p>
					<p>{location2}</p>
				</div>
				<button type="button" on:click={() => (edit = true)} class="">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
					</svg>
				</button>
			</div>
		{/if}
		

		{#if features}
			<div class="mt-20">
				<Accordion bind:response={features} updateHoveredPoint={updateHoveredPointFunc} hoverdPointId={hoverdPointId}/>
			</div>
		{/if}
	</aside>

	<Map bind:middle={average} bind:response={features} bind:locations={points} updateHoveredPoint={updateHoveredPointFunc} hoverdPointId={hoverdPointId}/>
</div>
