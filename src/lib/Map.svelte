<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';

	export let lat: number, long: number;

	$: if (map) {
		map.setCenter([long, lat]);
		marker.setLngLat([long, lat]);
		map.setStyle(getStyleMode());
	}

	const getStyleMode = () => {
		return `mapbox://styles/mapbox/${localStorage.theme === 'dark' ? 'dark' : 'light'}-v9`;
	};

	let mapElement: HTMLElement;
	let map: mapboxgl.Map | null = null;
	let accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
	let mapStyle = getStyleMode();
	let viewState = {
		zoom: 2,
		pitch: 0,
		bearing: 0
	};
	let marker =  new mapboxgl.Marker({ color: '#FF0000' }).setLngLat([long, lat]);
	marker.setPopup(new mapboxgl.Popup().setHTML(`<h1>${lat}, ${long}</h1>`));

	onMount(() => {
		createMap();
	});

	function createMap() {
		map = new mapboxgl.Map({
			accessToken: accessToken,
			container: mapElement,
			interactive: true,
			style: mapStyle,
			center: [lat, long],
			zoom: viewState.zoom,
			pitch: viewState.pitch,
			bearing: viewState.bearing
		});
		map.addControl(new mapboxgl.NavigationControl({ showZoom: true }));
		marker.addTo(map);
		
	}
</script>

<div id="map" bind:this={mapElement} />

<style>
	#map {
		height: 30rem;
		width: 30rem;
	}
</style>
