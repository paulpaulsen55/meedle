<script lang="ts">
	import { ChevronRight, ChevronLeft } from 'lucide-svelte';
	import { afterUpdate, onMount } from 'svelte';

	export let arrowSize: number = 8;
	export let arrowBackground: boolean = true;

	let box: HTMLElement,
		arrowRight: HTMLElement,
		arrowLeft: HTMLElement,
		scrollAmount: number = 150;

	function updateScroll() {
		if (box.scrollLeft <= 0) {
			arrowLeft.classList.add('hidden');
		} else if (box.scrollLeft + box.clientWidth >= box.scrollWidth - 1) {
			arrowRight.classList.add('hidden');
		} else {
			arrowLeft.classList.remove('hidden');
			arrowRight.classList.remove('hidden');
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

<div class="relative" style={$$props.style}>
	<button
		bind:this={arrowLeft}
		on:click={() => {
			box.scrollLeft -= scrollAmount;
		}}
		class={`absolute top-0 h-full pr-4 hidden ${
			arrowBackground ? 'bg-gradient-to-r from-neutral-900 via-neutral-900 to-transparent' : ''
		}`}
		style={`left: -${arrowSize * 3}px`}
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
		class={`absolute top-0 h-full pl-4 ${
			arrowBackground ? 'bg-gradient-to-l from-neutral-900 via-neutral-900 to-transparent' : ''
		}`}
		style={`right: -${arrowSize * 3}px`}
	>
		<ChevronRight class={`h-${arrowSize} w-${arrowSize} text-white`} />
	</button>
</div>