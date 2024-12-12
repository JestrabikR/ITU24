<script setup>
defineProps({
    "value": {
        type: String
    },
    "forInput": {
        type: String
    }
})
</script>

<template>
    <label :for="forInput" class="absolute text-sm text-gray-500 duration-300 transform pl-2 -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 peer-focus:-translate-x-1">{{ value }}</label>
</template>