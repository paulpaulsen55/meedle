<script lang="ts">
	import Map from './Map.svelte';
	import type { SearchBoxCategoryResponse } from '@mapbox/search-js-core';
	import type { Coordinate } from '../../app';
	import AddressInput from '$lib/AddressInput.svelte';
	import { locations as lol } from '../../store';
	import type { Unsubscriber } from 'svelte/store';
	import { onMount } from 'svelte';
	import { pointToCoordinates, pointToFeatures } from '$lib/helpers/mapbox';

	export let data;

	let loc = { location1: '', location2: '' };
	const unsubscribe: Unsubscriber = lol.subscribe((value) => (loc = value));

	let location1 = loc.location1,
		location2 = loc.location2,
		average: Coordinate,
		points: Array<Coordinate>,
		category = 'food_and_drink',
		features: SearchBoxCategoryResponse;

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
	onMount(() => (location1 && location2 ? handleSubmit() : null));
</script>

<form
	on:submit|preventDefault={handleSubmit}
	action="/api"
	class="grid place-content-center gap-3 h-full"
>
	<div class="space-x-3 flex">
		<AddressInput bind:location={location1} sessionToken={data.sessionToken} />
		<AddressInput bind:location={location2} sessionToken={data.sessionToken} />
	</div>
	<div class="space-x-3 flex">
		<div class="flex flex-col items-start justify-center">
			<label for="category" class="input-label" data-melt-part="root">
				<span>category</span>
			</label>
			<input bind:value={category} type="text" id="category" class="input" />
		</div>
	</div>

	<button type="submit" class="button-white w-fit"> Calculate Middle Point </button>
	{#if average}
		<Map bind:middle={average} bind:feat={features} bind:locations={points} />
	{/if}
</form>
