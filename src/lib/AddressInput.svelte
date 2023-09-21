<script lang="ts">
	import type {
		AddressAutofillCore,
		AddressAutofillSuggestionResponse
	} from '@mapbox/search-js-core';
	import { createCombobox, melt } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let location: string;
	export let sessionToken: string = '';

	let results: string[] = [];
	let suggestions: AddressAutofillSuggestionResponse | null = null;
	let autofill: AddressAutofillCore;

	const {
		elements: { menu, input, option },
		states: { open, inputValue }
	} = createCombobox({
		forceVisible: true
	});

	// set the input value to the location variable passed from the parent components
	inputValue.set(location);

	onMount(async () => {
		const { AddressAutofillCore } = await import('@mapbox/search-js-core');
		autofill = new AddressAutofillCore({
			accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
			language: 'de'
		});
	});

	async function searchAutofill() {
		if ($inputValue.value.length < 2) return;
		suggestions = await autofill.suggest($inputValue.value, { sessionToken });
		results = [];
		suggestions.suggestions.forEach((suggestion) => {
			const s = suggestion.address_line1!;
			results.push(s);
		});
	}

	onMount(() => {
		if (location != '') {
			searchAutofill();
		}
	});

	// reset results AND store the combobox value in the location variable to use it in the parent component
	$: {
		if ($inputValue.value.length < 2) {
			results = [];
		}
		location = $inputValue.value;
	}
</script>

<div class="relative">
	<input
		use:melt={$input}
		on:input={() => searchAutofill()}
		class="flex h-10 items-center justify-between rounded-lg bg-white px-3 text-black w-full"
		placeholder="Adresse eingeben" 
	/>	
</div>
{#if $open}
	<ul
		class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-md"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div class="flex max-h-full flex-col overflow-y-auto bg-white p-2 text-black" tabindex="0">
			{#each results as el}
				<li
					use:melt={$option({ value: el })}
					class="cursor-pointer scroll-my-2 rounded-md py-2 data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900"
				>
					<div class="pl-4">
						<span class="font-medium">{el}</span>
					</div>
				</li>
			{:else}
				<li class="relative cursor-pointer rounded-md py-2">Bitte gib mehr als 2 Zeichen ein.</li>
			{/each}
		</div>
	</ul>
{/if}
