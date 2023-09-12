import { SessionToken } from '@mapbox/search-js-core';

export async function load({ url, cookies }) {
	const token = cookies.get('session_token');
	if (!token) {
		const sessionToken = new SessionToken();
		cookies.set('session_token', sessionToken.id);
	}

	return {
		currentPath: url.pathname
	};
}
