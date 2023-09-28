<script lang="ts">
	import { createDialog, createTagsInput, melt, type CreateDialogProps, type Tag } from '@melt-ui/svelte';
	import { filters } from '$lib/helpers/filters';
	import { X, Plus } from 'lucide-svelte';
	import Scroller from '$lib/Scroller.svelte';
	import { beforeUpdate, createEventDispatcher } from 'svelte';
	import { afterUpdate } from 'svelte';

	let filterTags: Array<Tag> = [],
		tempTags: Tag[] = [],
		continueOption = false,
		searchTerm = '',
		results: Map<string, string>[] = [];

	const dispatch = createEventDispatcher();

	const displayTagsInput = createTagsInput({ 
		unique: true, 
		defaultTags: [{id:"food_and_drink", value:"Essen und Trinken"}] 
		}),
		displayTagElement = displayTagsInput.elements.tag,
		displayTags = displayTagsInput.states.tags,
		displayDeleteTrigger = displayTagsInput.elements.deleteTrigger;

	const {
		elements: { tag, deleteTrigger },
		states: { tags },
		helpers: { addTag, updateTag },
	} = createTagsInput({
		defaultTags: [{id:"food_and_drink", value:"Essen und Trinken"}],
		unique: true,
		add(tag) {
			return { id: tag, value: '' };
		},	
		update(tag) {
			return { id: tag.id, value: tag.value };
		}
	});

	const handleOpen: CreateDialogProps['onOpenChange'] = ({ curr, next }) => {
		if (open && !next) {
			if (!continueOption) {
				tags.set(tempTags);
			}
			return false; // close
		}
		return next;
	};

	const {
		elements: { trigger, title, content, portalled },
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
		displayTags.set(filterTags); // update displayed tags when filterTags changes
		dispatch('updateTags', filterTags); // send tags to parent
	}

	let filteredTags = (map: Map<string, string>) => {
		if (searchTerm.length == 0) {
			return map;
		}
		let result = new Map();
		map.forEach((key, data) => {
			if (data.toLowerCase().includes(searchTerm.toLowerCase())) {
				result.set(data, key);
			}
		});
		return result;
	};

	function setUnselected(id:string) {
		document.getElementById(id)?.classList.replace("bg-magnum-300", "bg-magnum-200");
	}

	beforeUpdate(() => {
		if ($tags.length > 3) {
			tags.set($tags.slice(0, 3));
		}
	})

	afterUpdate(() => {
		$tags.forEach(function (v) {
			if(document.getElementById(v.value)?.id == v.value) {
				document.getElementById(v.value)?.classList.replace("bg-magnum-200", "bg-magnum-300");
			}
		}); 
	});

	$ : {
		if (searchTerm.length > 0 && filters) {
			results = [];
			const r = Object.values(filters);
			r.forEach((map) => {
				results.push(filteredTags(map));
			});
		} else if (searchTerm.length == 0 && filters) {
			results = Object.values(filters);
		}

		if ($displayTags.length) {
			filterTags = $displayTags
			dispatch('updateTags', filterTags); // send tags to parent
		};
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
		{#each $displayTags as t}
			<div
				use:melt={$displayTagElement(t)}
				class="flex rounded-md bg-magnum-300 text-magnum-900 py-2"
			>
				<button 
					use:melt={$displayDeleteTrigger(t)} 
					class="flex items-center rounded m-0.5"
				>
					<span class="px-1">{t.value}</span>
					<X class="h-5 w-5" />
				</button>
			</div>
		{/each}
	</div>
</div>

<div use:melt={$portalled}>
	{#if $open}
		<div class="fixed inset-0 z-10 backdrop-blur" />
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
				bind:value={searchTerm}
			/>

			{#each Object.entries(filters) as filter, i}
				<h2 use:melt={$title} class="m-1 text-lg font-medium text-white">{filter[0]}</h2>
				<Scroller style="height: 4.5rem">
					{#each results[i].entries() as [k, s], j}
						<button id={k} on:click={() => { 
								addTag(s);
								updateTag({ id: s, value: k });
							}}
							class="inline-block h-8 rounded bg-magnum-200 px-4 m-0.5 font-medium text-magnum-900
									hover:bg-magnum-300"
						>
							{k}
						</button>
						{#if j == Math.floor(results[i].size / 2)}
							<br class="inline-block" />
						{/if}
					{/each}
				</Scroller>
			{/each}

			<div class="my-5">
				<Scroller arrowSize={5}>
					<div class="flex gap-2 h-6">
						{#each $tags as t}
							<div use:melt={$tag(t)} class="flex py-2 rounded-md bg-magnum-300 text-magnum-900 hover:bg-magnum-400">
								<button on:click={() => setUnselected(t.value)}
									use:melt={$deleteTrigger(t)} 
									class="flex items-center rounded m-0.5"
								>
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
