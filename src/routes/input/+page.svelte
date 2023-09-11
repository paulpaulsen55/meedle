<script lang="ts">
	import Map from '$lib/Map.svelte';
	import { pointToCoordinates, pointToFeatures } from '$lib/helpers/mapbox';
	import { SearchBoxCore, SessionToken, type SearchBoxCategoryResponse } from '@mapbox/search-js-core';
	import type { Coordinate } from '../../app';
	
	let location1: String = 'tuxer steig 6',
		location2: String = 'Rheinbabenallee 47',
		average: Coordinate,
		locations: Array<Coordinate>,
		category = 'food_and_drink',
		feature: SearchBoxCategoryResponse;

	async function handleSubmit() {
		const point1 = await pointToCoordinates(location1); 
		const point2 = await pointToCoordinates(location2);
		locations = [point1, point2];

		average = {
			lng: (point1.lng + point2.lng) / 2,
			lat: (point1.lat + point2.lat) / 2
		}
		feature = await pointToFeatures(category, average);
	}
	
	async function searchBox1() {
		const search = new SearchBoxCore({ accessToken: import.meta.env.VITE_MAPBOX_TOKEN});
		const sessionToken = new SessionToken();
		const result = await search.suggest('Washington D.C.', { sessionToken });
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
				class="input"
			/>
		</div>
	</div>

	<button
		type="submit"
		class="button-white w-fit"
	>
		Calculate Middle Point
	</button>
	{#if average}
		<Map bind:middle={average} bind:feat={feature} bind:locations={locations} />
	{/if}
</form>
