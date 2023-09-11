<script lang="ts">
	import type { AddressAutofillSuggestionResponse } from '@mapbox/search-js-core';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	export let autofill: AddressAutofillSuggestionResponse | null = null;

    const dispatch = createEventDispatcher();

    function sendClick(text: string | undefined) {
        console.log(text);
        
        dispatch('message', {
			text: text
		});
    }
</script>

{#if autofill != null}
	<ul
		class="z-10 flex flex-col rounded-lg absolute top-0 mt-20 bg-white"
		transition:fly={{ duration: 150, y: -5 }}
	>
			{#each autofill.suggestions as suggestion}
				<button 
                    on:click={() => {sendClick(suggestion.place_name); console.log(suggestion.place_name)}}
                    class="relative cursor-pointer rounded-md py-4 hover:bg-magnum-100 transition"
                >
                    <span class="font-medium">{suggestion.address_line1}</span>
                    <span class="block text-sm opacity-75">{suggestion.place_name}</span>
				</button>
            {:else}
            <div class="relative cursor-pointer rounded-md py-2 hover:bg-magnum-100 transition">
				<div>
                </div>
            </div>
			{/each}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 absolute top-0 right-0 hover:text-red-600 cursor-pointer">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
	</ul>
{/if}
