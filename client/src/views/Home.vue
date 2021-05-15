<template>
  <div>
    <input type="text" v-model="message">
    <button @click="sendMessage()">Send</button>
    <ul>
      <li v-for="message in messages" :key="message">
        {{ message }}
      </li>
    </ul>
  </div>
</template>

<script>

import { io } from "socket.io-client";

export default {
  name: 'Home',
  data() {
    return {
      socket: null,
      message: '',
      messages: [],
    }
  },
  mounted() {
    this.socket = io("http://localhost:3000");

    this.socket.on('message', (msg) => {
      this.messages.push(msg)
    });
  },
  methods: {
    sendMessage() {
      if (this.message) {
        this.socket.emit('message', this.message);
        this.message = '';
      }
    }
  }
}
</script>
