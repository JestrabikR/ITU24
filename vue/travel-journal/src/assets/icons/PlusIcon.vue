<script setup>
const props = defineProps({
    color: {
        type: String
    },
    size: {
        type: String,
        default: "2em"
    }
});

console.log(props.color);
</script>

<template>
<svg xmlns="http://www.w3.org/2000/svg" :class="color" :width="size" :height="size" viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="16;0"/></path>
        <path d="M12 5v14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="16;0"/></path>¨
    </g>
</svg>
</template>