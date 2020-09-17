<template>
  <div class="workGov-electronicForm mainBox">
    <div class="mainTop">
      <header>
        <van-nav-bar @click-left="goBack" class="nav" title="电子联单">
          <template #left>
            <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
          </template>
          <template #right>
            <van-icon @click="handelSearch" color="#333" name="search" size="22" />
          </template>
        </van-nav-bar>
      </header>
      <div class="msgBox">
        <div style="width:33%;text-align:center">
          <p class="label">全部固定源</p>
          <p class="titleOne" v-text="number.projectNum"></p>
        </div>
        <div style="width:33%;text-align:center">
          <p class="label">电子联单</p>
          <p class="titleOne blue" v-text="number.electronicNum"></p>
        </div>
        <div style="width:33%;text-align:center">
          <p class="label">车辆登记</p>
          <p class="titleOne red" v-text="number.carNum"></p>
        </div>
      </div>
      <van-tabs @change="select(1)" color="#4683f1" v-model="searchData.areaCode">
        <van-tab :key="index" :name="item.value" :title="item.text" v-for="(item, index) in areaList"></van-tab>
      </van-tabs>
    </div>
    <section class="all mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
          <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
            <van-row :key="index" @click="handelDetail(item)" class="item" v-for="(item, index) in list">
              <van-col span="6" style="height:85px;position:relative">
                <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item.carPhoto" fit="cover" height="100%" style="width:100%;height:100%" width="100%" />
              </van-col>
              <van-col span="1"></van-col>
              <van-col span="17">
                <div class="top" style="margin-bottom:8px">
                  <p>
                    <span class="plateNumber" v-text="item.licenseNumber"></span>
                    <span class="carTag0" v-if="item.carState">名录车</span>
                    <span class="carTag1" v-if="!item.carState">非名录车</span>
                  </p>
                  <van-tag type="primary" v-if="item.state < $dictionaries.electronic.yunshu">运输中</van-tag>
                  <van-tag type="warning" v-else>已消纳</van-tag>
                </div>
                <div class="bottom">
                  <p class="textFlow">项目名称:{{ item.projectName }}</p>
                  <div class="dfsb">
                    <p>
                      所属区县:
                      <span v-text="item.projectAreaName"></span>
                    </p>
                  </div>
                  <p>
                    创建时间:
                    <span v-text="item.createDate"></span>
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
import { getArea, getList } from '@/assets/js/commonAxios'

export default {
  components: {},
  data() {
    return {
      areaList: [],
      list: [],
      loading: false,
      refreshloading: false,
      finished: false,
      number: {},
      searchData: {
        plateNo: '',
        limit: 10,
        page: 1,
        areaCode: ''
      }
    }
  },
  mounted() {
    this.searchData.areaCode = this.$store.state.user.user.accountTypeDto.code
    this.getNumber()
    this.getArea()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
      if (window.jsCall) window.jsCall.back()
    },
    //滑动
    onSwipe(type) {
      let length = this.areaList.length
      let index = 0
      for (let i = 0; i < length; i++) {
        if (this.areaList[i].value == this.searchData.areaCode) {
          index = i
        }
      }
      if (type == 'left') {
        if (index != length - 1) {
          this.searchData.areaCode = this.areaList[index + 1].value
        }
      }
      if (type == 'right') {
        if (index != 0) {
          this.searchData.areaCode = this.areaList[index - 1].value
        }
      }
    },
    async getNumber() {
      let resp = await this.$http.get('/carp/business/a/q/electronic/num/statistics')
      if (resp.code == 0) {
        this.number = resp.data
      } else {
        this.$dialog.alert({
          message: '获取信息失败',
          confirmButtonColor: 'red'
        })
      }
    },
    //得到地区列表
    async getArea() {
      this.areaList = await getArea()
    },
    //跳转联单详情
    handelDetail(params) {
      this.$router.push({
        name: 'workGov-electronicFormDetail',
        params
      })
    },
    // 点击搜索
    handelSearch() {
      this.$router.push({
        name: 'workGov-electronicFormSearch'
      })
    },
    //点击查看详情
    handelItem() {
      this.$router.push({
        name: 'workGov-electronicFormDetail'
      })
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = '/carp/business/a/q/electronic/workflow/government'
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '电子联单', this.searchData)
      this.list = result.list
      this.searchData.page = result.page
      this.refreshloading = result.refreshloading
      this.loading = result.loading
      this.finished = result.finished
    }
  }
}
</script>

<style lang="less" scoped>
.workGov-electronicForm {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  .red {
    color: #fa302b;
  }
  .blue {
    color: #3882ea;
  }
  .green {
    color: #0cc15d;
  }
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
  .msgBox {
    padding: 20px 10px;
    background-color: #fff;
    display: flex;
    .label {
      color: #c5c5c5;
      font-size: 16px;
    }
  }
  .all {
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
