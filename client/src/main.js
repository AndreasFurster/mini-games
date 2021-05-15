import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const app = createApp(App)
app.use(router)
app.use(vuetify)

app.provide('socket', socket)

app.mount('#app')
