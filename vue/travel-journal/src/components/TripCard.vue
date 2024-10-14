<script setup>
import { formatDate } from '@/helpers';
import { ref, onMounted } from 'vue';
import placeholderImg from '../assets/images/trip-placeholder-img.jpg';

// defineProps allows passing values to component
const props = defineProps({
    trip: {
        type: Object,
    },
    full_width: {
        type: Boolean,
        default: false
    }
})

let formattedFromDate = ref(null);
let formattedUntilDate = ref(null);

onMounted(() => {
    formattedFromDate.value = formatDate(props.trip["from_date"]);
    formattedUntilDate.value = formatDate(props.trip["until_date"]);
});

</script>

<template>
    <!--TODO: na male obrazovce je to jinak vysoke nez karty bez full_width=true-->
    <div v-if="full_width" class="col-span-2">
        <RouterLink :to="`/trip/${props.trip['id']}`">
            <div class="relative to-xs:h-44 sm:h-52 md:h-64 lg:h-52 xl:h-52 2xl:h-64 rounded-lg overflow-hidden shadow-card-shadow transition-shadow duration-300 hover:shadow-card-shadow-hover ">
                <img v-if="props.trip['photos'].length > 0" :src="props.trip['photos'][0]" class="w-full h-full object-cover">
                <!-- if no image -->
                <img v-else :src="placeholderImg" class="w-full h-full object-cover">
                
                <!-- Overlay and text -->
                <div class="absolute bottom-0 left-0 right-0 h-1/2.5 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <div class="text-white">
                    <h2 class="text-3xl font-bold line-clamp-2 drop-shadow-lg">{{ props.trip["name"] }}</h2>
                    <p class="text-lg drop-shadow-md">{{ props.trip["country"] }}</p>
                    <p class="drop-shadow-sm">{{ formattedFromDate }} - {{ formattedUntilDate }}</p>
                </div>
                </div>
            </div>
        </RouterLink>
    </div>

    <div v-else class="col-span-1">
        <RouterLink :to="`/trip/${props.trip['id']}`">
            <div class="relative max-w-80 to-xs:w-52 to-xs:h-44 sm:w-60 sm:h-52 md:w-72 md:h-64 lg:w-60 lg:h-52 xl:w-60 xl:h-52 2xl:w-72 2xl:h-64 rounded-lg overflow-hidden shadow-card-shadow transition-shadow duration-300 hover:shadow-card-shadow-hover ">
                <img v-if="props.trip['photos'].length > 0" :src="props.trip['photos'][0]" class="w-full h-full object-cover">
                <!-- if no image -->
                <img v-else :src="placeholderImg" class="w-full h-full object-cover">
                
                <!-- Overlay and text -->
                <div class="absolute bottom-0 left-0 right-0 h-1/2.5 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <div class="text-white">
                    <h2 class="text-3xl font-bold line-clamp-2 drop-shadow-lg">{{ props.trip["name"] }}</h2>
                    <p class="text-lg drop-shadow-md">{{ props.trip["country"] }}</p>
                    <p class="drop-shadow-sm">{{ formattedFromDate }} - {{ formattedUntilDate }}</p>
                </div>
                </div>
            </div>
        </RouterLink>
    </div>
</template>