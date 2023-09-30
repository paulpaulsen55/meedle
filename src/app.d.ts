// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}
export {};

export type Coordinate = {
	lng: number;
	lat: number;
};

export type Address = {
	title: string;
	address: string;
};
export type Feature = {
	categories: string[],
	name: string,
	address: string,
	coordinate: Coordinate
	id: string,
	metadata?: any,
	maki?: string,
	isMatch: boolean
}
