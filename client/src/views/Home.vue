<template>
  <div>
    <input type="text" v-model="message">
    <button @click="sendMessage()">Send</button>
    <ul>
      <li v-for="message in messages" :key="message">
        {{ message }}
      </li>
    </ul>
    <ConnectFour/>
  </div>
</template>

<script>

import ConnectFour from '../components/games/connect-four'

export default {
  name: 'Home',
  components: {
    ConnectFour,
  },
  data() {
    return {
      socket: null,
      message: '',
      messages: [],
    }
  },
  mounted() {
    

    // this.socket.on('message', (msg) => {
    //   this.messages.push(msg)
    // });
  },
  methods: {
    sendMessage() {
      // if (this.message) {
      //   this.socket.emit('message', this.message);
      //   this.message = '';
      // }
    }
  }
}
</script>

