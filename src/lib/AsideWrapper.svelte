<script lang="ts">
	import { ArrowLeftIcon } from "lucide-svelte";
	import { onMount } from "svelte";
	import { circInOut, linear } from "svelte/easing";
	import { tweened } from "svelte/motion";

    let isMobile = false;
    let width = 0, height = 0;
    let prevTouchY = 0;
    let moving = false;
    let y = tweened(50, { duration: 150, easing: circInOut });
    let positions = [50]

    export function setOpen(open: boolean) {
        if (!isMobile) return;
        
        if (open) y.set(50);
        else y.set(height - 100);
    }

    onMount(()  => {
        // add the height of the aside to the positions array | onMount, because the height of the aside is not known before
        const min = height - 100;
        positions.push(min);
        y.set(min);
    })
    
    $ : if (width <= 768) { // tailwind breakpoint md
            isMobile = true;
        } else {
            isMobile = false;
        }

    function onDown() {
        if (!isMobile) return; 
        moving = true;
    }

    function onMove(e: MouseEvent | TouchEvent) {
        if (!isMobile) return; 
        if(e instanceof MouseEvent) {
            if (moving && $y + e.movementY >= 50 && $y + e.movementY <= height - 100) {
                y.set($y + e.movementY, { duration: 0 , easing: linear});
            }
        } else if (e instanceof TouchEvent){
            const t = e.touches[0].pageY - prevTouchY;
            if (moving && $y + t >= 50 && $y + t <= height - 100) {
                y.set($y + t, { duration: 0 , easing: linear});
            }
            prevTouchY = e.touches[0].pageY;
        }
	}
	
	function onUp() {
        if (!isMobile) return; 
        moving = false;
        y.set(positions.reduce((prev, curr) => {
            return (Math.abs(curr - $y) < Math.abs(prev - $y) ? curr : prev);
        }));
	}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} on:mouseup={onUp} on:mousemove={onMove} on:touchmove={onMove} on:touchend={onUp} />

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<aside
    on:mousedown={() => onDown()}
    on:touchstart={() => onDown()}
    class={isMobile ? 'absolute z-10 flex justify-center w-full backdrop-blur' : ''}
    style="top: {$y}px;"
>
    <div 
    class="flex flex-col p-6 h-screen w-96 bg-neutral-900 rounded-md"
    >
        <a href="/" class="hidden md:inline-flex">
            <ArrowLeftIcon class="w-12 h-12" />
        </a>
        <div class="inline-flex md:hidden w-1/2 self-center h-1 bg-neutral-500 rounded-md" />
        <slot />
    </div>
</aside>