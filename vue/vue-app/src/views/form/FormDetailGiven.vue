<template>
  <div class="main">
    <div>
      <Title titleName="联单点检"></Title>
    </div>
    <div class="section">
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
            <span class="text">排放员：{{ formDetail.accountStr }}</span>
          </div>
        </div>
      </div>
      <div class="sectionItem">
        <div class="top">
          <div class="box"></div>
          <p class="title">联单状态</p>
        </div>
        <van-divider />
        <van-steps :active="getActive(formDetail.state)" class="mySteps">
          <van-step>待检查</van-step>
          <van-step>运输中</van-step>
          <van-step>已消纳</van-step>
        </van-steps>
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
            <span class="value" style="marginRight:10px" v-text="formDetail.licenseNumber"></span>
            <van-tag plain type="success" v-if="formDetail.carState">名录车</van-tag>
            <van-tag plain type="danger" v-else>非名录车</van-tag>
          </div>
          <div class="msgItem dfsb">
            <p class="dfsb">
              <van-image :src="require('@/assets/image/index_icon3.png')" height="18" width="18" />
              <span class="label">所属企业:</span>
            </p>
            <p class="textFlowP">
              <span class="value textFlow" v-text="formDetail.companyName"></span>
            </p>
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
          <p class="title">
            建渣信息
            <sup style="color:red">*</sup>
          </p>
        </div>
        <van-divider />
        <div class="msg">
          <div class="msgItem jcb" style="alignItems:flex-start">
            <p class="label2">建渣类型:</p>
            <div style="flexGrow:1;textAlign:left">
              <span
                :key="index"
                :style="{ background: item.choose ? '#4183f4' : '#e5e5e5', color: item.choose ? '#fff' : '#696969' }"
                @click="handelType(item)"
                class="myTag"
                color="#969799"
                v-for="(item, index) in garbageType"
                v-text="item.name"
              ></span>
            </div>
          </div>
          <div class="msgItem jcb" style="alignItems:center">
            <p class="label2">
              建渣重量:
              <van-field class="myFile" label placeholder="请输入建渣重量(Kg)" type="number" v-model="formDetail.weight" />
            </p>
          </div>
          <div class="msgItem">
            <p class="label2">
              建渣立方:
              <van-field class="myFile" label placeholder="请输入建渣立方" type="number" v-model="formDetail.cube" />
            </p>
          </div>
          <div class="msgItem jcb" style="alignItems:center">
            <span class="label2">车辆是否冲洗干净:{{ formDetail.clean ? '干净' : '不干净' }}</span>
            <van-radio-group direction="horizontal" v-if="isUpdate" v-model="formDetail.clean">
              <van-radio :name="true">是</van-radio>
              <van-radio :name="false" class="mr0">否</van-radio>
            </van-radio-group>
          </div>
          <div class="msgItem jcb" style="alignItems:center">
            <span class="label2">车辆篷布是否覆盖:{{ formDetail.cover ? '覆盖' : '未覆盖' }}</span>
            <van-radio-group direction="horizontal" v-if="isUpdate" v-model="formDetail.cover">
              <van-radio :name="true">是</van-radio>
              <van-radio :name="false" class="mr0">否</van-radio>
            </van-radio-group>
          </div>
          <div class="msgItem jcb" style="alignItems:center">
            <span class="label2">车辆是否超重:{{ formDetail.overload ? '超重' : '未超重' }}</span>
            <van-radio-group direction="horizontal" v-if="isUpdate" v-model="formDetail.overload">
              <van-radio :name="true">是</van-radio>
              <van-radio :name="false" class="mr0">否</van-radio>
            </van-radio-group>
          </div>
          <div class="msgItem jcb" style="alignItems:center">
            <span class="label2">车辆是否超高:{{ formDetail.height ? '超高' : '未超高' }}</span>
            <van-radio-group direction="horizontal" v-if="isUpdate" v-model="formDetail.height">
              <van-radio :name="true">是</van-radio>
              <van-radio :name="false" class="mr0">否</van-radio>
            </van-radio-group>
          </div>
          <div class="msgItem jcb" style="display:block;textAlign:left">
            <span class="label2" style="display:block;marginBottom:10px;textAlign:left">车牌识别照片:</span>
            <div style="display:flex;flexWrap:wrap;width:100%">
              <van-image
                :key="index"
                :src="$dictionaries.imgBaseUrl + item"
                height="80"
                style="margin:5px;flexShrink:0"
                v-for="(item, index) in formDetail.carPhoto"
                width="80"
              />
            </div>
          </div>
          <div class="msgItem jcb" style="display:block;textAlign:left">
            <span class="label2" style="display:block;marginBottom:10px;textAlign:left">排放员上传照片:</span>
            <div style="display:flex;flexWrap:wrap;width:100%">
              <van-image
                :key="index"
                :src="$dictionaries.imgBaseUrl + item"
                height="80"
                style="margin:5px;flexShrink:0"
                v-for="(item, index) in formDetail.adminPhoto"
                width="80"
              />
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
            <div class="dfsb">
              <van-image :src="require('@/assets/image/index_icon3.png')" height="18" width="18" />
              <span class="text" style="width:80px">企业名称:</span>
            </div>
            <p class="textFlowP">
              <span class="text textFlow">{{ formDetail.name }}</span>
            </p>
          </div>
          <div class="msgItem" style="alignItems:center">
            <div class="dfsb">
              <van-icon class-prefix="iconfont" name="dizhi" />
              <span class="text textFlow" style="width:80px">消纳地址:</span>
            </div>
            <p class="textFlowP">
              <span class="text textFlow">{{ formDetail.garbageStationAddress }}</span>
            </p>
          </div>
          <div class="msgItem" style="alignItems:center">
            <div class="dfsb">
              <van-icon class-prefix="iconfont" name="ren" />
              <span class="text" style="width:80px">消纳员:</span>
            </div>
            <p class="textFlowP">
              <span class="text textFlow">{{ $store.state.user.user.accountBaseDto.name }}</span>
            </p>
          </div>
          <div class="msgItem jcb" style="display:block;textAlign:left">
            <span class="label2" style="display:block;marginBottom:10px;textAlign:left">请上传车辆消纳场照片:</span>
            <div style="padding:10px">
              <MyUpload :limit="5" @uploadYes="uploadYes" :module="$dictionaries.imgType.electronic"></MyUpload>
            </div>
          </div>
        </div>
      </div>
      <div class="sectionItem" v-if="isUpdate">
        <van-button :loading="btnLoading" @click="checkYes" loading-text="加载中..." style="width:100%;borderRadius:4px" type="info">点检完成</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title.vue'
import MyUpload from '@/components/MyUpload.vue'

export default {
  data() {
    return {
      //是否处于修改状态
      isUpdate: false,
      btnLoading: false,
      btnLoading2: false,
      //路由参数
      paramsData: {
        id: ''
      },
      //页面详细
      formDetail: {},
      // 消纳场图片列表
      photoList: [],
      // 建渣类型列表
      garbageType: [],
      // 用户上传
      userInput: {
        garbageTypeStr: true,
        cube: true,
        weight: true
      },
      garbageTypeCode: '',
      position: {
        longitude: 0,
        latitude: 0
      }
    }
  },
  async mounted() {
    // 判断登陆账号状态,是否是消纳员
    if (this.$store.state.user.user.accountTypeDto.type === this.$dictionaries.userType.garbage) {
      this.isUpdate = true
    }
    //获取路由参数
    this.paramsData = this.$route.params
    await this.getMainData()
    await this.getGarbageType()
    let geolocation = new BMap.LocalCity()
    geolocation.get(res => {
      let { lng, lat } = res.center
      this.position.longitude = lng
      this.position.latitude = lat
    })
  },
  components: {
    Title,
    MyUpload
  },
  methods: {
    //清除画布
    handleReset() {
      this.$refs.esign.reset()
      this.formDetail.endSignImage = ''
    },
    //生成签名
    handleGenerate() {
      this.$refs.esign
        .generate()
        .then(async res => {
          let file = this.$until.dataURLtoFile(res)
          var formData = new FormData() //构造一个 FormData，把后台需要发送的参数添加
          formData.append('files', file) //接口需要传的参数
          this.btnLoading2 = true
          let resp = await this.$http.post('/carp/file/a/q/file/upload/files/base_image', formData)
          if (resp.code == 4002) {
            this.formDetail.endSignImage = resp.data[0]
          } else {
            this.$dialog.alert({
              message: '签名上传失败:' + resp.message,
              confirmButtonColor: 'red'
            })
          }
          this.btnLoading2 = false
        })
        .catch(err => {
          alert(err) // 画布没有签字时会执行这里 'Not Signned'
        })
    },
    getActive(state) {
      if (state < this.$dictionaries.electronic.yunshu) {
        return 0
      } else if (state < this.$dictionaries.electronic.xiaona) {
        return 1
      } else {
        return 2
      }
    },
    //点击渣土类型
    handelType(item) {
      //将选中模式取反
      this.garbageType[item.chooseIndex].choose = !this.garbageType[item.chooseIndex].choose
      this.garbageTypeCode = item.id
      this.formDetail.garbageTypeStr = item.name
      //将其他渣土类型选中状态设为否
      for (let i = 0; i < this.garbageType.length; i++) {
        if (this.garbageType[i].id != item.id) this.garbageType[i].choose = false
      }
    },
    //得到页面详细数据
    async getMainData() {
      let resp = await this.$http.get('/carp/business/a/q/electronic/workflow/' + this.paramsData.id)
      if (resp.code == 0) {
        this.formDetail = resp.data
        this.garbageTypeCode = this.formDetail.garbageTypeCode
      } else {
        this.$dialog.alert({
          message: '获取信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //得到建渣类型列表
    async getGarbageType() {
      let resp = await this.$http.get('/carp/business/a/q/dict/category/type')
      for (let i = 0; i < resp.data.length; i++) {
        resp.data[i].chooseIndex = i
        if (resp.data[i].id == this.formDetail.garbageTypeCode) {
          resp.data[i].choose = true
        } else {
          resp.data[i].choose = false
        }
      }
      this.garbageType = resp.data
    },
    //上传图片
    uploadYes(fileList) {
      this.photoList = fileList
    },
    //点检完成
    async checkYes() {
      let bool = true
      //需要进行验证的项
      let check = {
        garbageTypeCode: this.formDetail.garbageTypeStr,
        cube: this.formDetail.cube,
        weight: this.formDetail.weight,
        photoAdress: this.photoList,
        endSignImage: this.$store.state.user.user.accountBaseDto.name
      }
      if (!/^[1-9]\d*$/.test(this.formDetail.cube)) {
        this.$toast('建渣立方只能为整数')
        return
      }
      if (!/^[1-9]\d*$/.test(this.formDetail.weight) && this.formDetail.weight) {
        this.$toast('建渣重量只能为整数')
        return
      }
      //验证是否有图片(非必传)
      // if (check.photoAdress.length == 0) bool = false
      let updateData = {
        electronicFormId: this.formDetail.electronicFormId,
        accountId: this.$store.state.user.user.id,
        endSignImage: this.formDetail.endSignImage,
        cube: this.formDetail.cube,
        clean: this.formDetail.clean,
        cover: this.formDetail.cover,
        overload: this.formDetail.overload,
        height: this.formDetail.height,
        weight: this.formDetail.weight,
        photoAddress: this.photoList,
        garbageStationId: this.formDetail.garbageId,
        driverAccountId: this.$store.state.user.user.accountTypeDto.accountId,
        endDate: this.$moment().format('YYYY-MM-DD hh:mm:ss'),
        garbageTypeCode: this.garbageTypeCode,
        longitude: this.position.longitude,
        latitude: this.position.latitude
      }
      //验证必填项
      for (let key in check) {
        if (!check[key] && key != 'weight') {
          bool = false
        }
      }
      //必填项是否验证成功
      if (bool) {
        let url = '/carp/business/a/q/end/form/save/endForm'
        this.btnLoading = true
        let resp = await this.$http.post(url, updateData)
        this.btnLoading = false

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
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  background-color: #f9f9f9;
  padding-bottom: 30px;
  min-height: 100%;
  text-align: left;
}
canvas {
  background-color: #eee !important;
}
.mr0 {
  margin-right: 0;
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
        align-items: center;
        .myFile {
          display: inline-block;
          font-size: 18px;
          line-height: normal;
        }
        .van-cell {
          padding: 0;
        }
        .van-dropdown-menu__title::after {
          border-color: transparent transparent #4484ee #4484ee;
        }
        .van-cell {
          width: 160px;
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
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          text-align: left;
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
}
</style>
