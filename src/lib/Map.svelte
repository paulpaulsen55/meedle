<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import type { Coordinate } from '../app';
	import type { SearchBoxCategoryResponse } from '@mapbox/search-js-core';

	export let middle: Coordinate, response: SearchBoxCategoryResponse, locations: Array<Coordinate>;

	let mapElement: HTMLElement;
	let map: mapboxgl.Map | null = null;
	let accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
	let mapStyle = 'mapbox://styles/mapbox/dark-v9';
	let viewState = {
		zoom: 5,
		pitch: 0,
		bearing: 0
	};
	let featureMarkers: mapboxgl.Marker[] = [];
	let locationMarkers: mapboxgl.Marker[] = [];
	
	$: if (map != null) {
		// add all peoples locations to the map
		locationMarkers.forEach((marker) => marker.remove());
		locationMarkers = [];
		locations.forEach((location) => {
			locationMarkers.push(new mapboxgl.Marker({ color: '#003DD0' }).setLngLat(location));
		});
		locationMarkers.forEach((marker) => marker.addTo(map!));
		const factor = 0.01;
		map.fitBounds([
			[ locations[0].lng+factor, locations[0].lat-factor ],
			[ locations[1].lng-factor, locations[1].lat+factor ]
		]);

		// add the features to the map
		if (response) {
			featureMarkers.forEach((marker) => marker.remove());
			featureMarkers = [];
			response.features.forEach((feature: any) => {
				let m = new mapboxgl.Marker({ color: '#F38D1C' }).setLngLat(feature.geometry.coordinates);
				m.setPopup(new mapboxgl.Popup().setHTML(`<p>${feature.properties.name}</p>`));
				featureMarkers.push(m);
			});
			featureMarkers.forEach((marker) => marker.addTo(map!));
		}
	}


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
		map.setCenter(middle);
	}
</script>

<div id="map" bind:this={mapElement} />

<style>
	#map {
		height: 100vh;
		width: calc(100vw - 24rem);
	}
</style>
