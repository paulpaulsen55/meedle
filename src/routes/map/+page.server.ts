export async function load({ cookies }) {
	return { sessionToken: cookies.get('session_token') };
}
