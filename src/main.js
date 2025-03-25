import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './style.css'

// Import notification system
import './services/notification'

// Create pinia instance
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Create and mount app
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
