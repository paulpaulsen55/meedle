<script lang="ts">
	import { ChevronRight, ChevronLeft } from 'lucide-svelte';
	import { afterUpdate, onMount } from 'svelte';

	export let arrowSize: number = 8;

	let box: HTMLElement,
		arrowRight: HTMLElement,
		arrowLeft: HTMLElement,
		scrollAmount: number = 150;

	function updateScroll() {
		if (box.scrollLeft <= 0) {
			arrowLeft.hidden = true;
		} else if (box.scrollLeft + box.clientWidth >= box.scrollWidth) {
			arrowRight.hidden = true;
		} else {
			arrowLeft.hidden = false;
			arrowRight.hidden = false;
		}
	}

	// remove right arrow if not needed
	onMount(() => {
		displayRightArrow();
	});

	// check if right arrow is needed when content changes
	afterUpdate(() => {
		displayRightArrow();
	});

	function displayRightArrow() {
		if (box)
			if (box.clientWidth < box.scrollWidth) {
				arrowRight.hidden = false;
			} else {
				arrowRight.hidden = true;
			}
	}
</script>

<div class="relative">
	<button
		bind:this={arrowLeft}
		on:click={() => {
			box.scrollLeft -= scrollAmount;
		}}
		class="absolute top-0 h-full pr-4 bg-gradient-to-r from-neutral-900 via-neutral-900 to-transparent"
		style={`left: -${arrowSize * 3}px`}
		hidden
	>
		<ChevronLeft class={`h-${arrowSize} w-${arrowSize} text-white`} />
	</button>
	<div
		bind:this={box}
		on:scroll={() => updateScroll()}
		class="whitespace-nowrap overflow-x-auto scrollbar-hide"
	>
		<slot />
	</div>
	<button
		bind:this={arrowRight}
		on:click={() => {
			box.scrollLeft += scrollAmount;
		}}
		class="absolute top-0 h-full pl-4 bg-gradient-to-l from-neutral-900 via-neutral-900 to-transparent"
		style={`right: -${arrowSize * 3}px`}
	>
		<ChevronRight class={`h-${arrowSize} w-${arrowSize} text-white`} />
	</button>
</div>
