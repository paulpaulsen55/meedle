import type { SearchBoxCategoryResponse } from '@mapbox/search-js-core';
import type { Coordinate } from '../../app';
import { poi, radius } from '../../store';
import type { Unsubscriber } from 'svelte/store';

export async function pointToCoordinates(location: String): Promise<Coordinate> {
	const response = await fetch(
		`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${
			import.meta.env.VITE_MAPBOX_TOKEN
		}`
	);
	const data = await response.json();

	return { lng: data.features[0].center[0], lat: data.features[0].center[1] };
}

export async function pointToFeatures(
	category: String,
	average: Coordinate
): Promise<SearchBoxCategoryResponse> {
	let rad = 0, pp = 0;
	const unsubscribeRad: Unsubscriber = radius.subscribe((value) => (rad = value));
	const unsubscribePoi: Unsubscriber = poi.subscribe((value) => (pp = value));

	const lat = rad * (360 / 40075);
	const lng = rad * (360 / (Math.cos(lat) * 40075));

	const response = await fetch(
		`https://api.mapbox.com/search/searchbox/v1/category/${category}?proximity=${average.lng},${average.lat}
		&origin=${average.lng},${average.lat}
		&limit=${pp}
		&bbox=${average.lng - lng},${average.lat - lat},${average.lng + lng},${average.lat + lat}
		&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
	);
	
	const feature = await response.json();
	return feature;
}