<template>
  <div class="workGov-CarIdentifyDetailList">
    <myTitle class="mainBox2" titleName="车辆信息"></myTitle>
    <van-row class="project mt50">
      <van-col span="6" style="height:85px">
        <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + paramsData.carImage" fit="cover" height="100%" style="width:100%;height:100%" width="100%" />
      </van-col>
      <van-col span="1"></van-col>
      <van-col span="17">
        <div class="top">
          <p>
            <span class="plateNumber" v-text="paramsData.plateNumber"></span>
            <span class="carTag1" v-if="paramsData.tabActive == 1">非名录车</span>
            <span class="carTag0" v-else>名录车</span>
          </p>
        </div>
        <div class="bottom">
          <p>
            车主姓名:
            <span v-text="paramsData.ownerName"></span>
          </p>
          <p>
            车主电话:
            <span v-text="paramsData.ownerPhone"></span>
          </p>
        </div>
      </van-col>
    </van-row>
    <div class="box">
      <div class="top">
        <div class="blueBox"></div>
        <p class="titleOne">车辆信息</p>
      </div>
      <div class="p10">
        <table border="1">
          <tr>
            <td class="label">所属企业</td>
            <td class="value" v-text="mainData.carDetailVO.companyName"></td>
          </tr>
          <tr>
            <td class="label">车主电话</td>
            <td class="value" v-text="mainData.carDetailVO.ownerPhone"></td>
          </tr>
          <tr>
            <td class="label">驾驶员</td>
            <td class="value" v-text="mainData.carDetailVO.driver"></td>
          </tr>
          <tr>
            <td class="label">驾驶员电话</td>
            <td class="value" v-text="mainData.carDetailVO.driverPhone"></td>
          </tr>
        </table>
      </div>
    </div>
    <div :key="index" class="box" v-for="(item, index) in mainData.transportCertificateDetailVOList">
      <div class="dfsb p10">
        <div class="top" style="padding:0">
          <div class="blueBox"></div>
          <p class="titleOne">渣土运输证</p>
        </div>
        <!-- <span style="color:#5083ff">附件</span> -->
      </div>
      <div class="p10">
        <table border="1">
          <tr>
            <td class="label2">运输公司</td>
            <td class="value" colspan="3" v-text="item.companyName"></td>
          </tr>
          <tr>
            <td class="label2">准行时间</td>
            <td class="value" v-text="fixData(item.productionDate)"></td>
            <td class="label2">有效期</td>
            <td class="value" v-text="fixData(item.expiryDate)"></td>
          </tr>
          <tr>
            <td class="label2">项目名称</td>
            <td class="value" colspan="3" v-text="item.projectName"></td>
          </tr>
          <tr>
            <td class="label2">消纳站名称</td>
            <td class="value" colspan="3" v-text="item.garbageName"></td>
          </tr>
        </table>
      </div>
    </div>
    <div class="box">
      <div class="dfsb p10">
        <div class="top" style="padding:0">
          <div class="blueBox"></div>
          <p class="titleOne">电子联单</p>
        </div>
        <!-- <span style="color:#5083ff">更多</span> -->
      </div>
      <div style="display:flex">
        <div style="width:33%;text-align:center">
          <p class="titleThree">总联单</p>
          <p class="titleOne" v-text="mainData.totalNo"></p>
        </div>
        <div style="width:33%;text-align:center">
          <p class="titleThree">今日联单</p>
          <p class="titleOne" v-text="mainData.todayNo"></p>
        </div>
        <div style="width:33%;text-align:center">
          <p class="titleThree">违法违规</p>
          <p class="titleOne" v-text="mainData.illegalNo"></p>
        </div>
      </div>
    </div>
    <div class="box p10">
      <van-pull-refresh @refresh="getEleForm(1)" v-model="refreshloading">
        <van-list :finished="finished" @load="getEleForm" finished-text="没有更多了" v-model="loading">
          <table style="text-align:center">
            <tr style="color:#5083ff">
              <td style="width:40px">序号</td>
              <td>排放企业</td>
              <td>时间</td>
              <td style="width:70px">当前司机</td>
              <td></td>
            </tr>
            <tr :key="index" @click="handelItem(item)" style="color:#323232" v-for="(item, index) in eleFormList">
              <td v-text="index + 1"></td>
              <td v-text="item.companyName"></td>
              <td v-text="item.createDate"></td>
              <td v-text="item.driverName"></td>
              <td>
                <van-icon color="#323232" name="arrow" />
              </td>
            </tr>
          </table>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      mainData: {
        plateNo: '',
        createDate: '',
        carDetailVO: {
          //车辆信息
          companyName: '',
          ownerPhone: '',
          driver: '',
          driverPhone: ''
        },
        transportCertificateDetailVOList: [], //渣土运输证
        totalNo: 6,
        todayNo: 0,
        illegalNo: 0
      },
      paramsData: {},
      loading: false,
      refreshloading: false,
      finished: false,
      searchData: {
        limit: 10,
        page: 1,
        plateNo: '',
        projectId: '',
        state: ''
      },
      eleFormList: []
    }
  },
  methods: {
    fixData(date) {
      return this.$moment(date).format('YYYY-MM-DD')
    },
    //点击查看详情
    handelItem(params) {
      this.$router.push({
        name: 'workGov-electronicFormDetail',
        params
      })
    },
    //获取信息
    async getMainData() {
      let resp = await this.$http.get('/carp/business/a/q/project/car/info?projectCarId=' + this.paramsData.projectCarId)
      if (resp.code == 0) {
        this.mainData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //得到电子联单
    async getEleForm(page) {
      if (page) {
        this.searchData.page = 1
      }
      let resp = await this.$http.get('/carp/business/a/q/electronic/workflow/project', {
        params: this.searchData
      })
      if (resp.code == 0) {
        if (this.searchData.page == 1) {
          this.eleFormList = []
        }
        this.eleFormList = this.eleFormList.concat(resp.data.records)
        // 加载状态结束
        this.loading = false
        this.refreshloading = false
        this.searchData.page = this.searchData.page + 1
        if (this.eleFormList.length == resp.data.total) {
          // 数据全部加载完成
          this.finished = true
        }
      } else {
        this.$dialog.alert({
          message: '获取电子联单失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  },
  filters: {},
  mounted() {
    if (JSON.stringify(this.$route.params) == '{}') {
      this.paramsData = this.$store.state.user.paramsData
    } else {
      this.paramsData = this.$route.params
      this.$store.commit('setParamsData', this.paramsData)
    }
    this.searchData.plateNo = this.paramsData.plateNumber
    this.searchData.projectId = this.paramsData.projectId
    this.getMainData()
  }
}
</script>

<style lang="less" scoped>
.workGov-CarIdentifyDetailList {
  text-align: left;
  background-color: #f9f9f9;
  padding-bottom: 30px;
  .project {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 15px;
    padding-left: 20px;
    text-align: left;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .carTag0 {
        border-radius: 4px;
        line-height: 24px;
        padding: 0 10px;
        border: 1px solid #00ce5e;
        color: #00ce5e;
        margin-left: 5px;
      }
      .carTag1 {
        border-radius: 4px;
        line-height: 24px;
        padding: 0 10px;
        margin-left: 5px;
        border: 1px solid #ff2c37;
        color: #ff2c37;
      }
    }
    .bottom {
      color: #949494;
      p {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
  .box {
    margin-top: 20px;
    background-color: #fff;
    .top {
      display: flex;
      padding: 10px;
      align-items: center;
    }
    .item {
      padding: 10px;
    }
  }
  .label {
    text-align: center;
    color: #989898;
  }
  .label2 {
    text-align: center;
    color: #989898;
    background-color: #f8f8f8;
  }
  .value {
    color: #333;
    text-indent: 10px;
  }
}
</style>
