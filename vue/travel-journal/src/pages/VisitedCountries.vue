<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';

let visitedCountries = ref([]);

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:5000/countries')
        visitedCountries.value = response.data;
    } catch (error) {
        console.error('Error fetching visited countries', error);
    }
});
</script>

<template>
    <h1 class="py-3 sm:py-4 text-2xl font-extrabold">Navštívené země</h1>
    <!--TODO: layout 80%mapa | 20% seznam navštívených zemí pod sebou-->
</template>