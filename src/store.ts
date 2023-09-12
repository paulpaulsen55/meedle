import { writable } from 'svelte/store';

export const locations = writable({
	location1: '',
	location2: ''
});

