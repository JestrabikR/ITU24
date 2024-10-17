<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import FormLabel from '@/components/FormLabel.vue';

const route = useRoute();
const tripId = route.params.id;

//TODO: dalsi fieldy - obrazky, subtripy, atd
const form = reactive({
    trip_name: "",
    country: "",
    description: "",
    budget: "",
    from_date: "",
    until_date: ""
});

let trip = ref({});
let loading = ref(true);

onMounted(async () => {
    try {
        if (tripId === "") {
            console.log("no ID");
            return;
        }
        const response = await axios.get('http://localhost:5000/trip/' + tripId);
        trip.value = response.data;

        //TODO: do form se nastavi uvodni hodnoty
        // takto: form.trip_name = trip.value.name;

    } catch (error) {
        console.error('Error fetching trips', error);
    } finally {
        loading.value = false;
    }
});

const submitHandler = async () => {
    console.log(form);
}

</script>

<template>
    <div v-if="loading" class="text-center mt-12 w-full">
        <PulseLoader/>
    </div>

    <div v-else>
    <form @submit.prevent="submitHandler" class="max-w-lg mx-auto mt-5 to-xs:p-8 sm:p-10 to-xs:shadow-card-shadow sm:shadow-card-shadow rounded-xl">
        <!-- Trip name -->
        <div class="relative z-0 w-full mb-5 group">
            <input v-model="form.trip_name" type="text" name="trip_name" id="trip_name" class="block py-2.5 px-2 w-full text-sm text-black bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <FormLabel for-input="trip_name" value="Název cesty"/>
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

        <!-- Submit button -->
        <button type="submit" class="text-white align-middle bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Odeslat</button>
    </form>
    </div>

</template>