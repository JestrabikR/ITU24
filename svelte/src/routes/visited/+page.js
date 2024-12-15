// Author: Ondřej Hruboš (xhrubo01)
// File: trip/page.js

import { APIURL } from "$lib/helper.js";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const response_countries = await fetch(`${APIURL}/countries`);
	const countries = await response_countries.json();
	
	return { countries: countries };
}
