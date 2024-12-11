<script>
	import Navbar from "@components/Navbar.svelte";
	import Card from "@components/Card.svelte";

	/** @type {import('./$types').PageData} */
	export let data = [];

	const today = new Date();
	const pastTrips = data.trips.filter(trip => new Date(trip.until_date) < today);
	const ongoingTrips = data.trips.filter(trip => new Date(trip.from_date) <= today && new Date(trip.until_date) >= today);
	const futureTrips = data.trips.filter(trip => new Date(trip.from_date) > today);

	/********************
	 * LEAFLET SETTINGS *
	 ********************/
	let map;
	function initializeMap() {
		if (!map) {
			map = L.map("map", {
				worldCopyJump: true,
			}).setView([26.40, -30.67], 2.5);	
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);

            function onClick(e) {
				var popup = e.target.getPopup();
				var content = popup.getContent();
            }


			const markerCoords = [];

			for(const trip of data.trips){
                var hue_rotation = Math.floor(Math.random() * 360);

				// add marker
				for(const subtrip of trip.subtrips){
					var marker = L.marker(subtrip.gps).addTo(map);
                    marker._icon.style.filter = `hue-rotate(${hue_rotation}deg)`;

                    // popup
                    marker.bindPopup("<a href='/trip/" + trip.id + "'><b>" + trip.name + "</a>");
                    marker.on('click', onClick);

					markerCoords.push(subtrip.gps);
				}

				// add connecting lines
				for (var i = 0; i < trip.subtrips.length; i++) {
					if (i < trip.subtrips.length - 1) {
						L.polygon([
						trip.subtrips[i].gps,
						trip.subtrips[i+1].gps,
						]).addTo(map);
					}
				}
			}

			// bound to markers
			if (markerCoords.length > 0) {
				const bounds = L.latLngBounds(markerCoords);
				map.fitBounds(bounds, {
					padding: [20, 20]
				});
			}
		}
	}

	var gridView = true;
	function toggleView(){
		gridView = !gridView;
		if (!gridView) {
			requestAnimationFrame(() => {
				initializeMap();
				map.invalidateSize();  // Ensure Leaflet recalculates the map size
			});
		} else {
			if (map) {
				map.remove();
				map = null;
			}
		}
	}
</script>

<main class="responsive">
	<Navbar/>

	<div class="row top-padding bottom-padding">
		<button class="secondary absolute right" on:click={toggleView}><i>{gridView ? "map" : "apps"}</i></button>
	</div>

	{#if gridView}
		<div class="row">
			<h3><b>Ongoing trips</b></h3>
		</div>
		{#if ongoingTrips.length < 1}
			<p class="italic">You have no ongoing trips</p>
		{:else}
		<div class="grid medium-space" style="align-self: stretch">
			{#each ongoingTrips as card}
				<div class="s12 m12 l6" style="height: 100%;">
					<Card title={card.name} dateFrom={card.from_date} dateTo={card.until_date} country={card.country} imageUrl={card.photos[0]} id={card.id} />
				</div>
			{/each}
		</div>
		{/if}

		<div class="row">
			<h3><b>Future trips</b></h3>
		</div>
		{#if futureTrips.length < 1}
			<p class="italic">You have no future trips</p>
		{:else}
		<div class="grid medium-space">
			{#each futureTrips as card}
				<div class="s12 m6 l4">
					<Card title={card.name} dateFrom={card.from_date} dateTo={card.until_date} country={card.country} imageUrl={card.photos[0]} id={card.id} />
				</div>
			{/each}
		</div>
		{/if}

		<div class="row">
			<h3><b>Past trips</b></h3>
		</div>
		{#if pastTrips.length < 1}
			<p class="italic">You have no past trips</p>
		{:else}
		<div class="grid medium-space">
			{#each pastTrips as card}
				<div class="s12 m6 l4">
					<Card title={card.name} dateFrom={card.from_date} dateTo={card.until_date} country={card.country} imageUrl={card.photos[0]} id={card.id} />
				</div>
			{/each}
		</div>
		{/if}	
	{:else}
		<div class="space"></div>
		<div class="row">
			<div class="max">
				<div id="map" style="height: 80vh;"></div>
			</div>
		</div>
	{/if}
</main>
