import { createApp } from 'vue'
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import ConfirmationService from 'primevue/confirmationservice';


import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import router from './router'


//theme
import "primevue/resources/themes/lara-light-teal/theme.css";     
//core
import "primevue/resources/primevue.min.css";
import "/node_modules/primeflex/primeflex.css"

const app = createApp(App)
app.use(router)
app.use(PrimeVue)
app.use(ToastService);
app.directive('tooltip', Tooltip);
app.use(ConfirmationService);
app.mount('#app')