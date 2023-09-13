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

<div class="fixed bottom-0 left-0 w-96 h-40 dotted-bg p-2"></div>
<form on:submit|preventDefault={handleSubmit} action="/api" class="flex">
	<aside class="w-96 p-6 space-y-5 relative">
		<div class="">
			<AddressInput bind:location={location1} sessionToken={data.sessionToken} />
			<p>between</p>
			<AddressInput bind:location={location2} sessionToken={data.sessionToken} />
		</div>
		<div class="">
			<input bind:value={category} type="text" id="category" class="input" />
		</div>
		<button type="submit" class="button-white w-fit"> Calculate Middle Point </button>

		{#if features}
			<Accordion bind:features={features.features} />
		{/if}

	</aside>

	{#if average}
		<Map bind:middle={average} bind:feat={features} bind:locations={points} />
	{/if}
</form>
