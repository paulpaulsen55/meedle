<script lang="ts">
	import Map from '$lib/Map.svelte';
	import { pointToCoordinates, pointToFeatures } from '$lib/helpers/mapbox';
	import {
		SearchBoxCore,
		SessionToken,
		AddressAutofillCore,
		type SearchBoxCategoryResponse,
		type AddressAutofillSuggestionResponse
	} from '@mapbox/search-js-core';
	import type { Coordinate } from '../../app';
	import AddressSugestion from '$lib/AddressSugestion.svelte';

	let location1: string = 'tuxer steig 6',
		location2: string = 'Rheinbabenallee 47',
		average: Coordinate,
		locations: Array<Coordinate>,
		category = 'food_and_drink',
		suggestions1: AddressAutofillSuggestionResponse | null = null,
		suggestions2: AddressAutofillSuggestionResponse | null = null,
		feature: SearchBoxCategoryResponse;

	async function handleSubmit() {
		const point1 = await pointToCoordinates(location1);
		const point2 = await pointToCoordinates(location2);
		locations = [point1, point2];

		average = {
			lng: (point1.lng + point2.lng) / 2,
			lat: (point1.lat + point2.lat) / 2
		};
		feature = await pointToFeatures(category, average);
	}

	// TODO: add country restriction?
	const autofill = new AddressAutofillCore({
		accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
		language: 'de'
	});
	const sessionToken = new SessionToken();

	async function searchAutofill1(location: string) {
		if (location.length < 3) return;
		suggestions1 = await autofill.suggest(location, { sessionToken });
	}
	async function searchAutofill2(location: string) {
		if (location.length < 3) return;
		suggestions2 = await autofill.suggest(location, { sessionToken });
	}
</script>

<form
	on:submit|preventDefault={handleSubmit}
	action="/api"
	class="grid place-content-center gap-3 h-full"
>
	<div class="space-x-3 flex">
		<div class="flex flex-col items-start justify-center relative">
			<label for="location1" class="input-label" data-melt-part="root">
				<span>Location 1</span>
			</label>
			<input
				on:input={() => searchAutofill1(location1)}
				on:focusout={() => {
					setTimeout(() => {
						suggestions1 = null;
					}, 100);
				}}
				bind:value={location1}
				type="text"
				id="location1"
				class="input"
			/>
			<AddressSugestion bind:autofill={suggestions1} on:message={(event) => {location1 = event.detail.text}} />
		</div>
		<div class="flex flex-col items-start justify-center relative">
			<label for="location2" class="input-label" data-melt-part="root">
				<span>Location 2</span>
			</label>
			<input
				on:input={() => searchAutofill2(location2)}
				on:focusout={() => {
					setTimeout(() => {
						suggestions2 = null;
					}, 100);
				}}
				bind:value={location2}
				type="text"
				id="location2"
				class="input"
			/>
			<AddressSugestion bind:autofill={suggestions2} on:message={(event) => {location2 = event.detail.text}} />
		</div>
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
		<Map bind:middle={average} bind:feat={feature} bind:locations />
	{/if}
</form>
