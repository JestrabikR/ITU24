<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation'; 
	import { APIURL } from "$lib/helper.js";
	
	import Logo from "$lib/assets/logo.svg";

	export let view = false;

	export let currentlyEditing = false;
	export let editFunction = () => {};
	export let saveFunction = () => {};
	export let deleteFunction = () => {};
	export let tripName = "";

	export let error = false;
	let current = $page.url.pathname;

	async function newTrip() {

		const today = new Date();
		const tomorrow = new Date()
		tomorrow.setDate(today.getDate() + 1);

		const formattedDateToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
		const formattedDateTomorrow = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

		const emptyTrip = {
			name: "New Trip",
			from_date: formattedDateToday,
			until_date: formattedDateTomorrow,
			description: "",
			advantages: [],
			disadvantages: [],
			photos: [],
			subtrips: [],
			budget: 0
		};


		try {
			// Add the new trip
			const response = await fetch(`${APIURL}/trip/add`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(emptyTrip)
			});

			if (!response.ok) {
				throw new Error("Failed to create a new trip.");
			}

			// Fetch all trips to locate the new one
			const tripsResponse = await fetch(`${APIURL}/trips`);
			if (!tripsResponse.ok) {
				throw new Error("Failed to fetch trips.");
			}

			const trips = await tripsResponse.json();
			const newTrip = trips.at(-1); // Assuming the new trip is the last in the list

			if (!newTrip || !newTrip.id) {
				throw new Error("New trip ID not found.");
			}

			// Redirect to the new trip's page
			goto(`/trip/${newTrip.id}`);
		} catch (error) {
			console.error("Error creating new trip:", error);
			alert("There was an error creating a new trip. Please try again.");
		}
	}
</script>

<div class="space"></div>
<nav class="l m">
	<img class="circle" src={Logo} alt="Logo">
	<a href="/"><h3><b><span class:underline={current === '/' ? true : false}>Trips</span></b></h3></a>
	<a href="/visited"><h3><b><span class:underline={current === '/visited' ? true : false}>Visited</span></b></h3></a>
	<div class="absolute right">
	<button class="extend square round" on:click={newTrip}>
		<i>add</i>
		<span>New trip</span>
	</button>
	</div>
</nav>

<!-- small device version -->
<nav class="s right">
	<header>
		<img class="circle" src={Logo} alt="Logo">
	</header>
	<a href="/"><b><i>explore_nearby</i><span class:underline={current === '/' ? true : false}>Trips</span></b></a>
	<a href="/visited"><b><i>globe</i><span class:underline={current === '/visited' ? true : false}>Visited</span></b></a>
    <div class="max"></div>
	{#if !view && !error}
	<button class="square round extra">
		<i>add</i>
	</button>
	{:else if view}
		<button class="border square round extra" on:click={() => {ui("#delete-trip-confirm-sm")}}>
			<i class="extra error-text">delete</i>
		</button>
		<button class="border square round extra" on:click={() => goto("/")}>
			<i class="extra">apps</i>
		</button>
		{#if currentlyEditing }
		<button class="border square round extra" on:click={saveFunction}>
			<i class="extra secondary-text">save</i>
		</button>
		{:else}
		<button class="border square round extra" on:click={editFunction}>
			<i class="extra secondary-text">edit</i>
		</button>
		{/if}
	{:else if error}
		<a href="mailto:xhrubo01@fit.vutbr.cz?subject=Trip app - bug report" taget="_blank">
			<button class="border square round extra error">
				<i class="extra">bug_report</i>
			</button>
		</a>
	{/if}
</nav>
<div class="space"></div>

<div class="overlay blur" style="z-index: 1000000;"></div>
<dialog id="delete-trip-confirm-sm" style="z-index: 1000001;">
	<h3>Delete trip {tripName}?</h3>
	<p class="italic">Are you sure you want to delete trip <b>{tripName}</b>? This action cannot be taken back! All data belonging to this trip will be <b>permanently deleted</b>!</p>
	<div class="space"></div>
	<nav class="right-align no-space">
		<button class="transparent link" data-ui="#delete-trip-confirm-sm">Cancel</button>
		<button class="round error" data-ui="#delete-trip-confirm-sm" on:click={deleteFunction}>Delete permanently</button>
	</nav>
</dialog>
