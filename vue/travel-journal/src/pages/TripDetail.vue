<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const tripId = route.params.id;

onMounted(async () => {
    //TODO: GET /trips/tripId
});

</script>

<template>
    <p>Trip detail page {{ tripId }}</p>
</template>