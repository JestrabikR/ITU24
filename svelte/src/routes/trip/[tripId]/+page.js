// Author: Ondřej Hruboš (xhrubo01)
// File: trip/page.js

import { APIURL } from "$lib/helper.js";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const response_trip = await fetch(`${APIURL}/trip/${params.tripId}`);
	const trip = await response_trip.json();
	
	return { trip: trip };
}
