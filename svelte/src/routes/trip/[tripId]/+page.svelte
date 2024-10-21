<script>
	import Navbar from "@components/Navbar.svelte";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { APIURL } from "$lib/helper.js";

	const tripId = $page.params.tripId;

	export var data;

	async function budgetUpdate(){
		console.log("HERE");

		var defaultPUT = {
			name: "",
			country: "",
			description: "",
			budget: "",
			from_date: "",
			until_date: "",
			subtrips: [],
			photos: [],
			advantages: [],
			disadvantages: [] 
		}

		/*const response = await fetch(`${APIURL}/trip/update/${tripId}`, {
			method: 'PUT',
			body: JSON.stringify({ defaultPUT }),
				headers: {
					'Content-Type': 'application/json'
				}
		});*/
	}

	var currentlyEditing = false;
	function toggleEdit() {
		currentlyEditing = !currentlyEditing;
	}

	async function updateTrip(){
		const updatedTrip = data.trip;

		const response = await fetch(`${APIURL}/trip/update/${tripId}`, {
			method: 'PUT',
			body: JSON.stringify(updatedTrip),
				headers: {
					'Content-Type': 'application/json'
				}
		});
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
	height: 30px;
	padding: 10px;
	border: 2px solid #3498db;
	border-radius: 10px;
	outline: none;
	font-size: 16px;
	box-sizing: border-box;
	transition: border-color 0.3s ease;
}
</style>

<main class="responsive">
	<Navbar view=true/>

	<div class="row center-align">
		<h2><b>{data.trip.name}</b></h2>
	</div>

	<div class="row center-align">
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
	</div>

	<div class="row center-align">
		<h6>
			{#if currentlyEditing }
				<input type="number" class="custom-input" bind:value={data.trip.budget}>
				<button class="circle small secondary" on:click={() => { toggleEdit(); updateTrip();} }>
					<i class="small">save</i>
				</button>
			{:else}
				€{data.trip.budget}
				<button class="circle small secondary" on:click={toggleEdit}>
					<i class="small">edit</i>
				</button>
			{/if}
			<button class="circle small primary">
				{#if new Date(data.trip.until_date) < new Date().getDate()}
				<i class="small" id="completed">check</i>
				{:else}
				<i class="small" id="completed">close</i>
				{/if}
			</button>
			Completed
		</h6>
	</div>
	<div class="space"></div>
	<row class="center-align">
		<div id="map" style="height: 500px;"></div>
	</row>

</main>
