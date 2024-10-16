import { APIURL } from "$lib/helper.js";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const response = await fetch(`${APIURL}/trip/${params.tripId}`);
	const trip = await response.json();
	return { trip: trip };
}
