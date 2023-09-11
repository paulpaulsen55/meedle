<script>
    export let rows = 3;
    export let sinFactor = 0.1;
    let innerWidth = 0;
    $: size = Math.floor((innerWidth / 50) * rows) + 2;
</script>

<svelte:window bind:innerWidth/>
<div class="text-neutral-500 flex flex-wrap justify-center gap-5 overflow-hidden">
    {#each Array(size) as i, k}
        <div class="fade" style="animation-delay: {Math.sin(k * sinFactor)}s;">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none"><path fill="#818181" d="M14 10h2v4h4v2h-4v4h-2v-4h-4v-2h4v-4Z"/></svg>
        </div>
    {/each}
</div>

<style>
    @keyframes fade {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
    .fade {
        animation: fade 3s ease-in-out infinite;
    }
</style>