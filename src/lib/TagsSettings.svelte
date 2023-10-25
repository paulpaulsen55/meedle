<script lang="ts">
	import { createDialog, melt, type Tag } from '@melt-ui/svelte';
	import { tagsList } from '$lib/helpers/tagsList';
	import { X, Plus } from 'lucide-svelte';
	import Scroller from '$lib/Scroller.svelte';
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
	import { createToaster } from '@melt-ui/svelte';
  	import { flip } from 'svelte/animate';
  	import Toast from '$lib/AlertPopUp.svelte';
	import type { ToastData } from '$lib/AlertPopUp.svelte';

	export let defaultTags: Tag[] = [];

	const dispatch = createEventDispatcher();
 
  	const {
  	  elements,
  	  helpers: { addToast },
  	  states: { toasts },
  	  actions: { portal },
  	} = createToaster<ToastData>();

	const {
		elements: { trigger, title, content, portalled, close },
		states: { open }
	} = createDialog({ role: 'alertdialog' });

	let tags: Array<Tag> = [ {id: "food_and_drink", value: "Essen und Trinken" } ],
		tempTags: Array<Tag> = [],
		searchTerm = '',
		results: Map<string, string>[] = []

	function addTag(k:string, v:string) {
		const inList = tempTags.filter(e => e.id === k).length > 0;
		if (tempTags.length < 3 && !inList) {
			tempTags = [...tempTags, {id: k, value: v}];
			document.getElementById(k)?.classList.replace("bg-magnum-200", "bg-magnum-300"); 
		}
	}

	function removeTag(tag:Tag, isDisplay:boolean) {
		if(tempTags.length > 1) {
			tempTags = tempTags.filter( el => el !== tag );
			document.getElementById(tag.id)?.classList.replace("bg-magnum-300", "bg-magnum-200"); 
			if(isDisplay) {
				tags = tempTags;
				dispatch('updateTags', tags);
			}
		} else {
			addPopUp();
		}
	}

	function addPopUp() {
		addToast({data: {title: 'Info', description: 'Es muss mindestens ein Tag ausgewählt sein!', color: 'bg-green-500'}})
  	}

	let searchTags = (map: Map<string, string>) => {
		if (searchTerm.length == 0) return map;
		let result = new Map();
		map.forEach((key, data) => {
			if (key.toLowerCase().includes(searchTerm.toLowerCase())) result.set(key, data);
		});
		return result;
	};

	onMount(() => {
		if (defaultTags.length > 0) {
			tags = defaultTags;
			tempTags = defaultTags;
		}
	})

	$ : {
		if (searchTerm.length > 0) {
			results = [];
			Object.values(tagsList).forEach((map) => { results.push(searchTags(map)) });
		} else if (searchTerm.length == 0) results = Object.values(tagsList);
	}

	afterUpdate(() => {
		tags.forEach(function (v) {
			if(document.getElementById(v.id)?.id == v.id) {
				document.getElementById(v.id)?.classList.replace("bg-magnum-200", "bg-magnum-300");
			}
		}); 	
	});
</script>

<div class="flex space-x-2 h-6 w-[calc(100vw-120px)] md:w-[calc(100vw-24rem-120px)] overflow-auto rounded-md">
	<button on:click={() => tempTags = tags} use:melt={$trigger}
		class="bg-magnum-300 rounded-md text-magnum-900 p-0.5"
	>
		<Plus class="w-5 h-5" />
	</button>
	<div class="flex gap-2">
		{#each tags as t}
			<div class="flex py-2 rounded-md bg-magnum-300 text-magnum-900 hover:bg-magnum-400" >
				<button on:click={() => removeTag(t, true)} class="flex items-center rounded m-0.5">
					<span class="px-1 truncate">{t.value}</span>
					<X class="h-5 w-5" />
				</button>
			</div>
		{/each}
	</div>
</div>

<div use:melt={$portalled}>
	{#if $open}
		<div class="fixed inset-0 z-10 backdrop-blur" />
		<div class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw]
              max-w-[340px] translate-x-[-50%] translate-y-[-50%] rounded-md dark:bg-slate-50 bg-neutral-900
              p-6 shadow-lg"
			use:melt={$content}
		>
			<input type="text" placeholder="Enter Tag" class="input w-3/4 dark:bg-white bg-neutral-700" bind:value={searchTerm}/>
			{#each Object.entries(tagsList) as filter, i}
				<h2 use:melt={$title} class="m-1 text-lg font-medium dark:text-black text-white">{filter[0]}</h2>
				<Scroller style="height: 4.5rem">
					{#each results[i].entries() as [k, v], j}
						<button id={k} on:click={() => addTag(k, v)}
							class="inline-block h-8 rounded bg-magnum-200 px-4 m-0.5 font-medium text-magnum-900 hover:bg-magnum-300"
						>
							{v}
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
						{#each tempTags as t}
							<div class="flex py-2 rounded-md bg-magnum-300 text-magnum-900 hover:bg-magnum-400">
								<button on:click={() => removeTag(t, false)} class="flex items-center rounded m-0.5">
									<span class="px-1">{t.value}</span>
									<X class="h-5 w-5" />
								</button>
							</div>
						{/each}
					</div>
				</Scroller>
			</div>
			<div class="mt-6 grid grid-cols-2 gap-2">
				<button use:melt={$close} class="h-8 items-center justify-center rounded-[4px] dark:bg-slate-200 bg-neutral-100 px-4 font-medium text-neutral-700 dark:hover:bg-slate-300 hover:bg-neutral-200">
					Abbrechen
				</button>
				<button on:click={() => {tags = tempTags; dispatch('updateTags', tags)}} use:melt={$close}
					class="h-8 items-center justify-center rounded-[4px] bg-magnum-300 px-4 font-bold text-magnum-900 hover:bg-magnum-400"
				>
					Speichern
				</button>
			</div>
		</div>
	{/if}
</div>

<div
  class="fixed right-0 top-0 z-50 m-4 flex flex-col items-end gap-2 md:bottom-0 md:top-auto"
  use:portal
>
  {#each $toasts as toast (toast.id)}
    <div animate:flip={{ duration: 500 }}>
      <Toast {elements} {toast} />
    </div>
  {/each}
</div>
