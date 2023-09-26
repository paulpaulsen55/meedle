<script lang="ts">
	import type { SearchBoxCategoryResponse } from '@mapbox/search-js-core';
	import { createAccordion, melt } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	export let response : SearchBoxCategoryResponse;

    console.log(response);

    type item =  {
		id:string;
		title:string;
		address:string;
		description:string;
	}

    let items:item[] = [];

    for (let index = 0; index < response.features.length; index++) {
        const element = response.features[index];
        items.push({
            id: element.properties.mapbox_id,
            title: element.properties.name,
            address: element.properties.full_address,
            description: element.properties.poi_category.toString(),
        })
    }


	const {
		elements: { content, item, trigger, root },
		helpers: { isSelected }
	} = createAccordion({
		defaultValue: 'item-1'
	});

	function togglePoint(){
		
	};
</script>

<div class="scrollable rounded-xl bg-neutral-800 shadow-lg z-10">
	{#each items as { id, title, address, description }, i}
		<div
			use:melt={$item(id)}
			class="overflow-hidden transition first:rounded-t-xl last:rounded-b-xl"
		>
			<h2 class="flex">
				<button
					use:melt={$trigger(id)}
					class="w-full cursor-pointer flex items-start flex-col bg-neutral-800 p-5 text-base font-medium leading-none transition hover:bg-neutral-700
                    {i == 0 ? '' : 'border-t border-t-neutral-600'}"
				>
				    <p>{title}</p>
                    <span class="text-neutral-600 text-sm">{address}</span>
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

	.scrollable {
		max-height: 580px;
		height: fit-content;
		overflow: auto;
	}
</style>
