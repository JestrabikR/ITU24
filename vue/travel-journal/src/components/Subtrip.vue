<script setup>
const props = defineProps({
    subtrip: {
        type: Object,
    }
})
</script>

<template>
    <h2 class="text-2xl pt-2">{{ props.subtrip["name"]}}</h2>
    <p class="text-lg">{{ props.subtrip["description"]}}</p>
    <!--TODO: zobrazit vice... na description-->

    <!--TODO: obrazky-->
</template>