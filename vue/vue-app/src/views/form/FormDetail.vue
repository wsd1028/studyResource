<template>
  <div class="main">
    <myTitle titleName="创建联单" class="mainBox2"></myTitle>
    <div class="section mt50">
      <div class="sectionItem">
        <div class="top">
          <div class="box"></div>
          <p class="title" style="marginLeft:20px">排放企业</p>
        </div>
        <van-divider />
        <div class="msg">
          <div class="msgItem">
            <van-image :src="require('@/assets/image/index_icon3.png')" height="18" width="18" />
            <p class="textFlowP">
              <span class="text textFlow" v-text="formDetail.projectCompany"></span>
            </p>
          </div>
          <div class="msgItem">
            <van-icon class-prefix="iconfont" name="dizhi" />
            <p class="textFlowP">
              <span class="text" v-text="formDetail.address"></span>
            </p>
          </div>
          <div class="msgItem">
            <van-icon class-prefix="iconfont" name="ren" />
            <span class="text">排放员：{{ userMsg.accountBaseDto.name }}</span>
          </div>
        </div>
      </div>
      <div class="sectionItem">
        <div class="top">
          <div class="box"></div>
          <p class="title">联单状态</p>
        </div>
        <van-divider />
        <van-steps :active="0" class="mySteps">
          <van-step>待检查</van-step>
          <van-step>运输中</van-step>
          <van-step>已消纳</van-step>
        </van-steps>
      </div>
      <div class="sectionItem">
        <div class="top">
          <div class="box"></div>
          <p class="title">车辆识别图片</p>
        </div>
        <van-divider />
        <div style="display:flex;flexWrap:wrap;width:100%">
          <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item" :key="index" style="margin:5px;flexShrink:0" v-for="(item, index) in formDetail.carPhotoList" />
        </div>
      </div>
      <div class="sectionItem">
        <div class="top">
          <div class="box"></div>
          <p class="title">运输企业</p>
        </div>
        <van-divider />
        <div class="msg">
          <div class="msgItem">
            <van-image :src="require('@/assets/image/index_icon7.png')" height="18" width="22" />
            <span class="label">车牌号:</span>
            <span class="value" style="marginRight:10px">{{ formDetail.plateNumber }}</span>
            <van-tag plain type="success" v-if="formDetail.carState">名录车</van-tag>
            <van-tag plain type="danger" v-else>非名录车</van-tag>
          </div>
          <div class="msgItem">
            <van-image :src="require('@/assets/image/index_icon3.png')" height="18" width="18" />
            <span class="label">所属企业:</span>
            <span class="value">{{ formDetail.companyName }}</span>
          </div>
          <div class="msgItem">
            <van-icon class-prefix="iconfont" name="ren" />
            <span class="label">司机:</span>
            <span class="value" v-text="formDetail.driverName"></span>
          </div>
        </div>
      </div>
      <div class="sectionItem">
        <div class="top">
          <div class="box"></div>
          <p class="title">点检信息</p>
        </div>
        <van-divider />
        <div class="msg">
          <div class="msgItem">
            <span class="label">
              建渣类型:
              <sup style="color:red">*</sup>
            </span>
            <div style="flexGrow:1;textAlign:left">
              <span
                :key="index"
                :style="{ background: item.choose ? '#4183f4' : '#e5e5e5', color: item.choose ? '#fff' : '#696969' }"
                @click="handelType(item)"
                class="myTag"
                color="#969799"
                v-for="(item, index) in formDetail.garbageType"
                v-text="item.name"
              ></span>
            </div>
          </div>
          <div class="msgItem" style="alignItems:center">
            <span class="label">建渣重量:</span>
            <van-field label placeholder="请输入建渣重量" type="number" v-model="userInput.weight" />
            <span class="value">Kg</span>
          </div>
          <div class="msgItem" style="alignItems:center">
            <span class="label">
              建渣立方:
              <sup style="color:red">*</sup>
            </span>
            <van-field label placeholder="请输入建渣立方米" type="number" v-model="userInput.cube" />
            <span class="value">方</span>
          </div>
          <div class="msgItem jcb" style="alignItems:center">
            <span class="label2">
              车辆是否冲洗干净:
              <sup style="color:red">*</sup>
            </span>
            <van-radio-group direction="horizontal" v-model="userInput.clean">
              <van-radio :name="true">干净</van-radio>
              <van-radio :name="false" class="mr0">不干净</van-radio>
            </van-radio-group>
          </div>
          <div class="msgItem jcb" style="alignItems:center">
            <span class="label2">
              车辆篷布是否覆盖:
              <sup style="color:red">*</sup>
            </span>
            <van-radio-group direction="horizontal" v-model="userInput.cover">
              <van-radio :name="true">覆盖</van-radio>
              <van-radio :name="false" class="mr0">未覆盖</van-radio>
            </van-radio-group>
          </div>
          <div class="msgItem jcb" style="alignItems:center">
            <span class="label2">
              车辆是否超重:
              <sup style="color:red">*</sup>
            </span>
            <van-radio-group direction="horizontal" v-model="userInput.overload">
              <van-radio :name="true">超重</van-radio>
              <van-radio :name="false" class="mr0">未超重</van-radio>
            </van-radio-group>
          </div>
          <div class="msgItem jcb" style="alignItems:center">
            <span class="label2">
              车辆是否超高:
              <sup style="color:red">*</sup>
            </span>
            <van-radio-group direction="horizontal" v-model="userInput.height">
              <van-radio :name="true">超高</van-radio>
              <van-radio :name="false" class="mr0">未超高</van-radio>
            </van-radio-group>
          </div>
          <div class="msgItem jcb" style="display:block;textAlign:left">
            <span class="label2" style="display:block;marginBottom:10px;textAlign:left">请上传车辆照片:</span>
            <div style="display:flex;flexWrap:wrap;width:100%">
              <MyUpload @uploadYes="uploadYes" :module="$dictionaries.imgType.electronic"></MyUpload>
            </div>
          </div>
        </div>
      </div>
      <div class="sectionItem">
        <div class="top">
          <div class="box"></div>
          <p class="title">
            消纳企业
            <sup style="color:red">*</sup>
          </p>
        </div>
        <van-divider />
        <div class="msg">
          <div class="msgItem" style="alignItems:center">
            <van-image :src="require('@/assets/image/index_icon3.png')" height="18" width="18" />
            <span class="text" style="width:100px">消纳场名称:</span>
            <van-dropdown-menu style="width:200px">
              <van-dropdown-item :options="garbageName" v-model="userInput.garbageId" />
            </van-dropdown-menu>
          </div>
        </div>
      </div>
      <div class="sectionItem">
        <div class="top">
          <div class="box"></div>
          <p class="title">司机签名</p>
        </div>
        <van-divider />
        <div class="msg">
          <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + userInput.driverSignImage" v-if="userInput.driverSignImage" />
          <!--<div class="msgItem0">
            <vue-esign :height="300" :isCrop="false" :lineWidth="6" lineColor="#000000" ref="esign" />
          </div>-->
        </div>
        <div class="jcb" style="margin-top:10px">
          <van-button @click="handleReset" class="myBtn" type="info">清除</van-button>
          <van-button @click="handleGenerate" class="myBtn" type="info">签名</van-button>
        </div>
      </div>
      <div class="sectionItem">
        <van-button :loading="btnLoading2" @click="checkYes" loading-text="加载中..." style="width:100%;borderRadius:4px" type="info">创建联单</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import MyUpload from '@/components/MyUpload.vue'

export default {
  data() {
    return {
      //路由参数
      metaForm: {
        createDate: '',
        id: '',
        projectId: ''
      },
      //界面详情
      formDetail: {},
      // 消纳场名称列表
      garbageName: [],
      btnLoading: false,
      btnLoading2: false,
      //用户输入
      userInput: {
        clean: true,
        cover: true,
        cube: '',
        driverSignImage: '',
        garbageId: '',
        garbageTypeCode: '',
        height: false,
        overload: false,
        projectId: '',
        weight: ''
      },
      userMsg: {
        accountBaseDto: {}
      }
    }
  },
  mounted() {
    window.setAutograph = this.setAutograph2
    this.metaForm = this.$route.params
    this.userMsg = this.$store.state.user.user
    let geolocation = new BMap.LocalCity()
    geolocation.get(res => {
      let { lng, lat } = res.center
      this.userInput.longitude = lng
      this.userInput.latitude = lat
    })
    this.getMainData()
  },
  components: {
    MyUpload
  },
  methods: {
    //清除画布
    handleReset() {
      //this.$refs.esign.reset()
      this.userInput.driverSignImage = ''
    },
    //安卓回传图片id
    setAutograph2(url) {
      this.userInput.driverSignImage = url
    },
    //调用安卓接口生成签名
    handleGenerate() {
      if (window.jsCall) window.jsCall.autograph()
      //this.$refs.esign
      //  .generate()
      //  .then(async res => {
      //    let file = this.$until.dataURLtoFile(res)
      //    var formData = new FormData() //构造一个 FormData，把后台需要发送的参数添加
      //    formData.append('files', file) //接口需要传的参数
      //    this.btnLoading = true
      //    let resp = await this.$http.post('/carp/file/a/q/file/upload/files/base_image', formData)
      //    if (resp.code == 4002) {
      //      this.userInput.driverSignImage = resp.data[0]
      //    } else {
      //      this.$dialog.alert({
      //        message: '签名上传失败:' + resp.message,
      //        confirmButtonColor: 'red'
      //      })
      //    }
      //    this.btnLoading = false
      //  })
      //  .catch(err => {
      //    alert(err) // 画布没有签字时会执行这里 'Not Signned'
      //  })
    },
    //上传图片
    uploadYes(fileList) {
      this.userInput.startPhotoAddressList = fileList
    },
    //得到页面详细数据
    async getMainData() {
      var resp = {}
      if (this.$route.params.formUrl == 'createForm') {
        resp = {
          code: 0,
          data: this.$route.params
        }
      } else {
        resp = await this.$http.post('/carp/business/a/q/start/form/electronic/time', this.$qs.stringify(this.metaForm))
      }
      if (resp.code == 0) {
        for (let i = 0; i < resp.data.garbageType.length; i++) {
          resp.data.garbageType[i].choose = false
          resp.data.garbageType[i].chooseIndex = i
        }
        for (let i = 0; i < resp.data.garbageName.length; i++) {
          this.garbageName.push({
            value: resp.data.garbageName[i].id,
            text: resp.data.garbageName[i].name
          })
        }
        if (this.garbageName.length > 0) {
          this.userInput.garbageId = this.garbageName[0].value
        } else {
          this.$dialog.alert({
            message: '请绑定排放证',
            confirmButtonColor: 'red'
          })
        }
        this.formDetail = resp.data
      } else {
        this.$dialog.alert({
          closeOnPopstate: false,
          message: '获取车辆识别信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
        this.$router.go(-1)
      }
    },
    //点击渣土类型
    async handelType(item) {
      //将选中模式取反
      this.formDetail.garbageType[item.chooseIndex].choose = !this.formDetail.garbageType[item.chooseIndex].choose
      //将其他渣土类型选中状态设为否
      for (let i = 0; i < this.formDetail.garbageType.length; i++) {
        if (this.formDetail.garbageType[i].id != item.id) this.formDetail.garbageType[i].choose = false
      }
      this.$forceUpdate()
    },
    //点检完成
    async checkYes() {
      this.userInput.projectId = this.metaForm.projectId
      //筛选出建渣类型的id
      for (let i = 0; i < this.formDetail.garbageType.length; i++) {
        if (this.formDetail.garbageType[i].choose) this.userInput.garbageTypeCode = this.formDetail.garbageType[i].id
      }
      if (!/^[1-9]\d*$/.test(this.userInput.cube)) {
        this.$toast('建渣立方只能为整数')
        return
      }
      if (this.userInput.weight) {
        if (!/^[1-9]\d*$/.test(this.userInput.weight)) {
          this.$toast('建渣重量只能为整数')
          return
        }
      }

      let bool = true
      this.userInput.carPhotoList = this.formDetail.carPhotoList
      this.userInput.recognitionTime = this.formDetail.recognitionTime
      //验证是否有车辆图片(可不传)
      // if (this.userInput.startPhotoAddressList.length == 0) bool = false
      //验证必填项
      for (let key in this.userInput) {
        if (key != 'weight' && key != 'driverSignImage') {
          if (this.userInput[key] === '') {
            bool = false
          }
        }
      }
      //必填项是否验证成功
      if (bool) {
        this.userInput.accountId = this.$store.state.user.user.accountTypeDto.accountId
        this.userInput.licenseNumber = this.formDetail.plateNumber
        this.userInput.signImage = this.formDetail.accountName
        this.userInput.recognitionId = this.formDetail.recognitionId
        let url = '/carp/business/a/q/start/form/startFrom'
        this.btnLoading2 = true
        let resp = await this.$http.post(url, this.userInput)
        this.btnLoading2 = false
        if (resp.code == 0) {
          this.$dialog.alert({
            message: '创建成功',
            confirmButtonColor: 'green'
          })
          this.$router.go(-1)
        } else {
          this.$dialog.alert({
            message: '创建失敗:' + resp.message,
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
<style lang="less" scoped>
.main {
  background-color: #f9f9f9;
  text-align: left;
  min-height: 100%;
}
.mr0 {
  margin-right: 0;
}
canvas {
  background-color: #eee !important;
}
.section {
  .sectionItem {
    margin-top: 10px;
    padding: 16px;
    background-color: #fff;
    margin-bottom: 10px;
    .myBtn {
      width: 45%;
      border-radius: 4px;
    }
    .van-divider {
      margin: 0;
    }
    .mySteps {
      text-align: left;
    }
    .top {
      height: 40px;
      line-height: 40px;
      display: flex;
      align-items: center;
      .box {
        background-color: #4186f4;
        width: 6px;
        height: 20px;
        margin-right: 10px;
      }
      .title {
        color: #000;
        font-weight: 800;
        font-size: 18px;
        margin: 0;
      }
    }
    .jcb {
      display: flex;
      justify-content: space-between;
    }
    .msg {
      .msgItem {
        font-size: 18px;
        color: #666;
        display: flex;
        margin-top: 16px;
        align-items: flex-start;
        .van-dropdown-menu__title::after {
          border-color: transparent transparent #4484ee #4484ee;
        }
        .van-cell {
          width: 150px;
        }
        .myTag {
          padding: 4px 10px;
          font-size: 18px;
          margin: 4px 10px;
          border-radius: 16px;
          display: inline-block;
          color: #fff;
        }
        .iconfont {
          font-size: 18px;
        }
        .text {
          margin-left: 20px;
          flex-shrink: 0;
          flex-shrink: 0;
        }
        .label {
          width: 90px;
          display: inline-block;
          text-align: center;
          flex-shrink: 0;
        }
        .label2 {
          width: auto;
          display: inline-block;
          text-align: center;
          flex-shrink: 0;
        }
        .value {
          color: #333;
          flex-shrink: 0;
        }
      }
    }
  }
  .van-hairline--top-bottom::after,
  .van-hairline-unset--top-bottom::after {
    border: 0;
  }
}
</style>
