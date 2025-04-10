/* Autor: Radek Jestrabik (xjestr04) */

import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useTripFormStore = defineStore("tripForm", () => {
    const trip = ref({
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

    return {
        trip
    }
})