<template>
  <el-container>
    <el-header>Multiplayer Mini Games</el-header>
    <div class="content">
      <el-row :gutter="20">
        <el-col :span="8">
          <Chat />
        </el-col>
        <el-col :span="16">
          <router-view />
        </el-col>
      </el-row>
    </div>
  </el-container>
</template>

<script>
import Chat from './components/Chat'

export default {
  name: "App",
  components: {
    Chat
  },
  data: () => ({
    //
  }),
};
</script>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap");

  body {
    font-family: "Open Sans", sans-serif;
    background: rgb(236, 236, 236);
  }
</style>

<style scoped>
.el-header {
  background-color: #102c68;
  color: white;
  line-height: 60px;
}

.el-menu {
  border-right: none;
}

.content {
  margin: 30px 20px;
}

</style>