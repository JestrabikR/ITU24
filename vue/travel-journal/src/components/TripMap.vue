<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';

const map = ref();
const mapContainer = ref();

onMounted(() => {
    map.value = L.map(mapContainer.value).setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map.value);
});

</script>

<template>
    <div ref="mapContainer" class="w-64 h-40">

    </div>
</template>