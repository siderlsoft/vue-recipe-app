import { createApp } from 'vue'
import './main.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import router from '../src/router';
import Toast, { type PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
const options: PluginOptions = {};
app.use(Toast, options);
app.mount('#app');
