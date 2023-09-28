<script lang="ts">
	import type { Feature } from '../app';
	import { createAccordion, melt } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	export let response: Feature[];
	export let hoverdPointId:string|null;

	type item = {
		id: string;
		title: string;
		address: string;
		description: string;
	};

	let items: item[] = [];

	function refresh() {
		items = [];
		for (let index = 0; index < response.length; index++) {
			const element = response[index];
			items.push({
				id: element.id,
				title: element.name,
				address: element.address,
				description: element.categories.join()
			});
		}
	}
	
	const {
		elements: { content, item, trigger, root },
		helpers: { isSelected },
		states: {value}
	} = createAccordion();

	refresh();

	$:{
		let tmpItem = items.findLast((i)=>i.id==hoverdPointId);
		if (tmpItem != undefined) {
			value.set(tmpItem.id);
		}else {
			value.set(undefined);
		}
		if(response) refresh();
	}

	function preUpdateHoverdPoint(id:string){
		if (id == hoverdPointId) {
			hoverdPointId = null;
		}else{
			hoverdPointId = id
		}
	}

</script>

<div class="overflow-auto rounded-xl bg-neutral-800 shadow-lg z-10 mt-10">
	{#each items as { id, title, address, description }, i}
		<div
			use:melt={$item(id)}
			class="overflow-hidden transition first:rounded-t-xl last:rounded-b-xl"
		>
			<h2>
				<button
					on:click={() => preUpdateHoverdPoint(id)}
					class="w-full cursor-pointer flex items-start gap-2 flex-col bg-neutral-800 px-5 py-8 text-base font-medium leading-none transition hover:bg-neutral-700
                    {i == 0 ? '' : 'border-t border-t-neutral-600'}"
				>
					<p class="truncate w-full text-start">{title}</p>
					<span class="text-neutral-600 text-sm text-start truncate w-full">{address}</span>
				</button>
			</h2>
			{#if $isSelected(id)}
				<div
					class="content overflow-hidden bg-[rgb(50,50,50)] text-sm text-neutral-400"
					use:melt={$content(id)}
					transition:slide
				>
					<div class="px-5 py-4">
						{description}
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="postcss">
	.content {
		box-shadow: inset 0px 1px 0px theme('colors.neutral.500');
	}
</style>
