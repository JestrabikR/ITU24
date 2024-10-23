<script setup>
import MenuIcon from '@/assets/icons/MenuIcon.vue';
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const isActive = (routePath) => {
    const route = useRoute();
    return route.path === routePath;
}

const isMenuOpened = ref(false);

</script>

<template>
    <div class="max-w flex items-center justify-between gap-3">
        <div class="hidden sm:flex gap-6">
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
        
        <div class="sm:hidden">
            <button @click="isMenuOpened = !isMenuOpened;" class="text-xl font-bold"><MenuIcon/></button>
        </div>

        <div v-if="isMenuOpened" class="absolute top-0 left-0 w-full h-screen bg-gray-900 z-[10000] flex flex-col items-center justify-center text-white">
            <RouterLink @click="isMenuOpened = false" to="/" class="mb-4 text-2xl font-bold">Cesty</RouterLink>
            <RouterLink @click="isMenuOpened = false" to="/visited" class="mb-4 text-2xl font-bold">Navštívené země</RouterLink>
            <RouterLink @click="isMenuOpened = false" to="/gallery" class="mb-4 text-2xl font-bold">Galerie</RouterLink>
            <button @click="isMenuOpened = false" class="mt-4 px-4 py-2 text-3xl text-white rounded-lg">x</button>
        </div>
    </div>
</template>