<script lang="ts">
	import type {
		AddressAutofillCore,
		AddressAutofillSuggestionResponse
	} from '@mapbox/search-js-core';
	import AddressSugestion from '$lib/AddressSuggestion.svelte';
	import { onMount } from 'svelte';

	export let location: string;
	export let sessionToken: string = '';

	let suggestions: AddressAutofillSuggestionResponse | null = null;
	let autofill: AddressAutofillCore;

	onMount(async () => {
		const { AddressAutofillCore } = await import('@mapbox/search-js-core');
		autofill = new AddressAutofillCore({
			accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
			language: 'de'
		});
	});

	async function searchAutofill(location: string) {
		if (location.length < 3) return;
		suggestions = await autofill.suggest(location, { sessionToken });
	}
</script>

<div class="flex flex-col items-start justify-center relative">
	<input
		on:input={() => searchAutofill(location)}
		on:focusout={() => {
			setTimeout(() => {
				suggestions = null;
			}, 100);
		}}
		bind:value={location}
		type="text"
		id="location1"
		placeholder="address"
		class="input w-full"
	/>
	<AddressSugestion
		bind:autofill={suggestions}
		on:message={(event) => {
			location = event.detail.text;
		}}
	/>
</div>
