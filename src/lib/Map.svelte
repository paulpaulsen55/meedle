<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import type { Coordinate, Feature } from '../app';

	export let middle: Coordinate, response: Feature[], locations: Array<Coordinate>;
	export let hoverdPointId:string|null;

	let mapElement: HTMLElement;
	let map: mapboxgl.Map | null = null;
	let accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
	let viewState = {
		zoom: 3,
		pitch: 0,
		bearing: 0
	};
	let locationMarkers: mapboxgl.Marker[] = [];

	let markers = new Map<string, mapboxgl.Marker>();
	const getStyle = () => {
		return `mapbox://styles/mapbox/${localStorage.theme === 'dark' ? 'dark' : 'light'}-v9`;
	};

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
			response.forEach((feature: Feature) => {
				let el = createCustomMarker(feature)

				let m = new mapboxgl.Marker(el).setLngLat(feature.coordinate);
				m.setPopup(new mapboxgl.Popup().setHTML(`<p class="text-black">${feature.name}</p>`));
				m.getElement().addEventListener('click',()=>onMarkerClick(feature.id))
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
			style: getStyle(),
			center: { lng: 10, lat: 51 },
			zoom: viewState.zoom,
			pitch: viewState.pitch,
			bearing: viewState.bearing
		});
		map.addControl(new mapboxgl.NavigationControl({ showZoom: true }));
		map.setCenter(middle);
	}

	function createCustomMarker(feature: Feature) {
		let el = document.createElement('div');
		el.style.background =  'url(/marker.svg) center center no-repeat'; // Replace with the path to your Maki icon
		el.style.backgroundSize = '25px';
		el.style.width = '45px';
		el.style.height = '45px';

		let img = document.createElement('img');
		img.setAttribute("src", '/icons/' + feature.maki + '.svg');
		img.style.margin = 'auto';
		img.style.marginTop = '17%'
		img.style.width = '33%';
		img.style.height = '33%';
		
		el.appendChild(img)

		return el	
	}
</script>

<div id="map" bind:this={mapElement} />

<style>
	#map {
		height: 100vh;
		width: calc(100vw - 24rem);
	}
</style>
