<script setup>
import Navbar from '@/components/Navbar.vue';
import TripCard from '@/components/TripCard.vue';
</script>

<template>

<div class="p-6 mx-auto max-w-full sm:max-w-[90%] lg:max-w-[75%]">
  <Navbar/>
  <h1 class="text-2xl font-extrabold"><b>Cestovní deník</b></h1>

  <div class="grid grid-cols-1 to-xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 content-center">
    <TripCard title="Praha"/>
    <TripCard title="Vídeň"/>
    <TripCard title="Bratislava"/>
  </div>
  
</div>

</template>

<style scoped>

</style>
