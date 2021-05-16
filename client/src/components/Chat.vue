<template>
  <el-card>
    <h3>Chat</h3>
    <ul ref="chatMessagesList">
      <li
        v-for="(message, index) in messages"
        :key="index"
        :class="message.sender"
      >
        {{ message.text }}
      </li>
    </ul>
    <el-input v-model="currentMessage" @keyup.enter="sendMessage()">
      <template #suffix>
        <el-button
          type="primary"
          icon="el-icon-s-promotion"
          class="input-button"
          @click="sendMessage()"
        ></el-button>
      </template>
    </el-input>
  </el-card>
</template>

<script>
export default {
  inject: ["socket"],
  data: () => ({
    messages: [],
    currentMessage: "",
  }),
  mounted() {
    this.socket.on("room/data", (data) => {
      if (data.chatMessage) {
        this.messages.push({ sender: "external", text: data.chatMessage });
      }

      if (data.systemMessage) {
        this.messages.push({ sender: "system", text: data.systemMessage });
      }

      this.scrollToBottom();
    });
  },
  methods: {
    sendMessage() {
      if (!this.currentMessage) return;

      this.socket.emit("room/data", { chatMessage: this.currentMessage });
      this.messages.push({ sender: "me", text: this.currentMessage });
      this.scrollToBottom();
      this.currentMessage = "";
    },
    scrollToBottom() {
      this.$nextTick(function() {
        let ul = this.$refs.chatMessagesList;
        ul.scrollTop = ul.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
ul {
  height: calc(100vh - 320px);
  background: #fafafa;
  border: 1px solid black;
  border-radius: 3px;
  padding: 10px;
  list-style-type: none;
  overflow-y: auto;
}

ul::-webkit-scrollbar {
  width: 5px;
}

ul::-webkit-scrollbar-track,
ul::-webkit-scrollbar-thumb {
    background-color: transparent;
}

ul:hover::-webkit-scrollbar-track {
  background-color: #ddd;
}
 
ul:hover::-webkit-scrollbar-thumb {
  background-color: rgb(131, 131, 131); 
}

li {
  margin: 5px;
}

li:before {
  font-weight: bold;
}

li.me:before {
  content: "You: ";
}

li.external:before {
  content: "Player: ";
}

li.system:before {
  content: "System: ";
}

li.me {
  text-align: right;
}

li.system {
  font-style: italic;
}

.input-button {
  position: absolute;
  right: -5px;
  top: 0;
}
</style>