import { createRouter, createWebHistory } from 'vue-router'

import MainPage from '../pages/main-page/MainPage.vue'

export function createAppRouter() {
    return createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [
            {
                component: MainPage,
                path: '/:pathMatch(.*)*'
            }
        ]
    })
}
