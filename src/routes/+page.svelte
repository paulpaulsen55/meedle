<script lang="ts">
	import { fly } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { bounceOut, cubicOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { locations } from '../store';

	let innerWidth = 0,
		innerHeight = 0,
		location1: string = 'tuxer steig 6',
		location2: string = 'Rheinbabenallee 47';

	const markerPosition = tweened({ x: 0, y: 0, r: 0, s: 1 });

	let visible = false;
	function startClick() {
		visible = true;
		locations.set({ location1, location2 });

		markerPosition
			.set({ x: 0, y: 0, r: 0, s: 1 })
			.then(() =>
				markerPosition.set(
					{ x: 0, y: 100, r: 30, s: 1 },
					{ duration: 400, easing: bounceOut, delay: 200 }
				)
			)
			.then(() =>
				markerPosition.set({ x: innerWidth / 4, y: 100, r: 10, s: 1.1 }, { duration: 300 })
			)
			.then(() =>
				markerPosition.set({ x: innerWidth / 2 + 55, y: 100, r: -10, s: 1 }, { duration: 350 })
			)
			.then(() => goto('/loading'));
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="h-screen grid place-items-center">
	<img src="/logo.svg" alt="logo" />

	<div class="self-start flex flex-col items-center">
		<div class="space-x-3 flex">
			<div class="flex flex-col items-start justify-center relative">
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
			<div class="flex flex-col items-start justify-center relative">
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
		</div>
		<button
			on:click={() => startClick()}
			class="button-magnum w-64 flex justify-center relative group"
		>
			{#if visible}
				<svg
					in:fly={{ x: 10, duration: 200, easing: cubicOut }}
					xmlns="http://www.w3.org/2000/svg"
					width="38"
					height="25"
					class="absolute left-10"
					style={'transform: translate(' +
						$markerPosition.x +
						'px, ' +
						$markerPosition.y +
						'px) rotate(' +
						$markerPosition.r +
						'deg) scale(' +
						$markerPosition.s +
						')'}
					><path
						fill="#783A15"
						d="M37.98 12.5c.006 0 .02-.014.02-.014S19.22 0 13.048 0C3.965 0 .014 6.328 0 12.5.014 18.672 3.965 25 13.048 25 19.22 25 38 12.507 38 12.507l-.02-.007Zm-25.448 4.326c-2.346 0-4.245-1.939-4.245-4.333 0-2.395 1.899-4.333 4.245-4.333 2.345 0 4.244 1.945 4.244 4.34 0 2.387-1.899 4.326-4.244 4.326Z"
					/></svg
				>
			{/if}
			<span class="">start</span>
		</button>
	</div>
</div>
