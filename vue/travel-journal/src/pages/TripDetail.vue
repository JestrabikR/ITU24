<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { formatDate } from '@/helpers';
import Subtrip from '@/components/Subtrip.vue';
import PlusIcon from '@/assets/icons/PlusIcon.vue';
import MinusIcon from '@/assets/icons/MinusIcon.vue';
import TripPhoto from '@/components/TripPhoto.vue';

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
    <p class="">Náklady: {{ trip.budget }} Kč</p>

    <!--TODO: Mapa -->

    <!-- Visited places -->
    <h2 class="pt-4 sm:pt-5 text-2xl font-extrabold">Navštívená místa</h2>
    <div v-for="subtrip in trip.subtrips">
        <Subtrip :subtrip="subtrip"/>
    </div>

    <!-- Unclassified photos -->
    <h2 class="text-2xl pt-3">Nezařazené fotografie</h2>
    <div class="flex gap-4 overflow-x-auto flex-nowrap">
        <div v-for="photo in trip.photos" class="shrink-0">
            <TripPhoto :imageSrc="photo"/>
        </div>
    </div>

    <!-- Description -->
    <h2 class="pt-4 sm:pt-5 text-2xl font-extrabold">Popis cesty</h2>
    <p class="text-lg">{{ trip.description}}</p>
    
    
    <!-- Advantages Disadvantages-->
    <div class="pt-3 mb-16 grid grid-cols-1 to-xs:grid-cols-2 sm:grid-cols-2">
        <div class="advantages">
            <div class="flex">
                <PlusIcon/>
                <p class=" pl-1 pt-0.5 text-xl font-bold">Co se mi líbilo</p>
            </div>
            <ul class="list-inside pl-3.5" style="list-style-type: circle">
                <div v-for="adv in trip.advantages">
                    <li>{{ adv }}</li>
                </div>
            </ul>
        </div>

        <div class="disadvantages">
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
</template>

<style scoped>
ul li::marker {
    font-size: 1.1rem; /* li circle size */
}
</style>