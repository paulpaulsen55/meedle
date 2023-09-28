import { writable } from 'svelte/store';
import type { Address } from './app';

const lol: Address = { title: '', address: '' };

export const locations = writable({
	location1: lol,
	location2: lol
});
export const radius = writable(0)
export const poi = writable(0)
