<template>
  <div class="VideoCheckDetail mainBox">
    <div class="mainTop">
      <myTitle titleName="音视频巡检"></myTitle>
    </div>
    <section class="mainBottom">
      <video-player :options="getPlayerOptions(activeIndex)" :playsinline="true"></video-player>
      <van-row class="videoDetail">
        <van-col span="24">
          <div class="top">
            <p>
              <van-image :src="require('@/assets/image/file.png')" width="12px" />
              <span class="number" v-text="mainData.id"></span>
            </p>
            <span class="state-span delState" v-if="mainData.state == $dictionaries.videoCheck.update">整改</span>
            <span class="state-span finishState" v-if="mainData.state == $dictionaries.videoCheck.finish">完成</span>
            <span class="state-span waitcheckState" v-if="mainData.state == $dictionaries.videoCheck.waitCheck">待审核</span>
          </div>
          <p class="textFlowP">
            <span class="textFlow" style="color:#343434;font-size:14px">巡检项目：{{ mainData.name }}</span>
          </p>
          <div class="bottom">
            <p>
              巡检人:
              <span v-text="mainData.checkPeopleName"></span>
            </p>
            <p>
              时间:
              <span v-text="mainData.createDate"></span>
            </p>
          </div>
          <div class="bottom">
            <p>
              审核人:
              <span v-text="mainData.examinePeopleName"></span>
            </p>
            <p>
              审核时间:
              <span v-text="mainData.imgList[0].time"></span>
            </p>
          </div>
        </van-col>
      </van-row>
      <div class="detail">
        <p class="title">
          <van-icon color="#4285F4" name="video-o" size="16" />
          <span class="name">{{ mainData.imgList[activeIndex].name }}</span>
        </p>
        <p class="text">{{ mainData.imgList[activeIndex].remark }}</p>
        <p class="text">备注:{{ mainData.contentList[activeIndex].checkRemark }}</p>
      </div>
      <div class="checks">
        <div class="top">
          <div class="box"></div>
          <span class="title">巡检项目</span>
        </div>
        <div class="allTag">
          <div :key="index" @click="handelType(index)" class="tagDiv" v-for="(item, index) in mainData.imgList">
            <el-badge :value="mainData.contentList[index].checkState ? '' : '整改'" style="width:100%">
              <span
                :style="{ background: index == activeIndex ? '#4183f4' : '#F3F6F9', color: index == activeIndex ? '#fff' : '#999' }"
                class="myTag"
                color="#969799"
                v-text="item.name"
              ></span>
            </el-badge>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paramsData: {},
      activeIndex: 0,
      mainData: {
        contentList: [{}],
        imgList: [{}]
      }
    }
  },
  mounted() {
    this.paramsData = this.$route.params
    this.getMainData()
  },
  methods: {
    async getMainData() {
      let resp = await this.$http.get(`/carp/business/a/q/video/check/${this.paramsData.id}`)
      if (resp.code == 0) {
        this.mainData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取音视频巡检详情失败',
          confirmButtonColor: 'red'
        })
      }
    },
    //得到播放器配置
    getPlayerOptions(activeIndex) {
      let sources = [{ src: '', type: 'video/mp4' }]
      try {
        sources = [
          {
            src: this.$dictionaries.videoBaseUrl2 + this.mainData.imgList[activeIndex].videoUrl, // 路径
            type: 'video/' + this.mainData.imgList[activeIndex].videoUrl.split('-')[3] // 类型
          }
        ]
      } catch {}
      let playerOptions = {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      }
      return playerOptions
    },
    //点击检查项
    handelType(index) {
      this.activeIndex = index
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
