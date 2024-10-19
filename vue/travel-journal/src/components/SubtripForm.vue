<script setup>
import { ref, reactive, defineProps, defineEmits } from 'vue';
import { useTripFormStore } from '@/stores/TripFormStore';
import FormLabel from './FormLabel.vue';

const tripStore = useTripFormStore();
const props = defineProps({
  showModal: Boolean
});

const emit = defineEmits(['update:showModal']);

const newSubtrip = reactive({
  name: '',
  description: '',
  photos: [],
  gps: '',
  favourite: false
});

const addSubtrip = () => {
  if (newSubtrip.name && newSubtrip.description) {

    tripStore.trip.subtrips.push(newSubtrip);

    emit('update:showModal', false);
  } else {
    alert("Vyplňte všechny údaje!");
  }
};

const closeModal = () => {
  emit('update:showModal', false);
  newSubtrip.name = '';
  newSubtrip.description = '';
};
</script>

<template>
<!-- Přidání modálního okna pro Subtrip -->
<div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-5 rounded-lg shadow-lg w-96 to-xs:w-[28rem] sm:w-[34rem] md:w-[36rem] mx-1">
    
    <!--TODO: přidat / upravit-->
    <h2 class="text-2xl mb-4">Přidat výlet</h2>

        
    <!--TODO: inputy required?-->

    <div class="relative z-0 w-full mb-5 group">
        <input v-model="newSubtrip.name" type="text" name="name" id="name" class="block py-2.5 px-2 w-full text-sm text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <FormLabel for-input="name" value="Název"/>
    </div>

    <div class="relative z-0 w-full mb-5 group">
        <input v-model="newSubtrip.description" type="text" name="description" id="description" class="block py-2.5 px-2 w-full text-sm text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <FormLabel for-input="description" value="Popis výletu"/>
    </div>

    <div class="flex justify-between">
        <button @click="closeModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">Zavřít</button>
        <button @click="addSubtrip" class="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg">Uložit</button>
    </div>
</div>
</div>
</template>
  