<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import statesData from '../../../../countries.geo.json';

let visitedCountries = ref([]);
let geoJson = ref([]);
const map = ref(null);
const mapContainer = ref(null);
const selectedCountries = ref([]);

let isVisitedToggle = ref(true); // state of switch button 

// border highlight
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7,
    });
    layer.bringToFront();
}

// remove border highlight
function resetHighlight(e) {
    var layer = e.target;

    // do not remove higlight from selectedCountries
    const isSelected = selectedCountries.value.includes(layer);
    if (!isSelected) {
        geoJson.value.resetStyle(layer);
    }
}

const visitedColor = '#8ac43f';
const wantToVisitColor = '#f51d57';

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


const onEachFeature = (feature, layer) => {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: async (e) => {
            // is country selected
            const index = selectedCountries.value.indexOf(layer);

            let code = layer.feature.id;
            let name = layer.feature.properties.name;

            if (index === -1) {
                // Pokud není, přidáme ji do výběru a změníme styl
                selectedCountries.value.push(layer);
                layer.setStyle(isVisitedToggle.value ? visitedHighlightStyle : wantToVisitHighlightStyle);

                let newCountry = {
                    "code": code,
                    "name": name,
                    "visited": isVisitedToggle.value,
                    "wanted": !isVisitedToggle.value
                };
                
                // send to api add country
                const {data} = await axios.post('http://localhost:5000/country/add', newCountry, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                //TODO: check response

            } else {
                // if already selected, remove
                //TODO: const response = await axios.delete('http://localhost:5000/country/del/' + id);
                
                selectedCountries.value.splice(index, 1);
                geoJson.value.resetStyle(layer);
            }
        },
    });
};

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:5000/countries');
        visitedCountries.value = response.data;

        // initialize map only once
        map.value = L.map(mapContainer.value).setView([50.0755, 14.4378], 4);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map.value);

        // add geoJson
        geoJson.value = L.geoJson(statesData, {
            onEachFeature: onEachFeature,
        }).addTo(map.value);

        const legend = L.control({position: 'topright'});

        // add legend
        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'info legend bg-blue-100 p-1 px-2');
            const grades = [0, 1];
            const labels = ['Navštíveno', 'Chci navštívit'];
            const colors = [visitedColor, wantToVisitColor];

            // Přidání popisů k legendě
            for (let i = 0; i < grades.length; i++) {
                div.innerHTML += 
                    `<p style="color: ${colors[i]}">${labels[i]}</p>`;
            }

            return div;
        };

        legend.addTo(map.value);

    } catch (error) {
        console.error('Error fetching visited countries', error);
    }
});

</script>

<template>
    <h1 class="py-3 sm:py-4 text-2xl font-extrabold">Navštívené země</h1>

    <div class="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-5">
        <!--TODO: layout 80%mapa | 20% seznam navštívených zemí pod sebou-->
        <!--TODO ukladani na api, button presunout napravo od mapy do sloupce-->
        <div ref="mapContainer" class="w-full h-[80vh] col-span-4 shadow-card-shadow rounded-2xl"></div>
        
        <div>
            <label class="inline-flex items-center cursor-pointer">
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-500">Chci navštívit</span>
                <input type="checkbox" v-model="isVisitedToggle" value="" class="sr-only peer">
                <div class="relative min-w-11 w-11 h-6 mx-2 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-700"></div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-500">Navštíveno</span>
            </label>

            <button type="button" @click="saveSelected" class="bg-blue-700 rounded-xl mt-4 px-4 py-2 mr-3 text-white text-lg">ULOŽIT</button>
        </div>
    </div>
</template>
