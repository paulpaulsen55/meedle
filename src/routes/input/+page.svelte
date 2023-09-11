<script lang="ts">
	import Map from '$lib/Map.svelte';
	import mapboxgl from 'mapbox-gl';
	import { SearchBoxCore } from '@mapbox/search-js-core';

	let location1: String,
		location2: String,
		avgLongitude: number,
		avgLatitude: number,
		orgPositions: any,
		category = 'food_and_drink',
		feature: any;

	async function handleSubmit() {
		const geoResponse1 = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location1}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`)
		const data1 = await geoResponse1.json();		
		const geoResponse2 = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location2}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`)
		const data2 = await geoResponse2.json();

		if (data1.features && data2.features) {
			orgPositions = {long1: data1.features[0].center[0], lat1: data1.features[0].center[1], long2:data2.features[0].center[0], lat2: data2.features[0].center[1]};
			avgLongitude = (Number(data1.features[0].center[0]) + Number(data2.features[0].center[0])) / 2;
			avgLatitude = (Number(data1.features[0].center[1]) + Number(data2.features[0].center[1])) / 2;
		}

		console.log(avgLatitude, avgLongitude);

		const response = await fetch(
			`https://api.mapbox.com/search/searchbox/v1/category/${category}?proximity=${avgLongitude},${avgLatitude}&origin=${avgLongitude},${avgLatitude}&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
		);
		feature = await response.json();
	}
	async function searchBox1() {
		// const search = new SearchBoxCore({ accessToken: import.meta.env.VITE_MAPBOX_TOKEN});
		// const result = await search.suggest('Washington D.C.', { import.meta.env.VITE_MAPBOX_TOKEN });
	}
	
</script>

<form
	on:submit|preventDefault={handleSubmit}
	action="/api"
	class="grid place-content-center gap-3 h-full"
>
	<div class="space-x-3 flex">
		<div class="flex flex-col items-start justify-center">
			<label for="location1" class="input-label" data-melt-part="root">
				<span>Location 1</span>
			</label>
			<input
				bind:value={location1}
				type="text"
				id="location1"
				class="input"
			/>
		</div>
	</div>
	<div class="space-x-3 flex">
		<div class="flex flex-col items-start justify-center">
			<label for="location2" class="input-label" data-melt-part="root">
				<span>Location 2</span>
			</label>
			<input
				bind:value={location2}
				type="text"
				id="location2"
				class="input"
			/>
		</div>
		<div class="flex flex-col items-start justify-center">
			<label for="category" class="input-label" data-melt-part="root">
				<span>category</span>
			</label>
			<input
				bind:value={category}
				type="text"
				id="category"
				class="input-number"
			/>
		</div>
	</div>

	<button
		type="submit"
		class="button-white w-fit"
	>
		Calculate Middle Point
	</button>
	{#if avgLatitude && avgLongitude}
		<Map bind:lat={avgLatitude} bind:long={avgLongitude} bind:feature={feature} bind:orgPositions={orgPositions} />
	{/if}
</form>
