<script lang="ts">
	import { ArrowLeftIcon } from "lucide-svelte";
	import { onMount } from "svelte";
	import { circInOut, linear } from "svelte/easing";
	import { tweened } from "svelte/motion";

    const styles = ['', 'absolute bg-neutral-900 z-10 border-2 border-red-500']
    let width = 0, height = 0;
    let styleIndex = 0;
    let moving = false;
    let y = tweened(50, { duration: 150, easing: circInOut });
    let positions = [50]

    onMount(()  => {
        // add the height of the aside to the positions array | onMount, because the height of the aside is not known before
        positions.push(height - 100)
    })
    
    // TODO: replace with tailwind breakpoints css
    $ : if (width <= 768) { // tailwind breakpoint md
            styleIndex = 1
        } else {
            styleIndex = 0
        }

    function onMouseDown(e: MouseEvent) {
        moving = true;
    }

    function onMouseMove(e: MouseEvent) {

		if (moving && $y + e.movementY >= 50 && $y + e.movementY <= height - 100) {
            y.set($y + e.movementY, { duration: 0 , easing: linear})
		}
	}
	
	function onMouseUp() {
        moving = false;
        y.set(positions.reduce((prev, curr) => {
            return (Math.abs(curr - $y) < Math.abs(prev - $y) ? curr : prev);
        }));
	}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<aside 
    on:mousedown={(e) => onMouseDown(e)}
    class={styles[styleIndex]}
    style="top: {$y}px;"
>
    <div 
    class="flex flex-col p-6 h-screen w-96"
    >
        <a href="/" class="hidden md:inline-flex">
            <ArrowLeftIcon class="w-12 h-12" />
        </a>
        <hr class="inline-flex md:hidden">
        <slot />
    </div>
</aside>