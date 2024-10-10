<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

import Navbar from '@/components/Navbar.vue';
import TripCard from '@/components/TripCard.vue';

let trips = ref([]);

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:5000/trips')
        trips.value = response.data;
        console.log(trips.value)
    } catch (error) {
        console.error('Error fetching trips', error);
    }
})
</script>

<template>

<div class="p-6 mx-auto max-w-full sm:max-w-[90%] lg:max-w-[75%]">
  <Navbar/>
  <h1 class="text-2xl font-extrabold"><b>Cestovní deník</b></h1>

  <div v-for="trip in trips" :key="trip.id" class="grid grid-cols-1 to-xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 content-center">
    <TripCard :title = "trip.name" :from_date="trip.from_date" :until_date="trip.until_date"/>
  </div>
  
</div>

</template>

<style scoped>

</style>
