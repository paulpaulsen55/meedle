<script lang="ts">
    import {ArrowLeftIcon} from "lucide-svelte";
    import {onMount} from "svelte";
    import {circInOut, linear} from "svelte/easing";
    import {tweened} from "svelte/motion";

    let isMobile = false;
    let width = 0, height = 0;
    let prevTouchY = 0;
    let moving = false;
    let y = tweened(50, {duration: 150, easing: circInOut});
    let positions = [50]

    export function setOpen(open: boolean) {
        if (!isMobile) return;

        if (open) y.set(50);
        else y.set(height - 100);
    }

    onMount(() => {
        // add the height of the aside to the positions array | onMount, because the height of the aside is not known before
        const min = height - 100;
        positions.push(min);
        y.set(min);
    })

    $ : isMobile = width <= 768;

    function onDown() {
        if (!isMobile) return;
        moving = true;
    }

    function onMove(e: MouseEvent | TouchEvent) {
        if (!isMobile) return;
        if (e instanceof MouseEvent) {
            if (moving && $y + e.movementY >= 50 && $y + e.movementY <= height - 100) {
                y.set($y + e.movementY, {duration: 0, easing: linear});
            }
        } else if (e instanceof TouchEvent) {
            const t = e.touches[0].pageY - prevTouchY;
            if (moving && $y + t >= 50 && $y + t <= height - 100) {
                y.set($y + t, {duration: 0, easing: linear});
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

<svelte:window bind:innerWidth={width} bind:innerHeight={height} on:mouseup={onUp} on:mousemove={onMove}
               on:touchmove={onMove} on:touchend={onUp}/>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#if (isMobile)}
    <aside
            class='absolute z-10 flex flex-col justify-center items-center w-full backdrop-blur'
            style="top: {$y}px;">
            <div class="flex justify-center w-96 h-6 dark:bg-slate-100 bg-neutral-900 rounded-t-md"
                 on:mousedown={() => onDown()}
                 on:touchstart={() => onDown()}>
                <div class="flex w-1/2 self-center h-1 bg-neutral-500 rounded-lg"/>
            </div>
            <div class="flex flex-col h-screen  w-96 dark:bg-slate-100 bg-neutral-900 px-6">
                <slot/>
            </div>
    </aside>
{:else}
    <aside
            style="top: {$y}px;"
    >
        <div class="flex flex-col h-screen w-96 dark:bg-slate-100 bg-neutral-900 rounded-md p-6">
            <a href="/" class="hidden md:inline-flex dark:text-black w-fit">
                <ArrowLeftIcon class="w-12 h-12"/>
            </a>
            <slot/>
        </div>
    </aside>
{/if}