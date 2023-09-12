// used for page transitions
export async function load({ url }) {
	return {
		currentPath: url.pathname
	};
}
