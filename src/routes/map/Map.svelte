<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import type { Coordinate } from '../../app';
	import type { SearchBoxCategoryResponse } from '@mapbox/search-js-core';

	export let middle: Coordinate, feat: SearchBoxCategoryResponse, locations: Array<Coordinate>;
	let featureMarkers: mapboxgl.Marker[] = [];
	let locationMarkers: mapboxgl.Marker[] = [];

	$: if (map != null) {
		map.setCenter(middle);
		map.setZoom(5);
		marker.setLngLat(middle);

		// add all peoples locations to the map
		locationMarkers.forEach((marker) => marker.remove());
		locationMarkers = [];
		locations.forEach((location) => {
			locationMarkers.push(new mapboxgl.Marker({ color: '#9900ff' }).setLngLat(location));
		});
		locationMarkers.forEach((marker) => marker.addTo(map!));

		// add the features to the map
		if (feat) {
			featureMarkers.forEach((marker) => marker.remove());
			featureMarkers = [];
			feat.features.forEach((feature: any) => {
				let m = new mapboxgl.Marker({ color: '#030ffc' }).setLngLat(feature.geometry.coordinates);
				m.setPopup(new mapboxgl.Popup().setHTML(`<p>${feature.properties.name}</p>`));
				featureMarkers.push(m);
			});
			featureMarkers.forEach((marker) => marker.addTo(map!));
		}
	}

	let mapElement: HTMLElement;
	let map: mapboxgl.Map | null = null;
	let accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
	let mapStyle = 'mapbox://styles/mapbox/dark-v9';
	let viewState = {
		zoom: 5,
		pitch: 0,
		bearing: 0
	};
	let marker = new mapboxgl.Marker({ color: '#FF0000' }).setLngLat(middle);
	marker.setPopup(new mapboxgl.Popup().setHTML(`<h1>${middle}</h1>`));

	onMount(() => {
		createMap();
	});

	function createMap() {
		map = new mapboxgl.Map({
			accessToken: accessToken,
			container: mapElement,
			interactive: true,
			style: mapStyle,
			center: middle,
			zoom: viewState.zoom,
			pitch: viewState.pitch,
			bearing: viewState.bearing
		});
		map.addControl(new mapboxgl.NavigationControl({ showZoom: true }));
		marker.addTo(map);
	}
</script>

<div class="grid grid-flow-col">
	<div id="map" bind:this={mapElement} />
	<div>
		{#if feat}
			{#each feat.features as f}
				<p class="text-white">{f.properties.name}</p>
			{/each}
		{/if}
	</div>
</div>

<style>
	#map {
		height: 30rem;
		width: 30rem;
	}
</style>
