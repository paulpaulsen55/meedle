import { writable } from 'svelte/store';

export const locations = writable({
	location1: '',
	location2: '',
});
export const radius = writable(0)
export const poi = writable(0)
