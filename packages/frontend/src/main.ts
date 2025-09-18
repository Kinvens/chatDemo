import './assets/main.css'
import 'ant-design-vue/dist/reset.css'; // Vue3 推荐
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
