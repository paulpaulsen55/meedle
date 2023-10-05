<script lang="ts">
	import { ExternalLink, CarFront, Bike, Footprints, HelpCircle, X } from 'lucide-svelte';
	import { getTravelTimes } from './helpers/mapbox';
	import { locations } from '../store';
	import Loader from './Loader.svelte';
	import type { Coordinate, Feature } from '../app';
	import type { Unsubscriber } from 'svelte/store';
	import { createPopover, melt } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';
	import AccordionContentLocationSwitch from './AccordionContentLocationSwitch.svelte';

	export let tags: string[];
	export let feature: Feature;

	let check: boolean = false,
		location: Coordinate = {lat: 0, lng: 0};

	let loc: any;
	const unsubscribeRad: Unsubscriber = locations.subscribe((value) => (loc = value));

	const {
		elements: { trigger, content, arrow, close },
		states: { open },
	} = createPopover({
		forceVisible: true,
	});


	if (tags.length > 3) {
		tags = tags.slice(0, 3);
	}

	$: {
		open.set(false);
		if (check) {
			location = loc.location2.coordinate;
		} else {
			location = loc.location1.coordinate;
		}
	}
</script>

<div class="p-4 grid gap-4 place-items-center">
	<div class="flex">
		{#each tags as tag}
			<span class="inline-block text-neutral-500 mx-2">#{tag}</span>
		{/each}
	</div>
	{#await getTravelTimes(location, feature.coordinate)}
		<Loader />
	{:then travelTimes}
		<h3 class="text-center text-white text-lg font-semibold flex items-center gap-2">
			<span>{travelTimes.distance} km zum Zielort</span>
			<button use:melt={$trigger}>
				<HelpCircle class="text-neutral-500 h-5 hover:text-neutral-600 transition"/>
			</button>
		</h3>
		<div class="flex text-white gap-2 justify-between items-center">
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
			class="w-full bg-neutral-500 text-white relative text-base py-2 rounded-md text-center hover:bg-neutral-600 transition"
		>
			<ExternalLink class="absolute top-0 left-5 h-full w-6 text-white" />
			<span>Google Maps</span>
		</a>
	{/await}
</div>

{#if $open}
  <div use:melt={$content} in:fade={{ duration: 100 }} class="z-10 w-64 rounded-[4px] bg-white p-5 shadow-sm relative">
    <div use:melt={$arrow} />
	<AccordionContentLocationSwitch locations={loc} bind:check />
    <button class="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full text-magnum-900 transition hover:bg-magnum-500/10" use:melt={$close}>
      	<X class="square-4" />
    </button>
  </div>
{/if}
