<script lang="ts">
	import type { AddressAutofillCore, AddressAutofillSuggestionResponse } from '@mapbox/search-js-core';
	import { createCombobox, melt } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';
	import type { AutocompleteElement } from '../app';
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';

	export let location: string;
	export let sessionToken: string = '';

	const {
		elements: { menu, input, option },
		states: { open, inputValue }
	} = createCombobox({
		forceVisible: true
	});

	let results: AutocompleteElement[] = [];
	let suggestions: AddressAutofillSuggestionResponse | null = null;
	let autofill: AddressAutofillCore;


	onMount(async() => {
		const {AddressAutofillCore} = (await import('@mapbox/search-js-core'));
		autofill = new AddressAutofillCore({
			accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
			language: 'de'
		});
	});
	

	onMount(() => {
		inputValue.set(location);
	});

	async function searchAutofill() {
		if ($inputValue.value.length < 2) return;
		suggestions = await autofill.suggest($inputValue.value, { sessionToken });
		results = [];
		suggestions.suggestions.forEach((suggestion) => {
			results.push({
				title: suggestion.feature_name,
				adress: suggestion.full_address
			});
		});
	}

	$: location = $inputValue.value;
</script>

<div class="relative">
	<input
		use:melt={$input}
		on:input={() => searchAutofill()}
		class="flex h-10 items-center justify-between rounded-lg bg-white px-3 pr-12 text-black w-full"
		placeholder="Adresse eingeben"
	/>
	<div class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-black">
		{#if $open}
			<Icon name="chevronDown" />
		{:else}
			<Icon name="chevronUp" />
		{/if}
	</div>
</div>
{#if $open}
	<ul
		class="z-10 flex max-h-[300px] flex-col overflow-hidden"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div class="flex max-h-full flex-col overflow-y-auto bg-white p-2 text-black" tabindex="0">
			{#each results as el, index (index)}
				<li
					use:melt={$option({
						value: el.adress
					})}
					class="cursor-pointer scroll-my-2 rounded-md py-2 data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900"
				>
					<div class="pl-4">
						<span class="font-medium">{el.title}</span>
						<span class="block text-sm opacity-75">{el.adress}</span>
					</div>
				</li>
			{:else}
				<li class="relative cursor-pointer rounded-md py-2">Bitte gib mehr als 2 Zeichen ein.</li>
			{/each}
		</div>
	</ul>
{/if}
