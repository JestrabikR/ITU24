<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import FormLabel from '@/components/FormLabel.vue';
import PlusIcon from '@/assets/icons/PlusIcon.vue';
import TrashIcon from '@/assets/icons/TrashIcon.vue';
import TripPhoto from '@/components/TripPhoto.vue';

const route = useRoute();
const router = useRouter();
const tripId = route.params.id;

//TODO: dalsi fieldy - obrazky, subtripy, atd
const form = reactive({
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
});

let trip = ref({});
let loading = ref(true);

onMounted(async () => {
    try {
        if (tripId === "") {
            return;
        }
        const response = await axios.get('http://localhost:5000/trip/' + tripId);
        trip.value = response.data;

        //TODO: do form se nastavi uvodni hodnoty
        // takto: form.name = trip.value.name;
        form.photos = trip.value.photos;

    } catch (error) {
        console.error('Error fetching trips', error);
    } finally {
        loading.value = false;
    }
});

const submitHandler = async () => {
    //TODO: from_date nesmi byt vetsi nez until date - nejak validovat a zobrazit 
    
    //TODO: pokud existuje id, poslat update !

    try {
        // send to api add country
        const {data} = await axios.post('http://localhost:5000/trip/add', form, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //TODO: toast
    } catch (e) {
        //TODO: toast
        console.error("Error sending country", e);
    }
}

const addAdvantage = () => {
    form.advantages.push("");
};

const removeAdvantage = (index) => {
    form.advantages.splice(index, 1);
};

const addDisadvantage = () => {
    form.disadvantages.push("");
};

const removeDisadvantage = (index) => {
    form.disadvantages.splice(index, 1);
};

const handleFileUpload = async (event) => {
  const files = event.target.files;
  if (!files) return;

  for (let file of files) {
    const base64 = await toBase64(file);
    form.photos.push(base64);
  }
};

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const removePhoto = (index) => {
  form.photos.splice(index, 1);
};

</script>

<template>
    <div v-if="loading" class="text-center mt-12 w-full">
        <PulseLoader/>
    </div>

    <div v-else>
    <h1 v-if="tripId === ''" class="pt-3 to-xs:pt-5 sm:pt-5 text-3xl font-extrabold">Přidání cesty</h1>
    <h1 v-else class="pt-3 to-xs:pt-5 sm:pt-5 text-3xl font-extrabold">Úprava cesty</h1>
    <form @submit.prevent="submitHandler" class="max-w-lg mx-auto mt-5 to-xs:p-8 sm:p-10 to-xs:shadow-card-shadow sm:shadow-card-shadow rounded-xl">
        <!-- Trip name -->
        <div class="relative z-0 w-full mb-5 group">
            <input v-model="form.name" type="text" name="name" id="name" class="block py-2.5 px-2 w-full text-sm text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <FormLabel for-input="name" value="Název cesty"/>
        </div>

        <!-- Country -->
        <div class="relative z-0 w-full mb-5 group">
            <input v-model="form.country" type="text" name="country" id="country" class="block py-2.5 px-2 w-full text-sm text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <FormLabel for-input="country" value="Země"/>
        </div>

        <!-- Trip description -->
        <div class="relative z-0 w-full mb-5 group">
            <textarea v-model="form.description" name="description" id="description" class="block py-2.5 px-2 w-full text-sm text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required></textarea>
            <FormLabel for-input="description" value="Popis cesty"/>
        </div>

        <!-- Budget -->
        <div class="relative z-0 w-full mb-5 group">
            <input v-model="form.budget" type="number" name="budget" id="budget" class="block py-2.5 px-2 w-full text-sm text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <FormLabel for-input="budget" value="Celková cena"/>
        </div>

        <!-- From date, until date -->
        <div class="grid md:grid-cols-2 md:gap-6">
            <div class="relative z-0 w-full mb-5 group">
                <input v-model="form.from_date" type="date" name="from_date" id="from_date" class="block py-2.5 px-2 w-full text-sm text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <FormLabel for-input="From date" value="Datum začátku"/>
            </div>

            <div class="relative z-0 w-full mb-5 group">
                <input v-model="form.until_date" type="date" name="until_date" id="until_date" class="block py-2.5 px-2 w-full text-sm text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <FormLabel for-input="until_date" value="Datum konce"/>
            </div>
        </div>

        <!-- Advantages -->
        <h3 class="text-lg mt-2">Výhody</h3>
        <div v-for="(advantage, index) in form.advantages" :key="index" class="relative z-0 w-full mb-3 group">
            <input v-model="form.advantages[index]" type="text" class="block py-2.5 px-2 w-full text-sm text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Výhoda" required/>
            <button type="button" @click="removeAdvantage(index)" class="text-red-500">Odstranit</button>
        </div>
        <button type="button" @click="addAdvantage" class="px-4 text-gray-600 rounded-lg">
            <div class="flex gap-1">
                <PlusIcon color="text-gray-600 mt-0.5" size="1.2em"/>
                Přidat výhodu
            </div>
        </button>

        <!-- Disadvantages -->
        <h3 class="text-lg mt-2">Nevýhody</h3>
        <div v-for="(disadvantage, index) in form.disadvantages" :key="index" class="relative z-0 w-full mb-3 group">
            <input v-model="form.disadvantages[index]" type="text" class="block py-2.5 px-2 w-full text-sm text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Nevýhoda" required/>
            <button type="button" @click="removeDisadvantage(index)" class="text-red-500">Odstranit</button>
        </div>
        <button type="button" @click="addDisadvantage" class="px-4 text-gray-600 rounded-lg">
            <div class="flex gap-1">
                <PlusIcon color="text-gray-600 mt-0.5" size="1.2em"/>
                Přidat nevýhodu
            </div>
        </button>

        <!-- Uploading photos -->
        <div class="mt-3">
            <label for="photos" class="block mb-2 text-sm font-medium text-gray-700">Přidat fotky</label>
            <!-- <input type="file" id="photos" multiple accept="image/*" @change="handleFileUpload" class="block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer"/> -->
        </div>

        <!-- photos preview -->
        <div class="mt-5">
            <h3 class="text-lg font-semibold">Nahrané fotky:</h3>
            
            <div class="grid grid-cols-2 to-xs:grid-cols-3 sm:grid-cols-3 gap-4 mt-3">
                <div v-for="(photo, index) in form.photos" :key="index" class="relative">
                    <img :src="photo" alt="Nahraná fotka" class="aspect-square w-32 h-32 object-cover rounded-lg"/>

                    <!-- Remove photo button -->
                    <button @click="removePhoto(index)" class="absolute top-2 left-2 bg-black bg-opacity-25 hover:bg-opacity-50 text-white rounded-full p-2">
                        <TrashIcon/>
                    </button>
                </div>
                <div>
                <label for="photos" class="
                w-32 h-32 rounded-md 
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

        <br>
        <!-- Submit button -->
        <button type="submit" class="px-4 py-2 mt-4 bg-blue-700 text-white hover:bg-blue-800 rounded-lg">Odeslat</button>
    </form>
    </div>

</template>