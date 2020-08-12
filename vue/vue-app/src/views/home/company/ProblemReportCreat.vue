<template>
  <div class="company-problemReportCreat">
    <van-popup class="myDia" position="top" v-model="mapDia">
      <MyMap :needCode="true" @chooseAddress="chooseAddress"></MyMap>
    </van-popup>
    <myTitle class="mainBox2" titleName="新建问题上报"></myTitle>
    <div class="boxItem mt50">
      <p class="text">基本信息</p>
      <div class="itemContent">
        <van-field label="问题地址" placeholder="请输入当前问题地址" type="text" v-model="updateData.reportAddress">
          <template #right-icon>
            <div @click="mapDia = true" class="mapIcon">
              <van-icon color="#4f83e4" name="location" />
              <span>获取</span>
            </div>
          </template>
        </van-field>
      </div>
    </div>
    <div class="boxItem">
      <p class="text" style="display:block">
        图片上传
        <span style="color:#999">(最多3张)</span>
      </p>
      <div class="itemContent" style="padding:10px">
        <MyUpload :limit="3" :module="$dictionaries.imgType.problem" @uploadYes="uploadYes"></MyUpload>
      </div>
    </div>
    <div class="boxItem">
      <p class="text" style="display:block">问题描述</p>
      <div class="itemContent" style="padding:10px 0">
        <van-field :row="2" placeholder="请输入当前问题的详细描述" type="textarea" v-model="updateData.reportMessage" />
      </div>
    </div>
    <div style="padding:0 20px;marginTop:30px">
      <van-button :loading="btnLoading" @click="updateYes" block loading-text="加载中..." type="info">确认</van-button>
    </div>
  </div>
</template>

<script>
import MyUpload from '@/components/MyUpload.vue'
import MyMap from '@/components/MyMap.vue'

export default {
  data() {
    return {
      //图片上传列表
      fileList: [],
      //图片以及上传列表
      hasUploadImg: [],
      btnLoading: false,
      //地图弹框
      mapDia: false,
      updateData: {
        areaCode: 0,
        peopleId: '', //上报人ID1
        reportTitle: '', //项目名称
        reportType: this.$dictionaries.problem.type.pollution, //上报类型(政府有企业没有)
        reportMessage: '', //上报描述信息1
        createDate: '', //上报时间1
        reportAddress: '', //上报地址1
        adminCodeId: '', //行政区域id1
        photo: '', //上报图片集合1
        longitude: '',
        latitude: '',
        projectId: '',
        emergencies: '' //问题上报等级
      },
      userMsg: {}
    }
  },
  mounted() {
    this.updateData.projectId = this.$store.state.user.project.id
    this.userMsg = this.$store.state.user.user
  },
  components: { MyUpload, MyMap },
  methods: {
    //选择地址
    chooseAddress(address, bool, addressData) {
      this.updateData.reportAddress = address
      this.updateData.longitude = addressData.point.lng
      this.updateData.latitude = addressData.point.lat
      this.updateData.areaCode = addressData.areaCodeMsg.addressComponent.adcode
      this.mapDia = bool
    },
    //上传图片
    uploadYes(fileList) {
      this.hasUploadImg = fileList
    },
    async updateYes() {
      this.btnLoading = true
      this.updateData.peopleId = this.$store.state.user.user.id
      this.updateData.adminCodeId = this.$store.state.user.project.adminAreaId || this.$store.state.user.project.areaId
      this.updateData.createDate = this.$moment().format('YYYY-MM-DD hh:mm:ss')
      this.updateData.photo = this.hasUploadImg
      this.updateData.reportTitle = this.$store.state.user.project.name
      if (this.userMsg.accountTypeDto.type == this.$dictionaries.userType.project || this.userMsg.accountTypeDto.type == this.$dictionaries.userType.garbage) {
        //企业
        this.updateData.emergencies = this.$dictionaries.problem.level.company
      }
      if (this.userMsg.accountTypeDto.type == this.$dictionaries.userType.government) {
        this.updateData.emergencies = this.$dictionaries.problem.level.government
      }
      let bool = true
      //验证必填项
      for (let key in this.updateData) {
        if (!this.updateData[key] && key != 'adminCodeId') {
          bool = false
        }
      }
      if (this.updateData.photo.length === 0) bool = false
      //必填项是否验证成功
      if (bool) {
        let url = '/carp/business/a/q/question/report/insert'
        let resp = await this.$http.post(url, this.updateData)
        if (resp.code == 0) {
          this.$dialog.alert({
            message: '创建成功',
            confirmButtonColor: 'green'
          })
          this.$router.go(-1)
        } else {
          this.$dialog.alert({
            message: '创建失败:' + resp.message,
            confirmButtonColor: 'red'
          })
        }
      } else {
        this.$dialog.alert({
          message: '信息不完整',
          confirmButtonColor: 'red'
        })
      }
      this.btnLoading = false
    }
  }
}
</script>

<style lang="less">
.company-problemReportCreat {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  .myDia {
    padding: 10px;
    padding-top: 20px;
  }
  .boxItem {
    background-color: #fff;
    margin-top: 30px;
    padding-top: 10px;
    .text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        color: #666;
      }
    }
    .mapIcon {
      color: #4f83e4;
      display: flex;
    }
    p {
      color: #323232;
      font-weight: 700;
      margin-left: 16px;
    }
    .itemContent {
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
