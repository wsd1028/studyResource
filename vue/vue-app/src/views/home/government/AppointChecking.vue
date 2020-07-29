<template>
  <div class="government-appointChecking">
    <header>
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="指派点检">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <div class="boxItem">
      <p class="text2">
        <span class="spanBox"></span>
        基本信息
      </p>
      <div class="itemContent">
        <van-field :value="mainData.workStationName" disabled label="点检项目" type="text" />
        <van-field :value="mainData.workStationAddress" disabled label="点检地址" type="text" />
        <van-field :value="mainData.sponsorDept" disabled label="发起部门" type="text" />
        <van-field :value="mainData.sponsorName" disabled label="发起人员" type="text" />
        <van-field :value="mainData.createDate" disabled label="发起时间" type="text" />
        <van-field :value="mainData.manager" disabled label="处理人" type="text" />
        <van-field :value="mainData.managerPhone" disabled label="电话" type="text" />
        <van-field :value="mainData.finishDate" disabled label="处理时间" type="text" />
      </div>
    </div>
    <div class="boxItem">
      <p class="text2">
        <span class="spanBox"></span>
        点检内容
      </p>
      <div :key="index" class="itemContent" style="padding:10px" v-for="(item, index) in mainData.list">
        <p class="text">
          {{ index + 1 }}:{{ item.dictName }}
          <van-radio-group direction="horizontal" v-model="item.checkState">
            <van-radio :name="true">合格</van-radio>
            <van-radio :name="false" checked-color="#f34341">整改</van-radio>
          </van-radio-group>
        </p>
        <div :key="index" class="myVideo" v-for="(item, index) in item.video">
          <video-player :options="getPlayerOptions(item)" :playsinline="true"></video-player>
        </div>
        <van-grid :border="false" :gutter="10">
          <van-grid-item :key="index" v-for="(item, index) in item.images">
            <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item" />
          </van-grid-item>
        </van-grid>
        <div class="detail">
          <span>备注:{{ item.checkRemark }}</span>
        </div>
      </div>
    </div>
    <div style="padding:30px 10px">
      <van-button :loading="btnLoading" @click="updateYes" block loading-text="加载中..." style="marginTop:20px" type="info">点检完成</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mainData: {},
      btnLoading: false
    }
  },
  mounted() {
    this.paramsData = this.$route.params
    this.getMainData()
  },
  components: {},
  methods: {
    //得到播放器配置
    getPlayerOptions(data) {
      let playerOptions = {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            src: this.$dictionaries.videoBaseUrl2 + data.url, // 路径
            type: 'video/' + data.type // 类型
          }
        ],
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
    //获取信息
    async getMainData() {
      let resp = await this.$http.get('/carp/business/a/q/command/check/' + this.paramsData.id)
      if (resp.code == 0) {
        for (let i = 0; i < resp.data.list.length; i++) {
          let images = [],
            video = []
          resp.data.list[i].checkState = true
          //区分图片和视频
          for (let j = 0; j < resp.data.list[i].photos.length; j++) {
            if (this.$until.checkImage(resp.data.list[i].photos[j])) {
              images.push(resp.data.list[i].photos[j])
            } else {
              video.push({
                url: resp.data.list[i].photos[j],
                type: resp.data.list[i].photos[j].split('-')[3]
              })
            }
          }
          resp.data.list[i].images = images
          resp.data.list[i].video = video
        }
        this.mainData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //确认上传
    async updateYes() {
      this.btnLoading = true
      //必填项是否验证成功
      let url = '/carp/business/a/q/command/check/check'
      let resp = await this.$http.post(url, this.mainData.list)
      if (resp.code == 0) {
        this.$dialog.alert({
          message: '点检成功',
          confirmButtonColor: 'green'
        })
        this.$router.go(-1)
      } else {
        this.$dialog.alert({
          message: '点检失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
      this.btnLoading = false
    }
  }
}
</script>

<style lang="less">
.government-appointChecking {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  padding-bottom: 30px;
  header {
    background-color: #fff;
    .nav {
      text-align: left;
      line-height: 42px;
      i {
        color: #666;
      }
      .van-nav-bar__title {
        font-weight: 800;
        font-size: 18px !important;
      }
    }
  }
  .boxItem {
    margin-top: 30px;
    .detail {
      margin-top: 10px;
      .van-field__control {
        border: 1px dotted #ccc;
      }
    }
    .text2 {
      color: #979797;
      font-weight: 700;
      margin-bottom: 10px;
      margin-left: 16px;
      span {
        color: #666;
        vertical-align: top;
      }
    }
    .text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      span {
        color: #666;
      }
    }
    .itemContent {
      background-color: #fff;
      margin-top: 20px;
      .van-icon__image {
        width: 100%;
        height: 100%;
      }
      .van-grid-item__content {
        padding: 0;
      }
    }
  }
}
</style>
