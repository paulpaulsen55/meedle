<script lang="ts">
    import {createSwitch, melt} from '@melt-ui/svelte';

    export let changeZone: boolean;

    const {
        elements: {root, input},
        states: {checked}
    } = createSwitch();

    checked.subscribe(value => changeZone = value);

    $:checked.set(changeZone);

</script>
<div class="flex justify-center">
    <div class="flex items-center">
        <span
                class="pr-4 leading-none dark:text-black text-white"
        >
            Radius Anzeigen
        </span>
        <button
                use:melt={$root}
                class="relative h-6 cursor-default rounded-full dark:bg-slate-400 bg-neutral-500 transition-colors data-[state=checked]:bg-magnum-400 dark:data-[state=checked]:bg-magnum-400"

        >
            <span class="thumb block rounded-full bg-white transition"/>
        </button>
        <input use:melt={$input}/>
    </div>
</div>

<style>
    button {
        --w: 2.75rem;
        --padding: 0.125rem;
        width: var(--w);
    }

    .thumb {
        --size: 1.25rem;
        width: var(--size);
        height: var(--size);
        transform: translateX(var(--padding));
    }

    :global([data-state='checked']) .thumb {
        transform: translateX(calc(var(--w) - var(--size) - var(--padding)));
    }
</style>