<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicInOut, cubicIn } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { onMount } from 'svelte';
    import CircleGrid from '$lib/CircleGrid.svelte';
	import { goto } from '$app/navigation';
    import { locations } from '../../store';
	import type { Unsubscriber } from 'svelte/store';

    let loc = {location1: '', location2: ''};
	const unsubscribe: Unsubscriber = locations.subscribe((value) => (loc = value));

	const markerPosition = tweened({ x: 0, y: 0});

	markerPosition
		.set({ x: 0, y: 0})
		.then(() =>
			markerPosition.set(
				{ x: innerWidth, y: innerHeight/4 },
				{ duration: 500, easing: cubicInOut }
			)
		);

	let innerWidth = 0,
		innerHeight = 0;

	let ready = false;
	onMount(() => {
		ready = true;
        setTimeout(() => {
            goto('/map');
        }, 2000);
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />


<div class="h-screen w-screen grid place-items-center z-20">
	{#if ready}
		<svg
			in:fly={{ x: -600, duration: 200, easing: cubicIn }}
			xmlns="http://www.w3.org/2000/svg"
			width="38"
			height="25"
			class="fixed"
			style={'left: 0; bottom: ' +
				innerHeight / 3 +
				'px; transform: translate(' +
				$markerPosition.x +
				'px, ' +
				$markerPosition.y +
				'px)'}
			><path
				fill="#783A15"
				d="M37.98 12.5c.006 0 .02-.014.02-.014S19.22 0 13.048 0C3.965 0 .014 6.328 0 12.5.014 18.672 3.965 25 13.048 25 19.22 25 38 12.507 38 12.507l-.02-.007Zm-25.448 4.326c-2.346 0-4.245-1.939-4.245-4.333 0-2.395 1.899-4.333 4.245-4.333 2.345 0 4.244 1.945 4.244 4.34 0 2.387-1.899 4.326-4.244 4.326Z"
			/>
		</svg>
        <div class="grid place-items-center gap-10">
            <img src="/between.svg" alt="between" class="w-1/2">
            <h1 class="text-white font-bold text-4xl">{loc.location1} - {loc.location2}</h1>
        </div>
        <div class="fixed top-0 left-0 w-screen h-screen m-5">
            <CircleGrid opacity={0.5} animation={true} size={{x: Math.floor(innerWidth/24), y: Math.floor(innerHeight/24)}}/>
        </div>
	{/if}    
</div>
