<script setup>
import { ref, reactive, defineProps, defineEmits, watch, watchEffect } from 'vue';
import { useTripFormStore } from '@/stores/TripFormStore';
import FormLabel from './FormLabel.vue';
import TrashIcon from '@/assets/icons/TrashIcon.vue';
import PlusIcon from '@/assets/icons/PlusIcon.vue';

import { toBase64 } from '@/helpers';
import L from 'leaflet';

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
  gps: [50.0755, 14.4378], // default view and marker
  favourite: false
});

const initializeSubtrip = (index) => {
    if (index !== -1) {
    // load subtrip by subtripIndex
    const existingSubtrip = tripStore.trip.subtrips[index];

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
    subtrip.gps = [50.0755, 14.4378]; // default view and marker
    subtrip.favourite = false;
  }
}

// depending on subtripIndex either load subtrip or create empty one
watch(() => props.subtripIndex, (newIndex) => {
  initializeSubtrip(newIndex);
}, { immediate: true });

const addSubtrip = () => {
  console.log(subtrip.name);
  console.log(subtrip.description);
  console.log(subtrip.gps);
  if (subtrip.name && subtrip.description && subtrip.gps) {
    if (props.subtripIndex === -1) {
      // if subtripIndex is -1 add new subtrip
      tripStore.trip.subtrips.push({ ...subtrip });
    } else {
      // if subtripIndex is not -1 edit this subtrip
      tripStore.trip.subtrips[props.subtripIndex] = subtrip; // TODO? = { ...newSubtrip }
    }
    
    // close modal
    emit('update:showModal', false);
  } else {
    alert("Vyplňte všechny údaje!");
  }
};

const closeModal = () => {
    emit('update:showModal', false);
    // reset unsaved changes
    initializeSubtrip(props.subtripIndex);
};

const handleSubtripFileUpload = async (event) => {
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


// Map
const map = ref(null);
const mapContainer = ref(null);
const marker = ref([50.0755, 14.4378]); // default view and marker

// Watches for changes and rerenders map
watchEffect(() => {
    // initialize only once
    if (mapContainer.value) {
        if (map.value) {
            map.value.remove();
            map.value = null;
        }
        
        // initialize map
        map.value = L.map(mapContainer.value).setView(subtrip.gps, 13);

        // create marker
        marker.value = L.marker(subtrip.gps).addTo(map.value);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map.value);

        // adding marker on click
        map.value.on('click', function(e) {
            // if marker already exists remove it
            if (marker.value) {
                map.value.removeLayer(marker.value);
                subtrip.gps = e.latlng;
            }
            console.log("BEF");
            console.log(marker.value);
            marker.value = L.marker(e.latlng).addTo(map.value);
            
            console.log("AFT");
            console.log(marker.value);
        });
    }
});

</script>

<template>
<!-- Přidání modálního okna pro Subtrip -->
<div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div id="modal" class="bg-white p-5 overflow-y-scroll max-h-[95vh] rounded-lg shadow-lg w-96 to-xs:w-[28rem] sm:w-[34rem] md:w-[36rem] mx-1">
    
    <h2 class="text-2xl mb-3">{{ subtripIndex === -1 ? 'Přidat výlet' : 'Upravit výlet' }}</h2>

    <!-- Map -->        
    <p class="mb-1 text-sm text-gray-600">Kliknutím na mapu vyberte místo</p>
    <div ref="mapContainer" class="mb-5 w-full h-64 to-xs:h-72 sm:h-80 rounded-2xl shadow-card-shadow"></div>

    <!-- Name -->
    <div class="relative z-0 w-full mb-5 mt-8 group">
        <input v-model="subtrip.name" type="text" name="name" id="name" class="block py-2.5 px-2 w-full text-sm text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
        <FormLabel for-input="name" value="Název"/>
    </div>

    <!-- Description -->
    <div class="relative z-0 w-full mb-5 group">
        <textarea v-model="subtrip.description" name="description" id="description" class="block py-2 px-2 w-full text-md text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "></textarea>
        <FormLabel for-input="description" value="Popis výletu"/>
    </div>

    <!-- Photos -->
    <div class="mt-5">
        <h3 class="text-lg">Fotky</h3>
        
        <div class="grid grid-cols-2 to-xs:grid-cols-3 sm:grid-cols-3 gap-4 mt-3">
            <div v-for="(photo, index) in subtrip.photos" :key="index" class="relative">
                <img :src="photo" alt="Nahraná fotka" class="aspect-square object-cover rounded-lg"/>

                <!-- Remove photo button -->
                <button @click.prevent="removePhoto(index)" class="absolute top-2 left-2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-2">
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

    <!-- Buttons -->
    <div class="flex justify-between mt-4">
        <button @click.prevent="closeModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">Zavřít</button>
        <button @click.prevent="addSubtrip" class="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg">Uložit</button>
    </div>
</div>
</div>
</template>
  

<style scoped>
/*scrollbar style*/
#modal::-webkit-scrollbar {
    width: 8px;
    border-radius: 10px;
}

#modal::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
}

#modal::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
}

#modal::-webkit-scrollbar-thumb:hover {
    background-color: #777;
}

</style>