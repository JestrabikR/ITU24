<script>
	import Navbar from "@components/Navbar.svelte";
	import * as pkg from "@fancyapps/ui";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { APIURL } from "$lib/helper.js";
	import { sanitize } from "$lib/helper.js";
	import { imageToBase64 } from "$lib/helper.js";

	const tripId = $page.params.tripId;
	
	export var data;
	var defaultTrip = { ...data.trip }; // create copy
	if(defaultTrip.advantages.constructor === String){
		defaultTrip.advantages = defaultTrip.advantages.split("\n");
		defaultTrip.disadvantages = defaultTrip.disadvantages.split("\n");
	}

	var todayDate = new Date().getTime();

	var deleteConfirmDialog;
	var photoToDelete;
	var photoToDeleteIndex;

	var currentlyEditing = false;
	function toggleEdit() {
		currentlyEditing = !currentlyEditing;
		data.trip.advantages = data.trip.advantages.toString().replaceAll(",", "\n");
		data.trip.disadvantages = data.trip.disadvantages.toString().replaceAll(",", "\n");
	}

	async function updateTrip(){
		if(data.trip.advantages.constructor === Array){
			data.trip.advantages = data.trip.advantages.toString().replaceAll(",", "\n");
			data.trip.disadvantages = data.trip.disadvantages.toString().replaceAll(",", "\n");
		}

		data.trip.description = sanitize(data.trip.description);
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
				defaultTrip = { ...updatedTrip };
				if(defaultTrip.advantages.constructor === String){
					defaultTrip.advantages = defaultTrip.advantages.split("\n");
					defaultTrip.disadvantages = defaultTrip.disadvantages.split("\n");
				}else if(defaultTrip.advantages.constructor === Array){
					defaultTrip.advantages = defaultTrip.advantages.toString().replaceAll(",", "\n");
					defaultTrip.disadvantages = defaultTrip.disadvantages.toString().replaceAll(",", "\n");
				}
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

	const { Fancybox } = pkg;
	if(Fancybox){ // for some reason Fancybox is loading slowly, so this sometimes fails
		Fancybox.bind(`[data-fancybox="gallery"]`, {
			contentClick: "iterateZoom",
			Images: {
				initialSize: "cover",
				Panzoom: {
					maxScale: 2,
				},
			},
		});
	}
</script>
<svelte:options accessors={true}/>

<style>
@import "@fancyapps/ui/dist/fancybox/fancybox.css";
</style>

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
				<button class="close circle red" data-ui="#delete-confirm" on:click={() => {photoToDelete = photo; photoToDeleteIndex = index;}}>
					<i class="round small-padding white-text">delete</i>
				</button>
				<img src={photo} alt={index+1} class="responsive medium-width small-height round" />
			</span>
			{:else}
			<a href="{photo}" data-fancybox="gallery" data-caption={index+1}>
				<img src={photo} alt={index+1} class="responsive medium-width small-height round" />
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
		<div class="max" style="align-self: stretch">
			{#if currentlyEditing }
			<div class="field border label textarea round small-height">
				<textarea id="advantages" bind:value={data.trip.advantages}></textarea>
				<label for="advantages">Advantages</label>
			</div>
			{:else}
			<div class="border left-padding right-padding round"  style="height: 100%">
				{#if defaultTrip.advantages.length < 1}
					<p class="italic">Advantages</p>
				{:else}
					{#each defaultTrip.advantages as advantage }
					<span><i style="color: lightgreen">add</i>{advantage}<br/></span>
					{/each}
				{/if}
			</div>
			{/if}
		</div>
		<div class="max" style="align-self: stretch">
			{#if currentlyEditing }
			<div class="field border label textarea round small-height">
				<textarea id="disadvantages" bind:value={data.trip.disadvantages}></textarea>
				<label for="disadvantages">Disadvantages</label>
			</div>
			{:else}
			<div class="border left-padding right-padding round" style="height: 100%">
				{#if defaultTrip.disadvantages.length < 1}
					<p class="italic">Disadvantages</p>
				{:else}
					{#each defaultTrip.disadvantages as disadvantage }
					<span><i style="color: red">remove</i>{disadvantage}<br/></span>
					{/each}
				{/if}
			</div>
			{/if}
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

	<!-- Invisible elements (dialogs, pop-ups, modals, ...) -->

	<div class="overlay blur" style="z-index: 1000000;"></div>
	<dialog id="delete-confirm" style="z-index: 1000001;" bind:this={deleteConfirmDialog}>
		<h3>Delete photo from gallery?</h3>
		<p class="bold">Are you sure you want to delete this picture? This action cannot be taken back!</p>
		<div class="space"></div>
		<img class="responsive round" src={photoToDelete} alt="Photo to delete"/>
		<nav class="right-align no-space">
			<button class="transparent link" data-ui="#delete-confirm">Cancel</button>
			<button class="round error" data-ui="#delete-confirm" on:click={() => {deletePhoto(photoToDeleteIndex);}}>Delete permanently</button>
		</nav>
	</dialog>

</main>
