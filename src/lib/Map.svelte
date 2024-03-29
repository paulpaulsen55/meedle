<script lang="ts">
    import {onMount} from 'svelte';
    import mapboxgl, {GeoJSONSource, MapMouseEvent} from 'mapbox-gl';
    import type {Coordinate, Feature} from '../app';
    import ThemeSwitch from '$lib/ThemeSwitch.svelte';
    import {radius as r} from '../store';
    import {createEventDispatcher} from 'svelte';
    import {CircleDotDashed} from 'lucide-svelte';
    import {CircleDot} from 'lucide-svelte';

    const dispatch = createEventDispatcher();

    export let
        locations: Array<Coordinate> | undefined,
        middle: Coordinate | undefined,
        response: Feature[] | undefined,
        hoverdPointId: string | null;

    let mapElement: HTMLElement;
    let map: mapboxgl.Map | undefined = undefined;
    let accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    let viewState = {
        zoom: 14,
        pitch: 0,
        bearing: 0,
    };
    let locationMarkers: mapboxgl.Marker[] = [];
    let changeZone: boolean = false;
    let markers = new Map<string, mapboxgl.Marker>();

    let canvas: any;

    let geojson: any = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [0, 0]
                }
            }
        ]
    };

    $: changeZone, zoneHandling();


    function getCircleRadius(meters: number, lat: number) {
        const metersToPixelsAtMaxZoom = (meters: number, latitude: number) =>
            meters / 0.019 / Math.cos(latitude * Math.PI / 180);

        return {
            stops: [
                [0, 0],
                [22, metersToPixelsAtMaxZoom(meters, lat)]
            ],
            base: 2

        };
    }

    function zoneHandling() {
        if (map != null) {
            if (map.getLayer('point') != undefined) {
                map.removeLayer('point');
            }

            if (map.getLayer('visualiseRadius') != undefined) {
                map.removeLayer('visualiseRadius');
            }

            if (map.getSource('point') != undefined) {
                map.removeSource('point');

            }
            if (changeZone && middle != undefined) {
                canvas = map.getCanvasContainer();

                geojson.features[0].geometry.coordinates = [middle.lng, middle.lat];

                map.addSource('point', {
                    type: 'geojson',
                    data: geojson,
                });


                map.addLayer({
                    'id': 'visualiseRadius',
                    'type': 'circle',
                    'source': 'point',
                    'paint': {
                        "circle-radius": getCircleRadius($r * 1000, middle.lat),
                        "circle-opacity": 0,
                        "circle-stroke-width": 1,
                        "circle-stroke-color": '#F84C4C',
                    }
                });

                map.addLayer({
                    'id': 'point',
                    'type': 'circle',
                    'source': 'point',
                    'paint': {
                        "circle-radius": getCircleRadius(100, middle.lat),
                        'circle-color': '#f9c978', // red color
                        "circle-opacity": 0.50,

                    }
                });
            }
        }
    }

    function mapHandling() {
        if (map != undefined && middle != undefined && locations != undefined) {

            zoneHandling();

            // add all peoples locations to the map
            locationMarkers.forEach((marker) => marker.remove());
            locationMarkers = [];
            locations.forEach((location) => {
                locationMarkers.push(new mapboxgl.Marker({color: '#003DD0'}).setLngLat(location));
            });
            locationMarkers.forEach((marker) => marker.addTo(map!));

            if (!changeZone) {
                map.fitBounds([
                    [locations[0].lng, locations[0].lat],
                    [locations[1].lng, locations[1].lat]
                ]);
            }

            // add the features to the map
            if (response) {
                markers.forEach((marker) => marker.remove());
                markers.clear();
                response.forEach((feature: Feature) => {
                    let customMarker = createCustomMarker(feature)
                    let marker = new mapboxgl.Marker(customMarker).setLngLat(feature.coordinate);
                    marker.setPopup(new mapboxgl.Popup().setHTML(`<p class="text-black">${feature.name}</p>`));
                    marker.getElement().addEventListener('click', () => onMarkerClick(feature.id))
                    markers.set(feature.id, marker);
                });
                markers.forEach((marker) => marker.addTo(map!));
            }
        }
    }

    $: middle, locations, response, mapHandling();

    function onMarkerClick(id: string) {
        hoverdPointId = id;
    }

    $:{
        markers.forEach((value) => {
            if (value.getPopup().isOpen()) {
                value.togglePopup();
            }
        });
        if (hoverdPointId != null) {
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
            center: {lat:54.00496795053566,   lng: 10.722615376824443},
            zoom: viewState.zoom,
            pitch: viewState.pitch,
            bearing: viewState.bearing,

        });

        map.addControl(new mapboxgl.NavigationControl({showZoom: true}));

        map.on('mouseenter', 'point', () => {
            map?.setPaintProperty('point', 'circle-color', '#fce0ac');
            canvas.style.cursor = 'move';
        });

        map.on('mouseleave', 'point', () => {
            map?.setPaintProperty('point', 'circle-color', '#f9c978');
            canvas.style.cursor = '';
        });

        map.on('mousedown', 'point', (e) => {
            e.preventDefault();

            canvas.style.cursor = 'grab';

            map?.on('mousemove', onMove);
            map?.once('mouseup', onUp);
        });

        map.on('touchstart', 'point', (e) => {
            if (e.points.length !== 1) return;

            e.preventDefault();

            map?.on('touchmove', onMove);
            map?.once('touchend', onUp);
        });
        if (locations != undefined) {

        }
    }

    function changeStyle() {
        if (map != undefined) {
            changeZone = false;
            zoneHandling();
            map.setStyle(getStyle());
        }
    }

    function onMove(e: MapMouseEvent) {

        const coords = e.lngLat;

        canvas.style.cursor = 'grabbing';

        geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];

        if (map != null) {
            let tmp: GeoJSONSource = <GeoJSONSource>map.getSource('point');
            tmp.setData(geojson);
        }
    }

    function onUp(e: MapMouseEvent) {
        const coords: Coordinate = e.lngLat;

        //Request an Mapbox
        dispatch('newMiddle', coords);

        canvas.style.cursor = '';

        map?.off('mousemove', onMove);
        map?.off('touchmove', onMove);
    }

    const getStyle = () => {
        return `mapbox://styles/mapbox/${localStorage.theme === 'dark' ? 'light' : 'dark'}-v9`;
    };

    function createCustomMarker(feature: Feature) {
        let el = document.createElement('div');
        el.style.background = 'url(/marker.svg) center center no-repeat'; // Replace with the path to your Maki icon
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

<div class="h-screen w-full md:w-[calc(100vw - 24rem)]" id="map" bind:this={mapElement}/>
<div class="svg-container absolute md:bottom-[4.5rem] bottom-52 right-2 z-0  " on:click={()=> changeZone = !changeZone}>
    {#if changeZone}
        <CircleDotDashed class="h-8 w-8 dark:text-black"/>
    {:else}
        <CircleDot class="h-8 w-8 dark:text-black"/>
    {/if}
</div>
<button on:click={() => changeStyle()} class="absolute bottom-40 md:bottom-6 right-2 z-0">
    <ThemeSwitch/>
</button>

<style>
    .svg-container {
        @apply cursor-pointer;
    }
</style>