<script lang="ts">
	import type {
		AddressAutofillCore,
		AddressAutofillSuggestionResponse
	} from '@mapbox/search-js-core';
	import { createCombobox, melt } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import type { Address } from '../app';

	export let location: Address = { title: '', address: '' };
	export let sessionToken: string = '';

	let results: Address[] = [];
	let suggestions: AddressAutofillSuggestionResponse | null = null;
	let autofill: AddressAutofillCore;

	const {
		elements: { menu, input, option },
		states: { open, inputValue, selected }
	} = createCombobox({
		forceVisible: true
	});

	// set the input value to the location variable passed from the parent components
	inputValue.set(location.title);

	onMount(async () => {
		const { AddressAutofillCore } = await import('@mapbox/search-js-core');
		autofill = new AddressAutofillCore({
			accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
			language: 'de'
		});

		if (location.address != '') {
			searchAutofill(location.title).then(() => {
				const option = results.find((result) => result.address === location.address);
				if (option) selected.set({ label: option.title, value: option.address });
			});
		}
	});

	async function searchAutofill(term: string = '') {
		if ($inputValue.value &&  $inputValue.value.length < 2) return;
		term = $inputValue.value ?? term;
		suggestions = await autofill.suggest(term, { sessionToken });
		results = [];
		suggestions.suggestions.forEach((suggestion) => {
			const title = suggestion.address_line1!;
			const address = suggestion.full_address!;
			results.push({ title, address });
		});
	}

	// reset results AND store the combobox value in the location variable to use it in the parent component
	$ : {
		if ($inputValue.value) {
			if ($inputValue.value.length < 2) {
				results = [];
			}
			location.title = $inputValue.value;
			location.address = results.find((result) => result.title == $inputValue.value)?.address ?? location.address;
		}
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
			{#each results as address}
				<li
					use:melt={$option({ value: address.address, label: address.title })}
					class="cursor-pointer scroll-my-2 rounded-md py-2 data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900"
				>
					<div class="pl-4">
						<p class="font-medium">{address.title}</p>
						<p class="font-medium text-neutral-600 text-sm truncate">{address.address}</p>
					</div>
				</li>
			{:else}
				<li class="relative cursor-pointer rounded-md py-2">Bitte gib mehr als 2 Zeichen ein.</li>
			{/each}
		</div>
	</ul>
{/if}
