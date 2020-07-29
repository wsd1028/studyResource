<template>
  <div class="company-workBusinessMine mainBox">
    <header class="mainTop">
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="我发起的">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <section class="mainBottom">
      <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
        <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
          <van-swipe-cell :key="index" v-for="(item, index) in list">
            <div class="item">
              <div class="top">
                <div>
                  <van-icon class-prefix="iconfont" color="#4683f1" name="faqi" size="20" />
                  <span class="title" v-text="showType[paramsData.type].name"></span>
                </div>
                <span :class="item.reportState == $dictionaries.problem.finish || item.state == $dictionaries.todayCheck.finish ? 'dotBlue' : 'dotRed'"></span>
              </div>
              <p class="msg" v-if="paramsData.type == 'todayCheck'">检测{{ item.projectName }}还未进行巡检,请尽快处理</p>
              <p class="msg" v-if="paramsData.type == '问题上报'">检测{{ item.reportTitle }}有问题上报,请尽快处理</p>
              <div class="bottom">
                <p class="date" v-text="item.createDate"></p>
                <p v-if="paramsData.type == 'todayCheck'">
                  <van-image :src="require('@/assets/image/work_icon16.png')" height="16" v-if="item.state == $dictionaries.todayCheck.finish" width="14" />
                  <van-image :src="require('@/assets/image/work_icon17.png')" height="16" v-else width="14" />
                  <span class="text" v-if="item.state == $dictionaries.todayCheck.update">整改</span>
                  <span class="text" v-if="item.state == $dictionaries.todayCheck.waitCheck">待审核</span>
                  <span class="text" style="color:#4186f4" v-if="item.state == $dictionaries.todayCheck.finish">已结案</span>
                </p>
                <p v-else>
                  <van-image :src="require('@/assets/image/work_icon16.png')" height="16" v-if="item.reportState == $dictionaries.problem.finish" width="14" />
                  <van-image :src="require('@/assets/image/work_icon17.png')" height="16" v-else width="14" />
                  <span class="text" v-if="item.reportState == $dictionaries.problem.report">已上报</span>
                  <span class="text" v-if="item.reportState == $dictionaries.problem.processing">处理中</span>
                  <span class="text" style="color:#4186f4" v-if="item.reportState == $dictionaries.problem.finish">已结案</span>
                  <span class="text" v-if="item.reportState == $dictionaries.problem.cancel">已作废</span>
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
export default {
  data() {
    return {
      loading: false,
      refreshloading: false,
      finished: false,
      list: [],
      paramsData: {
        type: 'todayCheck'
      },
      searchData: {
        peopleId: '',
        initiatorPeopleId: '',
        departmentState: this.$dictionaries.machineType.company,
        todayInitiatorPeopleId: this.$store.state.user.user.id, //用户id
        workStationId: '',
        page: 1,
        limit: 10,
        stateQuestion: '', //问题上报状态550已上报551已解决
        state: '' //指派点检状态1未处理2未审核3已完成
      },
      showType: {
        todayCheck: {
          name: '每日巡检',
          msg: '你当前每日巡检任务已提交,请等待审核结果'
        },
        problemReport: {
          name: '问题上报',
          msg: '你当前问题已上报,请等待处理结果'
        }
      }
    }
  },
  mounted() {
    this.paramsData = this.$route.params
    this.searchData.peopleId = this.$store.state.user.user.id
    this.searchData.initiatorPeopleId = this.$store.state.user.user.id
    this.searchData.workStationId = this.$store.state.user.project.id
    if (this.$store.state.user.user.accountTypeDto.type == this.$dictionaries.userType.garbage) {
      this.searchData.departmentState = this.$dictionaries.machineType.garbage
    }
  },
  components: {},
  methods: {
    async select(page) {
      if (page) {
        this.searchData.page = 1
        this.list = []
      }
      let url = ''
      if (this.paramsData.type == 'todayCheck') {
        //每日巡检
        url = '/carp/business/a/q/todays/check/page'
      }
      if (this.paramsData.type == 'problemReport') {
        //问题上报
        url = '/carp/business/a/q/question/report/page'
      }
      let resp = await this.$http.get(url, {
        params: this.searchData
      })
      if (resp.code == 0) {
        this.list = this.list.concat(resp.data.records)
        // 加载状态结束
        this.loading = false
        this.refreshloading = false
        this.searchData.page = this.searchData.page + 1
        if (this.list.length == resp.data.total) {
          // 数据全部加载完成
          this.finished = true
        }
      } else {
        this.$dialog.alert({
          message: '获取信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.company-workBusinessMine {
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
        .dotRed {
          background-color: #f34341;
          border-radius: 100%;
          width: 10px;
          height: 10px;
        }
        .dotBlue {
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
          color: #f34341;
          font-size: 14px;
          vertical-align: top;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
