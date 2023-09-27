import type { SearchBoxCategoryResponse } from '@mapbox/search-js-core';
import type { Coordinate, Feature, FeatureCollection } from '../../app';

function test(test: any, categories: string[]) {
	let matches: Feature[] = [];

	//foreach loops do not work here @Johannes
	for (let i = 0; i <= test.length - 1; i++) {
		for (let j = 0; j <= test[i].features.length - 1; j++) {
			const f = test[i].features[j];
		
			if(categories.every( ai => f.properties.poi_category_ids.includes(ai))) {
				matches.push({name: f.properties.name, categories: f.properties.poi_category, address: f.properties.address, coordinate: {lng: f.geometry.coordinates[0], lat: f.geometry.coordinates[1]}, id: f.properties.mapbox_id, metadata: f.properties.metadata, maki: f.properties.maki})
			}
		}
	}

	console.log(matches);

	return test[0]
}

export async function pointToCoordinates(location: string): Promise<Coordinate> {
	const response = await fetch(
		`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${
			import.meta.env.VITE_MAPBOX_TOKEN
		}`
	);
	const data = await response.json();

	return { lng: data.features[0].center[0], lat: data.features[0].center[1] };
}

export async function pointToFeatures(
	categories: string[],
	average: Coordinate
): Promise<SearchBoxCategoryResponse> {
	let res: SearchBoxCategoryResponse[] = [];
	
	for (let i = 0; i < categories.length; i++) {
		const r = await fetch(
			`https://api.mapbox.com/search/searchbox/v1/category/${categories[i]}?proximity=${average.lng},${
				average.lat
			}&origin=${average.lng},${average.lat}&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
		);
		res.push(await r.json());
	}
		
	console.log("f",res);
	
	const feature = test(res, categories);
	return feature;
}
