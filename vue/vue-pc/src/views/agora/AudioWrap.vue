<template>
  <div class="audio-video-wrap">
    <!-- 视频容器 -->
    <div class="video-wrap">
      <!-- 渲染远端流用 -->
      <div v-for="id in remoteStreamId" :key="id" v-control :id="`remote-${id}`"></div>
    </div>

    <!-- 按钮组 -->
    <div class="bt-group" v-if="['calling'].includes(status)">
      <el-button v-if="!remoteInvitation" type="primary" @click="cancel()">取消</el-button>
      <el-button v-if="remoteInvitation" type="danger" @click="handleAccept(false)">拒绝</el-button>
      <el-button v-if="remoteInvitation" type="success" @click="handleAccept(true)">接受</el-button>
    </div>
    <div v-if="status == 'meeting'" class="bt-group">
      <el-button type="danger" @click="$store.commit('callBreak')">挂断</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      // 创建监听器开关,防止触发多个监听事件
      flag: true,
      // 远端流id数组
      remoteStreamId: []
    }
  },
  computed: {
    ...mapState({
      rtmClient: state => state.agora.rtmClient,
      rtcClient: state => state.agora.rtcClient,
      status: state => state.agora.rtmClient.status,
      joined: state => state.agora.rtcClient._joined,
      remoteInvitation: state => state.agora.rtmClient._remoteInvitation,
      user: state => state.user.userInfo
    })
  },
  created() {
    // 创建监听器
    if (this.flag) {
      this.flag = false

      // 远端流加入监听
      this.rtcClient.on('stream-added', this.streamAdded)

      // 订阅远端流数据监听
      this.rtcClient.on('stream-subscribed', this.streamSubscribed)

      // 远端用户关闭关闭视频
      this.rtcClient.on('mute-video', this.mute)

      // 远端用户关闭关闭音频
      this.rtcClient.on('mute-audio', this.mute)

      // 远端停止推送
      this.rtcClient.on('stream-removed', this.streamRemoved)

      // 远端用户加入频道
      this.rtcClient.on('peer-online', this.peerOnline)

      // 远端用户退出频道
      this.rtcClient.on('peer-leave', this.peerLeave)

      // 错误监听
      this.rtcClient.on('error', this.onError)

      let timer = setTimeout(() => {
        this.flag = true
        clearTimeout(timer)
      }, 1000)
    }
  },
  beforeDestroy() {
    // 移除监听器
    this.rtcClient.off('stream-added', this.streamAdded)
    this.rtcClient.off('stream-subscribed', this.streamSubscribed)
    this.rtcClient.off('stream-removed', this.streamRemoved)
    this.rtcClient.off('peer-leave', this.peerLeave)
    this.rtcClient.off('mute-video', this.mute)
    this.rtcClient.off('peer-online', this.peerOnline)
  },
  methods: {
    /* *
     * 是否接收呼叫邀请
     * @param boolean: true:接收 false:拒绝
     * * */
    handleAccept(boolean) {
      // 拒绝呼叫邀请
      if (!boolean) {
        this.rtmClient.refuseCall()
        return
      }
      // 接受呼叫邀请
      this.rtmClient.acceptCall()
      // 开始音视频
      this.$store.commit('openAV', {
        channel: this.remoteInvitation.callerId,
        uid: this.user.username,
        token: '00699c230d258994fa99019f80f890d3116IACIwezeRsK5Ljh433hOLxujwWOZB/MMIWIEXc1sIWO4iWlyPXEAAAAAEACYBm0zb+XiXgEAAQBv5eJe'
      })
    },

    /* *
     * 取消呼叫邀请
     * * */
    cancel() {
      this.rtmClient.cancelCall()
    },

    /* *
     * 远端流加入监听回调函数
     * * */
    streamAdded(evt) {
      console.log('远端用户id', id, this.rtcClient._uid)
      let remoteStream = evt.stream
      let id = remoteStream.getId()
      if (id !== this.rtcClient._uid) {
        this.remoteStreamId.push(id)
        this.rtcClient.subscribe(remoteStream, err => {
          console.log('错误信息', err)
        })
      }
    },

    /* *
     * 订阅成功后播放远端流监听回调
     * * */
    streamSubscribed(evt) {
      let remoteStream = evt.stream
      // 播放远端流
      remoteStream.play(`remote-${remoteStream.getId()}`)
    },

    /* *
     * 远端用户停止推送
     * * */
    streamRemoved(evt) {
      console.log('远端用户停止推送')
      let remoteStream = evt.stream
      let id = remoteStream.getId()
      if (id !== this.rtcClient._uid) {
        // 将该远端流id移出数组
        if (this.remoteStreamId.indexOf(id) !== -1) {
          this.remoteStreamId.splice(this.remoteStreamId.indexOf(id), 1)
        }
        // 关闭该远端流的接收
        remoteStream.stop('remote_video')
      }
    },

    /* *
     * 远端用户下线
     * * */
    peerLeave(evt) {
      let id = evt.uid
      this.$store.commit('callBreak')

      // 检查是否是当前用户本身
      if (id !== this.rtcClient._uid) {
        // 将该远端流id移出数组
        if (this.remoteStreamId.indexOf(id) !== -1) {
          this.remoteStreamId.splice(this.remoteStreamId.indexOf(id), 1)
        }
      }
    },

    /* *
     * 远端用户关闭摄像头,麦克风等设备
     * * */
    mute() {
      console.log('远端用户关闭摄像头')
    },

    /* *
     * 远端用户上线
     * * */
    peerOnline(evt) {
      console.log('远端用户上线', evt)
    },

    /* *
     * 错误监听
     * * */
    onError(err) {
      console.log('监听到一个错误信息', err)
    }
  },
  directives: {
    control: {
      inserted(el) {
        let timer = window.setTimeout(() => {
          el.getElementsByTagName('video')[0].setAttribute('controls', 'true')
          window.clearTimeout(timer)
        }, 2000)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
@import './style/audioWrap.less';

.audio-video-wrap {
  @flex-column();
  .video-wrap {
    flex: auto;
    height: 0;
    & > div {
      height: 2.32rem;
    }
  }
  .bt-group {
    flex: none;
    padding: 0.3rem;
    width: 100%;
    text-align: center;
  }
}
</style>
