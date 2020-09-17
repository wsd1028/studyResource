<template>
  <div class="wechat-problemReportCreat">
    <van-popup class="myDia" position="top" v-model="mapDia">
      <MyMap :needCode="true" @chooseAddress="chooseAddress"></MyMap>
    </van-popup>
    <myTitle class="mainBox2" titleName="新建问题上报" :isBack="false"></myTitle>
    <van-form>
      <div class="boxItem mt50">
        <van-field label="上报人" placeholder="请填写你的姓名" type="text" v-model="updateData.name"></van-field>
      </div>
      <div class="boxItem">
        <van-field
          :rules="[{ pattern: checkPhone, message: '请输入正确电话号码' }]"
          label="上报电话"
          placeholder="请填写你的电话号码"
          type="text"
          v-model="updateData.phone"
        ></van-field>
      </div>
      <div class="boxItem">
        <div class="itemContent problemType" style="padding:0 0px 10px">
          <p style="width:90px">问题类型</p>
          <el-select placeholder="请选择" size="mini" style="width: 150px" v-model="updateData.reportType">
            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in problemType"></el-option>
          </el-select>
        </div>
      </div>
      <div class="boxItem">
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
    </van-form>

    <div class="boxItem">
      <p class="text" style="display:block">
        图片上传
        <span style="color:#999">(最多3张)</span>
      </p>
      <div class="itemMsg" style="padding:10px">
        <MyUpload :limit="3" useType="wechat" :module="$dictionaries.imgType.problem" @uploadYes="uploadYes"></MyUpload>
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
import MyMap from '@/components/MyMap.vue'
import MyUpload from '@/components/MyUpload.vue'
import { checkPhone } from '@/assets/js/pattern'

export default {
  inject: ['reload'],
  data() {
    return {
      btnLoading: false,
      checkPhone,
      problemType: [
        {
          name: '污染源',
          id: this.$dictionaries.problem.type.pollution
        },
        {
          name: '项目未注册',
          id: this.$dictionaries.problem.type.noRegister
        },
        {
          name: '企业问题上报',
          id: this.$dictionaries.problem.type.company
        },
        {
          name: '其他',
          id: this.$dictionaries.problem.type.other
        }
      ],
      mapDia: false,
      updateData: {
        areaCode: null,
        name: '',
        phone: '',
        peopleId: '', //上报人ID
        reportTitle: '', //问题上报标题
        reportType: null, //上报类型
        reportMessage: '', //上报描述信息1
        createDate: '', //上报时间1
        reportAddress: '', //上报地址1
        adminCodeId: '', //行政区域id1
        photo: [], //上报图片集合1
        longitude: '',
        latitude: '',
        emergencies: this.$dictionaries.problem.level.ordinary //问题上报等级
      }
    }
  },
  mounted() {},
  components: { MyMap, MyUpload },
  methods: {
    async updateYes() {
      this.btnLoading = true
      for (let i = 0; i < this.problemType.length; i++) {
        if (this.updateData.reportType == this.problemType[i].id) {
          this.updateData.reportTitle = this.problemType[i].name + '问题'
        }
      }
      this.updateData.createDate = this.$moment().format('YYYY-MM-DD hh:mm:ss')
      let bool = this.$until.checkUpdateData(this.updateData, ['peopleId', 'adminCodeId', 'photo'])
      //必填项是否验证成功
      if (bool) {
        let url = '/carp/business/k/q/visitor/report/insert'
        let resp = await this.$http.post(url, this.updateData)
        if (resp.code == 0) {
          this.$dialog
            .alert({
              message: '创建成功',
              confirmButtonColor: 'green'
            })
            .then(() => {
              this.reload()
            })
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
    },
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
      this.updateData.photo = fileList
    }
  }
}
</script>

<style lang="less">
.wechat-problemReportCreat {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  padding-bottom: 30px;
  .van-field__label {
    font-weight: 700;
  }
  .myDia {
    padding: 10px;
    padding-top: 20px;
  }
  .boxItem {
    background-color: #fff;
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
      font-size: 14px;
    }
    .problemType {
      display: flex;
      align-items: flex-start;
      p {
        margin-top: 4px;
      }
      p,
      span {
        flex-shrink: 0;
      }
    }
  }
}
</style>
