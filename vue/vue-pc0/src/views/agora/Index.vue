<template>
  <div class="container">
    <!-- <el-col>
      <el-input v-model="message"></el-input>
      <el-button type="primary" @click="handleSendMessage">发送消息</el-button>
    </el-col> -->

    <!-- 联络人 -->
    <user-list @checked-user="receive = $event"></user-list>
    <!-- 联络人 -->

    <!-- 聊天区域容器 -->
    <chart-wrap :receive="receive"></chart-wrap>
    <!-- 聊天区域容器end -->

    <!-- 音视频通话 -->
    <audio-wrap></audio-wrap>
    <!-- 音视频通话end -->
  </div>
</template>

<script>
import userList from './UserList'
import chartWrap from './ChartWrap'
import audioWrap from './AudioWrap'
export default {
  data() {
    return {
      // 接受消息人id
      receive: {
        accountBaseDto: {}
      }
    }
  },
  components: {
    userList,
    chartWrap,
    audioWrap
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
.container {
  flex: auto;
  display: flex;
}
</style>
