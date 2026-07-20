import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'
import { enableMainThreadBlocking } from 'ios-vibrator-pro-max'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import 'vue-sonner/style.css'

import App from './App.vue'
import './global.css'
import { createAppRouter } from './router'
import { initDayjs } from './shared/utils/time-utils'

polyfillCountryFlagEmojis()
enableMainThreadBlocking(false)
initDayjs()

const app = createApp(App)

app.use(createPinia())
app.use(createAppRouter())
app.mount('#root')
