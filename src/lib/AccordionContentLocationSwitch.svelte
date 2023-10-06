<script lang="ts">
    import { createSwitch, melt } from '@melt-ui/svelte';

    export let locations: any;
    export let check: boolean = false;

    const {
        elements: { root, input },
        states: { checked }
    } = createSwitch();

    checked.set(check);
  </script>
   
<form class="text-black space-y-2">
    <p class="text-center">ausgehend von:</p>
    <div class="grid grid-flow-col gap-2">
        <span class="truncate" title={locations.location1.title} >{locations.location1.title}</span>
        <button
            use:melt={$root}
            class="switch w-11 relative h-6 cursor-default rounded-full bg-magnum-800 transition-colors"
        >
            <span class="thumb block rounded-full bg-white transition" />
        </button>
        <span class="truncate" title={locations.location2.title}>{locations.location2.title}</span>
        <input use:melt={$input} />
    </div>
    <div class="text-center">
        <button class="button-magnum text-center" on:click={() => check = $checked}>anwenden</button>
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