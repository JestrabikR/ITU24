<script setup>
import { RouterView, useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue'
import { ref, onMounted } from 'vue';

const route = useRoute();

let is_wide_page = ref(false); 

onMounted(() => {
  if (route.path === '/visited') {
    is_wide_page.value = true;
    console.log("WIDE PAGE");
  }
})
</script>

<template>

<!-- <div class="p-6 mx-auto max-w-full sm:max-w-[90%] lg:max-w-[60%]"> -->
  <div 
    :class="['p-6', 'mx-auto', 'max-w-full', 'sm:max-w-[90%]', {'lg:max-w-[60%]': !is_wide_page}]"
  >
  <Navbar/>
  <RouterView/>
</div>

</template>
