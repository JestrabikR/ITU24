<script setup>
import { onMounted, ref, watchEffect, toRaw } from 'vue';
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

const initial_view_gps = ref([]);

// Watches for changes and rerenders - needed because of map
watchEffect(() => {
    if (props.subtrips.length > 0 && mapContainer.value) {
        if (!map.value) {
            // initialize map only once
            map.value = L.map(mapContainer.value).setView(initial_view_gps.value, 13);


            
            for (var i = 0; i < props.subtrips.length; i++) {
                
                // create lines between markers
                if (i < props.subtrips.length - 1) {
                    L.polygon([
                        props.subtrips[i].gps,
                        props.subtrips[i+1].gps,
                    ]).addTo(map.value);
                }

                //create markers
                let marker = L.marker(props.subtrips[i].gps).addTo(toRaw(map.value));
                
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
        }
    }
});

onMounted(()=> {
    // gets first not empty subtrip
    props.subtrips.forEach((s) => {
        if (initial_view_gps.value.length) {
            return;
        }

        initial_view_gps.value = s.gps;
    });

    if (!initial_view_gps.value.length) {
        initial_view_gps.value = [50.0755, 14.4378]; // default
    }
})

</script>

<template>
    <div v-if="subtrips.length > 0" ref="mapContainer" class="mt-5 mb-4 w-full h-64 to-xs:h-72 sm:h-96 rounded-2xl shadow-card-shadow"></div>
</template>
