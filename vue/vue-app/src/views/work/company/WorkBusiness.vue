<template>
  <div class="company-workBusiness">
    <myTitle class="mainBox2" titleName="工作台"></myTitle>
    <van-tabs class="mt50" @change="changeTab" color="#4683f1" swipeable v-model="active">
      <van-tab name="wait" title="待办">
        <van-pull-refresh @refresh="changeTab" v-model="refreshloading">
          <div class="all">
            <van-row @click="handelWaitItem({ type: 'dust' })" class="item">
              <div class="top">
                <van-icon :name="iconName" class-prefix="iconfont" color="#4683f1" size="20" />
                <span class="title1">扬尘告警</span>
                <span class="count" v-text="dustWarnNum"></span>
              </div>
              <p class="msg">检测当前项目扬尘PM10浓度已超过告警阙值,请尽快处理</p>
            </van-row>
            <van-row @click="handelWaitItem({ type: 'car' })" class="item">
              <div class="top">
                <van-icon :name="iconName" class-prefix="iconfont" color="#4683f1" size="20" />
                <span class="title">非名录车告警</span>
                <span class="count" v-text="waitData.carNumber"></span>
              </div>
              <p class="msg">检测当前项目有非名录车进入,请尽快处理</p>
            </van-row>
            <van-row @click="handelWaitItem({ type: 'todayCheck' })" class="item">
              <div class="top">
                <van-icon :name="iconName" class-prefix="iconfont" color="#4683f1" size="20" />
                <span class="title">每日巡检</span>
                <span class="count" v-text="waitData.todayCheckNumber"></span>
              </div>
              <p class="msg">检测今日项目还未进行巡检,请尽快处理</p>
            </van-row>
            <van-row @click="handelWaitItem({ type: 'appointCheck' })" class="item">
              <div class="top">
                <van-icon :name="iconName" class-prefix="iconfont" color="#4683f1" size="20" />
                <span class="title">指派点检</span>
                <span class="count" v-text="waitData.assignCheckNumber"></span>
              </div>
              <p class="msg">收到翠屏区住建局质安科的指派点检任务,请尽快处理</p>
            </van-row>
            <van-row @click="handelWaitItem({ type: 'dispatch' })" class="item">
              <div class="top">
                <van-icon :name="iconName" class-prefix="iconfont" color="#4683f1" size="20" />
                <span class="title">督办派单</span>
                <span class="count" v-text="waitData.taskNumber"></span>
              </div>
              <p class="msg">收到翠屏区住建局质安科的督办派单任务,请尽快处理</p>
            </van-row>
          </div>
        </van-pull-refresh>
      </van-tab>
      <van-tab name="mine" title="我发起的">
        <van-pull-refresh @refresh="changeTab" v-model="refreshloading">
          <div class="all">
            <van-row @click="handelMineItem({ type: 'todayCheck' })" class="item">
              <div class="top">
                <van-icon :name="iconName" class-prefix="iconfont" color="#4683f1" size="20" />
                <span class="title">每日巡检</span>
                <span class="count" v-text="mineData.todayCheckNumber"></span>
              </div>
              <p class="msg">你当前每日巡检任务已提交,请等待审核结果</p>
            </van-row>
            <van-row @click="handelMineItem({ type: 'problemReport' })" class="item">
              <div class="top">
                <van-icon :name="iconName" class-prefix="iconfont" color="#4683f1" size="20" />
                <span class="title">问题上报</span>
                <span class="count" v-text="mineData.questionReportNumber"></span>
              </div>
              <p class="msg">你当前问题已上报,请等待处理结果</p>
            </van-row>
          </div>
        </van-pull-refresh>
      </van-tab>
      <van-tab name="finish" title="已处理">
        <van-pull-refresh @refresh="changeTab" v-model="refreshloading">
          <div class="all">
            <van-swipe-cell>
              <van-row @click="handelFinishItem({ type: 'problemReport' })" class="item">
                <div class="top">
                  <van-icon :name="iconName" class-prefix="iconfont" color="#4683f1" size="20" />
                  <span class="title">问题上报</span>
                  <span class="count" v-text="finishData.questionReportNumber"></span>
                </div>
                <p class="msg">你当前问题已处理,请查看结果</p>
              </van-row>
              <van-row @click="handelFinishItem({ type: 'todayCheck' })" class="item">
                <div class="top">
                  <van-icon :name="iconName" class-prefix="iconfont" color="#4683f1" size="20" />
                  <span class="title">每日巡检</span>
                  <span class="count" v-text="finishData.todayCheckNumber"></span>
                </div>
                <p class="msg">你当前每日巡检任务已完成,请等待审核结果</p>
              </van-row>
              <van-row @click="handelFinishItem({ type: 'appointCheck' })" class="item">
                <div class="top">
                  <van-icon :name="iconName" class-prefix="iconfont" color="#4683f1" size="20" />
                  <span class="title">指派点检</span>
                  <span class="count" v-text="finishData.assignCheckNumber"></span>
                </div>
                <p class="msg">你当前指派点检任务已完成,请等待审核结果</p>
              </van-row>
              <van-row @click="handelFinishItem({ type: 'dispatch' })" class="item">
                <div class="top">
                  <van-icon :name="iconName" class-prefix="iconfont" color="#4683f1" size="20" />
                  <span class="title">督办派单</span>
                  <span class="count" v-text="finishData.taskNumber"></span>
                </div>
                <p class="msg">你当前督办派单任务已完成,请等待审核结果</p>
              </van-row>
            </van-swipe-cell>
          </div>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 'wait',
      refreshloading: false,
      finished: false,
      iconName: 'daiban',
      dustWarnNum: 0,
      waitData: {
        carNumber: 0,
        todayCheckNumber: 0,
        questionReportNumber: 0,
        assignCheckNumber: 0,
        taskNumber: 0
      },
      mineData: { carNumber: 0, todayCheckNumber: 0, questionReportNumber: 0, assignCheckNumber: 0, taskNumber: 0 },
      finishData: { carNumber: 0, todayCheckNumber: 0, questionReportNumber: 0, assignCheckNumber: 0, taskNumber: 0 }
    }
  },
  mounted() {
    //获取路由参数
    if (JSON.stringify(this.$route.params) == '{}') {
      this.active = this.$store.state.user.paramsData.active
    } else {
      this.active = this.$route.params.active
    }
    this.changeTab()
  },
  components: {},
  methods: {
    changeTab(name) {
      this.$store.commit('setParamsData', { active: this.active })
      if (this.active == 'wait') {
        this.iconName = 'daiban'
        this.getWaitData()
        this.getDustNum()
      }
      if (this.active == 'mine') {
        this.iconName = 'faqi'
        this.getMineData()
      }
      if (this.active == 'finish') {
        this.iconName = 'chuli'
        this.getFinishData()
      }
    },
    //获取扬尘告警数量
    async getDustNum() {
      var fd = new FormData()
      fd.append('beginTimeEnd', this.$moment().format('YYYY-MM-DD HH:mm:ss'))
      fd.append(
        'beginTimeStart',
        this.$moment()
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
      )
      fd.append('projectIdList', [this.$store.state.user.user.accountTypeDto.ancillaryId])
      let resp = await this.$http.post('/carp/device/k/q/dust/alarm/total', fd)
      if (resp.code == 0) {
        this.dustWarnNum = resp.data
      } else {
        this.$dialog.alert({
          message: '获取扬尘告警数量:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //跳转待办页面
    handelWaitItem(parmas) {
      this.$router.push({
        name: 'work-workBusinessWait',
        params: parmas
      })
    },
    //跳转我发起的页面
    handelMineItem(parmas) {
      this.$router.push({
        name: 'work-workBusinessMine',
        params: parmas
      })
    },
    //跳转已处理页面
    handelFinishItem(parmas) {
      this.$router.push({
        name: 'work-workBusinessFinish',
        params: parmas
      })
    },
    //得到待办数据
    async getWaitData() {
      let resp = await this.$http.get(`/carp/business/a/q/data/num/statistics`, {
        params: {
          projectId: this.$store.state.user.user.accountTypeDto.ancillaryId, //项目id
          receiverId: this.$store.state.user.user.id, //收单人id
          initiatorPeopleId: this.$store.state.user.user.id, //收单人id
          carState: this.$dictionaries.carWarn.waitCheck, //非名录车状态
          warningCode: this.$dictionaries.warnType.car,
          todayState: this.$dictionaries.todayCheck.update, //今日巡检状态
          questionState: this.$dictionaries.problem.report, //问题上报状态
          assignState: this.$dictionaries.appointCheck.update, //指派点检状态
          taskState: this.$dictionaries.dispatch.wait //督办派单状态
        }
      })
      this.refreshloading = false
      if (resp.code == 0) {
        this.waitData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取待办数据:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //得到我发起的数据
    async getMineData() {
      let resp = await this.$http.get(`/carp/business/a/q/data/num/statistics`, {
        params: {
          projectId: this.$store.state.user.user.accountTypeDto.ancillaryId, //项目id
          todayInitiatorPeopleId: this.$store.state.user.user.id, //用户id
          receiverId: this.$store.state.user.user.id, //收单人id
          initiatorPeopleId: this.$store.state.user.user.id, //用户id
          carState: '', //非名录车状态
          todayState: '', //今日巡检状态
          questionState: '', //问题上报状态
          assignState: '', //指派点检状态
          taskState: '' //督办派单状态
        }
      })
      this.refreshloading = false
      if (resp.code == 0) {
        this.mineData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取我发起的数据:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //得到已完成的数据
    async getFinishData() {
      let resp = await this.$http.get(`/carp/business/a/q/data/num/statistics`, {
        params: {
          projectId: this.$store.state.user.user.accountTypeDto.ancillaryId, //项目id
          receiverId: this.$store.state.user.user.id, //收单人id
          initiatorPeopleId: this.$store.state.user.user.id, //收单人id
          carState: this.$dictionaries.carWarn.hasCheck, //非名录车状态
          todayState: this.$dictionaries.todayCheck.finish, //今日巡检状态
          questionState: this.$dictionaries.problem.finish, //问题上报状态
          assignState: this.$dictionaries.appointCheck.finish, //指派点检状态
          taskState: this.$dictionaries.dispatch.finish //督办派单状态
        }
      })
      this.refreshloading = false
      if (resp.code == 0) {
        this.finishData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取已处理数据:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.company-workBusiness {
  background-color: #f9f9f9;
  min-height: 100%;
  text-align: left;
  .all {
    padding: 10px;
    min-height: 400px;
    .item {
      border-radius: 4px;
      background-color: #fff;
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 4px;
      .top {
        display: flex;
        align-items: center;
        span {
          margin-left: 10px;
        }
        .title {
          font-weight: 800;
          color: #333;
        }
        .title1 {
          font-weight: 800;
          color: #4683f1;
        }
        .count {
          min-width: 20px;
          background-color: #f34341;
          border-radius: 20px;
          text-align: center;
          line-height: 20px;
          color: #fff;
          font-size: 14px;
        }
      }
      .msg {
        font-size: 14px;
      }
    }
  }
}
</style>
