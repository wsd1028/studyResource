<template>
  <el-dialog
    :fullscreen="true"
    v-if="telephoneShow"
    :visible="true"
    :append-to-body="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="dust-map-telephone-dialog-body"
    style="padding:20px"
  >
    <div class="audio-video-wrap">
      <!-- 背景 -->
      <div class="background-wrap">
        <caller-info :caller="caller"></caller-info>
      </div>

      <!-- 视频容器 -->
      <div class="video-wrap">
        <!-- 渲染远端流用 -->
        <div class="video-stream-wrap">
          <div id="remote-stream" class="video-stream"></div>
        </div>
      </div>

      <!-- 按钮组 -->
      <div class="bt-group" v-if="['calling'].includes(status)">
        <!-- 取消按钮 -->
        <el-tooltip effect="dark" content="取消" placement="top-start">
          <el-button v-if="!remoteInvitation" type="danger" circle @click="cancel()" class="el-icon-close"></el-button>
        </el-tooltip>
        <!-- 拒绝按钮 -->
        <el-tooltip effect="dark" content="拒绝" placement="top-start">
          <el-button v-if="remoteInvitation" type="danger" circle @click="handleAccept(false)" class="el-icon-close"></el-button>
        </el-tooltip>
        <!-- 接受按钮 -->
        <el-tooltip effect="dark" content="接受" placement="top-start">
          <el-button v-if="remoteInvitation" type="success" circle @click="handleAccept(true)" class="el-icon-check"></el-button>
        </el-tooltip>
      </div>
      <div v-if="status == 'meeting'" class="bt-group">
        <el-tooltip effect="dark" content="挂断" placement="top-start">
          <el-button
            type="danger"
            circle
            @click="
              $store.commit('changeAudioViewVisible', false)
              $store.commit('callBreak')
            "
            class="el-icon-phone"
          ></el-button>
        </el-tooltip>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import callerInfo from './CallerInfo'

// 呼叫/来电背景音乐
const audioEl = document.createElement('audio')
audioEl.src = '/telephone.mp3'
audioEl.loop = true
// 用户单次交流接触谷歌浏览器自动播放限制
const handle = () => {
  audioEl.play()
  audioEl.pause()
  audioEl.currentTime = 0
  document.removeEventListener('click', handle)
}
document.addEventListener('click', handle)

export default {
  name: 'telephone',
  data() {
    // 用户默认空对象
    let userDefault = {
      accountBaseDto: {},
      accountTypeDto: {},
      jobTitleDtoList: [],
      organizationDto: {}
    }
    return {
      // 创建监听器开关,防止触发多个监听事件
      flag: true,

      // 被呼叫人信息
      caller: userDefault,

      // 根据用户名获取用户信息
      getUserInfo: this.$debounceBefore(
        username =>
          new Promise(resolve => {
            this.$http
              .get('/carp/auth/a/q/account', {
                params: {
                  limit: 1,
                  page: 1,
                  username
                }
              })
              .then(({ code, data }) => {
                if (code === 0) {
                  resolve(data.records[0] || userDefault)
                } else {
                  resolve(userDefault)
                }
              })
              .catch(err => {
                if (err) resolve(userDefault)
              })
          }),
        600
      )
    }
  },
  computed: {
    ...mapState({
      rtmClient: state => state.agora.rtmClient,
      rtcClient: state => state.agora.rtcClient,
      status: state => state.agora.rtmClient.status,
      joined: state => state.agora.rtcClient._joined,
      remoteInvitation: state => state.agora.rtmClient._remoteInvitation,
      invitation: state => state.agora.rtmClient._invitation,
      user: state => state.user.userInfo,
      telephoneShow: state => state.agora.visible
    })
  },
  watch: {
    status(val) {
      switch (val) {
        // 呼叫和被呼叫状态
        case 'calling':
          audioEl.play()
          break

        default:
          audioEl.pause()
          audioEl.currentTime = 0
          break
      }
    }
  },
  beforeDestroy() {
    // 移除监听器
    this.rtmClient.off('LocalInvitationReceivedByPeer', this.onLocalInvitationReceivedByPeer)
    this.rtmClient.off('RemoteInvitationCanceled', this.onRemoteInvitationCanceled)
    this.rtmClient.off('RemoteInvitationReceived', this.onRemoteInvitationReceived)
    this.rtmClient.off('LocalInvitationRefused', this.onLocalInvitationRefused)
    this.rtmClient.off('LocalInvitationFailure', this.onLocalInvitationFailure)
    this.rtmClient.off('RemoteInvitationFailure', this.onLocalInvitationFailure)
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
        // 关闭当前弹窗
        this.$store.commit('changeAudioViewVisible', false)
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
      // 关闭当前弹窗
      this.$store.commit('changeAudioViewVisible', false)
    },

    /* *
     * 远端流加入监听回调函数
     * * */
    streamAdded(evt) {
      console.log('远端用户id', this.rtcClient._uid)
      let remoteStream = evt.stream
      let id = remoteStream.getId()
      if (id !== this.rtcClient._uid) {
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
      let id = remoteStream.getId()
      if (id !== this.rtcClient._uid) {
        // 播放远端流
        remoteStream.play('remote-stream')
      }
    },

    /* *
     * 远端用户停止推送
     * * */
    streamRemoved(evt) {
      console.log('远端用户停止推送')
      let remoteStream = evt.stream
      let id = remoteStream.getId()
      if (id !== this.rtcClient._uid) {
        console.log('远端用户已停止推送')
        // 关闭当前弹窗
        this.$store.commit('changeAudioViewVisible', false)
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
        console.log('远端用户下线')
        // 关闭当前弹窗
        this.$store.commit('changeAudioViewVisible', false)
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
    },

    /* *
     * 呼叫邀请进程失败
     * * */
    onLocalInvitationFailure() {
      this.$message.error('您拨打的用户正忙,无法接听!')
      this.$store.commit('changeAudioViewVisible', false)
    },

    /* *
     * 被呼叫邀请超时或进程失败
     * * */
    onRemoteInvitationFailure() {
      this.$message.error('该呼叫因超时未接听已被挂断!')
      this.$store.commit('changeAudioViewVisible', false)
    },

    /* *
     * 呼叫邀请被拒绝
     * * */
    onLocalInvitationRefused() {
      this.$message.error('对方拒绝接听')
      this.$store.commit('changeAudioViewVisible', false)
    },

    /* *
     * 被呼叫
     * * */
    onRemoteInvitationReceived() {
      // 获取呼叫方信息
      this.$store.commit('changeAudioViewVisible', true)
      let promise = this.getUserInfo(this.remoteInvitation.callerId)
      if (promise) {
        promise.then(caller => (this.caller = caller))
      }
    },

    /* *
     * 对方收到呼叫邀请
     * * */
    onLocalInvitationReceivedByPeer() {
      // 获取被呼叫方信息
      let promise = this.getUserInfo(this.invitation.calleeId)
      if (promise) {
        promise.then(caller => (this.caller = caller))
      }
    },

    /* *
     * 对方取消呼叫邀请
     * * */
    onRemoteInvitationCanceled() {
      this.$message.error('对方已取消')
      this.$store.commit('changeAudioViewVisible', false)
    }
  },
  created() {
    // 创建监听器
    if (this.flag) {
      this.flag = false

      // 被呼叫监听
      this.rtmClient.on('RemoteInvitationReceived', this.onRemoteInvitationReceived)

      // 呼叫邀请被接受
      this.rtmClient.on('LocalInvitationReceivedByPeer', this.onLocalInvitationReceivedByPeer)

      // 呼叫邀请被拒绝监听
      this.rtmClient.on('LocalInvitationRefused', this.onLocalInvitationRefused)

      // 对方取消呼叫
      this.rtmClient.on('RemoteInvitationCanceled', this.onRemoteInvitationCanceled)

      // 呼叫邀请进程失败监听
      this.rtmClient.on('LocalInvitationFailure', this.onLocalInvitationFailure)

      // 被呼叫邀请进程失败监听
      this.rtmClient.on('RemoteInvitationFailure', this.onRemoteInvitationFailure)

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
  components: {
    callerInfo
  }
}
</script>

<style lang="less" scoped>
.audio-video-wrap {
  position: absolute;
  background: url(/telephone-bg.jpg) no-repeat;
  background-size: cover;
  .background-wrap {
    background-color: rgba(34, 34, 34, 0.75);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &,
  .video-wrap {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .video-wrap,
  .bt-group {
    position: absolute;
  }
  .video-wrap {
    .video-stream-wrap,
    .video-stream {
      height: 100%;
      width: 100%;
    }
  }
  .bt-group {
    display: none;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0.3rem;
    background-image: linear-gradient(to bottom, rgba(34, 34, 34, 0), rgba(34, 34, 34, 0.6));
    text-align: center;
  }
  &:hover {
    .bt-group {
      display: block;
    }
  }
}
</style>

<style lang="less">
.dust-map-telephone-dialog-body {
  position: relative;
}
</style>
