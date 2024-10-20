<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import FormLabel from '@/components/FormLabel.vue';
import PlusIcon from '@/assets/icons/PlusIcon.vue';
import TrashIcon from '@/assets/icons/TrashIcon.vue';
import { useTripFormStore } from '@/stores/TripFormStore';
import SubtripForm from '@/components/SubtripForm.vue';
import { toBase64 } from '@/helpers';

const tripStore = useTripFormStore();

const route = useRoute();
const router = useRouter();
const tripId = route.params.id;

const subtripIndex = ref(-1); // -1 means that new subtrip will be created in modal

let trip = ref({});
let loading = ref(true);

onMounted(async () => {
    try {
        if (tripId === "") {
            tripStore.trip = {
                name: "",
                country: "",
                description: "",
                budget: "",
                from_date: "",
                until_date: "",
                subtrips: [],
                photos: [],
                advantages: [],
                disadvantages: []
            };

            console.log(tripStore.trip);
            return;
        }
        const response = await axios.get('http://localhost:5000/trip/' + tripId);
        trip.value = response.data;

        // TODO: ma to tady byt?
        // // only load if wrong trip is loaded in store
        // if (tripStore.trip.id !== tripId) {
        //     tripStore.trip = trip.value;
        // }

        // set trip value to trip store
        tripStore.trip = trip.value;

        console.log(tripStore.trip);
    } catch (error) {
        console.error('Error fetching trips', error);
    } finally {
        loading.value = false;
    }
});

// TODO: Z NEJAKEHO DUVODU SE TO POSILA I KDYZ NEKLIKNU NA ULOZIT
const submitHandler = async () => {
    //TODO: validace: (nejak zobrazovat chyby)
        //TODO: from_date nesmi byt vetsi nez until date
        //TODO: budget >= 0
    
    //TODO: pokud existuje id, poslat update !

    try {
        console.log("SENDING TO API");
        // TODO:send to api add country
        // const {data} = await axios.post('http://localhost:5000/trip/add', tripStore.trip, {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
        //TODO: toast
    } catch (e) {
        //TODO: toast
        console.error("Error sending country", e);
    }
}

const addAdvantage = () => {
    tripStore.trip.advantages.push("");
};

const removeAdvantage = (index) => {
    tripStore.trip.advantages.splice(index, 1);
};

const addDisadvantage = () => {
    tripStore.trip.disadvantages.push("");
};

const removeDisadvantage = (index) => {
    tripStore.trip.disadvantages.splice(index, 1);
};

const handleFileUpload = async (event) => {
  const files = event.target.files;
  if (!files) return;

  for (let file of files) {
    const base64 = await toBase64(file);
    tripStore.trip.photos.push(base64);
  }
};

const removePhoto = (index) => {
  tripStore.trip.photos.splice(index, 1);
};

const showSubtripModal = ref(false);

const openSubtripModal = (index) => {
    subtripIndex.value = index;
    showSubtripModal.value = true;
};

const deleteSubtrip = (index) => {
    if (index < 0 || index > tripStore.trip.subtrips.length - 1) {
        console.error("Wrong subtrip, cannot be deleted");
        return;
    } 
    console.log("deleting");
    tripStore.trip.subtrips.splice(index, 1);
}

</script>

<template>
    <div v-if="loading" class="text-center mt-12 w-full">
        <PulseLoader/>
    </div>

    <div v-else>
    <h1 v-if="tripId === ''" class="pt-3 to-xs:pt-5 sm:pt-5 text-3xl font-extrabold">Přidání cesty</h1>
    <h1 v-else class="pt-3 to-xs:pt-5 sm:pt-5 text-3xl font-extrabold">Úprava cesty</h1>
    <form @submit.prevent="submitHandler" class="max-w-xl mx-auto mt-5 to-xs:p-8 sm:p-10 to-xs:shadow-card-shadow sm:shadow-card-shadow rounded-xl">
        <!-- Trip name -->
        <div class="relative z-0 w-full mb-5 group">
            <input v-model="tripStore.trip.name" type="text" name="name" id="name" class="block py-2 px-2 w-full text-md text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <FormLabel for-input="name" value="Název cesty"/>
        </div>

        <!-- Country -->
        <div class="relative z-0 w-full mb-5 group">
            <input v-model="tripStore.trip.country" type="text" name="country" id="country" class="block py-2 px-2 w-full text-md text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <FormLabel for-input="country" value="Země"/>
        </div>

        <!-- Trip description -->
        <div class="relative z-0 w-full mb-5 group">
            <textarea v-model="tripStore.trip.description" name="description" id="description" class="block py-2 px-2 w-full text-md text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required></textarea>
            <FormLabel for-input="description" value="Popis cesty"/>
        </div>

        <!-- Budget -->
        <div class="relative z-0 w-full mb-5 group">
            <input v-model="tripStore.trip.budget" type="number" name="budget" id="budget" class="block py-2 px-2 w-full text-md text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <FormLabel for-input="budget" value="Celková cena"/>
        </div>

        <!-- From date, until date -->
        <div class="grid md:grid-cols-2 md:gap-6">
            <div class="relative z-0 w-full mb-5 group">
                <input v-model="tripStore.trip.from_date" type="date" name="from_date" id="from_date" class="block py-2 px-2 w-full text-md text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <FormLabel for-input="From date" value="Datum začátku"/>
            </div>

            <div class="relative z-0 w-full mb-5 group">
                <input v-model="tripStore.trip.until_date" type="date" name="until_date" id="until_date" class="block py-2 px-2 w-full text-md text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <FormLabel for-input="until_date" value="Datum konce"/>
            </div>
        </div>

        <!-- Advantages -->
        <h3 class="text-lg mt-2">Výhody</h3>
        <div v-for="(advantage, index) in tripStore.trip.advantages" :key="index" class="relative z-0 w-full mb-1 group">
            <input v-model="tripStore.trip.advantages[index]" type="text" class="block py-2 px-2 w-full text-md text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Výhoda" required/>
            <button type="button" @click="removeAdvantage(index)" class="text-red-500">Odstranit</button>
        </div>
        <button type="button" @click="addAdvantage" class="px-4 text-gray-600 rounded-lg">
            <div class="flex gap-1">
                <PlusIcon color="text-gray-600 mt-0.5" size="1.2em"/>
                Přidat výhodu
            </div>
        </button>

        <!-- Disadvantages -->
        <h3 class="text-lg mt-3">Nevýhody</h3>
        <div v-for="(disadvantage, index) in tripStore.trip.disadvantages" :key="index" class="relative z-0 w-full mb-1 group">
            <input v-model="tripStore.trip.disadvantages[index]" type="text" class="block py-2 px-2 w-full text-md text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Nevýhoda" required/>
            <button type="button" @click="removeDisadvantage(index)" class="text-red-500">Odstranit</button>
        </div>
        <button type="button" @click="addDisadvantage" class="px-4 text-gray-600 rounded-lg">
            <div class="flex gap-1">
                <PlusIcon color="text-gray-600 mt-0.5" size="1.2em"/>
                Přidat nevýhodu
            </div>
        </button>

        <!-- Photos -->
        <div class="mt-5">
            <h3 class="text-lg">Nezařazené fotky</h3>
            
            <div class="grid grid-cols-2 to-xs:grid-cols-3 sm:grid-cols-3 gap-4 mt-3">
                <div v-for="(photo, index) in tripStore.trip.photos" :key="index" class="relative">
                    <img :src="photo" alt="Nahraná fotka" class="aspect-square object-cover rounded-lg"/>

                    <!-- Remove photo button -->
                    <button @click="removePhoto(index)" class="absolute top-2 left-2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-2">
                        <TrashIcon/>
                    </button>
                </div>
                <div>
                <label for="photos" class="
                aspect-square rounded-md 
                text-sm font-semibold 
                bg-transparent hover:bg-gray-200 
                border-gray-300 border-solid border-2
                cursor-pointer flex items-center justify-center">
                    <input type="file" id="photos" multiple accept="image/*" @change="handleFileUpload" class="hidden" />
                    <PlusIcon size="3em" color="text-gray-600"/>
                </label>
                </div>
            </div>
        </div>
        

        <!-- Subtrips -->
        <h3 class="text-lg mt-4">Výlety</h3>

        <div class="mb-3">
            <div v-for="(subtrip, index) in tripStore.trip.subtrips" :key="index" class="mb-2.5">
                <div class="border p-3 rounded-md">
                    <h4 class="font-semibold">{{ subtrip.name }}</h4>
                    <p class="line-clamp-1">{{ subtrip.description }}</p>
                </div>
                <div class="pl-2">
                    <!--TODO: potvrzeni pred smazanim-->
                    <button @click="openSubtripModal(index)" class="mr-3 text-blue-700">Upravit</button>
                    <button @click="deleteSubtrip(index)" class="text-red-500">Odstranit</button>
                </div>
            </div>
        </div>

        <button type="button" @click="openSubtripModal(-1)" class="px-2 py-1 mb-2 text-gray-600 rounded-lg border-gray-600 border-2 hover:bg-gray-50">
            <div class="flex gap-1">
                <PlusIcon color="text-gray-600 mt-0.5" size="1.2em"/>
                Přidat výlet
            </div>
        </button>

        <SubtripForm 
        :showModal="showSubtripModal" 
        :subtripIndex="subtripIndex" 
        @update:showModal="showSubtripModal = $event" />

        <br>
        <!-- Submit button -->
        <button type="submit" class="px-4 text-lg py-2 mt-5 bg-blue-700 text-white hover:bg-blue-800 rounded-lg">Uložit</button>

        <!--TODO: REMOVE-->
        <br>
    </form>
    </div>

</template>