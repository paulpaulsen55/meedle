import pkg from '@mapbox/search-js-core';
const { SessionToken } = pkg;

export async function load({ url, cookies }) {
	const token = cookies.get('session_token');
	if (!token) {
		const sessionToken = new SessionToken();
		cookies.set('session_token', sessionToken.id);
	}

	return {
		currentPath: url.pathname,
		sessionToken: cookies.get('session_token'),
	};
}
