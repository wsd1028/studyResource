<template>
  <div class="government-appointCheckDetail">
    <van-dialog :showConfirmButton="false" class="tips" title v-model="cancelDia">
      <div style="padding:30px">
        <p style="textAlign:center">
          <van-icon color="#19c363" name="checked" size="20" />
          <span class="tipsMsg">确认作废该指派点检?</span>
        </p>
        <div class="tipsbtns">
          <van-button @click="cancelDia = false" block class="myBtn2" color="#ddd" round size="small">取消</van-button>
          <van-button @click="handelCancel" block class="myBtn" round size="small" type="info">确认</van-button>
        </div>
      </div>
    </van-dialog>
    <myTitle class="mainBox2" titleName="指派点检详情"></myTitle>
    <div class="boxItem mt50">
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
        <div class="text">
          {{ index + 1 }}:{{ item.dictName }}
          <p class="carCreat" v-if="!isFirst">
            <span class="carCreat0" v-if="item.checkState">合格</span>
            <span class="carCreat1" v-else>整改</span>
          </p>
        </div>
        <div :key="index" class="myVideo" v-for="(item, index) in item.video">
          <video-player :options="getPlayerOptions(item)" :playsinline="true"></video-player>
        </div>
        <van-grid :border="false" :gutter="10">
          <van-grid-item :key="index" v-for="(item, index) in item.images">
            <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item" />
          </van-grid-item>
        </van-grid>
        <div class="detail">
          <span>备注:</span>
          <span v-text="item.checkRemark"></span>
        </div>
      </div>
    </div>
    <div style="padding:30px 10px" v-if="isCancel">
      <van-button @click="cancelDia = true" block style="marginTop:30px" type="info">作废</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mainData: {},
      paramsData: {},
      cancelDia: false,
      isCancel: false,
      isFirst: true //判断是否是第一次
    }
  },
  async mounted() {
    this.paramsData = this.$route.params
    await this.getMainData()
    this.$until.fixVideo()
  },
  components: {},
  methods: {
    //作废
    async handelCancel() {
      let resp = await this.$http.post('/carp/business/a/q/command/check/cancel?id=' + this.paramsData.id)
      if (resp.code == 0) {
        this.$dialog.alert({
          message: '作废成功',
          confirmButtonColor: 'green'
        })
        this.cancelDia = false
        this.$router.go(-1)
      } else {
        this.$dialog.alert({
          message: '作废失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
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
          //区分图片和视频
          for (let j = 0; j < resp.data.list[i].photos.length; j++) {
            if (resp.data.list[i].photos.length > 0) {
              this.isFirst = false
            }
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
        if (
          (this.mainData.sponsorId == this.$store.state.user.user.id && this.mainData.state == this.$dictionaries.appointCheck.update) ||
          this.mainData.state == this.$dictionaries.appointCheck.waitCheck
        ) {
          this.isCancel = true
        }
      } else {
        this.$dialog.alert({
          message: '获取信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less">
.government-appointCheckDetail {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  padding-bottom: 30px;
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
      margin-top: 20px;
      background-color: #fff;
      .van-icon__image {
        width: 100%;
        height: 100%;
      }
      .van-grid-item__content {
        padding: 0;
      }
      .carCreat {
        flex-shrink: 0;
        span {
          padding: 0 15px;
          border-radius: 14px;
          color: #fff;
          line-height: 24px;
          text-align: center;
          margin: 0 5px;
        }
        .carCreat0 {
          background-color: #4186f4;
        }
        .carCreat1 {
          color: #f34341;
          border: 1px solid #f34341;
        }
        .carCreat2 {
          color: #4186f4;
          border: 1px solid #4186f4;
        }
        .carCreat3 {
          background-color: #ccc;
        }
      }
    }
  }
}
</style>
