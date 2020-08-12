<template>
  <div class="government-problemReportCreat">
    <van-popup class="myDia" position="top" v-model="mapDia">
      <MyMap :needCode="true" @chooseAddress="chooseAddress"></MyMap>
    </van-popup>
    <myTitle class="mainBox2" titleName="新建问题上报"></myTitle>
    <div class="boxItem mt50">
      <div class="itemContent problemType" style="padding:0 0px 10px">
        <p>问题类型</p>
        <div>
          <span
            :key="index"
            :style="{ background: item.choose ? '#4183f4' : '#e5e5e5', color: item.choose ? '#fff' : '#696969' }"
            @click="handelType(item)"
            class="myTag"
            color="#969799"
            v-for="(item, index) in problemType"
            v-text="item.name"
          ></span>
        </div>
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
    <div class="boxItem">
      <p class="text" style="display:block">
        图片上传
        <span style="color:#999">(最多3张)</span>
      </p>
      <div class="itemMsg" style="padding:10px">
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
import MyMap from '@/components/MyMap.vue'
import MyUpload from '@/components/MyUpload.vue'
export default {
  data() {
    return {
      btnLoading: false,
      problemType: [
        {
          name: '污染源',
          id: this.$dictionaries.problem.type.pollution,
          choose: true,
          chooseIndex: 0
        },
        {
          name: '项目未注册',
          id: this.$dictionaries.problem.type.noRegister,
          choose: false,
          chooseIndex: 1
        },
        {
          name: '企业问题上报',
          id: this.$dictionaries.problem.type.company,
          choose: false,
          chooseIndex: 2
        },
        {
          name: '其他',
          id: this.$dictionaries.problem.type.other,
          choose: false,
          chooseIndex: 3
        }
      ],
      mapDia: false,
      updateData: {
        areaCode: 0,
        peopleId: '', //上报人ID
        reportTitle: '未报建工地问题', //问题上报标题
        reportType: this.$dictionaries.problem.type.pollution, //上报类型
        reportMessage: '', //上报描述信息1
        createDate: '', //上报时间1
        reportAddress: '', //上报地址1
        adminCodeId: '0', //行政区域id1
        photo: [], //上报图片集合1
        longitude: '',
        latitude: '',
        emergencies: this.$dictionaries.problem.level.government //问题上报等级
      }
    }
  },
  mounted() {},
  components: { MyMap, MyUpload },
  methods: {
    //点击问题类型
    handelType(item) {
      //将选中模式取反
      this.problemType[item.chooseIndex].choose = !this.problemType[item.chooseIndex].choose
      this.updateData.reportTitle = item.name + '问题'
      //将其他渣土类型选中状态设为否
      for (let i = 0; i < this.problemType.length; i++) {
        if (this.problemType[i].id != item.id) this.problemType[i].choose = false
      }
    },
    async updateYes() {
      this.btnLoading = true
      this.updateData.peopleId = this.$store.state.user.user.id
      this.updateData.createDate = this.$moment().format('YYYY-MM-DD hh:mm:ss')
      let bool = this.$until.checkUpdateData(this.updateData)
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
.government-problemReportCreat {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  padding-bottom: 30px;
  .myDia {
    padding: 10px;
    padding-top: 20px;
  }
  .boxItem {
    background-color: #fff;
    margin-top: 20px;
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
  .myTag {
    padding: 0px 10px;
    line-height: 30px;
    font-size: 18px;
    margin: 4px 10px;
    border-radius: 16px;
    display: inline-block;
    color: #fff;
  }
}
</style>
