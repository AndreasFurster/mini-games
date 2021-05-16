<template>
  <el-card>
    <el-form>
      <h2>Invite a friend</h2>
      <el-form-item>
        <h3>Select a game</h3>
        <el-radio v-model="game" label="ConnectFour">Connect Four</el-radio>
      </el-form-item>

      <el-form-item>
        <h3>Share link to a friend</h3>
        <el-input :value="url" :disabled="true">
          <template #suffix>
            <el-tooltip content="✔ Copied!" placement="top" v-model="copiedTooltip" :manual="true">
              <el-button type="primary" icon="el-icon-share" class="input-button" @click="copyInvite()"></el-button>
            </el-tooltip>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { nanoid } from 'nanoid'
import copy from 'copy-to-clipboard';
import router from '../router'

export default {
  name: 'Home',
  inject: ['socket'],
  data() {
    return {
      game: 'ConnectFour',
      roomId: null,
      copiedTooltip: false,
      copiedTooltipTimeout: null
    }
  },
  mounted() {
    this.roomId = nanoid(16)
    this.socket.emit('room/join', this.roomId);

    this.socket.on('room/info', (info) => {
      if(info.userCount == 2) {
        this.socket.emit('room/data', {
          startGame: true,
          game: this.game,
        })

        router.push({ name: this.game })
      }
    });
  },
  computed: {
    url() {
      return location.href + 'invite/' + this.roomId
    }
  },
  methods: {
    copyInvite() {
      if(this.copiedTooltipTimeout) clearTimeout(this.copiedTooltipTimeout)
      
      copy(this.url);

      this.copiedTooltip = true
      this.copiedTooltipTimeout = setTimeout(() => this.copiedTooltip = false, 2000)
    }
  }
}
</script>


<style scoped>
  .input-button {
    position: absolute;
    right: -5px;
    top: 0;
  }
</style>

