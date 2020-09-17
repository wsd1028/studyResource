<template>
  <div class="government-workBusinessWait mainBox">
    <div class="mainTop">
      <header>
        <van-nav-bar @click-left="$router.go(-1)" class="nav" title="已处理">
          <template #left>
            <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
          </template>
        </van-nav-bar>
      </header>
      <van-radio-group
        @change="select(1)"
        direction="horizontal"
        style="padding:10px"
        v-if="paramsData.type == 'todayCheck'"
        v-model="searchData.departmentState"
      >
        <van-radio :name="$dictionaries.machineType.company">项目</van-radio>
        <van-radio :name="$dictionaries.machineType.garbage">消纳站</van-radio>
      </van-radio-group>
    </div>
    <section class="mainBottom">
      <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
        <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
          <van-swipe-cell :key="index" v-for="(item, index) in list">
            <div class="item">
              <div class="top">
                <div>
                  <van-icon class-prefix="iconfont" color="#4683f1" name="chuli" size="20" />
                  <span class="title" v-text="showType[paramsData.type].name"></span>
                </div>
                <span class="dot"></span>
              </div>
              <p class="msg" v-text="showType[paramsData.type].msg"></p>
              <div class="bottom">
                <p class="date" v-text="item.createDate"></p>
                <p>
                  <van-image :src="require('@/assets/image/work_icon16.png')" height="16" width="14" />
                  <span class="text">已完成</span>
                </p>
              </div>
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
  data() {
    return {
      loading: false,
      refreshloading: false,
      finished: false,
      list: [],
      paramsData: {
        type: 'problemReport'
      },
      allList: [], //无分页，获取所有数据
      isFirst: true, //是否为第一次获取数据
      searchData: {
        accountId: '', //用户id
        page: 1,
        limit: 10,
        peopleId: this.$store.state.user.user.id,
        departmentState: this.$dictionaries.machineType.company,
        stateQuestion: this.$dictionaries.problem.finish, //问题上报状态550已上报551已解决
        state: 2 //指派点检状态1未处理2未审核3已完成
      },
      showType: {
        problemReport: {
          name: '问题上报',
          msg: '你当前问题已处理,请查看结果'
        },
        todayCheck: {
          name: '每日巡检',
          msg: '你当前每日巡检任务已完成,请等待审核结果'
        },
        appointCheck: {
          name: '指派点检',
          msg: '你当前指派点检任务已完成,请等待审核结果'
        },
        dispatch: {
          name: '督办派单',
          msg: '你当前督办派单任务已完成,请等待审核结果'
        }
      }
    }
  },
  mounted() {
    this.searchData.accountId = this.$store.state.user.user.id
    this.paramsData = this.$route.params
  },
  components: {},
  methods: {
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = ''
      if (this.paramsData.type == 'problemReport') {
        //问题上报
        url = '/carp/business/a/q/question/report/page'
        this.searchData.stateQuestion = this.$dictionaries.problem.finish
      }
      if (this.paramsData.type == 'todayCheck') {
        //每日巡检
        url = '/carp/business/a/q/todays/check/page'
        this.searchData.state = this.$dictionaries.todayCheck.finish
      }
      if (this.paramsData.type == 'appointCheck') {
        //指派点检
        url = '/carp/business/a/q/command/check/list'
        this.searchData.state = this.$dictionaries.appointCheck.finish
      }
      if (this.paramsData.type == 'dispatch') {
        //督办派单
        url = '/carp/business/a/q/task/accountId'
        this.searchData.state = this.$dictionaries.dispatch.finish
      }
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '信息', this.searchData)
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
.government-workBusinessWait {
  background-color: #f9f9f9;
  min-height: 100%;
  text-align: left;
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
  section {
    padding: 10px;
    .item {
      border-radius: 4px;
      background-color: #fff;
      margin-top: 10px;
      padding: 10px;
      border-radius: 4px;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          font-weight: 800;
          color: #333;
          margin-left: 10px;
        }
        .dot {
          background-color: #4186f4;
          border-radius: 100%;
          width: 10px;
          height: 10px;
        }
      }
      .msg {
        font-size: 14px;
        margin: 10px 0 20px;
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .date {
          color: #999;
        }
        .text {
          color: #3f85f9;
          font-size: 14px;
          vertical-align: top;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
