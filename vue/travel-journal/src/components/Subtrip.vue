<script setup>
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

    <div class="flex gap-4 overflow-x-auto flex-nowrap">
        <div v-for="photo in subtrip['photos']" class="shrink-0">
            <TripPhoto :imageSrc="photo"/>
        </div>
    </div>
</template>