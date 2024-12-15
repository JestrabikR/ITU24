<!--Autor: Radek Jestrabik (xjestr04) -->

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import TripCard from '@/components/TripCard.vue';
import TripsSectionHeader from '@/components/TripsSectionHeader.vue';
import { TripStatus } from '@/helpers';
import TripCardsGrid from '@/components/TripCardsGrid.vue';
import PlusCircleIcon from '@/assets/icons/PlusCircleIcon.vue';
import AllTripsMap from '@/components/AllTripsMap.vue';
import MapIcon from '@/assets/icons/MapIcon.vue';
import GridIcon from '@/assets/icons/GridIcon.vue';
import { useToast } from 'vue-toastification';

let trips = ref([]);
let future_trips = ref([]);
let past_trips = ref([]);
let current_trips = ref([]);

let map_view = ref(false);

let loading = ref(true);

const limit = 3; // how many trips are showing in each section

const toast = useToast();

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:5000/trips')
        trips.value = response.data;
        
        const today = new Date().setHours(0, 0, 0, 0);
        
        // filter current, past and future trips
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
        toast.error("Nepodařilo se načíst cesty");
        console.error('Error fetching trips', error);
    } finally {
        loading.value = false;
    }
});

function toggleMapView() {
    map_view.value = !map_view.value;
}
</script>

<template>
    <div v-if="loading" class="text-center mt-12 w-full">
        <PulseLoader/>
    </div>

    <div v-else>
    <div class="flex justify-end">
        <button @click="toggleMapView" type="button" class="bg-blue-700 hover:bg-blue-800 rounded-xl px-4 my-1 mr-3 text-white text-lg">
            <div class="flex">
                <a v-if="map_view" class="flex flex-row items-center">
                    <GridIcon/>
                    Dlaždice
                </a>
                <a v-else class="flex flex-row items-center">
                    <MapIcon/>
                    Mapa
                </a>
            </div>
        </button>
        <RouterLink to="/form/trip">
            <PlusCircleIcon/>
        </RouterLink>
    </div>

    <div v-if="map_view"> <AllTripsMap :trips="trips"/> </div>

    <section v-else>
        <h2 v-if="current_trips.length > 0" class="pt-5 pb-2 sm:pt-6 sm:pb-3 text-2xl font-extrabold">
            Právě probíhající cesta
        </h2>
        <TripCardsGrid>
            <TripCard v-if="current_trips.length > 0" :trip="current_trips[0]" :full_width="true" />
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
    </section>
    </div>
</template>