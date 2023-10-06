<script lang="ts">
	import type { Feature } from '../app';
	import { createAccordion, melt } from '@melt-ui/svelte';
	import { fade, slide } from 'svelte/transition';
	import AccordionContent from './AccordionContent.svelte';
	import { Star, Triangle } from 'lucide-svelte';

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

<div class="overflow-auto rounded-xl bg-neutral-800 shadow-lg z-10 mt-10 mb-24">
	{#each response as { id, name, address, categories, isMatch }, i}
		<div
			use:melt={$item(id)}
			class="overflow-hidden transition first:rounded-t-xl last:rounded-b-xl"
		>
			<h2>
				<button
					on:click={() => preUpdateHoverdPoint(id)}
					class="w-full cursor-pointer bg-neutral-800 px-5 py-7 text-base font-medium transition hover:bg-neutral-700 text-start
                    {i == 0 ? '' : 'border-t border-t-neutral-600'}"
				>
					{#if isMatch}
						<button class="relative group inline-block">
							<span class="-top-6 absolute hidden group-hover:block text-neutral-400 whitespace-nowrap text-sm font-extralight">übereinstimmende Filter</span>
							<Star class="text-magnum-300 h-5 my-0.5" />
						</button>
					{/if}
					<p class="truncate inline-block w-5/6">{name}</p>
					<br>
					<span class="text-neutral-600 text-sm truncate w-full"
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
