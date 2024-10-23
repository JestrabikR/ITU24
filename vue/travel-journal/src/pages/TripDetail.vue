<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { formatDate } from '@/helpers';
import Subtrip from '@/components/Subtrip.vue';
import PlusIcon from '@/assets/icons/PlusIcon.vue';
import MinusIcon from '@/assets/icons/MinusIcon.vue';
import TripMap from '@/components/TripMap.vue';
import Gallery from '@/components/Gallery.vue';
import PencilIcon from '@/assets/icons/PencilIcon.vue';
import CalendarIcon from '@/assets/icons/CalendarIcon.vue';
import WalletIcon from '@/assets/icons/WalletIcon.vue';
import { useToast } from 'vue-toastification';

const route = useRoute();
const tripId = route.params.id;

let trip = ref({});
let formattedFromDate = ref({});
let formattedUntilDate = ref({});
let loading = ref(true);

const toast = useToast();

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:5000/trip/' + tripId);
        trip.value = response.data;

        formattedFromDate.value = formatDate(trip.value.from_date)
        formattedUntilDate.value = formatDate(trip.value.until_date);

    } catch (error) {
        toast.error("Nepodařilo se načíst cestu");
        console.error('Error fetching trips', error);
    } finally {
        loading.value = false;
    }
});

</script>

<template>
    <div v-if="loading" class="text-center mt-12 w-full">
        <PulseLoader/>
    </div>

    <div v-else>
    <div class="flex justify-between mt-3 to-xs:mt-5 sm:mt-5">
        <div>
            <h1 class="text-4xl font-extrabold">{{ trip.name }}</h1>
            <div class="flex flex-row"><div class="pt-1 pr-2"><CalendarIcon/></div> <p class="font-light">{{ formattedFromDate }} - {{ formattedUntilDate }}</p></div>
            <div class="flex flex-row"><div class="pt-1 pr-2"><WalletIcon/></div> <p class="">Náklady: {{ trip.budget }} Kč</p></div>
        </div>
        <RouterLink :to="`/form/trip/${trip.id}`"><button><PencilIcon/></button></RouterLink>
    </div>

    <TripMap :subtrips="trip.subtrips" />

    <!-- Visited places -->
    <h2 v-if="trip.subtrips.length > 0" class="pt-4 sm:pt-5 text-2xl font-extrabold">Navštívená místa</h2>
    <div v-for="subtrip in trip.subtrips">
        <Subtrip :subtrip="subtrip"/>
    </div>

    <!-- Unclassified photos -->
    <h2 v-if="trip.photos.length > 0" class="text-2xl pt-3">Nezařazené fotografie</h2>
    <div class="flex gap-4 overflow-x-auto flex-nowrap">
        <Gallery :images="trip.photos"/>
    </div>

    <!-- Description -->
    <h2 class="pt-4 sm:pt-5 text-2xl font-extrabold">Popis cesty</h2>
    <p class="text-lg">{{ trip.description}}</p>
    
    
    <!-- Advantages Disadvantages-->
    <div v-if="trip.advantages.length > 0" class="pt-4 sm:pt-5 mb-16 grid grid-cols-1 to-xs:grid-cols-2 sm:grid-cols-2">
        <div class="advantages">
            <div class="flex">
                <PlusIcon color="text-green-600"/>
                <p class=" pl-1 pt-0.5 text-xl font-bold">Co se mi líbilo</p>
            </div>
            <ul class="list-inside pl-3.5" style="list-style-type: circle">
                <div v-for="adv in trip.advantages">
                    <li>{{ adv }}</li>
                </div>
            </ul>
        </div>

        <div v-if="trip.disadvantages.length > 0" class="disadvantages">
            <div class="flex">
                <MinusIcon/>
                <p class="pl-1 pt-0.5 text-xl font-bold">Co se mi líbilo</p>
            </div>
            <ul class="list-inside pl-3.5" style="list-style-type: circle">
                <div v-for="disadv in trip.disadvantages">
                    <li>{{ disadv }}</li>
                </div>
            </ul>
        </div>
    </div>
    </div>
</template>

<style scoped>
ul li::marker {
    font-size: 1.1rem; /* li circle size */
}
</style>