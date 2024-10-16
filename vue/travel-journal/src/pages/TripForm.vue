<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

const route = useRoute();
const tripId = route.params.id;

let trip = ref({});
let loading = ref(true);

onMounted(async () => {
    console.log(tripId);
    try {
        if (tripId === "") {
            console.log("no ID");
            return;
        }
        const response = await axios.get('http://localhost:5000/trip/' + tripId);
        trip.value = response.data;
    } catch (error) {
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
        <p>načteno</p>
    </div>

</template>