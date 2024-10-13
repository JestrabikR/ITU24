<script setup>
import { RouterLink } from 'vue-router';

//TODO: zvyraznit vybrany item
</script>

<template>
    <div class="max-w flex items-center justify-between gap-3">
        <div class="flex gap-6">
            <RouterLink to="/"><p class="text-2xl to-xs:text-3xl sm:text-3xl font-extrabold">Cesty</p></RouterLink>
            <RouterLink to="/visited"><p class="text-2xl to-xs:text-3xl sm:text-3xl font-extrabold">Navštívené země</p></RouterLink>
        </div>
    </div>
</template>