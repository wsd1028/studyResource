import AgoraRTM from 'agora-rtm-sdk'
import EventEmitter from 'events'

export default class RTMClient {
  constructor(appID) {
    this._client = AgoraRTM.createInstance(appID)
    this._uid = ''
    this._token = undefined
    this._invitation = null
    this._remoteInvitation = null
    this.eventBus = new EventEmitter()

    // 自定义事件
    this.customEvents = [
      'LocalInvitationReceivedByPeer',
      'LocalInvitationCanceled',
      'LocalInvitationAccepted',
      'LocalInvitationRefused',
      'LocalInvitationFailure',
      'RemoteInvitationReceived',
      'RemoteInvitationCanceled',
      'RemoteInvitationAccepted',
      'RemoteInvitationRefused',
      'RemoteInvitationFailure'
    ]

    /* *
     * 该状态用来控制当前客户端是否在线(是否可以被呼叫)
     * @value 'onLine': 在线
     * @value 'offLine': 离线
     * @value 'calling': 通话中
     * @value 'metting': 会议中,meeting
     * * */
    this.status = 'offLine'

    this.peerInvitation()
  }

  //登录操作
  login(config) {
    this._uid = config.uid
    this._token = config.token
    return this._client
      .login({
        token: this._token,
        uid: config.uid
      })
      .then(() => {
        this.status = 'onLine'
      })
      .catch(err => {
        if (err) {
          this.$message.error('登录失败: ' + err)
        }
      })
  }

  /* *
   * 登出操作
   * * */
  logout() {
    return this._client.logout()
  }

  /* *
   * 发送消息
   * @param message: 消息内容
   * @param userId: 接收人id
   * @return 返回当前消息是否发送成功的promise
   * * */
  sendMessage(message, receiveId) {
    return this._client.sendMessageToPeer(
      message, // 符合 RtmMessage 接口的参数对象
      receiveId // 接收消息的用户id
    )
  }

  /* *
   * 查询指定呼叫对象的在线状态
   * @return <Promise>状态
   * * */
  inquire(peerIds) {
    return this._client.queryPeersOnlineStatus(peerIds)
  }

  /* *
   * 发送邀请
   * @param calleeId:呼叫者id
   * @param channel:频道号(呼叫者和被呼叫者需一致)
   * * */
  localInvitation(calleeId, content) {
    if (this._invitation !== null) {
      this._invitation.removeAllListeners()
      this._invitation = null
    }

    //创建一个LocalInvitation对象实例
    this._invitation = this._client.createLocalInvitation(calleeId)

    //返回给主叫：被叫已收到呼叫邀请
    this._invitation.on('LocalInvitationReceivedByPeer', () => {
      console.log('返回给主叫：被叫已收到呼叫邀请')
      this.status = 'calling'
      this.eventBus.emit('LocalInvitationReceivedByPeer')
    })

    //返回给主叫：呼叫邀请已被成功取消。
    this._invitation.on('LocalInvitationCanceled', () => {
      console.log('返回给主叫：呼叫邀请已被成功取消。')
      this.eventBus.emit('LocalInvitationCanceled')
    })

    //返回给主叫：被叫已接受呼叫邀请。
    this._invitation.on('LocalInvitationAccepted', () => {
      console.log('返回给主叫：被叫已接受呼叫邀请。')
      this.status = 'meeting'
      this.eventBus.emit('LocalInvitationAccepted')
    })

    //返回给主叫：被叫已拒绝呼叫邀请。
    this._invitation.on('LocalInvitationRefused', () => {
      console.log('返回给主叫：被叫已拒绝呼叫邀请。')
      this.status = 'onLine'
      this.eventBus.emit('LocalInvitationRefused')
    })

    //返回给主叫：呼叫邀请进程失败。
    this._invitation.on('LocalInvitationFailure', () => {
      console.log('返回给主叫：呼叫邀请进程失败。')
      this.status = 'onLine'
      this.eventBus.emit('LocalInvitationFailure')
    })

    this._invitation.content = content

    console.log('被呼叫人id: ', calleeId, ' 传递参数: ', content)

    //发送呼叫邀请
    this._invitation.send()
  }

  //被呼叫者监听呼叫邀请
  peerInvitation() {
    this._client.on('RemoteInvitationReceived', remoteInvitation => {
      console.log('接收邀请', remoteInvitation.callerId)
      console.log('远程邀请', remoteInvitation)
      if (this.status !== 'onLine') {
        setTimeout(() => {
          remoteInvitation.refuse()
        }, 1000)
        return
      }
      if (this._remoteInvitation !== null) {
        this._remoteInvitation.removeAllListeners()
        this._remoteInvitation = null
      }
      this.status = 'calling'
      this._remoteInvitation = remoteInvitation
      // 开启监听被呼叫事件
      this.peerEvents()
      this.eventBus.emit('RemoteInvitationReceived', remoteInvitation)
    })
  }

  peerEvents() {
    //呼叫者取消电话要求
    this._remoteInvitation.on('RemoteInvitationCanceled', () => {
      console.log('呼叫者取消电脑邀请')
      this.status = 'onLine'
      this.eventBus.emit('RemoteInvitationCanceled')
      this._remoteInvitation = null
    })

    //成功接受电话邀请
    this._remoteInvitation.on('RemoteInvitationAccepted', () => {
      console.log('成功接受电话邀请')
      this.eventBus.emit('RemoteInvitationAccepted')
      this._remoteInvitation = null
    })

    //电话邀请成功拒绝监听
    this._remoteInvitation.on('RemoteInvitationRefused', () => {
      console.log('电话邀请成功拒绝监听')
      this.eventBus.emit('RemoteInvitationRefused')
      this._remoteInvitation = null
    })

    //呼叫邀请过程失败
    this._remoteInvitation.on('RemoteInvitationFailure', () => {
      console.log('呼叫邀请过程失败')
      this.status = 'onLine'
      this.eventBus.emit('RemoteInvitationFailure')
      this._remoteInvitation = null
    })
  }

  // 取消电话邀请
  cancelCall() {
    this._invitation && this._invitation.cancel()
    this.status = 'onLine'
  }

  // 接受电话邀请
  acceptCall() {
    this._remoteInvitation && this._remoteInvitation.accept()
    this.status = 'meeting'
  }

  // 拒绝电话邀请
  refuseCall() {
    this._remoteInvitation && this._remoteInvitation.refuse()
    this.status = 'onLine'
  }

  // 用户监听
  on(evt, callback, once = false) {
    // 单次响应
    if (once) {
      if (this.customEvents.indexOf(evt) !== -1) {
        this.eventBus.once(evt, callback)
      }
      this._client.once(evt, callback)
    } else {
      if (this.customEvents.indexOf(evt) !== -1) {
        this.eventBus.on(evt, callback)
      }
      this._client.on(evt, callback)
    }
  }

  // 移除用户监听
  off(evt, callback) {
    // 自定义事件监听
    if (this.customEvents.indexOf(evt) !== -1) {
      this.eventBus.off(evt, callback)
      return
    }
    this._client.off(evt, callback)
  }
}
