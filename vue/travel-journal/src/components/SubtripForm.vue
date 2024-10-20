<script setup>
import { ref, reactive, defineProps, defineEmits, watch } from 'vue';
import { useTripFormStore } from '@/stores/TripFormStore';
import FormLabel from './FormLabel.vue';
import TrashIcon from '@/assets/icons/TrashIcon.vue';
import PlusIcon from '@/assets/icons/PlusIcon.vue';

import { toBase64 } from '@/helpers';

const tripStore = useTripFormStore();
const props = defineProps({
  showModal: Boolean,
  subtripIndex: {
    type: Number,
    default: -1,
  }
});

const emit = defineEmits(['update:showModal']);

// used for new or existing subtrip
const subtrip = reactive({
  name: '',
  description: '',
  photos: [],
  gps: '',
  favourite: false
});

// depending on subtripIndex either load subtrip or create empty one
watch(() => props.subtripIndex, (newIndex) => {
  if (newIndex !== -1) {
    // load subtrip by subtripIndex
    const existingSubtrip = tripStore.trip.subtrips[newIndex];
    if (existingSubtrip) {
      subtrip.name = existingSubtrip.name;
      subtrip.description = existingSubtrip.description;
      subtrip.photos = existingSubtrip.photos;
      subtrip.gps = existingSubtrip.gps;
      subtrip.favourite = existingSubtrip.favourite;
    }
  } else {
    subtrip.name = '';
    subtrip.description = '';
    subtrip.photos = [];
    subtrip.gps = '';
    subtrip.favourite = false;
  }
}, { immediate: true });

const addSubtrip = () => {
  if (subtrip.name && subtrip.description) {
    if (props.subtripIndex === -1) {
      // if subtripIndex is -1 add new subtrip
      tripStore.trip.subtrips.push({ ...subtrip });
    } else {
      // if subtripIndex is not -1 edit this subtrip
      tripStore.trip.subtrips[props.subtripIndex] = subtrip; // TODO? = { ...newSubtrip }
    }
    
    emit('update:showModal', false);
  } else {
    alert("Vyplňte všechny údaje!");
  }
};

const closeModal = () => {
  emit('update:showModal', false);
  subtrip.name = '';
  subtrip.description = '';
};

const handleSubtripFileUpload = async (event) => {
    console.log("SUBTRIP PHOTO");
    console.log(subtrip);
  const files = event.target.files;
  if (!files) return;

  for (let file of files) {
    console.log("Nth SUBTRIP PHOTO");
    const base64 = await toBase64(file);
    subtrip.photos.push(base64);
  }

  console.log(subtrip);
};

const removePhoto = (index) => {
  subtrip.photos.splice(index, 1);
};

</script>

<template>
<!-- Přidání modálního okna pro Subtrip -->
<div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-5 rounded-lg shadow-lg w-96 to-xs:w-[28rem] sm:w-[34rem] md:w-[36rem] mx-1">
    
    <h2 class="text-2xl mb-4">{{ subtripIndex === -1 ? 'Přidat výlet' : 'Upravit výlet' }}</h2>

        
    <!--TODO: inputy required?-->

    <div class="relative z-0 w-full mb-5 group">
        <input v-model="subtrip.name" type="text" name="name" id="name" class="block py-2.5 px-2 w-full text-sm text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <FormLabel for-input="name" value="Název"/>
    </div>

    <div class="relative z-0 w-full mb-5 group">
        <input v-model="subtrip.description" type="text" name="description" id="description" class="block py-2.5 px-2 w-full text-sm text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <FormLabel for-input="description" value="Popis výletu"/>
    </div>

    <div class="mt-5">
        <h3 class="text-lg">Fotky</h3>
        
        <div class="grid grid-cols-2 to-xs:grid-cols-3 sm:grid-cols-3 gap-4 mt-3">
            <div v-for="(photo, index) in subtrip.photos" :key="index" class="relative">
                <img :src="photo" alt="Nahraná fotka" class="aspect-square object-cover rounded-lg"/>

                <!-- Remove photo button -->
                <button @click="removePhoto(index)" class="absolute top-2 left-2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-2">
                    <TrashIcon/>
                </button>
            </div>
            <div>
            <label for="subtrip-photos" class="
            aspect-square rounded-md 
            text-sm font-semibold 
            bg-transparent hover:bg-gray-200 
            border-gray-300 border-solid border-2
            cursor-pointer flex items-center justify-center">
                <input type="file" id="subtrip-photos" multiple accept="image/*" @change="handleSubtripFileUpload" class="hidden" />
                <PlusIcon size="3em" color="text-gray-600"/>
            </label>
            </div>
        </div>
    </div>


    <!-- TODO? Po uložení / uzavření vyprázdnit políčka a vyresetovat subtripIndex-->
    <div class="flex justify-between mt-4">
        <button @click="closeModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">Zavřít</button>
        <button @click="addSubtrip" class="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg">Uložit</button>
    </div>
</div>
</div>
</template>
  