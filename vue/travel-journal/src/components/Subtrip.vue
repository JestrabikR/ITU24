<script setup>
import Gallery from './Gallery.vue';
import ReadMore from './ReadMore.vue';
import TripPhoto from './TripPhoto.vue';

const props = defineProps({
    subtrip: {
        type: Object,
    }
})
</script>

<template>
    <h2 class="text-2xl pt-3">{{ props.subtrip["name"]}}</h2>
    <ReadMore :text="props.subtrip['description']"/>
    <Gallery :images="subtrip['photos']"/>
</template>