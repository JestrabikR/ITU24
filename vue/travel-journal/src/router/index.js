import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/pages/HomePage.vue';
import TripDetail from '@/pages/TripDetail.vue';
import NotFound from '@/pages/NotFound.vue';
import AllTrips from '@/pages/AllTrips.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
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
            path: '/:catchAll(.*)',
            name: 'notFound',
            component: NotFound
        }
    ]
});

export default router;
