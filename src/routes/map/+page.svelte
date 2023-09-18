<script lang="ts">
	import Map from '$lib/Map.svelte';
	import type { SearchBoxCategoryResponse } from '@mapbox/search-js-core';
	import type { Coordinate } from '../../app';
	import AddressInput from '$lib/AddressInput.svelte';
	import Accordion from '$lib/Accordion.svelte';
	import Icon from '$lib/Icon.svelte';
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
		location1 = loc.location1;
		location2 = loc.location2;

		if (location1 != '' && location2 != '') {
			handleSubmit();
			edit = false;
		} else {
			edit = true;
		}
	});
</script>

<div class="fixed bottom-0 left-0 w-96 h-40 dotted-bg p-2" />
<div class="flex">
	<aside class="w-96 p-6 space-y-10">
		<a href="/">
			<Icon name="arrowLeft" class="w-12 h-12"/>
		</a>
		{#if edit}
			<div class="mt-5">
				<AddressInput bind:location={location1} sessionToken={data.sessionToken} />
				<p>between</p>
				<AddressInput bind:location={location2} sessionToken={data.sessionToken} />
				<div class="mt-4 flex justify-center items-center relative">
					<button class="absolute left-0 grid place-content-center h-full pl-2">
						<Icon name="settingsHorizontal" />
					</button>
					<button
						on:click={() => {
							edit = false;
							handleSubmit();
						}}
						class="button-magnum self-center w-3/4">meet me in the middle</button
					>
				</div>
			</div>
		{:else}
			<div class="flex justify-between items-end">
				<div>
					<p>{location1}</p>
					<p>between</p>
					<p>{location2}</p>
				</div>
				<button type="button" on:click={() => (edit = true)} class="">
					<Icon name="edit" />
				</button>
			</div>
		{/if}

		{#if features}
			<div class="">
				<Accordion bind:response={features} />
			</div>
		{/if}
	</aside>

	<Map bind:middle={average} bind:response={features} bind:locations={points} />
</div>
