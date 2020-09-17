<template>
  <div class="company-appointCheckSetting">
    <van-popup class="uploadDia" v-model="uploadDia">
      <MyUpload
        :content="true"
        :defaultFileList="getDefaultFileList(mainData.list[chooseItemIndex].imageList)"
        :module="$dictionaries.imgType.appoint"
        :previewImage="false"
        :limit="10"
        @uploadYes="uploadYes($event, chooseItemIndex)"
        class
      ></MyUpload>
      <van-button @click="uploadVideo" icon="play-circle" type="primary">上传视频</van-button>
    </van-popup>
    <myTitle class="mainBox2" titleName="指派点检"></myTitle>
    <div class="boxItem mt50">
      <p class="text">点检信息</p>
      <div class="itemContent">
        <van-field :value="mainData.workStationName" disabled label="点检项目" type="text" />
        <van-field :value="mainData.workStationAddress" disabled label="点检地址" type="text" />
        <van-field :value="mainData.sponsorDept" disabled label="发起部门" type="text" />
        <van-field :value="mainData.sponsorName" disabled label="发起人员" type="text" />
        <van-field :value="mainData.createDate" disabled label="发起时间" type="text" />
      </div>
    </div>
    <div :key="index" class="boxItem" v-for="(item, index) in mainData.list">
      <p class="text">点检内容</p>
      <div class="itemContent" style="padding:10px 0">
        <div class="text2">
          <span>
            {{ index + 1 }}:{{ item.dictName }}
            <sup style="color:red">*</sup>
          </span>
          <p class="carCreat" v-if="!isFirst">
            <span class="carCreat0" v-if="item.checkState">合格</span>
            <span class="carCreat1" v-else>整改</span>
          </p>
        </div>
        <div class="itemContent" style="padding:10px">
          <div v-if="!item.checkState">
            <p style="margin-bottom:10px" v-if="mainData2.list[index].photos.length > 0">问题图片</p>
            <div :key="index" class="myVideo" style="padding:0" v-for="(item, index) in mainData2.list[index].videoList">
              <video-player :options="getPlayerOptions(item)" :playsinline="true"></video-player>
            </div>
            <van-grid :border="false" :gutter="10" style="margin-bottom:10px;padding-left:0">
              <van-grid-item :key="index" v-for="(item, index) in mainData2.list[index].imageList">
                <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item" height="80" width="80" />
              </van-grid-item>
            </van-grid>
            <p style="margin-bottom:10px" v-if="mainData2.list[index].photos.length > 0">重新上传</p>
            <MyUpload
              :defaultFileList="getDefaultFileList(item.photos)"
              :limit="item.photos.length"
              :module="$dictionaries.imgType.appoint"
              @uploadYes="uploadYes2($event, index)"
            ></MyUpload>
            <div @click="handelUploadDia(item, index)" class="upload" v-if="item.photos.length < 3">
              <van-icon name="plus" size="30" />
            </div>
          </div>
          <div v-else>
            <van-grid :border="false" :gutter="10">
              <van-grid-item :key="index" v-for="(item, index) in item.photos">
                <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item" height="80" width="80" />
              </van-grid-item>
            </van-grid>
          </div>
        </div>
        <div class="remark">
          <p>备注:</p>
          <van-field :disabled="item.checkState" autosize rows="2" type="textarea" v-model="item.checkRemark" />
        </div>
      </div>
    </div>
    <div style="padding:20px 10px">
      <van-button :loading="btnLoading" @click="updateYes" block loading-text="加载中..." type="info">点检完成</van-button>
    </div>
  </div>
</template>

<script>
import MyUpload from '@/components/MyUpload.vue'
export default {
  data() {
    return {
      paramsData: {},
      btnLoading: false,
      mainData: {
        list: [
          {
            imageList: [],
            videoList: [],
            photos: []
          }
        ]
      },
      mainData2: {
        //政府驳回时,用于存储显示之前每一项的数据
        list: [
          {
            imageList: [],
            videoList: [],
            photos: []
          }
        ]
      },
      uploadDia: false,
      chooseItem: {},
      chooseItemIndex: 0,
      isFirst: true //判断是否是第一次
    }
  },
  created() {
    window.getUploadVideo = this.getUploadVideo2
  },
  async mounted() {
    this.paramsData = this.$route.params
    await this.getMainData()
    this.$until.fixVideo()
    window.setLocation = this.setLocation2
    this.getLocation()
  },
  components: {
    MyUpload
  },
  methods: {
    //得到安卓返回的经纬度
    setLocation2(data) {
      this.mainData.latitude = data.lat
      this.mainData.longitude = data.lng
    },
    //调用安卓接口获取经纬度
    getLocation() {
      if (window.jsCall) window.jsCall.getLocation()
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
    //得到默认图片列表
    getDefaultFileList(photo) {
      let arr = []
      for (let i = 0; i < photo.length; i++) {
        if (this.$until.checkImage(photo[i])) {
          arr.push({
            url: this.$dictionaries.imgBaseUrl2 + photo[i],
            imgUrl: photo[i],
            isImage: true
          })
        } else {
          arr.push({
            url: photo[i],
            imgUrl: photo[i],
            isImage: false
          })
        }
      }
      return arr
    },
    //点击上传弹窗
    handelUploadDia(data, index) {
      this.chooseItemIndex = index
      this.chooseItem = data
      this.uploadDia = true
    },
    //调用安卓上传视频
    uploadVideo() {
      let data = {
        id: this.chooseItem.dictId,
        name: this.chooseItem.dictName,
        description: ''
      }
      window.jsCall.videoSpotCheck(JSON.stringify(data))
    },
    // 安卓上传完调用我
    getUploadVideo2(data) {
      if (data == 'false') {
        this.$dialog.alert({
          message: '上传视频失败',
          confirmButtonColor: 'red'
        })
      } else {
        this.uploadDia = false
        this.mainData.list[this.chooseItemIndex].videoList.push(data)
        this.mainData.list[this.chooseItemIndex].photos = [
          ...this.mainData.list[this.chooseItemIndex].imageList,
          ...this.mainData.list[this.chooseItemIndex].videoList
        ]
      }
    },
    //上传图片
    uploadYes(fileList, index) {
      this.mainData.list[index].imageList = fileList
      this.mainData.list[index].photos = [...fileList, ...this.mainData.list[index].videoList]
      this.uploadDia = false
    },
    //删除文件
    uploadYes2(fileList, index) {
      let mainData = {}
      mainData = JSON.parse(JSON.stringify(this.mainData))
      mainData.list[index].photos = fileList
      let image = [],
        video = []
      for (let i = 0; i < fileList.length; i++) {
        if (this.$until.checkImage(fileList[i])) {
          image.push(fileList[i])
        } else {
          video.push(fileList[i])
        }
      }
      mainData.list[index].imageList = image
      mainData.list[index].videoList = video
      this.mainData = mainData
    },
    //获取信息
    async getMainData() {
      let resp = await this.$http.get('/carp/business/a/q/command/check/' + this.paramsData.id)
      if (resp.code == 0) {
        for (let i = 0; i < resp.data.list.length; i++) {
          resp.data.list[i].videoList = []
          resp.data.list[i].imageList = resp.data.list[i].photos
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
          resp.data.list[i].imageList = images
          resp.data.list[i].videoList = video
        }
        this.mainData2 = JSON.parse(JSON.stringify(resp.data))
        for (let i = 0; i < resp.data.list.length; i++) {
          //初始化政府驳回的检查项
          if (!resp.data.list[i].checkState) {
            resp.data.list[i].videoList = []
            resp.data.list[i].imageList = []
            resp.data.list[i].photos = []
          }
        }
        this.mainData = JSON.parse(JSON.stringify(resp.data))
      } else {
        this.$dialog.alert({
          message: '获取信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //确认上传
    async updateYes() {
      let bool = true
      for (let i = 0; i < this.mainData.list.length; i++) {
        this.mainData.list[i].commandCheckId = this.paramsData.id
        this.mainData.list[i].latitude = this.mainData.latitude
        this.mainData.list[i].longitude = this.mainData.longitude
        if (this.mainData.list[i].photos.length == 0) {
          bool = false
        }
      }
      let updateData = this.mainData.list.filter(item => {
        return !item.checkState
      })
      //必填项是否验证成功
      if (bool) {
        let url = '/carp/business/a/q/command/check/deal'
        this.btnLoading = true
        let resp = await this.$http.post(url, updateData)
        this.btnLoading = false
        if (resp.code == 0) {
          this.$dialog.alert({
            message: '处理成功',
            confirmButtonColor: 'green'
          })
          this.$router.go(-1)
        } else {
          this.$dialog.alert({
            message: '处理失败:' + resp.message,
            confirmButtonColor: 'red'
          })
        }
      } else {
        this.$dialog.alert({
          message: '信息不完整',
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less">
.company-appointCheckSetting {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  padding-bottom: 30px;
  .uploadDia {
    width: 300px;
    padding: 30px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
  }
  .upload {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    text-align: center;
    background-color: #f7f8fa;
    i {
      line-height: 80px;
    }
  }
  .boxItem {
    margin-top: 30px;
    .text {
      color: #979797;
      font-weight: 700;
      margin-bottom: 10px;
      margin-left: 16px;
      &::before {
        content: '';
        width: 5px;
        height: 20px;
        background-color: #1b7bfe;
        display: inline-block;
        vertical-align: -4px;
        margin-right: 10px;
      }
      span {
        color: #666;
      }
    }
    .text2 {
      color: #313131;
      margin-bottom: 10px;
      margin-left: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        color: #666;
      }
    }
    .itemContent {
      background-color: #fff;
      margin-top: 20px;
      padding-right: 20px;
      .van-icon__image {
        width: 100%;
        height: 100%;
      }
      .van-grid-item__content {
        padding: 0;
      }
      .remark {
        padding: 10px;
        p {
          color: #676767;
        }
        .van-cell {
          padding: 0;
          padding-top: 10px;
        }
        .van-field__control {
          border: 1px dashed #c3c3c3;
        }
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
      }
    }
  }
}
</style>
