import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'

import { io } from "socket.io-client";

import 'element-plus/lib/theme-chalk/index.css'
import 'normalize.css'

if(!process.env.VUE_APP_SERVER_URL) {
    console.error('Server url is not defined in env!')
}

const socket = io(process.env.VUE_APP_SERVER_URL, {
    transports: ['websocket'],
    upgrade: false,
});

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.provide('socket', socket)
app.provide('connectionInfo', {})

app.mount('#app')
