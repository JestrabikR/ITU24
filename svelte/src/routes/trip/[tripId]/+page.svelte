<script>
	import Navbar from "@components/Navbar.svelte";
	import EditBar from "@components/EditBar.svelte";
	import * as pkg from "@fancyapps/ui";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { APIURL } from "$lib/helper.js";
	import { sanitize } from "$lib/helper.js";
	import { imageToBase64 } from "$lib/helper.js";
	import { goto } from '$app/navigation'; 
	import { setFlashMessage } from "../../../stores/flashStore";

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

	var photoToDeleteSub;
	var photoToDeleteSubIndex;
	var subtripIndex;

	var currentlyEditing = false;
	function toggleEdit() {
		currentlyEditing = !currentlyEditing;
		data.trip.advantages = data.trip.advantages.toString().replaceAll(",", "\n");
		data.trip.disadvantages = data.trip.disadvantages.toString().replaceAll(",", "\n");
	}

	var messageSnackbar = "";
	async function flash(message, duration = 3000) {
		messageSnackbar = message;
		ui("#info-snackbar", duration);
	}

	async function updateTrip(message = "Trip successfully updated!"){
		if(data.trip.advantages.constructor === Array){
			data.trip.advantages = data.trip.advantages.toString().replaceAll(",", "\n");
			data.trip.disadvantages = data.trip.disadvantages.toString().replaceAll(",", "\n");
		}

		data.trip.description = sanitize(data.trip.description);
		const updatedTrip = data.trip;

		delete updatedTrip["country"] // adhere to update endpoint

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

		await flash(message);
	}

	async function deleteTrip(){
		try {
			const response = await fetch(`${APIURL}/trip/del/${tripId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {    
				await goto("/");
			    setFlashMessage("Trip successfully deleted!", "success");
			} else {
				console.error("Failed to delete trip:", response.status, response.statusText);
				await flash("ERROR: Could not delete trip!");
			}
		} catch (error) {
			console.error("Error while deleting trip:", error);
			await flash("ERROR: Could not delete trip!");
		}
	}

	async function deletePhoto(index){
		data.trip.photos.splice(index, 1);
		updateTrip("Photo successfully deleted!");
	}

	async function addPhoto(e){
		const img = await imageToBase64(e);
		data.trip.photos.push(img);
		updateTrip("Photo successfully added!");
	}

	/**
	 * Subtrip logic
	 */

	let subtripImageInput;
	let subtripImage;
	let subtripImageBase64;
	let subtripImageContainer;
	let subtripShowImage = false;
	let subtripImagePlaceholder;
	function onSubtripPhotoChange() {
		const file = subtripImageInput.files[0];
			
		if (file) {
			subtripShowImage = true;

			const reader = new FileReader();
			reader.addEventListener("load", function () {
				subtripImageBase64 = reader.result;
				subtripImage.setAttribute("src", reader.result);
			});
			reader.readAsDataURL(file);

			return;
		} 
		subtripShowImage = false; 
	}

	let subtripDesc;
	let subtripName;
	let subtripLat;
	let subtripLong;
	async function addSubtrip(){
		var subtrip = {
			"description": subtripDesc,
			"favourite": false,
			"gps": [
				subtripLat,
				subtripLong
			],
			"name": subtripName,
			"photos": [ ]
		};

		subtrip.photos.push(subtripImageBase64);
		data.trip.subtrips.push(subtrip);
		ui("#add-subtrip");
		updateTrip("Subtrip successfully added!");
		updateMap();

		subtripImageBase64 = null;
		subtripImage.setAttribute("src", "");
	}

	async function deleteSubPhoto(photoIndex, subtripIndex){
		data.trip.subtrips[subtripIndex].photos[photoIndex] = null;
		updateTrip("Subtrip photo successfully deleted!");
	}

	async function addSubPhoto(e, subtripIndex){
		console.log(e);
		const img = await imageToBase64(e);
		data.trip.subtrips[subtripIndex].photos.push(img);
		updateTrip("Photo successfully added!");
	}

	var subtripToDeleteIdx;
	function deleteSubtrip(index){
		data.trip.subtrips.splice(index, 1);
        if (data.trip.subtrips.length === 0) { // reinitialize empty array
            data.trip.subtrips = [];
        }

		updateTrip("Subtrip successfully deleted!");

        defaultTrip.subtrips = [...data.trip.subtrips]; // Trigger Svelte reactivity by reassigning
		subtripToDeleteIdx = 0;
		updateMap();
	}

	/********************
	 * LEAFLET SETTINGS *
	 ********************/
	let map;
	const markerCoords = [];
	const markers = [];
	onMount(() => {
		map = L.map("map", {
			worldCopyJump: true,
		}).setView([26.40, -30.67], 2.5);;
		L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 19,
			attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
		}).addTo(map);

		updateMap();
		

		// check if redirected from new trip, if yes toggle editing mode
		const url = new URL(window.location.href);
		const triggerFunction = url.searchParams.get("new");

		if (triggerFunction === "true") {
			toggleEdit();
		}
	});

	function updateMap() {
		markers.forEach(marker => map.removeLayer(marker));
        markers.length = 0;
        markerCoords.length = 0;

		if(data.trip.subtrips.length > 0){
        	function onClick(e) {
				var popup = e.target.getPopup();
				var content = popup.getContent();
			}

			map.eachLayer(layer => {
				if (layer instanceof L.Polyline && !(layer instanceof L.TileLayer)) {
					map.removeLayer(layer); // remove polylines
				}
			});

			// add new markers and lines
			for (const subtrip of data.trip.subtrips) {
				const marker = L.marker(subtrip.gps).addTo(map);

				// popup
				marker.bindPopup("<a href='#" + subtrip.name + "'>" + subtrip.name + "</a>");
				marker.on("click", onClick);

				markers.push(marker);
				markerCoords.push(subtrip.gps);
			}

			// bound to new markers
			if (markerCoords.length > 0) {
				const bounds = L.latLngBounds(markerCoords);
				map.fitBounds(bounds, {
					padding: [20, 20],
				});
			}

			// add connecting lines
			if(data.trip.subtrips.length > 1){
				for (let i = 0; i < data.trip.subtrips.length - 1; i++) {
					L.polygon([
						data.trip.subtrips[i].gps,
						data.trip.subtrips[i + 1].gps,
					]).addTo(map);
				}
			}
		}
	}

	let modalMap;
	let selectedCoordinates;
	let marker = null;
	function initializeModalMap() {
        if (!modalMap) {
            modalMap = L.map("map-subtrip").setView([50.0755, 14.4378], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(modalMap);

            modalMap.on("click", (e) => {
                selectedCoordinates = e.latlng;
				subtripLat = selectedCoordinates.lat;
				subtripLong = selectedCoordinates.lng;

                if (marker) {
                    modalMap.removeLayer(marker);
                }

                marker = L.marker(selectedCoordinates).addTo(modalMap);
            });
        } else {
            modalMap.invalidateSize();
        }
    }

    function openModal() {
		ui("#add-subtrip"); // opens the modal
        setTimeout(() => {
            initializeModalMap();
        }, 0);
    }

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
	<Navbar tripName={data.trip.name} view=true editFunction={() => {toggleEdit();}} saveFunction={() => {updateTrip(); toggleEdit();}} deleteFunction={() => {deleteTrip();}} bind:currentlyEditing={currentlyEditing} />
	<EditBar tripName={data.trip.name} editFunction={() => {toggleEdit();}} saveFunction={() => {updateTrip(); toggleEdit();}} deleteFunction={() => {deleteTrip();}} bind:currentlyEditing={currentlyEditing}/>

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
		<h6 class="border round right-padding left-padding m l">{
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

		<!-- small device -->
		<b class="border round right-padding left-padding s">{
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
		</b>
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
			<h6 class="left-padding"><b>Subtrips</b></h6>
		</div>
		<button class="extra" on:click={openModal}>
			<i>location_on</i>
			<span>Add subtrip</span>
		</button>
	</div>

	{#if defaultTrip.subtrips.length < 1}
		<div class="row">
			<div class="max">
				<div class="left-padding">
					<p>No subtrips</p>
				</div>
			</div>
		</div>
	{:else}
		<hr class="top-margin bottom-margin"/>
		{#each defaultTrip.subtrips as trip, si (si)}
			<div class="row" id="{trip.name}">
				{#if currentlyEditing }
				<div class="">
					<div class="max bottom-padding">
						<button class="chip small red white-text" on:click={() => { subtripToDeleteIdx = si; ui("#delete-subtrip-confirm")}}><i>delete</i> delete subtrip {trip.name}</button>
					</div>
					<div class="max">
						<div class="field small label border round">
							<input id="name" type="text" bind:value={trip.name} >
							<label for="name">Name</label>
						</div>
					</div>
					<div class="max top-padding">
						<div class="field small border label textarea round">
							<textarea id="description" bind:value={trip.description}></textarea>
							<label for="description">Description</label>
						</div>
					</div>
				</div>
				{:else}
				<div class="left-padding right-padding">
					<div class="max left-padding">
						<h5 class="small"><b>{trip.name}</b></h5>
					</div>
					<div class="max left-padding">
						<span>{trip.description}</span>
					</div>
				</div>
				{/if}
			</div>
			<div class="row scroll">
				{#each trip.photos as photo, pi}
					{#if photo != null}
						{#if currentlyEditing }
						<span>
							<button class="close circle red" data-ui="#delete-sub-confirm" on:click={() => {photoToDeleteSub = photo; photoToDeleteSubIndex = pi; subtripIndex = si;}}>
								<i class="round small-padding white-text">delete</i>
							</button>
							<img src={photo} alt={pi+1} class="responsive medium-width small-height round" />
						</span>
						{:else}
						<a href="{photo}" data-fancybox="gallery" data-caption={pi+1}>
							<img src={photo} alt={pi+1} class="responsive medium-width small-height round" />
						</a>
						{/if}
					{/if}
				{/each}
				<div class="left-padding right-padding">
					<input type="file" accept="image/*" on:input={(e) => addSubPhoto(e, si)} />
					<button class="extend border square round">
						<i>add</i>
						<span>Add photo</span>
					</button>
				</div>
			</div>
			<hr class="top-margin bottom-margin"/>
		{/each}
	{/if}

	<div class="row">
		<div class="max">
			<h6 class="left-padding"><b>Other photos</b></h6>
		</div>
		<div class="min">
			<input type="file" accept="image/*" on:input={addPhoto} />
			<button class="extra">
				<i>image</i>
				<span>Add photo</span>
			</button>
		</div>
	</div>
	{#if defaultTrip.photos.length > 0}
	<div class="row scroll">
		{#each defaultTrip.photos as photo, pi}
			{#if currentlyEditing }
			<span>
				<button class="close circle red" data-ui="#delete-confirm" on:click={() => {photoToDelete = photo; photoToDeleteIndex = pi;}}>
					<i class="round small-padding white-text">delete</i>
				</button>
				<img src={photo} alt={pi+1} class="responsive medium-width small-height round" />
			</span>
			{:else}
			<a href="{photo}" data-fancybox="gallery" data-caption={pi+1}>
				<img src={photo} alt={pi+1} class="responsive medium-width small-height round" />
			</a>
			{/if}
		{/each}
	</div>
	{:else}
	<div class="row">
		<div class="max">
			<div class="left-padding">
				<p>No uncategorized photos</p>
			</div>
		</div>
	</div>
	{/if}

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

	<div class="overlay blur" style="z-index: 1000000;"></div>
	<dialog id="delete-subtrip-confirm" style="z-index: 1000001;" bind:this={deleteConfirmDialog}>
		{#if subtripToDeleteIdx >= 0 && data.trip.subtrips.length > 0}
			<h3>Delete subtrip {data.trip.subtrips[subtripToDeleteIdx].name}?</h3>
		{/if}
		<p class="bold">Are you sure you want to this subtrip and all photos belonging to it? This action cannot be taken back!</p>
		<div class="space"></div>
		<nav class="right-align no-space">
			<button class="transparent link" data-ui="#delete-sub-confirm">Cancel</button>
			<button class="round error" data-ui="#delete-subtrip-confirm" on:click={() => {deleteSubtrip(subtripToDeleteIdx);}}>Delete permanently</button>
		</nav>
	</dialog>

	<div class="overlay blur" style="z-index: 1000000;"></div>
	<dialog id="delete-sub-confirm" style="z-index: 1000001;" bind:this={deleteConfirmDialog}>
		<h3>Delete photo from subtrip?</h3>
		<p class="bold">Are you sure you want to delete this picture? This action cannot be taken back!</p>
		<div class="space"></div>
		<img class="responsive round" src={photoToDeleteSub} alt="Photo to delete"/>
		<nav class="right-align no-space">
			<button class="transparent link" data-ui="#delete-sub-confirm">Cancel</button>
			<button class="round error" data-ui="#delete-sub-confirm" on:click={() => {deleteSubPhoto(photoToDeleteSubIndex, subtripIndex);}}>Delete permanently</button>
		</nav>
	</dialog>

	<div class="overlay blur" style="z-index: 1000000;"></div>
	<dialog id="add-subtrip" class="large" style="z-index: 1000001;">
		<h5>Add subtrip</h5>

		<div class="field label border round">
			<input id="name-subtrip" type="text" bind:value={subtripName} />
			<label for="name-subtrip">Name</label>
		</div>

		<div class="field border label textarea round">
			<textarea id="description-subtrip" bind:value={subtripDesc} ></textarea>
			<label for="description-subtrip">Description</label>
		</div>

		<a>Select location</a>
		<div class="max">
			<div id="map-subtrip" class="" style="height: 300px"></div>
		</div>

		<div class="top-padding">
			<input type="file" accept="image/*" on:change={onSubtripPhotoChange} bind:this={subtripImageInput} />
			<button class="extra">
				<span>Add cover photo</span>
				<i>add</i>
			</button>

			<i>info</i> You can add more images later
		</div>

		<div class="max top-padding" bind:this={subtripImageContainer}>
			{#if subtripShowImage}
				<img bind:this={subtripImage} src="" alt="Preview" />
			{:else}
				<span bind:this={subtripImagePlaceholder}>Image Preview</span>
			{/if}
		</div>

		<nav class="right-align no-space">
			<button class="transparent link" data-ui="#add-subtrip">Cancel</button>
			<button class="round" on:click={addSubtrip}>
				<i>add</i> Save
			</button>
		</nav>
	</dialog>

	<div id="info-snackbar" class="snackbar primary">{messageSnackbar}</div>

</main>
