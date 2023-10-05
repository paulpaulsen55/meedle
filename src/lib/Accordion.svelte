<script lang="ts">
	import type { Feature } from '../app';
	import { createAccordion, melt } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';
	import AccordionContent from './AccordionContent.svelte';
	import { Star } from 'lucide-svelte';

	export let response: Feature[];
	export let hoverdPointId: string | null;

	const {
		elements: { content, item },
		helpers: { isSelected },
		states: { value }
	} = createAccordion();

	$: {
		let tmpItem = response.findLast((i) => i.id == hoverdPointId);
		if (tmpItem != undefined) {
			value.set(tmpItem.id);
		} else {
			value.set(undefined);
		}
	}

	function preUpdateHoverdPoint(id: string) {
		if (id == hoverdPointId) {
			hoverdPointId = null;
		} else {
			hoverdPointId = id;
		}
	}
</script>

<div class="overflow-auto rounded-xl bg-neutral-800 shadow-lg z-10 mt-10">
	{#each response as { id, name, address, categories, isMatch }, i}
		<div
			use:melt={$item(id)}
			class="overflow-hidden transition first:rounded-t-xl last:rounded-b-xl"
		>
			<h2>
				<button
					on:click={() => preUpdateHoverdPoint(id)}
					class="w-full cursor-pointer flex items-start gap-2 flex-col bg-neutral-800 px-5 py-7 text-base font-medium leading-none transition hover:bg-neutral-700
                    {i == 0 ? '' : 'border-t border-t-neutral-600'}"
				>
					<p class="truncate w-full text-start flex gap-2 items-center">
						{#if isMatch}
							<Star class="text-magnum-300 h-5"/>
						{/if}
						<span>{name}</span>
					</p>
					<span class="text-neutral-600 text-sm text-start truncate w-full"
						>{address.slice(0, address.lastIndexOf(','))}</span
					>
				</button>
			</h2>
			{#if $isSelected(id)}
				<div
					class="content overflow-hidden bg-[rgb(50,50,50)] text-sm text-neutral-400"
					use:melt={$content(id)}
					transition:slide
				>
					<AccordionContent tags={categories} feature={response[i]} />
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
