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
	import { ArrowLeftIcon, Settings2, FileEdit } from 'lucide-svelte';
	import type { Address } from '../../app';

	import AdressSettings from '$lib/AdressSettings.svelte';
	import { radius as r } from '../../store';
	import { poi as p } from '../../store';

	export let data;
	let hoverdPointId: string | null;

	const sus: Address = { title: '', address: '' };
	let loc = { location1: sus, location2: sus },radius = 0, poi = 0;
	const unsubscribe: Unsubscriber = lol.subscribe((value) => {loc = value;});
	const unsubscribeRad: Unsubscriber = r.subscribe((value) => (radius = value));
	const unsubscribePoi: Unsubscriber = p.subscribe((value) => (poi = value));

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

		r.set(radius);
		p.set(poi);

		features = await pointToFeatures(category, average);
	}

	// loads data only when both locations are set through the store - prevents unnecessary api calls
	onMount(() => {
		location1 = loc.location1;
		location2 = loc.location2;

		if (location1.title != '' && location2.title != '') {
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
			<ArrowLeftIcon class="w-12 h-12" />
		</a>
		{#if edit}
			<div class="mt-5">
				<div class="space-y-3">
					<AddressInput bind:location={location1} sessionToken={data.sessionToken} />
					<AddressInput bind:location={location2} sessionToken={data.sessionToken} />
				</div>
				<div class="space-x-3 flex mt-5">
					<AdressSettings bind:radius bind:poi />
					<button on:click={() => {edit = false; handleSubmit()}} class="button-magnum w-80 justify-center" >meet me in the middle</button>
				</div>
			</div>
		{:else}
			<div class="flex justify-between items-end w-full gap-2">
				<div class="w-[85%]">
					<p class="w-fit">Zwischen</p>
					<p class="truncate">{location1.address}</p>
					<p class="w-fit">und</p>
					<p class="truncate">{location2.address}</p>
				</div>
				<button type="button" on:click={() => (edit = true)} class="">
					<FileEdit />
				</button>
			</div>
		{/if}

		{#if features}
			<div class="mt-20">
				<Accordion response={features} bind:hoverdPointId={hoverdPointId}/>
			</div>
		{/if}
	</aside>
	<Map middle={average} response={features} locations={points} bind:hoverdPointId={hoverdPointId}/>
</div>

