<template>
  <div class="government-directoriesWarn mainBox">
    <div class="mainTop">
      <myTitle titleName="非名录车告警"></myTitle>
      <van-tabs @change="select(1)" color="#4683f1" swipeable v-model="searchData.areaCode">
        <van-tab :key="index" :name="item.value" :title="item.text" v-for="(item, index) in areaList"></van-tab>
      </van-tabs>
    </div>
    <div class="all mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
          <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
            <div :key="index" @click="handelItem(item)" class="item" v-for="(item, index) in list">
              <div class="top">
                <div>
                  <span class="projectName" v-text="item.name"></span>
                </div>
                <p class="warn">
                  <van-icon class-prefix="iconfont" name="note" size="18" />报警：
                  <span v-text="item.num"></span>
                  次
                </p>
              </div>
              <div class="bottom">
                <van-row>
                  <van-col class="left" span="24">
                    <p>负责人:{{ item.manager }}</p>
                    <p>项目地址:{{ item.address }}</p>
                  </van-col>
                </van-row>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </v-touch>
    </div>
  </div>
</template>

<script>
import { getArea, getList } from '@/assets/js/commonAxios'

export default {
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
        areaCode: ''
      }
    }
  },
  async created() {
    this.searchData.areaCode = this.$store.state.user.user.accountTypeDto.code
    this.getArea()
  },
  components: {},
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
        name: 'government-directoriesWarnDetail',
        params
      })
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = `/carp/business/a/q/warning/list/select/area?areaCode=${this.searchData.areaCode}&limit=${this.searchData.limit}&page=${
        this.searchData.page
      }&r=${Math.random()}`
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '车辆识别')
      this.list = result.list
      this.searchData.page = result.page
      this.refreshloading = result.refreshloading
      this.loading = result.loading
      this.finished = result.finished
    }
  }
}
</script>

<style lang="less">
.government-directoriesWarn {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  .van-info {
    top: 12px;
    right: -11px;
  }
  .all {
    padding: 0 10px;
    background-color: #f9f9f9;
    .item {
      background-color: #fff;
      margin-top: 10px;
      padding: 10px;
      border-radius: 4px;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .projectName {
          color: #333;
          font-weight: bold;
          font-size: 18px;
        }
        .warn {
          color: #d7484a;
          font-weight: 700;
          flex-shrink: 0;
        }
      }
      .bottom {
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
    }
  }
}
</style>
