import AgoraRTC from 'agora-rtc-sdk'
import EventEmitter from 'events'
console.log('agora sdk version: ' + AgoraRTC.VERSION + ' compatible: ' + AgoraRTC.checkSystemRequirements())
export default class RTCClient {
  constructor(appID) {
    this._client = null
    this.appID = appID
    this._joined = false
    this._localStream = null
    // this._enableBeauty = false;
    this._params = {}
    this._uid = 0
    this._eventBus = new EventEmitter()
    this._showProfile = false
    this._subscribed = false
    this._created = false
  }

  // 创建客户端
  createClient(data) {
    this._client = AgoraRTC.createClient({
      mode: data.mode,
      codec: data.codec
    })
    this._client.on('stream-added', evt => {
      console.log('远端流加入: ', evt)
    })
    return this._client
  }

  // 关闭流
  closeStream() {
    /* if (this._localStream.isPlaying && this._localStream.isPlaying()) {
      this._localStream.stop()
    }
    this._localStream.close() */
  }

  // 销毁当前客户端
  destroy() {
    this._created = false
  }

  // 绑定监听事件
  on(evt, callback) {
    const customEvents = ['localStream-added', 'screenShare-canceled']

    if (customEvents.indexOf(evt) !== -1) {
      this._eventBus.on(evt, callback)
      return
    }

    this._client.on(evt, callback)
  }

  // 移除监听事件
  off(evt, callback) {
    const customEvents = ['localStream-added', 'screenShare-canceled']

    if (customEvents.indexOf(evt) !== -1) {
      this._eventBus.off(evt, callback)
      return
    }

    this._client.off(evt, callback)
  }

  // 设置客户端角色
  setClientRole(role) {
    this._client.setClientRole(role)
  }

  // 创建rtc流
  createRTCStream(data) {
    return new Promise((resolve, reject) => {
      this._uid = this._localStream ? this._localStream.getId() : data.uid
      if (this._localStream) {
        this.unpublish()
        this.closeStream()
      }
      // 创建rtc流
      const rtcStream = AgoraRTC.createStream({
        streamID: this._uid,
        audio: true,
        video: false,
        screen: false,
        microphoneId: data.microphoneId,
        cameraId: data.cameraId
      })

      if (data.resolution && data.resolution !== 'default') {
        rtcStream.setVideoProfile(data.resolution)
      }

      // 初始化本地流
      rtcStream.init(
        () => {
          this._localStream = rtcStream
          this._eventBus.emit('localStream-added', {
            stream: this._localStream
          })
          if (data.muteVideo === false) {
            this._localStream.muteVideo()
          }
          if (data.muteAudio === false) {
            this._localStream.muteAudio()
          }
          // if (data.beauty === true) {
          //   this._localStream.setBeautyEffectOptions(true, {
          //     lighteningContrastLevel: 1,
          //     lighteningLevel: 0.7,
          //     smoothnessLevel: 0.5,
          //     rednessLevel: 0.1
          //   })
          //   this._enableBeauty = true;
          // }
          resolve()
        },
        err => {
          reject(err)
          // Toast.error("stream init failed, please open console see more detail");
          console.error('初始化本地流失败', err)
        }
      )
    })
  }

  // 创建屏幕共享流
  createScreenSharingStream(data) {
    return new Promise((resolve, reject) => {
      // 创建屏幕共享流
      this._uid = this._localStream ? this._localStream.getId() : data.uid
      if (this._localStream) {
        this._uid = this._localStream.getId()
        this.unpublish()
      }
      const screenSharingStream = AgoraRTC.createStream({
        streamID: this._uid,
        audio: true,
        video: false,
        screen: true,
        microphoneId: data.microphoneId,
        cameraId: data.cameraId
      })

      if (data.resolution && data.resolution !== 'default') {
        screenSharingStream.setScreenProfile(`${data.resolution}_1`)
      }

      screenSharingStream.on('stopScreenSharing', evt => {
        this._eventBus.emit('stopScreenSharing', evt)
        this.closeStream()
        this.unpublish()
      })

      // 初始化本地流
      screenSharingStream.init(
        () => {
          this.closeStream()
          this._localStream = screenSharingStream

          // run callback
          this._eventBus.emit('localStream-added', {
            stream: this._localStream
          })
          resolve()
        },
        err => {
          this.publish()
          reject(err)
        }
      )
    })
  }

  // 订阅流
  subscribe(stream, callback) {
    this._client.subscribe(stream, callback)
  }

  // 创建缓存流
  _createTmpStream() {
    this._uid = 0
    return new Promise((resolve, reject) => {
      if (this._localStream) {
        this._localStream.close()
      }

      // create rtc stream
      const _tmpStream = AgoraRTC.createStream({
        streamID: this._uid,
        audio: true,
        video: true,
        screen: false
      })

      // init local stream
      _tmpStream.init(
        () => {
          this._localStream = _tmpStream
          resolve()
        },
        err => {
          reject(err)
          // Toast.error("stream init failed, please open console see more detail");
          console.error('初始化本地流失败', err)
        }
      )
    })
  }

  // 获取设备
  getDevices() {
    return new Promise((resolve, reject) => {
      if (!this._client) {
        this.createClient({ codec: 'vp8', mode: 'live' })
      }
      /* AgoraRTC.getDevices(devices => {
        if (!devices) {
          reject('未获取到设备')
          return
        }
        resolve(devices)
      }) */
      this._createTmpStream()
        .then(() => {
          AgoraRTC.getDevices(devices => {
            this._localStream.close()
            resolve(devices)
          })
        })
        .catch(err => {
          if (err) {
            reject(err)
          }
        })
    })
  }

  // 设置音视频流回退策略
  setStreamFallbackOption(stream, type) {
    this._client.setStreamFallbackOption(stream, type)
  }

  // 开启双流模式
  enableDualStream() {
    return new Promise((resolve, reject) => {
      this._client.enableDualStream(resolve, reject)
    })
  }

  // 设置视频大小流
  setRemoteVideoStreamType(stream, streamType) {
    this._client.setRemoteVideoStreamType(stream, streamType)
  }

  // 加入频道
  join(data) {
    this._joined = 'pending'
    return new Promise((resolve, reject) => {
      /**
       * A class defining the properties of the config parameter in the createClient method.
       * Note:
       *    Ensure that you do not leave mode and codec as empty.
       *    Ensure that you set these properties before calling Client.join.
       *  You could find more detail here. https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.clientconfig.html
       **/

      this._params = data

      // handle AgoraRTC client event
      // this.handleEvents();

      // 初始化客户端
      this._client.init(
        this.appID,
        () => {
          this._client.join(
            data.token ? data.token : null,
            data.channel,
            data.uid ? data.uid : null,
            uid => {
              this._uid = uid
              console.log('加入频道: ' + data.channel + ' 成功, 用户id: ' + uid)
              this._joined = true

              data.uid = uid

              if (data.host) {
                this.createRTCStream(data)
                  .then(() => {
                    this.enableDualStream()
                      .then(() => {
                        this.setRemoteVideoStreamType(this._localStream, 0)
                        resolve(data.uid)
                      })
                      .catch(err => {
                        reject(err)
                      })
                  })
                  .catch(err => {
                    reject(err)
                  })
              } else {
                resolve()
              }
            },
            err => {
              this._joined = false
              reject(err)
              console.error('加入频道失败', err)
            }
          )
        },
        err => {
          this._joined = false
          reject(err)
          console.error(err)
        }
      )
    })
  }

  // 发布本地音视频流
  publish() {
    this._client.publish(this._localStream, err => {
      console.error(err)
    })
  }

  // 取消发布本地音视频流
  unpublish() {
    if (!this._client) {
      return
    }
    this._client.unpublish(this._localStream, err => {
      console.error(err)
    })
  }

  // 离开 AgoraRTC 频道
  leave() {
    return new Promise(resolve => {
      if (!this._client) return resolve()
      // leave channel
      this._client.leave(
        () => {
          // 关闭流
          this.closeStream()
          this._joined = false
          this.destroy()
          resolve()
        },
        err => {
          console.log('退出频道失败')
          console.error(err)
        }
      )
    })
  }
}
