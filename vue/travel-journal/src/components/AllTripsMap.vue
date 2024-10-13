<script setup>
import { ref, watchEffect } from 'vue';
import L from 'leaflet';

// Definujeme props
const props = defineProps({
    tripsGps: {
        type: Array, // Array<Array<Gps>>
        default: () => []
    }
});

const map = ref(null);
const mapContainer = ref(null);

// Watchs for changes and rerenders - needed because of map
watchEffect(() => {
    if (props.tripsGps.length > 0 && props.tripsGps[0].length > 0 && mapContainer.value) {
        if (!map.value) {
            console.log(props.tripsGps[0]);
            console.log(props.tripsGps[0][0]);
            // initialize map only once
            map.value = L.map(mapContainer.value).setView(props.tripsGps[0][0], 5);

            let hue_rotation;

            // create lines between markers
            props.tripsGps.forEach((trip) => {
                for (var i = 0; i < trip.length - 1; i++) {
                    L.polygon([
                        trip[i],
                        trip[i+1],
                    ]).addTo(map.value);
                }
            });

            // create markers

            props.tripsGps.forEach((trip) => {
                let marker;
                hue_rotation = Math.floor(Math.random() * 360);

                trip.forEach((subtripGps) => {
                    marker = L.marker(subtripGps).addTo(map.value);
                    marker._icon.style.filter = `hue-rotate(${hue_rotation}deg)`;
                });
            });

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map.value);
        } else {
            // Aktualizace mapy na nové souřadnice
            map.value.setView(props.tripsGps[0], 13);
        }

        // Zajištění správného vykreslení
        map.value.invalidateSize();
    }
});

</script>

<template>
    <div v-if="tripsGps.length > 0 && tripsGps[0].length > 0" ref="mapContainer" class="w-full h-[80vh] mt-4 sm:mt-5 shadow-card-shadow rounded-2xl"></div>
</template>
