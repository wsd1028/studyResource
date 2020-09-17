/* *
 * 声网音视频通话操作手柄
 * */
import { Notification as $notify } from 'element-ui'
import RTMClient from '@/libs/agora/rtm-client'
import RTCClient from '@/libs/agora/rtc-client'

export default {
  state: {
    // rtm客户端
    rtmClient: null,
    // rtc客户端
    rtcClient: null,
    // 音视频通话弹窗显示控制器
    visible: false,
    // 历史记录
    histories: []
  },
  mutations: {
    // 声网初始化操作
    agoraInit(state) {
      // 声网RTM秘钥
      let agoraRTMAppId = '414a621c09bc4c46b58a1bb1fe1774a7'
      // 声网RTC秘钥
      let agoraRTCAppId = '414a621c09bc4c46b58a1bb1fe1774a7'
      // let agoraRTCAppId = '99c230d258994fa99019f80f890d3116'
      // 聊天记录上限
      let historiesMaxLength = 10000
      // 新建RTM客户端实例
      state.rtmClient = new RTMClient(agoraRTMAppId)
      // 用当前用户id登录声网客户端
      state.rtmClient
        .login({ uid: this.state.user.userInfo.username })
        // .login({ uid: this.state.user.userInfo.id })
        .then(() => {
          $notify({
            title: '登录成功',
            duration: 1000
          })
        })
        .catch(err => {
          if (err) {
            $notify({
              title: '登录失败',
              duration: 1000
            })
          }
        })

      // 新建RTC客户端实例
      state.rtcClient = new RTCClient(agoraRTCAppId)
      state.rtcClient.createClient({ codec: 'h264', mode: 'rtc' })
      // 获取历史记录
      let histories = JSON.parse(decodeURIComponent(window.localStorage.getItem('histories')))
      // 长度验证
      if (histories && histories.length > historiesMaxLength) {
        this.histories.splice(0, histories.length - historiesMaxLength)
        saveToLocal(histories)
      }
      state.histories = histories && histories.forEach ? histories : []
    },

    // 登出操作
    agoraLogout(state) {
      state.rtmClient
        .logout()
        .then(() => {
          $notify({
            dangerouslyUseHTMLString: true,
            message: `<h3 style="color:#67C23A;margin:0">注销成功</h3>`,
            duration: 1000
          })
        })
        .catch(err => {
          if (err) {
            $notify({
              title: '注销操作异常',
              message: `<h3 style="color:#F56C6C;margin:0">${err}</h3>`,
              duration: 1000
            })
          }
        })
    },

    /* *
     * 发送消息
     * * */
    sendMessage(state, { content, sendId, receiveId, callback }) {
      if (!content.text && content.text.length) return
      // 发送消息
      state.rtmClient
        .sendMessage(content, receiveId)
        .then(sendResult => {
          if (sendResult.hasPeerReceived) {
            // 添加消息到聊天记录
            state.histories.push({ sendId, receiveId, content })
            // 保存聊天记录到本地
            saveToLocal(state.histories)
            if (callback) callback()
          } else {
            // 添加消息到聊天记录
            if (callback) callback('服务器已接收,但远端用户不可达')
          }
        })
        .catch(err => {
          if (err) {
            if (callback) callback('服务器不可达')
          }
        })
    },

    /* *
     * 保存聊天历史数据
     * * */
    saveMessage(state, { content, sendId, receiveId, callback }) {
      // 添加消息到聊天记录
      state.histories.push({ sendId, receiveId, content })
      // 保存聊天记录到本地
      saveToLocal(state.histories)
      if (callback) callback()
    },

    /* *
     * 发起呼叫
     * * */
    makeCall(state, receiveId) {
      let user = this.state.user.userInfo
      // 显示弹窗
      this.commit('changeAudioViewVisible', true)
      // 发起呼叫
      state.rtmClient.localInvitation(receiveId, JSON.stringify(user))
      // 监听对方已接受呼叫邀请
      let flag = true
      state.rtmClient.on('LocalInvitationAccepted', () => {
        if (flag) {
          flag = false
          // 开启音视频
          this.commit('openAV', {
            channel: user.username,
            uid: user.id,
            token: '00699c230d258994fa99019f80f890d3116IACIwezeRsK5Ljh433hOLxujwWOZB/MMIWIEXc1sIWO4iWlyPXEAAAAAEACYBm0zb+XiXgEAAQBv5eJe'
          })

          let timer = window.setTimeout(() => {
            flag = true
            clearTimeout(timer)
          }, 1000)
        }
      })
    },

    /* *
     * 挂断电话
     * * */
    callBreak(state) {
      // 取消推流
      state.rtcClient.unpublish()
      // 退出频道
      state.rtcClient.leave().then(() => {
        // 替换用户在线状态
        state.rtmClient.status = 'onLine'
        console.log('成功退出频道')
      })
    },

    /* *
     * 开启音视频流推送
     * * */
    openAV(state, { channel }) {
      console.log('频道id', channel)

      // 加入频道
      state.rtcClient
        .join({
          channel,
          cameraResolution: 'default',
          host: true
        })
        .then(() => {
          // 推送流
          console.log('加入频道成功')
          state.rtcClient.publish()
        })
    },

    // 显示/隐藏音视频通话弹窗
    changeAudioViewVisible(state, value) {
      state.visible = value
    },

    /* *
     * 销毁客户端
     * * */
    agoraDestroyed(state) {
      state.rtcClient = null
      state.rtmClient = null
    }
  }
}

/* *
 * 存储消息到本地
 * */
function saveToLocal(data) {
  window.localStorage.setItem('histories', encodeURIComponent(JSON.stringify(data)))
}
