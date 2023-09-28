<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import type { Coordinate, Feature } from '../app';
	import type {
		SearchBoxCategoryResponse,
		SearchBoxCategorySuggestion
	} from '@mapbox/search-js-core';

	export let middle: Coordinate, response: Feature[], locations: Array<Coordinate>;
	export let hoverdPointId:string|null;

	let mapElement: HTMLElement;
	let map: mapboxgl.Map | null = null;
	let accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
	let mapStyle = 'mapbox://styles/mapbox/dark-v9';
	let viewState = {
		zoom: 5,
		pitch: 0,
		bearing: 0
	};
	let locationMarkers: mapboxgl.Marker[] = [];

	let markers = new Map<string, mapboxgl.Marker>();

	$: if (map != null && middle && locations) {
		map.setCenter(middle);

		// add all peoples locations to the map
		locationMarkers.forEach((marker) => marker.remove());
		locationMarkers = [];
		locations.forEach((location) => {
			locationMarkers.push(new mapboxgl.Marker({ color: '#003DD0' }).setLngLat(location));
		});
		locationMarkers.forEach((marker) => marker.addTo(map!));
		const factor = 0.01;
		map.fitBounds([
			[locations[0].lng + factor, locations[0].lat - factor],
			[locations[1].lng - factor, locations[1].lat + factor]
		]);

		// add the features to the map
		if (response) {
			markers.forEach((marker) => marker.remove());
			markers.clear();
			response.forEach((feature: any) => {
				let m = new mapboxgl.Marker({ color: '#F38D1C' }).setLngLat(feature.coordinate);
				m.setPopup(new mapboxgl.Popup().setHTML(`<p class="text-black">${feature.name}</p>`));
				m.getElement().addEventListener('click',()=>onMarkerClick(feature.properties.mapbox_id))
				markers.set(feature.id, m);
			});
			markers.forEach((marker) => marker.addTo(map!));
		}
	}


    function onMarkerClick(id:string){
        hoverdPointId = id;
    }

    $:{
        markers.forEach((value) => {
            if (value.getPopup().isOpen()) {
                value.togglePopup();
            }
        });
        if (hoverdPointId != null){
            markers.get(hoverdPointId)?.togglePopup();
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
			center: { lng: 10, lat: 51 },
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
