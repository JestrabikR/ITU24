const APIURL = "http://127.0.0.1:5000";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const response = await fetch(`${APIURL}/trips`);
	const trips = await response.json();
	return { trips: trips };
}
