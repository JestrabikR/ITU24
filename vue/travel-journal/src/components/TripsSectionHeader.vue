<script setup>
import ArrowRightIcon from '@/assets/icons/ArrowRightIcon.vue';

const props = defineProps({
    sectionName: {
        type: String,
    },
    tripStatus: {
        type: String
    }
});


</script>

<template>
<div class="flex justify-between items-center">
    <h2 class="pt-5 pb-2 sm:pt-6 sm:pb-3 text-2xl font-extrabold">{{ sectionName }}</h2>
    <RouterLink :to="`/trips/${props.tripStatus}`">
        <div class="flex items-center space-x-1 pt-5 pb-2 sm:pt-6">
            <p class="pr-0 to-xs:pr-1 sm:pr-1">Zobrazit všechny</p>
            <ArrowRightIcon />
        </div>
    </RouterLink>
</div>
</template>