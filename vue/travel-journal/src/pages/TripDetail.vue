<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { formatDate } from '@/helpers';
import Subtrip from '@/components/Subtrip.vue';

const route = useRoute();
const tripId = route.params.id;

let trip = ref({});
let formattedFromDate = ref({});
let formattedUntilDate = ref({});

onMounted(async () => {
    try {
        //TODO: pri nacitani nejsou videt data, udelat nejaky loader
        const response = await axios.get('http://localhost:5000/trip/' + tripId);
        trip.value = response.data;

        formattedFromDate.value = formatDate(trip.value.from_date)
        formattedUntilDate.value = formatDate(trip.value.until_date);

    } catch (error) {
        console.error('Error fetching trips', error);
    }
});

</script>

<template>
    <h1 class="pt-3 to-xs:pt-5 sm:pt-5 text-4xl font-extrabold">{{ trip.name }}</h1>
    <p class="font-light">{{ formattedFromDate }} - {{ formattedUntilDate }}</p>
    <p class="">{{ trip.budget }} Kč</p>

    <!--TODO: Obrazek-->

    <h2 class="pt-4 sm:pt-5 text-2xl font-extrabold">Navštívená místa</h2>
    <div v-for="subtrip in trip.subtrips">
        <Subtrip :subtrip="subtrip"/>
    </div>

    <h2 class="pt-4 sm:pt-5 text-2xl font-extrabold">Popis cesty</h2>
    <p class="text-lg">{{ trip.description}}</p>
    
</template>