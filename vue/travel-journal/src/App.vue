<script setup>
import { RouterView, useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue'
import { ref } from 'vue';

const route = useRoute();

let is_wide_page = ref(false); 

</script>

<template>

<div class="p-6 mx-auto max-w-full sm:max-w-[90%] lg:max-w-[60%]">
  <Navbar/>
  <RouterView/>
</div>

</template>

<style>
@import 'lightgallery/css/lightgallery.css';
@import 'lightgallery/css/lg-thumbnail.css';
@import 'lightgallery/css/lg-zoom.css';
</style>