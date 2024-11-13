<script>
	import { onMount } from "svelte";
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

					//TODO: pokud uz je vybrana a klikne se na ni znovu s tim ze se ma znovu dat jako ta stejna, tak ignorovat
					
					// send to api add country
					/*const {data} = await axios.post("http://localhost:5000/country/add", newCountry, {
						headers: {
							"Content-Type": "application/json"
						}
					})*/

					//TODO: check response

				} else {
					// if already selected, remove
					//const response = await axios.delete("http://localhost:5000/country/del/" + code);
					
					//TODO: check response

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
</script>

<main class="responsive">
	<Navbar/>
</main>

<div id="map" style="height: 80vh;"></div>
