<script lang="ts">
	import { createDialog, createTagsInput, melt, type CreateDialogProps, type Tag } from '@melt-ui/svelte';
	import { filters } from '$lib/helpers/filters';
	import { X, Plus } from 'lucide-svelte';
	import Scroller from '$lib/Scroller.svelte';
	import { createEventDispatcher } from 'svelte';

	let filterTags: Array<Tag> = [],
	  tempTags: Tag[] = [],
    continueOption = false;

	const dispatch = createEventDispatcher();

	const {
		elements: { tag, deleteTrigger },
		states: { tags },
		helpers: { addTag }
	} = createTagsInput({
		unique: true,
		add(tag) {
			return { id: tag, value: tag };
		}
	});

  const handleOpen: CreateDialogProps['onOpenChange'] = ({ curr, next }) => {
    if (open && !next) {
      if (!continueOption) {
        tags.set(tempTags);
      }
      return false // close
    }
    return next
  }

	const {
		elements: { trigger, overlay, title, content, close, portalled },
		states: { open }
	} = createDialog({
		role: 'alertdialog',
    onOpenChange: handleOpen
  });

	function openClick() {
		tempTags = filterTags.map((item) => ({ ...item }));
    continueOption = false;
	}

	function closeClick() {
		tags.set(tempTags);
		open.set(false);
	}

	function continueClick() {
		filterTags = $tags;
    continueOption = true;
		open.set(false);
		dispatch('updateTags', filterTags);
	}
</script>

<div class="flex space-x-2 h-6">
	<button
		on:click={() => openClick()}
		use:melt={$trigger}
		class="bg-magnum-300 rounded-md text-magnum-900 p-0.5"
	>
		<Plus class="w-5 h-5" />
	</button>
	<div class="flex gap-2">
		{#each filterTags as t}
			<div use:melt={$tag(t)} class="flex rounded-md bg-magnum-300 text-magnum-900 py-2">
				<button use:melt={$deleteTrigger(t)} class="flex items-center rounded m-0.5">
					<span class="px-1">{t.value}</span>
					<X class="h-5 w-5" />
				</button>
			</div>
		{/each}
	</div>
</div>

<div use:melt={$portalled}>
	{#if $open}
  <div class="fixed inset-0 z-10 backdrop-blur"
    ></div>
		<div
			class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw]
              max-w-[340px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-neutral-900
              p-6 shadow-lg"
			use:melt={$content}
		>
			<input type="text" id="tag" placeholder="Enter Tag" class="input w-3/4" />

			{#each Object.entries(filters) as filter}
				<h2 use:melt={$title} class="m-1 text-lg font-medium text-white">{filter[0]}</h2>
				<Scroller>
					{#each filter[1].entries() as [k, _], index}
						{#if index == Math.floor(filter[1].size / 2)}
							<br class="inline-block" />
						{/if}
						<button
							on:click={() => {
								addTag(k);
							}}
							class="inline-block h-8 rounded bg-magnum-200 px-4 m-0.5 font-medium text-magnum-900"
						>
							{k}
						</button>
					{/each}
				</Scroller>
			{/each}
			<div class="my-5">
				<Scroller arrowSize={5}>
					<div class="flex gap-2 h-6">
						{#each $tags as t}
							<div use:melt={$tag(t)} class="flex rounded-md bg-magnum-300 text-magnum-900 py-2">
								<button use:melt={$deleteTrigger(t)} class="flex items-center rounded m-0.5">
									<span class="px-1">{t.value}</span>
									<X class="h-5 w-5" />
								</button>
							</div>
						{/each}
					</div>
				</Scroller>
			</div>

			<div class="mt-6 flex justify-end gap-4">
				<button
					on:click={() => closeClick()}
					class="inline-flex h-8 items-center justify-center rounded-[4px] bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
				>
					Cancel
				</button>
				<button
					on:click={() => continueClick()}
					class="inline-flex h-8 items-center justify-center rounded-[4px] bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
        >
					Continue
				</button>
			</div>
		</div>
	{/if}
</div>
