<script lang="ts">
    import { createSwitch, melt } from '@melt-ui/svelte';
	import { createEventDispatcher, onMount } from 'svelte';

    export let locations: any;
    export let check: boolean = false;

    const {
        elements: { root, input },
        states: { checked }
    } = createSwitch();

    onMount(() => {
        checked.set(check);
    })
  </script>
   
<form class="text-black space-y-2">
    <p class="text-center">ausgehend von:</p>
    <div class="flex justify-evenly">
        <span>{locations.location1.title}</span>
        <button
            use:melt={$root}
            class="switch relative h-6 cursor-default rounded-full bg-magnum-800 transition-colors"
        >
            <span class="thumb block rounded-full bg-white transition" />
        </button>
        <span>{locations.location2.title}</span>
        <input use:melt={$input} />
    </div>
    <div class="text-center">
        <button class="button-magnum text-center" on:click={() => check = $checked}>anwenden</button>
    </div>
</form>
  
<style>
    .switch {
      --w: 2.75rem;
      --padding: 0.125rem;
      width: var(--w);
    }
   
    .thumb {
      --size: 1.25rem;
      width: var(--size);
      height: var(--size);
      transform: translateX(var(--padding));
    }
   
    :global([data-state='checked']) .thumb {
      transform: translateX(calc(var(--w) - var(--size) - var(--padding)));
    }
</style>