<script>
	import Navbar from "@components/Navbar.svelte";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { APIURL } from "$lib/helper.js";
	import { sanitize } from "$lib/helper.js";
	import { imageToBase64 } from "$lib/helper.js";

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
		updatedTrip.description = sanitize(updatedTrip.description);

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

	async function deletePhoto(index){
		data.trip.photos.splice(index, 1);
		updateTrip();
	}

	async function addPhoto(e){
		const img = await imageToBase64(e);
		console.log(img);
		data.trip.photos.push(img);
		updateTrip();
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

	Fancybox.bind(`[data-fancybox="gallery"]`, {
		contentClick: "iterateZoom",
		Images: {
			initialSize: "cover",
			Panzoom: {
				maxScale: 2,
			},
		},
	});
</script>

<main class="responsive">
	<Navbar view=true editFunction={() => {toggleEdit();}} saveFunction={() => {updateTrip(); toggleEdit();}} bind:currentlyEditing={currentlyEditing} />

	<div class="row center-align">
		{#if currentlyEditing}
		<div class="field label border round">
			<input id="name" type="text" bind:value={data.trip.name} >
			<label for="name">Name</label>
		</div>
		{:else}
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
		{/if}
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
	<div class="row center-align">
		<div class="max">
			<div id="map" style="height: 500px;"></div>
		</div>
	</div>
	<div class="space"></div>
	
	<div class="row">
		<div class="max">
			<h6 class="left-padding"><b>Photos</b></h6>
		</div>
		<div class="min">
			<input type="file" on:input={addPhoto} />
			<button class="extend square round">
				<i>add</i>
				<span>Add photo</span>
			</button>
		</div>
	</div>
	<div class="row scroll">
		{#each defaultTrip.photos as photo, index}
			{#if currentlyEditing }
			<span>
				<button class="close circle red" on:click={() => {deletePhoto(index);}}>
					<i class="round small-padding white-text">delete</i>
				</button>
				<img src={photo} class="responsive medium-width small-height round" />
			</span>
			{:else}
			<a href="{photo}" data-fancybox="gallery" data-caption={index+1}>
				<img src={photo} class="responsive medium-width small-height round" />
			</a>
			{/if}
		{/each}
	</div>

	<div class="row">
		<div class="max">
			<h6 class="left-padding"><b>Notes</b></h6>
		</div>
	</div>
	<div class="row">
		<div class="max">
			<div class="border left-padding right-padding round">
				{#if defaultTrip.advantages.length < 1}
					<p class="italic">Advantages</p>
				{:else}
					{#each defaultTrip.advantages as advantage }
					<span><i style="color: lightgreen">add</i>{advantage}<br/></span>
					{/each}
				{/if}
			</div>
		</div>
		<div class="max">
			<div class="border left-padding right-padding round">
				{#if defaultTrip.disadvantages.length < 1}
					<p class="italic">Disadvantages</p>
				{:else}
					{#each defaultTrip.disadvantages as disadvantage }
					<span><i style="color: red">remove</i>{disadvantage}<br/></span>
					{/each}
				{/if}
			</div>
		</div>
	</div>
	<div class="row">
		<div class="max">
		{#if currentlyEditing }
		<div class="field border label textarea round medium-height">
			<textarea id="description" bind:value={data.trip.description}></textarea>
			<label for="description">Description</label>
		</div>
		{:else}
		<div class="border left-padding right-padding round">
			{#if defaultTrip.description.length < 1}
			<p class="italic">Description</p>
			{:else}
			<p>{defaultTrip.description}</p>
			{/if}
		</div>
		{/if}
		</div>
	</div>

	{#if currentlyEditing }
	<nav class="no-space right-align">
		<button class="border left-round extra" on:click={() => {updateTrip(); toggleEdit();}}>
			<i class="extra secondary-text">save</i>
		</button>
		<button class="border right-round extra" on:click={toggleEdit}>
			<i class="extra secondary-text">cancel</i>
		</button>
	</nav>
	{/if}

</main>
