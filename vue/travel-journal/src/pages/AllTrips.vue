<script setup>
import TripCard from '@/components/TripCard.vue';
import TripCardsGrid from '@/components/TripCardsGrid.vue';
import { TripStatus } from '@/helpers';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

const route = useRoute();
const tripStatus = route.params.tripStatus;

let title = ref("");

let trips = ref([]);

const toast = useToast();

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:5000/trips')
        trips.value = response.data;
        
        const today = new Date().setHours(0, 0, 0, 0);

        if (tripStatus == TripStatus.CURRENT) {
            title.value = "Právě probíhající cesty";

            trips.value = trips.value.filter((trip) => {
            const tripStartDate = new Date(trip.from_date).setHours(0, 0, 0, 0);
            const tripEndDate = new Date(trip.until_date).setHours(0, 0, 0, 0);
            return tripStartDate <= today && tripEndDate >= today;
            });
        }
        else if (tripStatus == TripStatus.FUTURE) {
            title.value = "Plánované cesty";

            trips.value = trips.value.filter((trip) => {
            const tripStartDate = new Date(trip.from_date).setHours(0, 0, 0, 0);
            const tripEndDate = new Date(trip.until_date).setHours(0, 0, 0, 0);
            return tripStartDate > today && tripEndDate > today;
            });
        }
        else if (tripStatus == TripStatus.PAST) {
            title.value = "Minulé cesty";

            trips.value = trips.value.filter((trip) => {
            const tripEndDate = new Date(trip.until_date).setHours(0, 0, 0, 0);
            return tripEndDate < today;
            });
        }
    } catch (error) {
        toast.error("Nepodařilo se načíst cesty");
        console.error('Error fetching trips', error);
    }
})
</script>

<template>
    
<h2 class="py-3 sm:py-4 text-2xl font-extrabold">{{ title }}</h2>

<TripCardsGrid>
    <div v-for="trip in trips" :key="trip.id">
        <TripCard :trip="trip" />
    </div>
</TripCardsGrid>

</template>