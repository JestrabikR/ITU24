<script setup>

const props = defineProps({
    imageSrc: {
        type: String
    }
});

</script>
  

<template>
    <img :src="imageSrc" alt="Image" class="rounded-3xl aspect-square max-w-64 max-h-64 w-full h-full object-cover"/>
</template>