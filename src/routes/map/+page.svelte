<script lang="ts">
	import Map from '$lib/Map.svelte';
	import AddressInput from '$lib/AddressInput.svelte';
	import Accordion from '$lib/Accordion.svelte';
	import { onMount } from 'svelte';
	import { pointToCoordinates, pointToFeatures } from '$lib/helpers/mapbox';
	import { ArrowLeftIcon, FileEdit } from 'lucide-svelte';
	import AdressSettings from '$lib/AdressSettings.svelte';
	import { locations as lol, poi as p, radius as r } from '../../store';
	import TagsSettings from '$lib/TagsSettings.svelte';
	import type { Unsubscriber } from 'svelte/store';
	import type { Tag } from '@melt-ui/svelte';
	import type { Coordinate, Feature, Address } from '../../app';
	import LocationSwitch from '$lib/LocationSwitch.svelte';

	export let data;
	let hoverdPointId: string | null;

	const sus: Address = { title: '', address: '' };
	let loc = { location1: sus, location2: sus },
		radius = 0,
		poi = 0;
	const unsubscribe: Unsubscriber = lol.subscribe((value) => {
		loc = value;
	});
	const unsubscribeRad: Unsubscriber = r.subscribe((value) => (radius = value));
	const unsubscribePoi: Unsubscriber = p.subscribe((value) => (poi = value));

	let location1 = loc.location1,
		location2 = loc.location2,
		average: Coordinate,
		points: Coordinate[] = [],
		category = ['food_and_drink'],
		features: Feature[],
		edit = true;

	async function handleSubmit() {
		if (!location1 || !location2) return;

		const point1 = await pointToCoordinates(location1);
		const point2 = await pointToCoordinates(location2);
		lol.set({
			location1: { title: location1.title, address: location1.address, coordinate: point1 },
			location2: { title: location2.title, address: location2.address, coordinate: point2 }
		});
		points = [point1, point2];
		average = {
			lng: (point1.lng + point2.lng) / 2,
			lat: (point1.lat + point2.lat) / 2
		};

		r.set(radius);
		p.set(poi);

		features = await pointToFeatures(category, average);
	}

	function handleTagsSetting(event: CustomEvent<Tag[]>) {
		const filterTags = event.detail;
		category = [];
		category = filterTags.map((tag) => tag.id);

		handleSubmit();
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

<div class="flex">
	<aside class="flex flex-col w-96 p-6 h-screen">
		<a href="/">
			<ArrowLeftIcon class="w-12 h-12" />
		</a>
		{#if edit}
			<div class="mt-10">
				<AddressInput bind:location={location1} sessionToken={data.sessionToken} />
				<p>between</p>
				<AddressInput bind:location={location2} sessionToken={data.sessionToken} />
				<div class="space-x-3 flex mt-5">
					<AdressSettings bind:radius bind:poi />
					<button
						on:click={() => {
							handleSubmit();
							edit = false;
						}}
						class="button-magnum w-80 justify-center">meet me in the middle</button
					>
				</div>
			</div>
		{:else}
			<div class="flex gap-5 mt-5 items-end justify-between">
				<LocationSwitch locations={loc} />
				<button type="button" on:click={() => (edit = true)} class="">
					<FileEdit class="h-6 mb-1"/>
				</button>
			</div>
		{/if}

		{#if features}
			<Accordion response={features} bind:hoverdPointId />
		{/if}
		<div class="w-96 h-32 bg-dotted -ml-6 -mb-4 p-2 absolute bottom-2" />
	</aside>
	<div class="absolute ml-96 z-10 p-1">
		<TagsSettings on:updateTags={handleTagsSetting} />
	</div>
	<Map middle={average} response={features} locations={points} bind:hoverdPointId />
</div>