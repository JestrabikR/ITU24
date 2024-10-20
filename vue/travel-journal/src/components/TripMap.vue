<script setup>
import { ref, watchEffect } from 'vue';
import L from 'leaflet';

// Definujeme props
const props = defineProps({
    subtripsGps: {
        type: Array,
        default: () => []
    }
});

const map = ref(null);
const mapContainer = ref(null);

// Watches for changes and rerenders - needed because of map
watchEffect(() => {
    if (props.subtripsGps.length > 0 && mapContainer.value) {
        if (!map.value) {
            // initialize map only once
            map.value = L.map(mapContainer.value).setView(props.subtripsGps[0], 13);


            // create lines between markers
            for (var i = 0; i < props.subtripsGps.length - 1; i++) {
                L.polygon([
                    props.subtripsGps[i],
                    props.subtripsGps[i+1],
                ]).addTo(map.value);
            }

            //TODO: kliknuti na marker ukaze nejaky popup s detailem nebo moznost dostat se na trip aspon

            // create markers
            props.subtripsGps.forEach((gps) => {
                L.marker(gps).addTo(map.value);
            })

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map.value);
        } else {
            // Aktualizace mapy na nové souřadnice
            map.value.setView(props.subtripsGps[0], 13);
        }

        // const bounds = new L.LatLngBounds(props.subtripsGps);
        // map.value.fitBounds(bounds, { padding: [20, 20] });
    }
});

</script>

<template>
    <div v-if="subtripsGps.length > 0" ref="mapContainer" class="mt-5 mb-4 w-full h-64 to-xs:h-72 sm:h-96 rounded-2xl shadow-card-shadow"></div>
</template>
