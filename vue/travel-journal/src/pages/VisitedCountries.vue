<!--Autor: Radek Jestrabik (xjestr04) -->

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import statesData from '../../../../countries.geo.json';
import { useToast } from 'vue-toastification';
import SearchIcon from '@/assets/icons/SearchIcon.vue';
import TrashIcon from '@/assets/icons/TrashIcon.vue';

let selectedCountries = ref([]);
let geoJson = ref([]);
const map = ref(null);
const mapContainer = ref(null);

let isVisitedToggle = ref(true); // state of switch button 

const toast = useToast();

const NUMBER_OF_STATES = 180;

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

const moveViewToCountry = (country) => {
    console.log(statesData["features"].length);
    statesData["features"].forEach((c) => {
        if (c["id"] === country.code) {
            let first_coordinates = c["geometry"]["coordinates"][0][0];

            // in some cases the gps is one level more nested
            if (first_coordinates.length > 2) {
                // coordinates need to be inversed for setView()
                map.value.setView([first_coordinates[0][1], first_coordinates[0][0]], 4);
            } else {
                // coordinates need to be inversed for setView()
                map.value.setView([first_coordinates[1], first_coordinates[0]], 4);
            }
            return;
        }
    })
}


const onEachFeature = (feature, layer) => {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: async (e) => {
            // is country selected
            let index = -1;

            let code = layer.feature.id;
            let name = layer.feature.properties.name;

            selectedCountries.value.forEach((country, i) => {
                if (country.code === code) {
                    index = i;
                }
            })

            if (index === -1) {

                let newCountry = {
                    "code": code,
                    "name": name,
                    "visited": isVisitedToggle.value,
                    "wanted": !isVisitedToggle.value
                };

                selectedCountries.value.push(newCountry);
                layer.setStyle(isVisitedToggle.value ? visitedHighlightStyle : wantToVisitHighlightStyle);
                
                try {
                    // send to api add country
                    const {data} = await axios.post('http://localhost:5000/country/add', newCountry, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                } catch (e) {
                    toast.error("Nepodařilo se uložit zemi");
                    console.error("Error sending country", e);
                }
            } else {
                try {
                    // if already selected, remove
                    const response = await axios.delete('http://localhost:5000/country/del/' + code);
                } catch (e) {
                    toast.error("Nepodařilo se odstranit zemi");
                    console.error("Error deleting country", e);
                }

                selectedCountries.value.splice(index, 1);
                geoJson.value.resetStyle(layer);
            }
        },
    });
};

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:5000/countries');
        selectedCountries.value = response.data;

        // initialize map only once
        map.value = L.map(mapContainer.value).setView([50.0755, 14.4378], 4);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map.value);

        // color countries got from api
        const style = (feature) => {
            // check whether country is visited
            const isVisited = selectedCountries.value.find(
                (country) => country.code === feature.id && country.visited
            );
            
            // check whether country is wanted
            const isWanted = selectedCountries.value.find(
                (country) => country.code === feature.id && country.wanted
            );

            if (isVisited) {
                return visitedHighlightStyle;
            }
            else if (isWanted) {
                return wantToVisitHighlightStyle;
            } else {
                return { fillColor: '#D3D3D3', weight: 1, color: '#777', fillOpacity: 0.5 }; // default color
            }
        };

        // add geoJson
        geoJson.value = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature,
        }).addTo(map.value);

        const legend = L.control({position: 'topright'});

        // add legend
        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'info legend bg-blue-100 p-1 px-2');
            const grades = [0, 1];
            const labels = ['Navštíveno', 'Chci navštívit'];
            const colors = [visitedColor, wantToVisitColor];

            for (let i = 0; i < grades.length; i++) {
                div.innerHTML += 
                    `<p style="color: ${colors[i]}">${labels[i]}</p>`;
            }

            return div;
        };

        legend.addTo(map.value);

    } catch (error) {
        toast.error("Nepodařilo se načíst země");
        console.error('Error fetching visited countries', error);
    }
});

</script>

<template>
    <h1 class="py-3 sm:py-4 text-2xl font-extrabold">Navštívené země</h1>

    <div class="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-5 mb-4">
        <div ref="mapContainer" class="w-full h-[80vh] col-span-4 shadow-card-shadow rounded-2xl"></div>
        
        <div>
            <!-- Wanted / Visited toggle-->
            <p>Režim výběru:</p>
            <label class="inline-flex items-center cursor-pointer mb-4">
                <span class="text-sm font-medium text-gray-900 dark:text-gray-500">Chci navštívit</span>
                <input type="checkbox" v-model="isVisitedToggle" value="" class="sr-only peer">
                <div class="relative min-w-11 w-11 h-6 mx-2 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-700"></div>
                <span class="text-sm font-medium text-gray-900 dark:text-gray-500">Navštíveno</span>
            </label>

            <!-- Circular progress bar -->
            <div class="relative size-44 sm:size-48 md:size-40 lg:size-48">
                <svg class="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <!-- Background circle -->
                    <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-gray-200" stroke-width="2"></circle>
                    <!-- Progress circle -->
                    <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-blue-700" stroke-width="2" stroke-dasharray="100"
                    :stroke-dashoffset="100 - (selectedCountries.filter((c) => c.visited).length / NUMBER_OF_STATES) * 100" 
                    stroke-linecap="round"></circle>
                </svg>

                <!-- Percentage text -->
                <div class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span class="text-gray-500">Navštíveno</span>
                    <span class="text-center text-lg sm:text-2xl font-bold text-blue-700 whitespace-nowrap">{{ selectedCountries.filter((c) => c.visited).length }} / {{ NUMBER_OF_STATES }}</span>
                    <span class="text-gray-500">zemí</span>
                </div>
            </div>

            <!-- Lists of countries -->
            <div class="grid grid-cols-2 md:grid-cols-1">
                <div>
                    <p class="text-xl pt-4 md:pt-5 font-bold">Navštívil jsem</p>
                    <div v-for="country in selectedCountries">
                        <div v-if="country.visited" class="flex flex-row items-center">
                            <a class="cursor-pointer mr-1 hover:text-gray-500" @click="moveViewToCountry(country)"><SearchIcon/></a>
                            <p class="pt-0.5">{{ country.name }}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <p class="text-xl pt-3 md:pt-4 font-bold">Chci navštívit</p>
                    <div v-for="country in selectedCountries">
                        <div v-if="country.wanted" class="flex flex-row items-center">
                            <a class="cursor-pointer mr-1 hover:text-gray-500" @click="moveViewToCountry(country)"><SearchIcon/></a>
                            <p class="pt-0.5">{{ country.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
