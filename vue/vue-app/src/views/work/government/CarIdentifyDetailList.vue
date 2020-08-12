<template>
  <div class="workGov-CarIdentifyDetail mainBox">
    <div class="mainTop">
      <myTitle titleName="车辆识别"></myTitle>
      <van-row class="project">
        <van-col span="6" style="height:85px">
          <MyImage
            :imgUrl="$dictionaries.imgBaseUrl2 + (paramsData.carImage || paramsData.photo)"
            fit="cover"
            height="100%"
            style="width:100%;height:100%"
            width="100%"
          />
        </van-col>
        <van-col span="1"></van-col>
        <van-col span="17">
          <div class="top">
            <p>
              <span class="plateNumber" v-text="paramsData.plateNumber || paramsData.license"></span>
              <span class="carTag0" v-if="paramsData.tabActive == 0">名录车</span>
              <span class="carTag1" v-else>非名录车</span>
            </p>
          </div>
          <div class="bottom" v-if="paramsData.tabActive == 0">
            <p>
              车主姓名:
              <span v-text="paramsData.ownerName"></span>
            </p>
            <p>
              车主电话:
              <span v-text="paramsData.ownerPhone"></span>
            </p>
          </div>
          <div class="bottom" v-else>
            <p>项目名称:{{ paramsData.workplaceName }}</p>
            <p>
              告警时间:
              <span v-text="paramsData.violationDate"></span>
            </p>
          </div>
        </van-col>
      </van-row>
      <div class="box">
        <div class="top">
          <div class="blueBox"></div>
          <p class="titleOne">选择项目</p>
        </div>
      </div>
    </div>
    <section class="mainBottom">
      <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
        <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
          <van-swipe-cell :key="index" v-for="(item, index) in list">
            <div @click="handelItem(item)" class="item">
              <p class="titleTwo" v-text="item.projectName"></p>
              <p class="titleThree">
                项目地址:
                <span v-text="item.projectAddress"></span>
              </p>
              <van-divider />
            </div>
          </van-swipe-cell>
        </van-list>
      </van-pull-refresh>
    </section>
  </div>
</template>

<script>
import { getList } from '@/assets/js/commonAxios'

export default {
  components: {},
  data() {
    return {
      mainData: {},
      paramsData: {},
      list: [],
      loading: false, //加载
      refreshloading: false,
      finished: false, //完成
      searchData: {
        limit: 10,
        page: 1,
        plateNumber: ''
      }
    }
  },
  mounted() {
    if (JSON.stringify(this.$route.params) == '{}') {
      this.paramsData = this.$store.state.user.paramsData
    } else {
      this.paramsData = this.$route.params
      this.$store.commit('setParamsData', this.paramsData)
    }
    this.searchData.plateNumber = this.paramsData.plateNumber
  },
  methods: {
    //查看详情
    handelItem(params) {
      this.$router.push({
        name: 'workGov-carIdentifyDetail',
        params: { ...this.paramsData, projectCarId: params.id, projectId: params.projectId }
      })
    },
    //获取信息
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = '/carp/business/a/q/project/car/plateNum'
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '项目', this.searchData)
      this.list = result.list
      this.searchData.page = result.page
      this.refreshloading = result.refreshloading
      this.loading = result.loading
      this.finished = result.finished
      //let resp = await this.$http.get('/carp/business/a/q/project/car/plateNum', {
      //  params: this.searchData
      //})
      //if (resp.code == 0) {
      //  if (page) {
      //    this.list = []
      //  }
      //  this.list = this.list.concat(resp.data.records)
      //  // 加载状态结束
      //  this.loading = false
      //  this.refreshloading = false
      //  this.searchData.page = this.searchData.page + 1
      //  if (this.list.length == resp.data.total) {
      //    // 数据全部加载完成
      //    this.finished = true
      //  }
      //} else {
      //  this.$dialog.alert({
      //    message: '获取项目失败:' + resp.message,
      //    confirmButtonColor: 'red'
      //  })
      //}
    }
  }
}
</script>

<style lang="less" scoped>
.workGov-CarIdentifyDetail {
  text-align: left;
  background-color: #f9f9f9;
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
  section {
    background-color: #fff;
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
}
</style>
