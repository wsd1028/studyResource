<template>
  <div class="VideoCheckDetail mainBox">
    <div class="mainTop">
      <myTitle titleName="音视频巡检"></myTitle>
    </div>
    <section class="mainBottom">
      <video-player :options="playerOptions" :playsinline="true"></video-player>
      <video-player :options="playerOptions1" :playsinline="true"></video-player>
      <video-player :options="playerOptions2" :playsinline="true"></video-player>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{ src: 'http://218.6.151.186:8855/carp/file/k/q/hbase/open/video/play/2020-490899828369264640-file-mp4', type: 'video/mp4' }],
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      },
      playerOptions1: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{ src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', type: 'video/mp4' }],
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      },
      playerOptions2: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{ src: 'https://media.w3.org/2010/05/sintel/trailer.mp4', type: 'video/mp4' }],
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      }
    }
  }
}
</script>

<style lang="less">
.VideoCheckDetail {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  font-size: 14px;
  .el-badge__content.is-fixed {
    right: 20px;
  }
  section {
    padding: 10px;
    .videoDetail {
      background-color: #fff;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        .number {
          color: #4285f4;
          font-size: 14px;
          font-weight: 700;
          margin-left: 10px;
        }
        .projectName {
          color: #333;
          font-weight: bold;
          font-size: 18px;
        }
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        p {
          font-size: 12px;
          line-height: 23px;
          margin-top: 5px;
          color: #9a9a9a;
        }
      }
    }
    .detail {
      background-color: #fff;
      margin-top: 10px;
      .title {
        display: flex;
        align-items: center;
        .name {
          color: #000;
          margin-left: 10px;
          font-weight: 700;
        }
      }
      .text {
        color: #999999;
      }
    }
    .checks {
      background-color: #fff;
      margin-top: 10px;
      .top {
        height: 30px;
        display: flex;
        align-items: center;
        .box {
          background-color: #ffaf30;
          width: 6px;
          height: 20px;
          margin-right: 10px;
        }
        .title {
          color: #333;
          font-weight: 800;
          margin: 0;
        }
      }
      .allTag {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .tagDiv {
          flex-shrink: 0;
          width: 50%;
          padding: 10px;
          .myTag {
            text-align: center;
            width: 100%;
            line-height: 28px;
            box-sizing: border-box;
            border-radius: 24px;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
