<template>
  <div class="workGov-durationSearch mainBox">
    <div class="mainTop">
      <header>
        <van-icon @click="$router.go(-1)" color="#333" name="arrow-left" size="22" />
        <van-search @search="select(1)" input-align="center" placeholder="请输入项目名称" shape="round" style="flex-grow:1" v-model="searchData.projectName" />
        <van-button @click="select(1)" size="small" type="primary">搜索</van-button>
      </header>
      <van-tabs @change="select(1)" color="#4683f1" v-model="searchData.areaCode">
        <van-tab :key="index" :name="item.value" :title="item.text" v-for="(item, index) in areaList"></van-tab>
      </van-tabs>
    </div>
    <section class="all mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
          <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
            <van-swipe-cell :key="index" v-for="(item, index) in list">
              <div @click="handelItem(item)" class="item dfsb">
                <div class="left">
                  <div class="top">
                    <van-image :src="require('@/assets/image/index_icon3.png')" height="18" width="14" />
                    <span class="projectName" v-text="item.name"></span>
                  </div>
                  <div class="middle">
                    <van-row>
                      <van-col class="left" span="24">
                        <p>
                          所属区域:
                          <span v-text="item.fullName"></span>
                        </p>
                      </van-col>
                    </van-row>
                  </div>
                  <div class="bottom">
                    <p>
                      项目状态:
                      <span class="green" v-text="item.state"></span>
                    </p>
                    <p>
                      当前工期:
                      <span class="blue" v-text="item.phase"></span>
                    </p>
                  </div>
                </div>
                <div class="rightIcon">
                  <van-icon color="#d2d2d2" name="arrow" size="30" />
                </div>
              </div>
            </van-swipe-cell>
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
      areaList: [],
      loading: false,
      refreshloading: false,
      finished: false,
      searchData: {
        limit: 10,
        page: 1,
        areaId: '',
        areaCode: '',
        projectName: ''
      }
    }
  },
  mounted() {
    this.searchData.areaCode = this.$store.state.user.user.accountTypeDto.code
    this.getArea()
  },
  methods: {
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
    //得到地区列表
    async getArea() {
      this.areaList = await getArea()
    },
    //点击查看详情
    handelItem(params) {
      this.$router.push({
        name: 'workGov-durationDetail',
        params
      })
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = '/carp/business/a/q/duration/form/areaId'
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
      //let resp = await this.$http.get('/carp/business/a/q/duration/form/areaId', {
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
      //    message: '获取项目失败:' + resp.message,
      //    confirmButtonColor: 'red'
      //  })
      //}
    }
  }
}
</script>

<style lang="less" scoped>
.workGov-durationSearch {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  header {
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 10px;
  }
  .msgBox {
    padding: 20px 10px;
    background-color: #fff;
    display: flex;
    .label {
      color: #c5c5c5;
      font-size: 16px;
    }
    .red {
      color: #fa302b;
    }
    .blue {
      color: #3882ea;
    }
  }
  .all {
    background-color: #fff;
    .item {
      padding: 10px;
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
      .middle {
        .left {
          color: #949494;
          p {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-size: 14px;
            line-height: 23px;
            margin-top: 5px;
          }
        }
      }
      .bottom {
        margin-top: 3px;
        display: flex;
        justify-content: space-between;
        font-weight: 600;
        p {
          color: #333;
        }
        .red {
          color: #f92a2f;
        }
        .green {
          color: #0cc15d;
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
