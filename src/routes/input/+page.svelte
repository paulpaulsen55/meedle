<script lang="ts">
	import Map from '$lib/Map.svelte';

	let longitude1 = 0,
		latitude1 = 0,
		longitude2 = 0,
		latitude2 = 0,
		avgLongitude = 0,
		avgLatitude = 0;
	async function handleSubmit() {
		avgLongitude = (Number(longitude1) + Number(longitude2)) / 2;
		avgLatitude = (Number(latitude1) + Number(latitude2)) / 2;
	}
</script>

<form
	on:submit|preventDefault={handleSubmit}
	action="/api"
	class="grid place-content-center gap-3 h-full"
>
	<div class="space-x-3 flex">
		<div class="flex flex-col items-start justify-center">
			<label for="latitude1" class="mb-0.5 font-medium text-magnum-900" data-melt-part="root">
				<span>Latitude 1</span>
			</label>
			<input
				bind:value={latitude1}
				type="number"
				id="latitude1"
				class="h-10 w-[240px] rounded-md px-3 py-2 text-magnum-700"
			/>
		</div>
		<div class="flex flex-col items-start justify-center">
			<label for="longitude1" class="mb-0.5 font-medium text-magnum-900" data-melt-part="root">
				<span>Longitude 1</span>
			</label>
			<input
				bind:value={longitude1}
				type="number"
				id="longitude1"
				class="h-10 w-[240px] rounded-md px-3 py-2 text-magnum-700"
			/>
		</div>
	</div>

	<div class="space-x-3 flex">
		<div class="flex flex-col items-start justify-center">
			<label for="latitude2" class="mb-0.5 font-medium text-magnum-900" data-melt-part="root">
				<span>Latitude 2</span>
			</label>
			<input
				bind:value={latitude2}
				type="number"
				id="latitude2"
				class="h-10 w-[240px] rounded-md px-3 py-2 text-magnum-700"
			/>
		</div>
		<div class="flex flex-col items-start justify-center">
			<label for="longitude2" class="mb-0.5 font-medium text-magnum-900" data-melt-part="root">
				<span>Longitude 2</span>
			</label>
			<input
				bind:value={longitude2}
				type="number"
				id="longitude2"
				class="h-10 w-[240px] rounded-md px-3 py-2 text-magnum-700"
			/>
		</div>
	</div>

	<button
		type="submit"
		class="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3
            font-medium leading-none text-magnum-700 shadow hover:opacity-75"
	>
		Calculate Middle Point
	</button>
	{#if avgLatitude != 0 && avgLongitude != 0}
		<Map bind:lat={avgLatitude} bind:long={avgLongitude} />
	{/if}
</form>
