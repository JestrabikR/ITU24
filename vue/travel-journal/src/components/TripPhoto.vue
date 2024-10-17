<script setup>

const props = defineProps({
    imageSrc: {
        type: String
    }
});

</script>
  

<template>
    <img :src="imageSrc" class="pt-2 rounded-3xl aspect-square w-36 h-36 to-xs:w-48 to-xs:h-48 sm:w-56 sm:h-56 object-cover cursor-pointer"/>
</template>