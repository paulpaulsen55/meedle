<script lang="ts">
	import type { AddressAutofillSuggestionResponse } from '@mapbox/search-js-core';
	import pkg from '@mapbox/search-js-core';
	const { AddressAutofillCore } = pkg;

	import AddressSugestion from '$lib/AddressSugestion.svelte';

	export let location: string;
	export let sessionToken: string = '';

	let suggestions: AddressAutofillSuggestionResponse | null = null;

	const autofill = new AddressAutofillCore({
		accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
		language: 'de'
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
