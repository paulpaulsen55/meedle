<script lang="ts">
	import { createDialog, melt } from "@melt-ui/svelte";
    import { Share2, Copy, Check, PartyPopper } from "lucide-svelte";
    import { Confetti } from "svelte-confetti"
	import { fade } from "svelte/transition";
    import { locations, poi, radius } from "../store";

    export let category: string[] = ["food_and_drink"];

    let link = '',
        copy = false;

    const {
		elements: { trigger, content, portalled, close },
		states: { open }
	} = createDialog({ role: 'alertdialog' });

    function copyLink(){
        copy = true;
        navigator.clipboard.writeText(link)
        setTimeout(() => {
            copy = false;
        }, 500);
    }

    $ : {
            if ($locations.location1 && $locations.location2 && $poi && $radius)
                link = window.location.host + "/map?r=" + $radius + "&p=" + $poi + "&a1=" + $locations.location1.address + "&a2=" + $locations.location2.address + "&t=" + category.join(",");
        }
</script>

<button class="bg-magnum-300 text-magnum-900 p-3 rounded-md" use:melt={$trigger}>
    <Share2 class="h-6 w-6" />     
</button>

<div use:melt={$portalled}>
	{#if $open}
		<div class="fixed inset-0 z-10 backdrop-blur" />
		<div class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw]
              max-w-[340px] translate-x-[-50%] translate-y-[-50%] rounded-md dark:bg-slate-50 bg-neutral-900
              p-6 shadow-lg"
			use:melt={$content}
		>
            <div class="flex justify-between items-center gap-2">
                <div class="absolute">
                    <Confetti colorArray={['#F7B155', '#FCE0AC', '#793A15']} cone x={[0, -1.25]} y={[0.25, 0.75]} />
                </div>
                <PartyPopper class="h-8 w-8 text-magnum-300 -rotate-90" />
                <p class="whitespace-nowrap">Teil den Link mit deiner Mutter</p>
                <PartyPopper class="h-8 w-8 text-magnum-300" />
                <div class="absolute right-6">
                    <Confetti colorArray={['#F7B155', '#FCE0AC', '#793A15']} cone x={[0, 1.25]} y={[0.25, 0.75]}/>
                </div>
            </div>
            <div class="flex justify-between mt-5">
                <input type="text" class="input bg-white" bind:value={link}/>
                <button class="relative" on:click={() => copyLink()}>
                        <div transition:fade={{duration: 100}} class="bg-neutral-800 p-2 rounded-md" >
                            <Copy />
                        </div>
                    {#if copy}
                        <div transition:fade={{duration: 100}} class="bg-neutral-800 p-2 rounded-md z-10 absolute top-0 left-0">
                            <Check class="text-green-600" />
                        </div>
                    {/if}
                </button>
            </div>
			<div class="mt-6 text-end">
				<button use:melt={$close} class="h-8 items-center justify-center rounded-[4px] dark:bg-slate-200 bg-neutral-100 px-4 font-medium text-neutral-700 dark:hover:bg-slate-300 hover:bg-neutral-200">
					Schließen
				</button>
			</div>
		</div>
	{/if}
</div>