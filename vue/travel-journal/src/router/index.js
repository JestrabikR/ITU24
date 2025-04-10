/* Autor: Radek Jestrabik (xjestr04) */

import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/pages/HomePage.vue';
import TripDetail from '@/pages/TripDetail.vue';
import NotFound from '@/pages/NotFound.vue';
import AllTrips from '@/pages/AllTrips.vue';
import VisitedCountries from '@/pages/VisitedCountries.vue';
import TripForm from '@/pages/TripForm.vue';
import SubtripForm from '@/components/SubtripForm.vue';
import AllTripsGallery from '@/pages/AllTripsGallery.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
        },
        {
            path: '/gallery',
            name: 'gallery',
            component: AllTripsGallery,
        },
        {
            path: '/trip/:id',
            name: 'tripDetail',
            component: TripDetail
        },
        {
            path: '/trips/:tripStatus',
            name: 'allTrips',
            component: AllTrips
        },
        {
            path: '/visited',
            name: 'visited',
            component: VisitedCountries
        },
        {
            path: '/form/trip/:id?', // if id is empty => it is a create form else update
            name: 'tripForm',
            component: TripForm
        },
        {
            path: '/form/subtrip/:id', // if id is empty => it is a create form else update
            name: 'subtripForm',
            component: SubtripForm
        },
        {
            path: '/:catchAll(.*)',
            name: 'notFound',
            component: NotFound
        }
    ]
});

export default router;
