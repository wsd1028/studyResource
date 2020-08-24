<template>
  <div class="chat-wrap">
    <!-- 顶部收件人信息及语音视频操作按钮 -->
    <header>
      <!-- 用户信息 -->
      <div class="userInfo">
        <div class="username">
          <span v-text="receive.accountBaseDto.name"></span>
        </div>
      </div>
      <!-- 音视频按钮组 -->
      <div class="bt-group" v-if="status == 'onLine'">
        <!-- 音频按钮 -->
        <i class="el-icon-phone" @click="$store.commit('makeCall', receive.username)"></i>
      </div>
    </header>
    <!-- 顶部收件人信息及语音视频操作按钮end -->

    <!-- 聊天内容 -->
    <div class="message-wrap">
      <el-scrollbar ref="scrollBar" class="custom-scrollbar">
        <!-- 消息盒子 -->
        <div v-for="(item, index) in histories" :key="index" class="message-box">
          <!-- 接收人 -->
          <div :class="item.sendId == user.username ? 'send' : 'receive'">
            <!-- 头像 -->
            <div class="avatar">
              <el-image
                class="image"
                fit="cover"
                :src="$store.state.config.convertImgUrl(item.sendId == user.username ? user.accountBaseDto.photo : receive.accountBaseDto.photo)"
              >
                <i class="el-icon-user-solid"></i>
              </el-image>
            </div>
            <!-- 信息 -->
            <div class="message">
              <span v-text="item.content.text"></span>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <!-- 聊天内容end -->

    <!-- 底部聊天输入框 -->
    <footer>
      <div class="input-wrap">
        <input @keyup.enter="handleSendMessage" v-model="message" type="text" placeholder="发送消息给TA" />
      </div>
      <el-button type="success" class="send-bt" @click="handleSendMessage">
        <span>发送</span>
      </el-button>
    </footer>
    <!-- 底部聊天输入框end -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      // 发送消息内容
      message: '',
      // 滚动条置底函数(防抖)
      scrollBottom: this.$debounce(() => {
        this.$nextTick(() => {
          this.$refs['scrollBar'].wrap.scrollTop = this.$refs['scrollBar'].wrap.scrollHeight
        })
      }, 600)
    }
  },
  props: {
    receive: Object
  },
  computed: {
    ...mapState({
      // 在线状态
      status: state => state.agora.rtmClient.status,
      // 声网客户端
      rtmClient: state => state.agora.rtmClient,
      // 聊天历史记录
      histories(state) {
        let histories = state.agora.histories
        return histories.filter(item => {
          if (
            [this.$store.state.user.userInfo.username, this.receive.username].includes(item.sendId) &&
            [this.$store.state.user.userInfo.username, this.receive.username].includes(item.receiveId)
          ) {
            this.scrollBottom()
            return true
          } else {
            return false
          }
        })
      },
      // 当前登录用户
      user: state => state.user.userInfo
    })
  },
  methods: {
    /* *
     * 发送消息
     * * */
    handleSendMessage() {
      this.$store.commit('sendMessage', {
        content: { text: this.message },
        sendId: this.user.username,
        receiveId: this.receive.username,
        callback: err => {
          if (err) {
            this.$message.error(err)
            return
          }
          this.scrollBottom()
          // 清除输入框
          this.message = ''
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './style/chart';
</style>
