import './assets/main.css';
import router from './router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(Toast, {})

app.mount('#app');
