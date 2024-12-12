<script>
	import { onMount } from "svelte";
	import { APIURL } from "$lib/helper"
	import Navbar from "@components/Navbar.svelte";

	import statesData from "../../../../countries.geo.json";

	export let data;

	/********************
	 * LEAFLET SETTINGS *
	 ********************/
	const visitedColor = "#8ac43f";
	const wantToVisitColor = "#f51d57";

	const wantToVisitHighlightStyle = {
		color: wantToVisitColor,
		weight: 2,
		fillColor: wantToVisitColor,
		fillOpacity: 0.5,
	};

	const visitedHighlightStyle = {
		color: visitedColor,
		weight: 2,
		fillColor: visitedColor,
		fillOpacity: 0.5,
	};

	const style = (feature) => {
		// check whether country is visited
		const isVisited = data.countries.find(
			(country) => country.code === feature.id && country.visited
		);
		
		// check whether country is wanted
		const isWanted = data.countries.find(
			(country) => country.code === feature.id && country.wanted
		);

		if (isVisited) {
			return visitedHighlightStyle;
		}
		else if (isWanted) {
			return wantToVisitHighlightStyle;
		} else {
			return { fillColor: "#D3D3D3", weight: 1, color: "#777", fillOpacity: 0.5 }; // default color
		}
	};

	// border highlight
	function highlightFeature(e) {
		var layer = e.target;
		layer.setStyle({
			weight: 5,
			color: "#666",
			dashArray: "",
			fillOpacity: 0.7,
		});
		layer.bringToFront();
	}

	// remove border highlight
	function resetHighlight(e) {
		var layer = e.target;

		// do not remove higlight from selectedCountries
		const isSelected = data.countries.includes(layer);
		if (!isSelected) {
			geoJson.resetStyle(layer);
		}
	}

	let isVisitedToggle = true;
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: async (e) => {
				// is country selected
				let index = -1;

				let code = layer.feature.id;
				let name = layer.feature.properties.name;

				data.countries.forEach((country, i) => {
					if (country.code === code) {
						index = i;
					}
				})

				if (index === -1) {

					let newCountry = {
						"code": code,
						"name": name,
						"visited": isVisitedToggle,
						"wanted": !isVisitedToggle
					};

					data.countries.push(newCountry);
					layer.setStyle(isVisitedToggle ? visitedHighlightStyle : wantToVisitHighlightStyle);

					// send to api add country
					try{
						const response = await fetch(`${APIURL}/country/add`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(newCountry)
						});
					}catch(e){
						console.error("Error during country addition: ", e);
					}
				} else {
					try{
						const response = await fetch(`${APIURL}/country/del/${code}`, {
							method: 'DELETE',
							headers: {
								'Content-Type': 'application/json'
							}
						});
					}catch(e){
						console.error("Error during country addition: ", e);
					}

					data.countries.splice(index, 1);
					geoJson.resetStyle(layer);
				}
			},
		});
	}

	let map;
	let geoJson;
	onMount(() => {
		map = L.map("map", {worldCopyJump:true,}).setView([26.40, -30.67], 2.5);
		L.tileLayer("https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}", {
			minZoom: 0,
			maxZoom: 20,
			attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
			ext: "png",
		}).addTo(map);

        geoJson = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature,
        }).addTo(map);

		let legend = L.control({position: "topright"});

		// add legend
		legend.onAdd = function () {
			const div = L.DomUtil.create("article", "white tiny-line small-padding"); //TODO styling
			const grades = [0, 1];
			const labels = ["<i>check_circle</i>Visited", "<i>cancel</i>Want to visit"];
			const colors = [visitedColor, wantToVisitColor];

			for (let i = 0; i < grades.length; i++) {
				div.innerHTML += 
				`<p style="color: ${colors[i]}">${labels[i]}</p>`;
			}

			return div;
		};

		legend.addTo(map);
	});

	/**************
	 * STATISTICS *
	 *************/
	let showVisited = true;

	// Compute statistics
	$: totalCountries = statesData.features.length;
	$: visitedCountries = data.countries.filter((c) => c.visited).length;
	$: wantToVisitCountries = data.countries.filter((c) => c.wanted).length;
	$: visitedPercentage = ((visitedCountries / totalCountries) * 100).toFixed(2);
	$: wantToVisitPercentage = ((wantToVisitCountries / totalCountries) * 100).toFixed(2);

</script>

<style>
	.switch > input:checked + span::before, .switch.icon > input:checked + span > i {
		color: #E3E2E5 !important;
	}

	.switch > input:checked + span::after{
		background-color: #E3E2E5;
		border: .125rem solid var(--outline);
	}
</style>

<main class="responsive">
	<Navbar />
	<div class="row right-align right-padding bottom-padding">
		{#if isVisitedToggle}
			Visited
		{:else}
			Want to visit
		{/if}
		<label class="switch icon">
			<input type="checkbox" bind:checked={isVisitedToggle}>
			<span>
				<i style="background-color: {wantToVisitColor}">cancel</i>
				<i style="background-color: {visitedColor}">check_circle</i>
			</span>
		</label>
	</div>
	<div class="m l s" id="map" style="height: 80vh;"></div>

	<div class="row">
		<div class="max">
			<h2>Statistics</h2>
			<p><b>Visited:</b> {visitedCountries} ({visitedPercentage}%)</p>
			<p><b>Want to Visit:</b> {wantToVisitCountries} ({wantToVisitPercentage}%)</p>
		</div>
	</div>
	<div class="row">
		<div class="max">
			<h5>Visited</h5>
			<ul>
				{#each data.countries.filter(c => c.visited) as country}
					<li>{country.name}</li>
				{/each}
			</ul>
		</div>
	</div>
	<div class="row">
		<div class="max">
			<h5>Want to visit</h5>
			{#if data.countries.filter(c => c.wanted).length < 1}
				<p class="italic">No countries to display</p>
			{/if}
			<ul>
				{#each data.countries.filter(c => c.wanted) as country}
					<li>{country.name}</li>
				{/each}
			</ul>
		</div>
	</div>
</main>
