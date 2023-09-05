<script lang="ts">
	import Map from '$lib/Map.svelte';

	let longitude1: number,
		latitude1: number,
		longitude2: number,
		latitude2: number,
		avgLongitude: number,
		avgLatitude: number,
		category = 'food_and_drink',
		feature: any;
	async function handleSubmit() {
		avgLongitude = (Number(longitude1) + Number(longitude2)) / 2;
		avgLatitude = (Number(latitude1) + Number(latitude2)) / 2;

		const response = await fetch(
			`https://api.mapbox.com/search/searchbox/v1/category/${category}?proximity=${avgLongitude},${avgLatitude}&origin=${avgLongitude},${avgLatitude}&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
		);
		feature = await response.json();
	}
</script>

<form
	on:submit|preventDefault={handleSubmit}
	action="/api"
	class="grid place-content-center gap-3 h-full"
>
	<div class="space-x-3 flex">
		<div class="flex flex-col items-start justify-center">
			<label for="latitude1" class="input-label" data-melt-part="root">
				<span>Latitude 1</span>
			</label>
			<input
				bind:value={latitude1}
				type="number"
				id="latitude1"
				max="90"
				min="-90"
				step="any"
				class="input-number"	
			/>
		</div>
		<div class="flex flex-col items-start justify-center">
			<label for="longitude1" class="input-label" data-melt-part="root">
				<span>Longitude 1</span>
			</label>
			<input
				bind:value={longitude1}
				type="number"
				id="longitude1"
				max="180"
				min="-180"
				step="any"
				class="input-number"
			/>
		</div>
	</div>

	<div class="space-x-3 flex">
		<div class="flex flex-col items-start justify-center">
			<label for="latitude2" class="input-label" data-melt-part="root">
				<span>Latitude 2</span>
			</label>
			<input
				bind:value={latitude2}
				type="number"
				id="latitude2"
				max="90"
				min="-90"
				step="any"
				class="input-number"
			/>
		</div>
		<div class="flex flex-col items-start justify-center">
			<label for="longitude2" class="input-label" data-melt-part="root">
				<span>Longitude 2</span>
			</label>
			<input
				bind:value={longitude2}
				type="number"
				id="longitude2"
				max="180"
				min="-180"
				step="any"
				class="input-number"
			/>
		</div>
		<div class="flex flex-col items-start justify-center">
			<label for="category" class="input-label" data-melt-part="root">
				<span>category</span>
			</label>
			<input
				bind:value={category}
				type="text"
				id="category"
				class="input-number"
			/>
		</div>
	</div>

	<button
		type="submit"
		class="button-white w-fit"
	>
		Calculate Middle Point
	</button>
	{#if avgLatitude && avgLongitude}
		<Map bind:lat={avgLatitude} bind:long={avgLongitude} bind:feature={feature} />
	{/if}
</form>
