import type { SearchBoxCategoryResponse } from '@mapbox/search-js-core';
import type { Address, Coordinate } from '../../app';

export async function pointToCoordinates(location: Address): Promise<Coordinate> {
	const response = await fetch(
		`https://api.mapbox.com/geocoding/v5/mapbox.places/${location.address}.json?access_token=${
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
	const response = await fetch(
		`https://api.mapbox.com/search/searchbox/v1/category/${category}?proximity=${average.lng},${
			average.lat
		}&origin=${average.lng},${average.lat}&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
	);
	const feature = await response.json();
	return feature;
}
