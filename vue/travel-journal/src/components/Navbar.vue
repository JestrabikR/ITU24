<script setup>
import { RouterLink, useRoute } from 'vue-router';

const isActive = (routePath) => {
    const route = useRoute();
    return route.path === routePath;
}
</script>

<template>
    <div class="max-w flex items-center justify-between gap-3">
        <div class="flex gap-6">
            <RouterLink to="/">
                <p :class="[isActive('/') ? 'border-b-4 border-black' : '', 'transition-color duration-200', 'text-2xl', 'to-xs:text-3xl', 'sm:text-3xl', 'font-extrabold']">Cesty</p>
            </RouterLink>
            <RouterLink to="/visited">
                <p :class="[isActive('/visited') ? 'border-b-4 border-black' : '', 'transition-color duration-200', 'text-2xl', 'to-xs:text-3xl', 'sm:text-3xl', 'font-extrabold']">Navštívené země</p>
            </RouterLink>
            <RouterLink to="/gallery">
                <p :class="[isActive('/gallery') ? 'border-b-4 border-black' : '', 'transition-color duration-200', 'text-2xl', 'to-xs:text-3xl', 'sm:text-3xl', 'font-extrabold']">Galerie</p>
            </RouterLink>
        </div>
    </div>
</template>