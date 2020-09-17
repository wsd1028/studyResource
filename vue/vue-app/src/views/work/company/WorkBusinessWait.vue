<template>
  <div class="company-workBusinessWait mainBox">
    <myTitle class="mainTop" titleName="待办事项"></myTitle>
    <section class="mainBottom">
      <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
        <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
          <van-swipe-cell :key="index" v-for="(item, index) in list">
            <div class="item">
              <div class="top">
                <div>
                  <van-icon class-prefix="iconfont" color="#4683f1" name="daiban" size="20" />
                  <span class="title" v-text="showType[paramsData.type].name"></span>
                </div>
                <span class="dot"></span>
              </div>
              <p class="msg" v-if="paramsData.type == 'car'">检测{{ item.projectName }}有非名录车进入,请尽快处理</p>
              <p class="msg" v-if="paramsData.type == 'todayCheck'">检测{{ item.projectName }}还未进行巡检,请尽快处理</p>
              <p class="msg" v-if="paramsData.type == 'appointCheck'">{{ item.projectName }}有指派点检任务,请尽快处理</p>
              <p class="msg" v-if="paramsData.type == 'dispatch'">{{ item.title }}有督办派单任务,请尽快处理</p>
              <div class="bottom">
                <p class="date" v-if="paramsData.type == 'car'" v-text="item.violationDate"></p>
                <p class="date" v-else v-text="item.createDate"></p>
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
        type: 'dust'
      },
      searchData: {
        departmentState: this.$dictionaries.machineType.company,
        workStationId: '',
        workplaceId: '',
        projectId: '',
        accountId: '', //用户id
        page: 1,
        limit: 10,
        state: 0, //指派点检状态1未处理2未审核3已完成
        disposeState: 0, //非名录车告警状态0未处理1已处理,
        code: this.$dictionaries.warnType.car //告警类型60非名录车告警
      },
      showType: {
        dust: {
          name: '扬尘告警',
          msg: '检测当前项目扬尘PM10浓度已超过告警阙值,请尽快处理'
        },
        car: {
          name: '非名录车告警',
          msg: '检测当前项目有非名录车进入,请尽快处理'
        },
        todayCheck: {
          name: '每日巡检',
          msg: '检测今日项目还未进行巡检,请尽快处理'
        },
        appointCheck: {
          name: '指派点检',
          msg: '收到指派点检任务,请尽快处理'
        },
        dispatch: {
          name: '督办派单',
          msg: '收到督办派单任务,请尽快处理'
        }
      }
    }
  },
  mounted() {
    this.searchData.projectId = this.$store.state.user.project.id
    this.searchData.accountId = this.$store.state.user.user.id
    this.paramsData = this.$route.params
    this.searchData.workStationId = this.$store.state.user.project.id
    this.searchData.workplaceId = this.$store.state.user.project.id
    if (this.$store.state.user.user.accountTypeDto.type == this.$dictionaries.userType.garbage) {
      this.searchData.departmentState = this.$dictionaries.machineType.garbage
    }
  },
  components: {},
  methods: {
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = ''
      if (this.paramsData.type == 'dust') {
        //扬尘告警
        this.finished = true
        this.loading = false
        this.refreshloading = false
        return
      }
      if (this.paramsData.type == 'car') {
        //非名录车告警
        url = '/carp/business/a/q/warning/list/page'
        this.searchData.disposeState = this.$dictionaries.carWarn.waitCheck
      }
      if (this.paramsData.type == 'todayCheck') {
        //每日巡检
        url = '/carp/business/a/q/todays/check/page'
        this.searchData.state = this.$dictionaries.todayCheck.update
      }

      if (this.paramsData.type == 'appointCheck') {
        //指派点检
        url = '/carp/business/a/q/command/check/list'
        this.searchData.state = this.$dictionaries.appointCheck.update
      }
      if (this.paramsData.type == 'dispatch') {
        //督办派单
        url = '/carp/business/a/q/task/accountId'
        this.searchData.state = this.$dictionaries.dispatch.wait
      }
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '数据', this.searchData)
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
.company-workBusinessWait {
  background-color: #f9f9f9;
  min-height: 100%;
  text-align: left;
  section {
    padding: 10px;
    .item {
      border-radius: 4px;
      background-color: #fff;
      margin-bottom: 10px;
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
          background-color: #f34341;
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
