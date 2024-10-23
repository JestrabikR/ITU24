<script setup>
import { onMounted, ref, watchEffect, toRaw } from 'vue';
import L from 'leaflet';

// Definujeme props
const props = defineProps({
    trips: {
        type: Array, // Array<Array<Gps>>
        default: () => []
    }
});

const map = ref(null);
const mapContainer = ref(null);

const initial_view_gps = ref([]);

// Watches for changes and rerenders - needed because of map
watchEffect(() => {
    if (mapContainer.value) {
        if (!map.value) {
            // initialize map only once
            map.value = L.map(mapContainer.value).setView(initial_view_gps.value, 5);

            let hue_rotation;

            // create markers
            props.trips.forEach((trip) => {
                console.log("TRIP: ", trip.name, " - ", trip.id);
                let marker;
                hue_rotation = Math.floor(Math.random() * 360);

                // create lines between markers
                for (var i = 0; i < trip.subtrips.length; i++) {
                    if (i < trip.subtrips.length - 1) {
                        L.polygon([
                            trip.subtrips[i].gps,
                            trip.subtrips[i+1].gps,
                        ]).addTo(map.value);
                    }

                    marker = L.marker(trip.subtrips[i].gps).addTo(toRaw(map.value));
                    marker._icon.style.filter = `hue-rotate(${hue_rotation}deg)`;

                    // popup
                    marker.bindPopup("<a href='/trip/" + trip.id + "' class='text-lg'><b>" + trip.name + "</a></b><br><a class='text-lg'>" + trip.subtrips[i].name + "</a>");
                    marker.on('click', onClick);

                    function onClick(e) {
                        var popup = e.target.getPopup();
                        var content = popup.getContent();
                    }
                }
            });

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map.value);
        }

        // re-render map
        map.value.invalidateSize();
    }
});

onMounted(()=> {
    // gets first not empty subtrip
    props.trips.forEach((trip) => {
        trip.subtrips.forEach((s) => {
            if (initial_view_gps.value.length) {
                return;
            }
            initial_view_gps.value = s.gps;
        });
    });

    if (!initial_view_gps.value.length) {
        initial_view_gps.value = [50.0755, 14.4378]; // default
    }
});

</script>

<template>
    <div v-if="trips.length > 0" ref="mapContainer" class="w-full h-[80vh] mt-4 sm:mt-5 shadow-card-shadow rounded-2xl"></div>
</template>
