<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';

	export let lat: number, long: number, feature: any = {}, orgPositions: any = {};
	let featureArray: mapboxgl.Marker[] = [];

	$: if (map != null) {
		map.setCenter([long, lat]);
		map.setZoom(5);
		marker.setLngLat([long, lat]);
		map.setStyle(getStyle());

		if (feature.features) {
			featureArray.forEach((marker) => marker.remove());
			featureArray = [];
			feature.features.forEach((feature: any) => {
				let m = new mapboxgl.Marker({ color: '#030ffc' }).setLngLat(feature.geometry.coordinates)
				m.setPopup(new mapboxgl.Popup().setHTML(`<h1>${lat}, ${long}</h1><h2>${feature.properties.name}</h2>`));
				featureArray.push(m);
			});
			featureArray.forEach((marker) => marker.addTo(map!));
		}
	}

	const getStyle = () => {
		return `mapbox://styles/mapbox/${localStorage.theme === 'dark' ? 'dark' : 'light'}-v9`;
	};

	let mapElement: HTMLElement;
	let map: mapboxgl.Map | null = null;
	let accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
	let mapStyle = getStyle();
	let viewState = {
		zoom: 5,
		pitch: 0,
		bearing: 0
	};
	let marker =  new mapboxgl.Marker({ color: '#FF0000' }).setLngLat([long, lat]);
	marker.setPopup(new mapboxgl.Popup().setHTML(`<h1>${lat}, ${long}</h1>`));

	let markerPos1 =  new mapboxgl.Marker({ color: '#9900ff' }).setLngLat([orgPositions.long1, orgPositions.lat1]);
	let markerPos2 =  new mapboxgl.Marker({ color: '#9900ff' }).setLngLat([orgPositions.long2, orgPositions.lat2]);

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
		markerPos1.addTo(map);
		markerPos2.addTo(map);	
	}
</script>

<div class="grid grid-flow-col">
	<div id="map" bind:this={mapElement} />
	<div>
		{#if feature.features}
			{#each feature.features as f}
				<p class="dark:text-white">{f.properties.name}</p>
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
