import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './style.css'

// Import notification system
import './services/notification'

// Import Toast notification
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Toast configuration
const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
}

// Create pinia instance
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Create and mount app
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(Toast, toastOptions)
app.mount('#app')
