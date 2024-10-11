<script setup>
import TripPhoto from './TripPhoto.vue';

const props = defineProps({
    subtrip: {
        type: Object,
    }
})
</script>

<template>
    <h2 class="text-2xl pt-3">{{ props.subtrip["name"]}}</h2>
    <p class="text-lg">{{ props.subtrip["description"]}}</p>
    <!--TODO: zobrazit vice... na description-->

    <div class="flex gap-4 overflow-x-auto flex-nowrap">
        <div v-for="photo in subtrip['photos']" class="shrink-0">
            <TripPhoto :imageSrc="photo"/>
        </div>
    </div>
</template>