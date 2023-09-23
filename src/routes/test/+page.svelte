<script lang="ts">
    import { createDialog, createTagsInput, melt } from '@melt-ui/svelte';
    import { filters } from '$lib/helpers/filters';
    import { X, ChevronRight, ChevronLeft } from 'lucide-svelte';
    import Scroller from '$lib/Scroller.svelte';

    const {
      elements: { tag, deleteTrigger },
      states: { tags },
      helpers: {addTag},
    } = createTagsInput({
      unique: true,
      add(tag) {
        return { id: tag, value: tag };
      },
    });

    const {
      elements: {
        trigger,
        overlay,
        title,
        content,
        close,
        portalled,
      },
      states: { open },
    } = createDialog({
      role: 'alertdialog',
    });
  </script>
   
  <button use:melt={$trigger} class="button-white">
    Delete Item
  </button>
   
  <div use:melt={$portalled}>
    {#if $open}
      <div use:melt={$overlay} class="fixed inset-0 z-5 bg-white" />
      <div
        class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw]
              max-w-[340px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-neutral-900
              p-6 shadow-lg"
        use:melt={$content}
      >
      <input
        type="text"
        id="tag"
        placeholder="Enter Tag"
        class="input w-3/4"
	    />

      {#each Object.entries(filters) as filter}
        <h2 use:melt={$title} class="m-1 text-lg font-medium text-white">{filter[0]}</h2>
        <Scroller>
          {#each filter[1].entries() as [k, _], index}
            {#if index == Math.floor(filter[1].size / 2)}
              <br class="inline-block">
            {/if}
            <button on:click={() => {addTag(k)}} 
              class="inline-block h-8 rounded bg-magnum-200 px-4 m-0.5 font-medium text-magnum-900">
                {k}
            </button>
          {/each}
        </Scroller>
      {/each}
      <div class="flex flex-col items-start justify-center gap-2">
        <div
          class="flex h-6 flex-row flex-wrap gap-2.5 rounded-md py-2"
        >
          {#each $tags as t}
            <div
              use:melt={$tag(t)}
              class="flex rounded-md bg-magnum-200 text-magnum-900 font-medium [word-break:break-word]"
            >
              <button use:melt={$deleteTrigger(t)} class="flex items-center rounded m-0.5">
                <span class="px-1">{t.value}</span>
                <X class="h-full px-1"/>
              </button>
            </div>
          {/each}
        </div>
      </div>
      
      <div class="mt-6 flex justify-end gap-4">
        <button
          use:melt={$close}
          class="inline-flex h-8 items-center justify-center rounded-[4px]
                    bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
        >
          Cancel
        </button>
        <button
          use:melt={$close}
          class="inline-flex h-8 items-center justify-center rounded-[4px]
                    bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
        >
          Continue
        </button>
      </div>
        <button
          use:melt={$close}
          aria-label="Close"
          class="absolute right-[10px] top-[10px] inline-flex h-6 w-6
                  appearance-none items-center justify-center rounded-full text-magnum-800
                  hover:bg-magnum-100 focus:shadow-magnum-400"
        >
        </button>
      </div>
    {/if}
  </div>