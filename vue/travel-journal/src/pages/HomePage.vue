<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TripCard from '@/components/TripCard.vue';

let trips = ref([]);
let future_trips = ref([]);
let past_trips = ref([]);
let current_trips = ref([]);

const limit = 3; // how many trips are showing in each section

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:5000/trips')
        trips.value = response.data;
        
        const today = new Date().setHours(0, 0, 0, 0);

        past_trips.value = trips.value.filter((trip) => {
          const tripEndDate = new Date(trip.until_date).setHours(0, 0, 0, 0);
          return tripEndDate < today;
        });

        future_trips.value = trips.value.filter((trip) => {
          const tripStartDate = new Date(trip.from_date).setHours(0, 0, 0, 0);
          const tripEndDate = new Date(trip.until_date).setHours(0, 0, 0, 0);
          return tripStartDate > today && tripEndDate > today;
        });

        current_trips.value = trips.value.filter((trip) => {
          const tripStartDate = new Date(trip.from_date).setHours(0, 0, 0, 0);
          const tripEndDate = new Date(trip.until_date).setHours(0, 0, 0, 0);
          return tripStartDate <= today && tripEndDate >= today;
        });
    } catch (error) {
        console.error('Error fetching trips', error);
    }
})
</script>

<template>
    <h2 class="pt-2 sm:pt-4 text-2xl font-extrabold">Právě probíhající cesty</h2>
    <div class="grid grid-cols-1 to-xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 content-center">
        <div v-for="trip in current_trips.slice(0, limit || current_trips.length)" :key="trip.id">
            <TripCard :trip="trip" />
        </div>
    </div>

    <h2 class="text-2xl font-extrabold">Plánované cesty</h2>
    <div class="grid grid-cols-1 to-xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 content-center">
        <div v-for="trip in future_trips.slice(0, limit || future_trips.length)" :key="trip.id">
            <TripCard :trip="trip" />
        </div>
    </div>

    <h2 class="text-2xl font-extrabold">Minulé cesty</h2>
    <div class="grid grid-cols-1 to-xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 content-center">
        <div v-for="trip in past_trips.slice(0, limit || past_trips.length)" :key="trip.id">
            <TripCard :trip="trip" />
        </div>
    </div>
</template>