<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TripCard from '@/components/TripCard.vue';
import TripsSectionHeader from '@/components/TripsSectionHeader.vue';
import { TripStatus } from '@/helpers';
import TripCardsGrid from '@/components/TripCardsGrid.vue';
import PlusCircleIcon from '@/assets/icons/PlusCircleIcon.vue';

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
    <!--TODO? na urovni tlacitka udelat listu jako z navrhu?-->
    <div class="flex justify-end">
        <RouterLink to="/trips/add">
            <PlusCircleIcon/>
        </RouterLink>
    </div>

    <TripsSectionHeader sectionName="Právě probíhající cesty" :tripStatus="TripStatus.CURRENT"/>

    <TripCardsGrid>
        <div v-for="trip in current_trips.slice(0, limit || current_trips.length)" :key="trip.id">
            <TripCard :trip="trip" />
        </div>
    </TripCardsGrid>

    <TripsSectionHeader sectionName="Plánované cesty" :tripStatus="TripStatus.FUTURE"/>
    <TripCardsGrid>
        <div v-for="trip in future_trips.slice(0, limit || future_trips.length)" :key="trip.id">
            <TripCard :trip="trip" />
        </div>
    </TripCardsGrid>

    <TripsSectionHeader sectionName="Minulé cesty" :tripStatus="TripStatus.PAST"/>
    <TripCardsGrid>
        <div v-for="trip in past_trips.slice(0, limit || past_trips.length)" :key="trip.id">
            <TripCard :trip="trip" />
        </div>
    </TripCardsGrid>
</template>