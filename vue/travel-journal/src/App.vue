<script setup>
import { RouterView } from 'vue-router';
import Navbar from '@/components/Navbar.vue'
</script>

<template>

<div class="p-6 mx-auto max-w-full sm:max-w-[90%] lg:max-w-[60%]">
  <Navbar/>
  <RouterView/>
</div>

</template>
