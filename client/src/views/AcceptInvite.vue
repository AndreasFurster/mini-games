<template>
  <el-skeleton v-loading.fullscreen.lock="true" animated />
</template>

<script>
import router from '../router'

export default {
  inject: ['socket'],
  mounted() {
    const roomId = this.$route.params.id;
    if(roomId) {
      this.socket.emit('room/join', roomId);
    }

    this.socket.on('room/data', data => {
      if(data.startGame) {
        router.push({ name: data.game })
      }
    })
  },
}
</script>



