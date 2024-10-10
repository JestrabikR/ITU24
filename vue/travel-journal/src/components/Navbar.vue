<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="max-w flex items-center justify-between gap-3">
        <div class="flex gap-4">
            <RouterLink to="/"><p class="text-2xl to-xs:text-3xl sm:text-3xl font-extrabold">Cesty</p></RouterLink>
            <RouterLink to="/visited"><p class="text-2xl to-xs:text-3xl sm:text-3xl font-extrabold">Navštívené země</p></RouterLink>
        </div>
        <button class="font-extrabold text-3xl bg-blue-700 px-4 text-white rounded-full">+</button>
    </div>
</template>