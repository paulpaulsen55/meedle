<script lang="ts">
    import {ArrowLeftIcon} from "lucide-svelte";
    import {onMount, SvelteComponent} from "svelte";
    import {circInOut, linear} from "svelte/easing";
    import {tweened} from "svelte/motion";
    import type {CupertinoSettings} from 'cupertino-pane';
    import {CupertinoPane} from 'cupertino-pane';


    let isMobile = false,
        width = 0,
        height = 0,
        prevTouchY = 0,
        moving = false,
        y = tweened(50, {duration: 150, easing: circInOut}),
        positions = [50],
        mobilePane: CupertinoPane | undefined = undefined,
        paneDiv: SvelteComponent | null;

    $:console.log(paneDiv);

    export function setOpen(open: boolean) {
        if (!isMobile) return;

        if (open) y.set(50);
        else y.set(height - 100);
    }


    $: width, handleWith()

    function handleWith() {
        console.log(width);

        if (width > 0) {
            isMobile = width <= 768;
        }

        if (isMobile) {
            showPane();
        } else {
            if (mobilePane != undefined) {
                mobilePane.destroy();
                mobilePane = undefined;
            }
        }
    }


    async function showPane() {
        await (paneDiv != null);

        let paneSettings: CupertinoSettings = {
            buttonDestroy: false,
            backdrop: true
        };

        mobilePane = new CupertinoPane('.cupertino-pane', paneSettings);

        await mobilePane.present({animate: true});
    }


</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height}/>


{#if isMobile}
    <div class="cupertino-pane flex flex-col p-6 h-screen w-96 dark:bg-slate-100 bg-neutral-900 rounded-md"
         bind:this={paneDiv}>
            <a href="/" class="hidden md:inline-flex dark:text-black w-fit">
                <ArrowLeftIcon class="w-12 h-12"/>
            </a>
            <slot/>
        </div>
{:else}
    <div class="content flex flex-col p-6 h-screen w-96 dark:bg-slate-100 bg-neutral-900 rounded-md">
        <a href="/" class="hidden md:inline-flex dark:text-black w-fit">
            <ArrowLeftIcon class="w-12 h-12"/>
        </a>
        <slot/>
    </div>
{/if}
