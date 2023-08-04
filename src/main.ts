import { createApp } from 'vue'
import Toastify from 'vue3-toastify';
import './style.css'
import App from './App.vue'
import router from './router/router.ts'

const app = createApp(App)
app.use(router)
app.use(Toastify);
app.mount('#app')



