<template>
  <div class="workGov-carIdentify mainBox">
    <div class="mainTop">
      <header>
        <van-nav-bar @click-left="goBack" class="nav" title="车辆识别">
          <template #left>
            <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
          </template>
          <template #right>
            <van-icon color="#333" name="scan" size="22" />
          </template>
        </van-nav-bar>
      </header>
      <van-search @search="select(1)" input-align="center" placeholder="请输入搜索关键词" shape="round" show-action v-model="searchData.plateNumber">
        <template #action>
          <div @click="select(1)">搜索</div>
        </template>
      </van-search>
      <van-tabs @change="select(1)" color="#4683f1" v-model="tabActive">
        <van-tab :key="index" :name="item.name" :title="item.title" v-for="(item, index) in tabList"></van-tab>
      </van-tabs>
    </div>
    <section class="lincenseBox mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
          <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
            <van-row :key="index" @click="handelItem(item)" class="item" v-for="(item, index) in list">
              <van-col span="6" style="height:85px">
                <MyImage
                  :imgUrl="$dictionaries.imgBaseUrl2 + (item.carImage || item.photo)"
                  fit="cover"
                  height="100%"
                  style="width:100%;height:100%"
                  width="100%"
                />
              </van-col>
              <van-col span="1"></van-col>
              <van-col span="17">
                <div class="top" style="margin-bottom:10px">
                  <p>
                    <span class="plateNumber" v-text="item.plateNumber || item.license"></span>
                    <span class="carTag0" v-if="tabActive == 0">名录车</span>
                    <span class="carTag1" v-else>非名录车</span>
                  </p>
                </div>
                <div class="bottom" v-if="tabActive == 0">
                  <p>
                    运输公司:
                    <span v-text="item.companyName"></span>
                  </p>
                  <p>
                    经营业户:
                    <span v-text="item.ownerName"></span>
                  </p>
                  <p>
                    车主电话:
                    <span v-text="item.ownerPhone"></span>
                  </p>
                </div>
                <div class="bottom" v-else>
                  <p>项目名称:{{ item.workplaceName }}</p>
                  <p>
                    告警时间:
                    <span v-text="item.violationDate"></span>
                  </p>
                </div>
              </van-col>
            </van-row>
          </van-list>
        </van-pull-refresh>
      </v-touch>
    </section>
  </div>
</template>

<script>
import { getList } from '@/assets/js/commonAxios'

export default {
  components: {},
  data() {
    return {
      tabActive: '0',
      list: [], //车辆识别列表
      tabList: [
        {
          name: '0',
          title: '名录车'
        },
        {
          name: '1',
          title: '非名录车'
        }
      ],
      loading: false, //加载
      refreshloading: false,
      finished: false, //完成
      searchData: {
        //车辆识别查询条件
        plateNumber: '',
        limit: 10,
        page: 1,
        code: 60,
        areaCode: ''
      },
      myTimeout: null
    }
  },
  mounted() {
    this.searchData.areaCode = this.$store.state.user.user.accountTypeDto.code
  },
  methods: {
    goBack() {
      this.$router.go(-1)
      if (window.jsCall) window.jsCall.back()
    },
    //滑动
    onSwipe(type) {
      let length = this.tabList.length
      let index = 0
      for (let i = 0; i < length; i++) {
        if (this.tabList[i].name == this.tabActive) {
          index = i
        }
      }
      if (type == 'left') {
        if (index != length - 1) {
          this.tabActive = this.tabList[index + 1].name
        }
      }
      if (type == 'right') {
        if (index != 0) {
          this.tabActive = this.tabList[index - 1].name
        }
      }
    },
    //跳转车辆项目界面
    handelItem(params) {
      let that = this
      if (!params.plateNumber) params.plateNumber = params.license
      this.$router.push({
        name: 'workGov-carIdentifyDetailList',
        params: {
          ...params,
          tabActive: that.tabActive
        }
      })
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = ''
      if (this.tabActive == 0) {
        //名录车
        url = '/carp/business/a/q/car/page'
      } else {
        //非名录车
        url = '/carp/business/a/q/warning/list/page'
      }
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '车辆识别', this.searchData)
      this.list = result.list
      this.searchData.page = result.page
      this.refreshloading = result.refreshloading
      this.loading = result.loading
      this.finished = result.finished
      //let resp = await this.$http.get(url, {
      //  params: this.searchData
      //})
      //if (resp.code == 0) {
      //  if (this.searchData.page == 1) {
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
      //    message: '获取车辆识别失败:' + resp.message,
      //    confirmButtonColor: 'red'
      //  })
      //}
    }
  }
}
</script>

<style lang="less" scoped>
.workGov-carIdentify {
  text-align: left;
  min-height: 100%;
  background-color: #f9f9f9;
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
  .lincenseBox {
    padding: 0;
    .item {
      background-color: #fff;
      margin-bottom: 10px;
      padding: 10px;
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
  }
}
</style>
