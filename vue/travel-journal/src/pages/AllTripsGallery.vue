<!--Autor: Radek Jestrabik (xjestr04) -->

<script setup>
import Gallery from '@/components/Gallery.vue';
import { formatDate } from '@/helpers';
import axios from 'axios';
import { ref, onMounted } from 'vue';

let trips = ref([]);

let allTripPhotos = ref([]); // 2D array of grouped photos from one trip including subtrip photos

onMounted(async () => {
    const response = await axios.get('http://localhost:5000/trips')
    trips.value = response.data;

    // groups photos from each trip
    for (let trip of trips.value) {
        let tripPhotos = [];
        tripPhotos.push(...trip.photos);

        for (let subtrip of trip.subtrips) {
            tripPhotos.push(...subtrip.photos);
        }

        allTripPhotos.value.push(tripPhotos)
    }
});
</script>

<template>
    <div v-for="(trip, index) in trips" :key="trip.id">
        <div v-if="allTripPhotos[index].length > 0" class="flex flex-row items-end mt-3">
            <h2 class="text-3xl font-bold line-clamp-2 drop-shadow-lg">{{ trip["name"] }}</h2>
            <p class="ml-2 mb-0.5">{{ formatDate(trip.from_date) }} - {{ formatDate(trip.until_date) }}</p>
        </div>
        <Gallery :images="allTripPhotos[index]" :oneLineDisplay="false"/>
    </div>
</template>