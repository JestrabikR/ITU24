<script setup>
import { onMounted } from 'vue';

let trips = ref([]);

onMounted(async () => {
    const response = await axios.get('http://localhost:5000/trips')
    trips.value = response.data;
})
</script>

<template>

</template>