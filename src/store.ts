import { writable } from 'svelte/store';
import type { Address, Coordinate } from './app';

const lol: Address = { title: '', address: '' };

export const locations = writable({
	location1: lol,
	location2: lol
});
export const radius = writable(5)
export const poi = writable(5)

const kek: Coordinate = { lat: 0, lng: 0 };
export const travelFrom = writable(kek)