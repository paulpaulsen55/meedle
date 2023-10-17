<script lang="ts">
    import { createPopover, melt } from '@melt-ui/svelte';
  	import { fade } from 'svelte/transition';
  	import { X, SlidersHorizontal } from 'lucide-svelte';

    export let radius = 5, poi = 5;

    const {
    	elements: { trigger, content, arrow, close },
    	states: { open },
  	} = createPopover({
    	forceVisible: true,
	});

	$: if (poi > 25){
		poi = 25
	} else if(poi < 1){
		poi = 1
	}
</script>

<button
    type="button"
    class={"p-2 rounded transition dark:text-black text-white dark:bg-slate-200 dark:hover:bg-[rgb(235,238,246)] bg-neutral-800 hover:bg-neutral-700" + $$props.class}
    use:melt={$trigger}
>
    <SlidersHorizontal />
</button>
{#if $open}
    <div use:melt={$content} transition:fade={{ duration: 100 }} class="z-10 w-60 rounded-[4px] bg-white p-5 shadow-sm">
        <div use:melt={$arrow} />
        <div class="flex flex-col gap-2.5">
            <p class="mb-2 font-medium text-neutral-900">Einstellungen</p>
            <fieldset>
                <label for="radius">Radius (km)</label>
                <input bind:value={radius} type="number" min="1" max="50" id="radius" class="input" placeholder="max. Radius" />
            </fieldset>
            <fieldset>
                <label for="POI">Ergebnisse</label>
                <input bind:value={poi} type="number" min="1" max="25" id="POI" class="input" placeholder="Anzahl POI" />
            </fieldset>
        </div>
        <button class="close" use:melt={$close}>
            <X class="square-4" />
        </button>
    </div>
{/if}

<style lang="postcss">
fieldset {
    @apply flex items-center gap-5;
}

label {
    @apply w-[75px] text-sm text-neutral-700;
}
.input {
    @apply flex h-8 w-full rounded-md border border-magnum-800 bg-transparent px-2.5 text-sm;
    @apply ring-offset-magnum-300 focus-visible:ring;
    @apply focus-visible:ring-magnum-400 focus-visible:ring-offset-1;
    @apply flex-1 items-center justify-center;
    @apply text-magnum-700;
}

.close {
    @apply absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full;
    @apply text-magnum-900 transition-colors hover:bg-magnum-500/10;
    @apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
    @apply bg-white p-0 text-sm font-medium;
}
</style>