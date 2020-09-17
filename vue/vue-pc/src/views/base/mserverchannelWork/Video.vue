<template>
  <div class="video-container">
    <!-- 视频 -->
    <div class="video-wrap">
      <video ref="videoEl" class="video-js" preload="auto" muted controls>
        <!-- src中填充预览或回放URL -->
        <source :src="url" type="application/x-mpegURL" />
      </video>
    </div>

    <!-- 退出按钮 -->
    <div class="close-bt">
      <i class="el-icon-circle-close" @click="close"></i>
    </div>

    <!-- 控制按钮,只有球机显示 -->
    <div v-if="['2'].includes(mserverchannel.cameraType)" class="bt-control-wrap">
      <div
        v-for="(button, key) in controlButtons"
        :key="key"
        class="bt-wrap"
        @mousedown="
          controlButtonCurrent = button.code
          button.code !== -1 && handleControl(button.code)
        "
        :class="{ hidden: button.code === -1 }"
      >
        <el-button type="info" :class="button.icon" class="bt"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mserverchannelVideo',
  data() {
    return {
      // 视频地址
      url: null,
      // 播放器实例
      player: null,

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
      // 当前控制按钮编号
      controlButtonCurrent: null
    }
  },
  props: {
    mserverchannel: Object,
    close: Function
  },
  methods: {
    // 获取播放地址
    getUrl() {
      this.$http.put(`/carp/business/a/q/business/mserverchannel/status/${this.mserverchannel.liveVideoId}`).then(({ code, data, message }) => {
        if (code === 0) {
          this.url = data.hls
          let timer = setTimeout(() => {
            this.player = window.videojs(this.$refs.videoEl)
            this.player.play()
            clearTimeout(timer)
          }, 0)
        } else {
          this.$message.error('获取播放地址失败:' + message)
          this.close()
        }
      })
    },

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
              id: this.mserverchannel.liveVideoId
            }
          }
        )
        .then(({ code, message }) => {
          if (code !== 0) {
            this.$message.error('控制失败:' + message)
          }
        })
    }
  },
  mounted() {
    // 获取播放地址
    this.getUrl()

    // 添加释放按钮事件
    document.addEventListener('mouseup', () => {
      this.handleControl(this.controlButtonCurrent, false)
    })
  },
  beforeDestroy() {
    // 销毁播放器
    this.player.dispose()

    // 移除监听事件
    document.removeEventListener('mouseup', () => {
      this.handleControl(this.controlButtonCurrent, false)
    })
  }
}
</script>

<style lang="less" scoped>
.video-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #000;
  .video-wrap,
  .video-js {
    width: 100%;
    height: 100%;
  }
  .close-bt {
    position: absolute;
    z-index: 1;
    top: 20px;
    right: 20px;
    display: none;
    font-size: 32px;
    color: #fff;
    cursor: pointer;
  }
  &:hover {
    .close-bt,
    .bt-control-wrap {
      display: block;
    }
  }

  .bt-control-wrap {
    position: absolute;
    display: none;
    width: 1.9rem;
    bottom: 0.4rem;
    right: 0.1rem;
    .bt-wrap {
      float: left;
      margin: 0.1rem 0.05rem;
      height: 0.5rem;
      width: 0.5rem;
      .bt {
        padding: 0;
        display: block;
        height: 100%;
        width: 100%;
        line-height: 0.5rem;
        text-align: center;
        font-size: 20px;
      }
    }
    .hidden {
      opacity: 0;
    }
  }
}
</style>
