<template>
  <div class="government-streamingMediaShow">
    <video-player :options="playerOptions" class="vjs-custom-skin" ref="videoPlayer"></video-player>
    <!-- 控制按钮,只有球机显示 -->
    <div class="bt-control-wrap" v-if="['2'].includes(paramsData.cameraType)">
      <div
        :class="{ hidden: button.code === -1 }"
        :key="key"
        @mousedown="
          controlButtonCurrent = button.code
          button.code !== -1 && handleControl(button.code)
        "
        class="bt-wrap"
        v-for="(button, key) in controlButtons"
      >
        <el-button :class="button.icon" class="bt" type="info" v-show="button.icon"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import 'videojs-contrib-hls'
export default {
  data() {
    return {
      controlButtonCurrent: null,
      paramsData: {},
      // 控制按钮
      controlButtons: [
        { icon: 'el-icon-top-left', code: 4 },
        { icon: 'el-icon-top', code: 0 },
        { icon: 'el-icon-top-right', code: 6 },
        { icon: 'el-icon-back', code: 2 },
        { icon: '', code: -1 },
        { icon: 'el-icon-right', code: 3 },
        { icon: 'el-icon-bottom-left', code: 5 },
        { icon: 'el-icon-bottom', code: 1 },
        { icon: 'el-icon-bottom-right', code: 7 },
        { icon: '', code: -1 },
        { icon: '', code: -1 },
        { icon: '', code: -1 },
        { icon: 'el-icon-circle-plus-outline', code: 8 },
        { icon: '', code: -1 },
        { icon: 'el-icon-remove-outline', code: 9 }
      ],
      playerOptions: {
        height: '360'
      }
    }
  },
  async mounted() {
    this.paramsData = this.$route.params
    await this.getUrl()
    // 添加释放按钮事件
    document.addEventListener('mouseup', () => {
      this.handleControl(this.controlButtonCurrent, false)
    })
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  methods: {
    // 开始控制
    handleControl(code, flag = true) {
      if ([undefined, null, -1].includes(code)) return
      this.$http
        .put(
          '/carp/business/a/q/business/mserverchannel/control/status',
          {},
          {
            params: {
              action: flag ? 1 : 0,
              direction: code,
              id: this.paramsData.channelIdentifier
            }
          }
        )
        .then(({ code, message }) => {
          if (code !== 0) {
            this.$dialog.alert({
              message: '控制失败:' + message,
              confirmButtonColor: 'red'
            })
          }
        })
    },
    // 获取播放地址
    getUrl() {
      this.$http
        .put(`/carp/business/a/q/business/mserverchannel/status/${this.paramsData.channelIdentifier || this.paramsData.liveVideoId}`)
        .then(({ code, data, message }) => {
          if (code === 0) {
            this.playerOptions = {
              height: '360',
              autoplay: true,
              muted: true,
              sources: [
                {
                  withCredentials: false,
                  type: 'application/x-mpegURL',
                  src: data.hls
                }
              ],
              controlBar: {
                timeDivider: false,
                durationDisplay: false
              },
              flash: { hls: { withCredentials: false } },
              html5: { hls: { withCredentials: false } }
            }
          } else {
            this.$dialog.alert({
              message: '获取播放地址失败:' + message,
              confirmButtonColor: 'red'
            })
          }
        })
    },
    handelWeixinPlay() {
      let self = this
      //调用 <audio> 元素提供的方法 play()
      this.$refs.videoPlayer.player.play()
      //判断 WeixinJSBridge 是否存在
      if (typeof WeixinJSBridge == 'object' && typeof WeixinJSBridge.invoke == 'function') {
        self.$refs.videoPlayer.player.play()
      } else {
        //监听客户端抛出事件"WeixinJSBridgeReady"
        if (document.addEventListener) {
          document.addEventListener(
            'WeixinJSBridgeReady',
            function() {
              self.$refs.videoPlayer.player.play()
            },
            false
          )
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', function() {
            self.$refs.videoPlayer.player.play()
          })
          document.attachEvent('onWeixinJSBridgeReady', function() {
            self.$refs.videoPlayer.player.play()
          })
        }
      }
    }
  },
  beforeDestroy() {
    // 移除监听事件
    document.removeEventListener('mouseup', () => {
      this.handleControl(this.controlButtonCurrent, false)
    })
  }
}
</script>
<style lang="less" scoped>
.government-streamingMediaShow {
  height: 100%;
  background-color: #000;
  h1 {
    position: fixed;
    width: 100%;
    text-align: center;
    left: 0;
    top: 0;
    z-index: 999;
    color: #fff;
    font-size: 20px;
  }
  .bt-control-wrap {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    padding: 0 20px;
    .bt-wrap {
      width: 33%;
      .bt {
        margin-top: 20px;
      }
    }
  }
}
</style>
