<script lang="ts">
    import { createSwitch, melt } from '@melt-ui/svelte';
    import { travelFrom } from '../store';

    export let locations: any;

    const {
        elements: { root, input },
        states: { checked }
    } = createSwitch();

    $ : {
        travelFrom.set($checked ? locations.location2.coordinate : locations.location1.coordinate);
    } 
</script>
   
<form class="space-y-4 w-5/6 text-lg dark:text-black text-white">
    <p class="">Navigation von:</p>
    <div class="flex gap-2">
        <span class="truncate" title={locations.location1.address} >{locations.location1.title}</span>
        <button
            use:melt={$root}
            class="w-[44px] relative h-6 cursor-default rounded-full dark:bg-slate-400 bg-neutral-500 transition-colors"
        >
            <span class="thumb block rounded-full bg-white transition" />
        </button>
        <span class="truncate" title={locations.location2.address}>{locations.location2.title}</span>
        <input use:melt={$input} />
    </div>
</form>
  
<style>
    .thumb {
      --padding: 0.125rem;
      --size: 1.25rem;
      width: var(--size);
      height: var(--size);
      transform: translateX(var(--padding));
    }
   
    :global([data-state='checked']) .thumb {
      transform: translateX(calc(2.75rem - var(--size) - var(--padding)));
    }
</style>