<script>
	import Navbar from "@components/Navbar.svelte";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { APIURL } from "$lib/helper.js";

	const tripId = $page.params.tripId;
	
	export var data;
	var defaultTrip = { ...data.trip }; // create copy

	var todayDate = new Date().getTime();

	var currentlyEditing = false;
	function toggleEdit() {
		currentlyEditing = !currentlyEditing;
	}

	async function updateTrip(){
		const updatedTrip = data.trip;

		try{
			const response = await fetch(`${APIURL}/trip/update/${tripId}`, {
				method: 'PUT',
				body: JSON.stringify(updatedTrip),
					headers: {
						'Content-Type': 'application/json'
					}
			});

			if(response.ok){
				defaultTrip = { ...data.trip };
			}else{
				console.error("Failed to update trip (PUT)");
			}
		}catch(e){
			console.error("Error during updateTrip(): ", e);
		}
	}

	/********************
	 * LEAFLET SETTINGS *
	 ********************/
	let map;
	onMount(() => {
		map = L.map("map").setView([50.0755, 14.4378], 4);
		L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 19,
			attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
		}).addTo(map);
	});
</script>

<main class="responsive">
	<Navbar view=true editFunction={() => {toggleEdit();}} saveFunction={() => {updateTrip(); toggleEdit();}} bind:currentlyEditing={currentlyEditing} />

	<div class="row center-align">
		<h2><b>{data.trip.name}</b></h2>
		<button class="circle small primary" disabled>
			{#if new Date(defaultTrip.from_date).getTime() < todayDate && new Date(defaultTrip.until_date).getTime() < todayDate }
			<i class="small">check</i>
			{:else if new Date(defaultTrip.from_date).getTime() < todayDate && new Date(defaultTrip.until_date).getTime() > todayDate}
			<i class="small">arrow_right_alt</i>
			{:else}
			<i class="small">event_upcoming</i>
			{/if}
		</button>
	</div>

	<div class="row center-align">
		{#if currentlyEditing }
		<div class="field label border round">
			<input id="fromDate" type="date" bind:value={data.trip.from_date}>
			<label for="fromDate">From date</label>
		</div>
		<div class="field label border round">
			<input id="untilDate" type="date" bind:value={data.trip.until_date}>
			<label for="untilDate">Until date</label>
		</div>
		{:else}
		<h6 class="border round right-padding left-padding">{
			new Date(defaultTrip.from_date).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			})
			}
			-
			{
			new Date(defaultTrip.until_date).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			})
			}
		</h6>
		{/if}
	</div>

	<div class="row center-align">
			{#if currentlyEditing }
			<div class="field label border round">
				<input id="budget" type="number" bind:value={data.trip.budget} >
				<label for="budget">Budget</label>
			</div>
			{:else}
			<h6 class="border round right-padding left-padding">
				€{defaultTrip.budget}
			</h6>
			{/if}
	</div>
	<div class="space"></div>
	<row class="center-align">
		<div id="map" style="height: 500px;"></div>
	</row>

</main>
