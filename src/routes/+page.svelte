<script lang="ts">
	import { goto } from '$app/navigation';
	import { locations } from '../store';
	import NavBar from '$lib/NavBar.svelte';
	import AddressInput from '$lib/AddressInput.svelte';
	import { radius as r } from '../store';
	import { poi as p } from '../store';
	import { createPopover, melt } from '@melt-ui/svelte';
  	import { fade } from 'svelte/transition';
  	import { Settings2, X } from 'lucide-svelte';


	let radius: number;
	let poi: number;
	export let data

	let location1: string = 'tuxer steig 6',
		location2: string = 'Rheinbabenallee 47';

	function startClick() {
		locations.set({ location1, location2 });
		r.set(radius);
		goto('/map');
	}

	const {
    	elements: { trigger, content, arrow, close },
    	states: { open },
  	} = createPopover({
    	forceVisible: true,
	});
</script>

<div class="h-screen grid place-items-center">
	<NavBar />
	<img src="/logo.svg" alt="logo" />

	<div class="self-start flex flex-col items-center">
		<div class="space-x-3 flex">
			<AddressInput bind:location={location1} sessionToken={data.sessionToken} />
			<AddressInput bind:location={location2} sessionToken={data.sessionToken} />
		</div>
		<div class="space-x-3 flex">
			<div class="flex flex-col items-start justify-center relative">
				<button
					type="button"
					class="trigger"
					use:melt={$trigger}
				>
					<Settings2 class="button-magnum w-64 flex justify-center" />
					<span class="sr-only">Open Popover</span>
				</button>
			</div>
			{#if $open}
				<div use:melt={$content} transition:fade={{ duration: 100 }} class="content">
					<div use:melt={$arrow} />
					<div class="flex flex-col gap-2.5">
						<p>Einstellungen</p>
						<fieldset>
							<label for="radius">Radius</label>
							<input bind:value={radius} type="number" id="radius" class="input" placeholder="Radius" />
						</fieldset>
						<fieldset>
							<label for="POI">POI</label>
							<input bind:value={poi} type="number" id="POI" class="input" placeholder="POI" />
						</fieldset>
					</div>
					<button class="close" use:melt={$close}>
						<X class="square-4" />
					</button>
				</div>
			{/if}
			<button on:click={() => startClick()} class="button-magnum w-80 justify-center">
				meet me in the middle
			</button>
		</div>
	</div>
</div>

<style lang="postcss">
fieldset {
	@apply flex items-center gap-5;
}

label {
	@apply w-[75px] text-sm text-neutral-700;
}

p {
	@apply mb-2 font-medium text-neutral-900;
}

.input {
	@apply flex h-8 w-full rounded-md border border-magnum-800 bg-transparent px-2.5 text-sm;
	@apply ring-offset-magnum-300 focus-visible:ring;
	@apply focus-visible:ring-magnum-400 focus-visible:ring-offset-1;
	@apply flex-1 items-center justify-center;
	@apply text-magnum-700;
}

.trigger {
	@apply inline-flex h-10 w-10;
}

.close {
	@apply absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full;
	@apply text-magnum-900 transition-colors hover:bg-magnum-500/10;
	@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	@apply bg-white p-0 text-sm font-medium;
}

.content {
	@apply z-10 w-60 rounded-[4px] bg-white p-5 shadow-sm;
}
</style>