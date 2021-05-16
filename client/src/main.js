import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'

import { io } from "socket.io-client";

import 'element-plus/lib/theme-chalk/index.css'
import 'normalize.css'

const socket = io("http://localhost:3000");

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.provide('socket', socket)
app.provide('connectionInfo', {})

app.mount('#app')
