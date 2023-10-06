import type { SearchBoxCategoryResponse } from '@mapbox/search-js-core';
import type { Address, Coordinate, Feature, TravelTimes } from '../../app';
import { poi, radius } from '../../store';
import type { Unsubscriber } from 'svelte/store';

function filterFeatures(reponses: any, categories: string[]) {
	let pp = 0;
	const unsubscribePoi: Unsubscriber = poi.subscribe((value: number) => (pp = value));

	let results: Feature[] = [];

	//foreach loops do not work here @Johannes
	for (let i = 0; i <= reponses.length - 1; i++) {
		for (let j = 0; j <= reponses[i].features.length - 1; j++) {
			const f = reponses[i].features[j];

			if (
				results.length < pp &&
				categories.every((ai) => f.properties.poi_category_ids.includes(ai))
			) {
				results.push({
					name: f.properties.name,
					categories: f.properties.poi_category,
					address: f.properties.full_address,
					coordinate: { lng: f.geometry.coordinates[0], lat: f.geometry.coordinates[1] },
					id: f.properties.mapbox_id,
					metadata: f.properties.metadata,
					maki: f.properties.maki,
					isMatch: true
				});
			}
		}
	}

	const remaining = pp - results.length;
	let full = pp;

	outer: for (let i = 0; i <= reponses.length - 1; i++) {
		let inner = remaining;
		for (let j = 0; j <= reponses[i].features.length - 1; j++) {
			if (full < 1) break outer;
			if (inner < 1) break;

			const f = reponses[i].features[j];
			const inList = results.filter((e) => e.id === f.properties.mapbox_id).length > 0;
			if (results.length < pp && !inList)
				results.push({
					name: f.properties.name,
					categories: f.properties.poi_category,
					address: f.properties.full_address,
					coordinate: { lng: f.geometry.coordinates[0], lat: f.geometry.coordinates[1] },
					id: f.properties.mapbox_id,
					metadata: f.properties.metadata,
					maki: f.properties.maki,
					isMatch: false
				});
			full--;
			inner--;
		}
	}
	return results;
}

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
	categories: string[],
	average: Coordinate
): Promise<Feature[]> {
	let rad = 0,
		pp = 0;
	const unsubscribeRad: Unsubscriber = radius.subscribe((value) => (rad = value));
	const unsubscribePoi: Unsubscriber = poi.subscribe((value) => (pp = value));

	const lat = rad * (360 / 40075);
	const lng = rad * (360 / (Math.cos(lat) * 40075));

	let res: SearchBoxCategoryResponse[] = [];

	for (let i = 0; i < categories.length; i++) {
		const r = await fetch(
			`https://api.mapbox.com/search/searchbox/v1/category/${categories[i]}?proximity=${
				average.lng
			},${average.lat}
			&origin=${average.lng},${average.lat}
			&limit=${pp}
			&bbox=${average.lng - lng},${average.lat - lat},${average.lng + lng},${average.lat + lat}
			&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
		);
		res.push(await r.json());
	}
	const feature = filterFeatures(res, categories);
	return feature;
}

export async function getTravelTimes(from: Coordinate, to: Coordinate): Promise<TravelTimes> {
	let durations = { driving: 0, walking: 0, cycling: 0, distance: 0 };

	const drivingRes = await fetch(
		`https://api.mapbox.com/directions/v5/mapbox/driving/${from.lng},${from.lat};${to.lng},${
			to.lat
		}?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
	);
	const drivingData = await drivingRes.json();

	durations.driving = Math.floor(drivingData.routes[0].duration / 60);
	durations.distance = Math.floor(drivingData.routes[0].distance / 1000);

	const cyclingRes = await fetch(
		`https://api.mapbox.com/directions/v5/mapbox/cycling/${from.lng},${from.lat};${to.lng},${
			to.lat
		}?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
	);
	const cyclingData = await cyclingRes.json();
	durations.cycling = Math.floor(cyclingData.routes[0].duration / 60);

	const walkingRes = await fetch(
		`https://api.mapbox.com/directions/v5/mapbox/walking/${from.lng},${from.lat};${to.lng},${
			to.lat
		}?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
	);
	const walkingData = await walkingRes.json();
	durations.walking = Math.floor(walkingData.routes[0].duration / 60);

	return durations;
}
