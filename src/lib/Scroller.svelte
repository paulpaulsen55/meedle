<script lang="ts">
    import { ChevronRight, ChevronLeft } from 'lucide-svelte';

    let box:HTMLElement,
        arrowRight:HTMLElement,
        arrowLeft:HTMLElement,
        scrollAmount:number = 100;

    function updateScroll(box: HTMLElement, arrowL: HTMLElement, arrowR: HTMLElement) {
        console.log(box.scrollWidth);
        console.log(box.scrollLeft + box.clientWidth);
        if (box.scrollLeft <= 0) {
            arrowL.hidden = true;
        } else if (box.scrollLeft + box.clientWidth >= box.scrollWidth) {
            arrowR.hidden = true;
        } else {
            arrowL.hidden = false;
            arrowR.hidden = false;
        }
    }
</script>

<div class="relative">
    <button bind:this={arrowLeft} on:click={() => {box.scrollLeft -= scrollAmount}} 
      class="absolute -left-6 top-0 h-full pr-4 bg-gradient-to-r from-neutral-900 via-neutral-900 to-transparent" 
      hidden
    >
      <ChevronLeft class="h-8 w-8 text-white"/>
    </button>
    <div bind:this={box} 
        on:scroll={() => updateScroll(box, arrowLeft, arrowRight)} 
        class="whitespace-nowrap overflow-x-auto scrollbar-hide"
    >
        <slot></slot>
    </div>
    <button bind:this={arrowRight} on:click={() => {box.scrollLeft += scrollAmount}} 
      class="absolute -right-6 top-0 h-full pl-4 bg-gradient-to-l from-neutral-900 via-neutral-900 to-transparent"
    >
        <ChevronRight class="h-8 w-8 text-white"/>
    </button>
</div>