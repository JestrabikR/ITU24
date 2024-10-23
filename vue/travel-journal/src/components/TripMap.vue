<script setup>
import { ref, watchEffect } from 'vue';
import L from 'leaflet';

// Definujeme props
const props = defineProps({
    subtrips: {
        type: Array,
        default: () => []
    }
});

const map = ref(null);
const mapContainer = ref(null);

// Watches for changes and rerenders - needed because of map
watchEffect(() => {
    if (props.subtrips.length > 0 && mapContainer.value) {
        if (!map.value) {
            // initialize map only once
            map.value = L.map(mapContainer.value).setView(props.subtrips[0].gps, 13);


            
            for (var i = 0; i < props.subtrips.length; i++) {
                
                // create lines between markers
                if (i < props.subtrips.length - 1) {
                    L.polygon([
                        props.subtrips[i].gps,
                        props.subtrips[i+1].gps,
                    ]).addTo(map.value);
                }

                //create markers
                let marker = L.marker(props.subtrips[i].gps).addTo(map.value);
                
                // popup
                marker.bindPopup(props.subtrips[i].name);
                marker.on('click', onClick);

                function onClick(e) {
                    var popup = e.target.getPopup();
                    var content = popup.getContent();
                }
            }

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map.value);
        } else {
            // Aktualizace mapy na nové souřadnice
            map.value.setView(props.subtrips[0], 13);
        }

        // const bounds = new L.LatLngBounds(props.subtripsGps);
        // map.value.fitBounds(bounds, { padding: [20, 20] });
    }
});

</script>

<template>
    <div v-if="subtrips.length > 0" ref="mapContainer" class="mt-5 mb-4 w-full h-64 to-xs:h-72 sm:h-96 rounded-2xl shadow-card-shadow"></div>
</template>
