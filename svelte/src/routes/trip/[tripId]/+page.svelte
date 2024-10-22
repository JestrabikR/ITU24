<script>
	import Navbar from "@components/Navbar.svelte";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { APIURL } from "$lib/helper.js";

	const tripId = $page.params.tripId;
	
	export var data;
	var defaultTrip = { ...data.trip }; // create copy

	const defaultFromDate = new Date(data.trip.from_date).getTime();
	var fromDate = new Date();
	const defaultUntilDate = new Date(data.trip.until_date).getTime();
	var untilDate = new Date();
	const todayDate = new Date().getTime();

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

<style>
.custom-input {
	max-width: 120px;
	height: 30px;
	padding: 10px;
	text-align: right;
	border: 1px solid #e8e9ea;
    border-radius: 4px;
	border-radius: 10px;
	outline: none;
	font-size: 20px;
	transition: border-color 0.3s ease;
}
</style>

<main class="responsive">
	<Navbar view=true editFunction={() => {toggleEdit();}} saveFunction={() => {updateTrip(); toggleEdit();}} bind:currentlyEditing={currentlyEditing} />

	<div class="row center-align">
		<h2><b>{data.trip.name}</b></h2>
		<button class="circle small primary" disabled>
			{#if defaultUntilDate < todayDate}
			<i class="small">check</i>
			{:else if defaultFromDate < todayDate && defaultUntilDate > todayDate}
			<i class="small">arrow_right_alt</i>
			{:else}
			<i class="small">event_upcoming</i>
			{/if}
		</button>
	</div>

	<div class="row center-align">
		{#if currentlyEditing }
		<input type="date" class="custom-input" bind:value={fromDate} />
		<input type="date" class="custom-input" bind:value={untilDate} />
		{:else}
		<h6 id="date">{
			new Date(data.trip.from_date).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			})
			}
			-
			{
			new Date(data.trip.until_date).toLocaleDateString("en-US", {
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
				<input type="number" class="custom-input" bind:value={data.trip.budget} />
			{:else}
				<h6>
					€{defaultTrip.budget}
				</h6>
			{/if}
	</div>
	<div class="space"></div>
	<row class="center-align">
		<div id="map" style="height: 500px;"></div>
	</row>

</main>
