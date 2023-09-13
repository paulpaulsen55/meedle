<script lang="ts">
	import { SessionToken, AddressAutofillCore } from '@mapbox/search-js-core';
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
	<label for="location1" class="input-label" data-melt-part="root">
		<span>Location 1</span>
	</label>
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
		class="input"
	/>
	<AddressSugestion
		bind:autofill={suggestions}
		on:message={(event) => {
			location = event.detail.text;
		}}
	/>
</div>
