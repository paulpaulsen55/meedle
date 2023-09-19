<script lang="ts">
    import { createDialog, createTagsInput, melt } from '@melt-ui/svelte';
    import { food } from '$lib/helpers/filters';
    import { activities } from '$lib/helpers/filters';
    import { shopping } from '$lib/helpers/filters';
   
    const {
    elements: { root, tag, deleteTrigger },
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
   
  <button
    use:melt={$trigger}
    class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2
      font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75"
  >
    Delete Item
  </button>
   
  <div use:melt={$portalled}>
    {#if $open}
      <div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
      <div
        class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw]
              max-w-[400px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white
              p-6 shadow-lg"
        use:melt={$content}
      >
      <h2 use:melt={$title} class="m-0 text-lg font-medium text-black">
        Essen und Trinken
      </h2>
        <div class="grid grid-rows-2 grid-flow-col auto-cols-max gap-1 overflow-x-scroll">
          {#each food.entries() as [k, _]}
          <div>
            <button
              on:click={() => {addTag(k)}}
              class="inline-flex h-8 items-center justify-center rounded-[4px]
                    bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
            >
              {k}
            </button>
          </div>
          {/each}
        </div>
        <h2 use:melt={$title} class="m-0 text-lg font-medium text-black">
          Freizeit
        </h2>
        <div class="grid grid-rows-2 grid-flow-col auto-cols-max gap-1 overflow-x-scroll">
          {#each activities.entries() as [k, _]}
          <div>
            <button
              on:click={() => {addTag(k)}}
              class="inline-flex h-8 items-center justify-center rounded-[4px]
                    bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
            >
              {k}
            </button>
          </div>
          {/each}
        </div>
        <h2 use:melt={$title} class="m-0 text-lg font-medium text-black">
          Einkaufen
        </h2>
        <div class="grid grid-rows-2 grid-flow-col auto-cols-max gap-1 overflow-x-scroll">
          {#each shopping.entries() as [k, _]}
          <div>
            <button
              on:click={() => {addTag(k)}}
              class="inline-flex h-8 items-center justify-center rounded-[4px]
                    bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
            >
              {k}
            </button>
          </div>
          {/each}
        </div>









        <div class="flex flex-col items-start justify-center gap-2">
          <div
            use:melt={$root}
            class="flex min-w-[280px] flex-row flex-wrap gap-2.5 rounded-md bg-white px-3 py-2 text-magnum-700
            focus-within:ring focus-within:ring-magnum-400"
          >
            {#each $tags as t}
              <div
                use:melt={$tag(t)}
                class="flex items-center overflow-hidden rounded-md bg-magnum-200 text-magnum-900 [word-break:break-word]
              data-[disabled]:bg-magnum-300 data-[selected]:bg-magnum-400 data-[disabled]:hover:cursor-default
                data-[disabled]:focus:!outline-none data-[disabled]:focus:!ring-0"
              >
                <span class="flex items-center border-r border-white/10 px-1.5"
                  >{t.value}</span
                >
                <button
                  use:melt={$deleteTrigger(t)}
                  class="flex h-full items-center px-1 enabled:hover:bg-magnum-300"
                >
                x
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