<template>
  <div class="company-problemReport mainBox">
    <div class="mainTop">
      <myTitle titleName="问题上报"></myTitle>
      <van-tabs @change="select(1)" color="#4683f1" v-model="searchData.stateQuestion">
        <van-tab :key="index" :name="item.name" :title="item.title" v-for="(item, index) in tabList"></van-tab>
      </van-tabs>
    </div>

    <section class="mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
          <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
            <div :key="index" @click="handelItem(item)" class="item" v-for="(item, index) in list">
              <div class="top">
                <div class="textFlowP">
                  <span class="projectName textFlow" v-text="item.reportTitle"></span>
                </div>
                <div style="flexShrink:0">
                  <span class="state-span waitState" v-if="item.reportState == $dictionaries.problem.report">已上报</span>
                  <span class="state-span finishState" v-if="item.reportState == $dictionaries.problem.finish">已结案</span>
                  <span class="state-span cancelState" v-if="item.reportState == $dictionaries.problem.cancel">已作废</span>
                  <span class="state-span updateState" v-if="item.reportState == $dictionaries.problem.processing">处理中</span>
                </div>
              </div>
              <div class="bottom">
                <div class="textFlowP">
                  <span class="textFlow" v-text="item.reportMessage"></span>
                </div>
                <span class="date" v-text="item.createDate"></span>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </v-touch>
    </section>
    <div @click="handelCreat" class="iconBox">
      <van-icon name="plus" />
    </div>
  </div>
</template>

<script>
import { getList } from '@/assets/js/commonAxios'

export default {
  data() {
    return {
      mainData: {},
      list: [],
      tabList: [
        {
          name: '',
          title: '全部'
        },
        {
          name: this.$dictionaries.problem.report,
          title: '已上报'
        },
        {
          name: this.$dictionaries.problem.processing,
          title: '处理中'
        },
        {
          name: this.$dictionaries.problem.cancel,
          title: '已作废'
        },
        {
          name: this.$dictionaries.problem.finish,
          title: '已结案'
        }
      ],
      loading: false,
      refreshloading: false,
      finished: false,
      searchData: {
        limit: 10,
        page: 1,
        stateQuestion: this.$dictionaries.problem.report,
        peopleId: this.$store.state.user.user.id
      }
    }
  },
  mounted() {},
  components: {},
  methods: {
    //滑动
    onSwipe(type) {
      let length = this.tabList.length
      let index = 0
      for (let i = 0; i < length; i++) {
        if (this.tabList[i].name == this.searchData.stateQuestion) {
          index = i
        }
      }
      if (type == 'left') {
        if (index != length - 1) {
          this.searchData.stateQuestion = this.tabList[index + 1].name
        }
      }
      if (type == 'right') {
        if (index != 0) {
          this.searchData.stateQuestion = this.tabList[index - 1].name
        }
      }
    },
    //跳转到问题上报详情
    handelItem(item) {
      this.$router.push({
        name: 'company-problemReportDetail',
        params: item
      })
    },
    //跳转到问题上报创建
    handelCreat() {
      this.$router.push({
        name: 'company-problemReportCreat'
      })
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = page
      }
      let url = '/carp/business/a/q/question/report/page'
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '问题上报', this.searchData)
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
.company-problemReport {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  section {
    .item {
      background-color: #fff;
      margin-top: 10px;
      padding: 10px;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .projectName {
          color: #333;
          font-weight: bold;
          font-size: 18px;
        }
      }
      .bottom {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .date {
          color: #303030;
          font-size: 16px;
          margin-left: 5px;
        }
        span {
          color: #999;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
  .iconBox {
    position: fixed;
    right: 40px;
    bottom: 40px;
    i {
      background-color: #4186fc;
      color: #fff;
      font-weight: 800;
      font-size: 24px;
      width: 50px;
      height: 50px;
      border-radius: 100%;
      line-height: 50px;
      text-align: center;
      display: inline-block;
    }
  }
}
</style>
