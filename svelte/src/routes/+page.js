// Author: Ondřej Hruboš (xhrubo01)
// File: page.js

import { APIURL } from "$lib/helper.js";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const response = await fetch(`${APIURL}/trips`);
	const trips = await response.json();
	return { trips: trips };
}
