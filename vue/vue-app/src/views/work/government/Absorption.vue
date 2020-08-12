<template>
  <div class="workGov-absorption mainBox">
    <div class="mainTop">
      <header>
        <van-nav-bar @click-left="goBack" class="nav" title="消纳监管">
          <template #left>
            <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
          </template>
          <template #right>
            <van-icon @click="handelSearch" color="#333" name="search" size="22" />
          </template>
        </van-nav-bar>
      </header>
      <div class="msgBox">
        <div style="width:100%;text-align:center">
          <p class="label">全部消纳场</p>
          <p class="titleOne" v-text="total"></p>
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
            <div :key="index" @click="handelItem(item)" class="item dfsb" v-for="(item, index) in list">
              <div class="left">
                <div class="top">
                  <van-image :src="require('@/assets/image/work_government_icon12.png')" height="18" width="14" />
                  <span class="projectName" v-text="item.name"></span>
                </div>
                <div class="middle">
                  <van-row>
                    <van-col class="left" span="24">
                      <p>
                        消纳站地址:
                        <span v-text="item.address"></span>
                      </p>
                    </van-col>
                  </van-row>
                </div>
                <div class="bottom">
                  <p>
                    剩余方量:
                    <span class="green" v-text="item.garbageSurplusWeight"></span>
                    <span class="green">万方</span>
                  </p>
                  <p>
                    已消纳:
                    <span class="red" v-text="item.capacity - item.garbageSurplusWeight"></span>
                    <span class="red">万方</span>
                  </p>
                </div>
              </div>
              <div class="rightIcon">
                <van-icon color="#d2d2d2" name="arrow" size="30" />
              </div>
            </div>
            <van-divider />
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
      list: [],
      loading: false,
      refreshloading: false,
      finished: false,
      areaList: [],
      total: 0,
      searchData: {
        limit: 10,
        page: 1,
        areaId: '',
        areaCode: '',
        name: ''
      }
    }
  },
  mounted() {
    this.searchData.areaCode = this.$store.state.user.user.accountTypeDto.code
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
    handelSearch() {
      this.$router.push({
        name: 'workGov-absorptionSearch'
      })
    },
    //点击查看详情
    handelItem(params) {
      this.$router.push({
        name: 'workGov-absorptionDetail',
        params
      })
    },
    //得到地区列表
    async getArea() {
      this.areaList = await getArea()
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = '/carp/business/a/q/garbage/station/page'
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '消纳站', this.searchData)
      this.list = result.list
      this.searchData.page = result.page
      this.refreshloading = result.refreshloading
      this.loading = result.loading
      this.finished = result.finished
      this.total = result.total

      //let resp = await this.$http.get('/carp/business/a/q/garbage/station/page', {
      //  params: this.searchData
      //})
      //if (resp.code == 0) {
      //  if (page) {
      //    this.list = []
      //  }
      //  this.total = resp.data.total
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
      //    message: '获取信息失败:' + resp.message,
      //    confirmButtonColor: 'red'
      //  })
      //}
    }
  }
}
</script>

<style lang="less" scoped>
.workGov-absorption {
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
    background-color: #fff;
    .item {
      padding: 10px;
      .left {
        color: #949494;
        flex-grow: 1;
        padding-right: 20px;
        p {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-size: 14px;
          line-height: 23px;
          margin-top: 5px;
        }
        .top {
          display: flex;
          align-items: center;
          .projectName {
            color: #333;
            font-weight: bold;
            font-size: 18px;
            margin-left: 5px;
          }
        }
        .bottom {
          margin-top: 3px;
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          width: 100%;
          p {
            color: #333;
          }
        }
      }

      .rightIcon {
        text-align: center;
        height: 100%;
        width: 50px;
      }
    }
  }
}
</style>
