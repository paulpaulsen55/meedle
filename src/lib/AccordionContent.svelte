<script lang="ts">
	import { ExternalLink, CarFront, Bike, Footprints, ArrowLeftRight, X } from 'lucide-svelte';
	import { getTravelTimes } from './helpers/mapbox';
	import { travelFrom } from '../store';
	import Loader from './Loader.svelte';
	import type { Coordinate, Feature } from '../app';
	import type { Unsubscriber } from 'svelte/store';

	export let tags: string[];
	export let feature: Feature;

	let  from: Coordinate;
	const unsubscribeFrom: Unsubscriber = travelFrom.subscribe((value) => (from = value));
</script>

<div class="p-4 grid gap-4 place-items-center">
	<div class="flex gap-2 justify-center w-64">
		{#each tags.length < 3 ? Array(tags.length) : Array(3) as _, i}
			<p class="truncate text-neutral-500" title={tags[i]}>#{tags[i]}</p>
		{/each}
	</div>
	{#await getTravelTimes(from, feature.coordinate)}
		<Loader />
	{:then travelTimes}
		<h3 class="text-center dark:text-black text-white text-lg font-semibold flex items-center">
			<span>{travelTimes.distance} km von Zielort</span>
		</h3>
		<div class="flex dark:text-black text-white gap-2 justify-between items-center">
			<p class="flex">
				<CarFront class="h-5"/>
				<span class="truncate">: {travelTimes.driving} Min.</span>
			</p>
			<p class="flex">
				<Bike class="h-5"/>
				<span class="truncate">: {travelTimes.cycling} Min.</span>
			</p>
			<p class="flex">
				<Footprints class="h-5"/>
				<span class="truncate">: {travelTimes.walking} Min.</span>
			</p>
		</div>
		<a
			href="https://www.google.de/maps/search/?api=1&query={feature.name}, {feature.address}"
			target="_blank"
			class="w-64 dark:bg-slate-400 bg-neutral-500 text-white relative text-base py-2 rounded-md text-center dark:hover:bg-slate-300 hover:bg-neutral-600 transition"
		>
			<ExternalLink class="absolute top-0 left-5 h-full w-6 text-white" />
			<span>Google Maps</span>
		</a>
	{/await}
</div>

