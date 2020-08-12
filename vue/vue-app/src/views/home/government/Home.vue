<template>
  <div class="government-home">
    <GoTop></GoTop>
    <van-pull-refresh @refresh="appMain" v-model="refreshloading">
      <div class="head">
        <HomeTitle titleName="扬尘治理"></HomeTitle>
        <div class="cell-box">
          <div class="top">
            <div class="msgItem">
              <span>
                <van-image :src="require('@/assets/image/man_icon.png')" height="20" v-if="$store.state.user.user.accountBaseDto.sex" width="20" />
                <van-image :src="require('@/assets/image/woman_icon.png')" height="20" v-else width="20" />
              </span>
              <span class="text" style="fontSize:20px;fontWeight:800;color:#333" v-text="user.name"></span>
              <span style="color:#333;marginLeft:10px;fontSize:14px;fontWeight:800" v-text="user.work"></span>
            </div>
            <div class="msgItem">
              <van-image :src="require('@/assets/image/index_government_icon1.png')" height="18" width="18" />
              <span class="text" v-text="user.organizationDto"></span>
            </div>
            <div class="msgItem">
              <van-icon class="myIcon" color="#6c6c6c" name="location" size="18" />
              <span class="text" v-text="user.areaName"></span>
            </div>
            <div @click="goSkip('government-dustWarn')" style="display:flex;width:100%;marginTop:20px;align-items:flex-end">
              <van-image :src="require(`@/assets/image/${weather.wea_img}.png`)" height="40" width="40" />
              <p style="color:#4285F4;text-align:left;margin-left:5px">
                <span v-text="weather.wea"></span>
                <br />
                <span>{{ weather.tem2 }}°/{{ weather.tem1 }}°</span>
              </p>
              <van-tag :color="getWeatherColor(weather.air_level)" style="margin:0 6px;padding:2px 4px;font-size:16px">
                <!--eslint-->
                {{ weather.air_pm25 }}{{ weather.air_level }}
              </van-tag>
              <span style="color:#666;margin-right:6px">风力{{ weather.win_speed }}</span>
              <span style="color:#666">湿度{{ weather.humidity }}</span>
            </div>
          </div>
        </div>
        <div style="height:70px"></div>
        <van-notice-bar :text="noticeText" color="#538dc3" speed="50">
          <template #right-icon>
            <div @click="goSkip('government-exposure')" class="exposureIcon">
              <span class="text">更多</span>
              <van-icon name="arrow" />
            </div>
          </template>
          <template #left-icon>
            <div>
              <span class="exposureText">曝光台</span>
            </div>
          </template>
        </van-notice-bar>
      </div>
      <div class="box">
        <div style="textAlign:left;lineHeight:40px">
          <span class="title2">待办</span>
          <van-divider></van-divider>
        </div>
        <div class="allIconBox">
          <div @click="goSkip('government-dustWarn')" class="tac">
            <div class="iconBox" style="color:#ee4634" v-text="dustWarnNum"></div>
            <span class="text">扬尘告警</span>
          </div>
          <div @click="goSkip('government-directoriesWarn')" class="tac">
            <div class="iconBox" style="color:#ee4634" v-text="todayWait.carNumber"></div>
            <span class="text">非名录车告警</span>
          </div>
          <div @click="goSkip('government-todayCheck')" class="tac">
            <div class="iconBox" style="color:#333" v-text="todayWait.todayCheckNumber"></div>
            <span class="text">每日巡检</span>
          </div>
          <div @click="goSkip('government-appointCheck')" class="tac">
            <div class="iconBox" v-text="todayWait.assignCheckNumber"></div>
            <span class="text">指派点检</span>
          </div>
          <div @click="goSkip('government-problemReport')" class="tac">
            <div class="iconBox" v-text="todayWait.questionReportNumber"></div>
            <span class="text">问题上报</span>
          </div>
          <div class="tac"></div>
        </div>
      </div>
      <div class="box" style="paddingTop:0">
        <van-cell is-link style="textAlign:left" to="/home/government/dispatch" value="更多">
          <template #title>
            <span class="title2">督办派单</span>
          </template>
        </van-cell>
        <van-divider></van-divider>
        <div class="activeBtn">
          <span :class="searchData.state === '' ? 'active' : ''" @click="handelActive('')">全部</span>
          <span :class="searchData.state === $dictionaries.dispatch.wait ? 'active' : ''" @click="handelActive($dictionaries.dispatch.wait)">
            <!-- eslint -->
            待处理
          </span>
          <span :class="searchData.state === $dictionaries.dispatch.finish ? 'active' : ''" @click="handelActive($dictionaries.dispatch.finish)">已处理</span>
        </div>
      </div>
      <div class="box lincenseBox">
        <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
          <van-swipe-cell :key="index" v-for="(item, index) in list">
            <van-row @click="goSkip('dispatchDetail', item)" class="item">
              <van-col span="24">
                <div class="top">
                  <div class="top-left">
                    <p class="textFlowP">
                      <span class="textFlow">督办案件:{{ item.id }}</span>
                    </p>
                    <span class="nofinish" v-if="item.finishType == $dictionaries.dispatch.finishNo">未完成</span>
                    <span class="finish" v-if="item.finishType == $dictionaries.dispatch.finishYes">完成</span>
                  </div>
                  <p class="carCreat">
                    <span class="state-span waitState" v-if="item.accountState == $dictionaries.dispatch.wait">待处理</span>
                    <span class="state-span waitState" v-if="item.accountState == $dictionaries.dispatch.handleing">处理中</span>
                    <span
                      class="state-span finishState"
                      v-if="item.accountState == $dictionaries.dispatch.finish && item.state != $dictionaries.dispatch.finish"
                    >
                      <!--eslint-->
                      已处理
                    </span>
                  </p>
                </div>
                <div class="bottom">
                  <p>
                    案件地址:
                    <span v-text="item.address"></span>
                  </p>
                  <div class="dfsb">
                    <p>
                      处理人:
                      <span v-text="item.manager"></span>
                    </p>
                    <p>
                      创建时间:
                      <span v-text="item.createDate"></span>
                    </p>
                  </div>
                  <p class="stateP">
                    案件状态:
                    <span class="wait-span" v-if="item.state == $dictionaries.dispatch.wait">待处理</span>
                    <span class="handleing-span" v-if="item.state == $dictionaries.dispatch.handleing">处理中</span>
                    <span class="waitcheck-span" v-if="item.state == $dictionaries.dispatch.waitCheck">待审核</span>
                    <span class="update-span" v-if="item.state == $dictionaries.dispatch.reject">已驳回</span>
                    <span class="finish-span" v-if="item.state == $dictionaries.dispatch.finish">已结案</span>
                    <span class="update-span" v-if="item.state == $dictionaries.dispatch.cancel">已作废</span>
                  </p>
                </div>
              </van-col>
            </van-row>
          </van-swipe-cell>
        </van-list>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import HomeTitle from '@/components/HomeTitle.vue'
import GoTop from '@/components/GoTop.vue'
export default {
  data() {
    return {
      refreshloading: false,
      sex: true,
      exposureList: [], //曝光台列表
      exposureIndex: 0, //曝光台下标
      noticeText: '', //当前曝光台文字
      user: {
        name: '',
        work: '',
        organizationDto: '',
        areaName: ''
      },
      dustWarnNum: 0,
      todayWait: {
        assignCheckNumber: 0,
        carNumber: 0,
        questionReportNumber: 0,
        taskNumber: 0,
        todayCheckNumber: 0
      },
      list: [], //督办派单列表
      loading: false, //加载
      finished: false, //完成
      weather: {
        wea_img: 'qing'
      },
      searchData: {
        limit: 10,
        page: 1,
        accountId: '',
        state: ''
      }
    }
  },
  mounted() {
    this.appMain()
  },
  components: {
    HomeTitle,
    GoTop
  },
  methods: {
    //程序入口
    appMain() {
      this.user.name = this.$store.state.user.user.accountBaseDto.name
      this.searchData.accountId = this.$store.state.user.user.id
      try {
        this.user.organizationDto = this.$store.state.user.user.organizationDto.name
        this.user.areaName = this.$store.state.user.user.organizationDto.areaName
      } catch {}
      try {
        this.user.work = this.$store.state.user.user.jobTitleDtoList[0].name
      } catch {}
      this.getExposure()
      this.getTodayWait()
      //this.getDustWarnNum()//获取扬尘告警数量
      this.getWeather()
      this.refreshloading = false
    },
    //处理天气颜色
    getWeatherColor(name) {
      let color = '#17D687'
      if (name == '优') {
        color = '#17D687'
      } else if (name == '良') {
        color = '#FBCF1E'
      } else if (name == '轻度污染') {
        color = '#FBA01E'
      } else if (name == '中度污染') {
        color = '#FB1E1E'
      } else if (name == '重度污染') {
        color = '#AB0044'
      } else if (name == '严重污染') {
        color = '#AB0044'
      }
      return color
    },
    //得到天气
    async getWeather() {
      let resp = await this.$http.get('https://tianqiapi.com/api?version=v6&appid=66527314&appsecret=79zfaynW')
      this.weather = resp
    },
    //得到扬尘告警数量
    async getDustWarnNum() {
      var fd = new FormData()
      fd.append('beginTimeEnd', this.$moment().format('YYYY-MM-DD HH:mm:ss'))
      fd.append(
        'beginTimeStart',
        this.$moment()
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
      )
      fd.append('projectIdList', [])
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
    //得到今日待办
    async getTodayWait() {
      let resp = await this.$http.get(`/carp/business/a/q/data/num/statistics`, {
        params: {
          areaCode: this.$store.state.user.user.accountTypeDto.code,
          receiverId: this.$store.state.user.user.id, //收单人id
          carState: '', //非名录车状态
          warningCode: this.$dictionaries.warnType.car,
          todayState: this.$dictionaries.todayCheck.waitCheck, //今日巡检状态
          questionState: this.$dictionaries.problem.report, //问题上报状态
          assignState: this.$dictionaries.appointCheck.waitCheck, //指派点检状态
          taskState: this.$dictionaries.dispatch.waitCheck //督办派单状态
        }
      })
      if (resp.code == 0) {
        this.todayWait = resp.data
      } else {
        this.$dialog.alert({
          message: '获取今日待办:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },

    //得到曝光台信息
    async getExposure() {
      let resp = await this.$http.get('/carp/business/a/q/exposure/table/page?Page=1&Limit=9999&showType=1')
      if (resp.code == 0) {
        this.exposureList = resp.data.records
        for (let i = 0; i < this.exposureList.length; i++) {
          this.noticeText += '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + (i + 1) + '.'
          this.noticeText += this.exposureList[i].title
        }
      }
    },
    //跳转路由
    goSkip(name, params) {
      this.$router.push({
        name,
        params
      })
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let user = this.$store.state.user.user
      let resp = await this.$http.get('/carp/business/a/q/task/accountId', {
        params: this.searchData
      })
      if (resp.code == 0) {
        if (this.searchData.page == 1) {
          this.list = []
        }
        this.list = this.list.concat(resp.data.records)
        // 加载状态结束
        this.loading = false
        this.searchData.page = this.searchData.page + 1
        if (this.list.length == resp.data.total) {
          // 数据全部加载完成
          this.finished = true
        } else {
          this.finished = false
        }
      } else {
        this.$dialog.alert({
          message: '获取督办派单失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //点击按钮
    handelActive(val) {
      if (this.searchData.state !== val) {
        this.searchData.state = val
        this.select(1)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.government-home {
  padding-bottom: 50px;
  height: auto;
  background-color: #f9f9f9;
  .handleing-span {
    color: #3983f3;
  }
  .waitcheck-span {
    color: #f49b45;
  }
  .finish-span {
    color: #3df39a;
  }
  .wait-span {
    color: #3983f3;
  }
  .update-span {
    color: #fa3e3a;
  }
  .finish {
    border-radius: 4px;
    background-color: #3a87f2;
    color: #fff;
    padding: 0 5px;
    font-size: 14px;
    flex-shrink: 0;
  }
  .nofinish {
    border-radius: 4px;
    background-color: #f49b45;
    color: #fff;
    padding: 0 5px;
    font-size: 14px;
    flex-shrink: 0;
  }
  .van-divider {
    margin: 0;
  }
  .head {
    height: 210px;
    margin-bottom: 100px;
  }
  .van-notice-bar {
    background-color: #fff;
  }
  .main {
    background: #f9f9f9;
  }
  .exposureIcon {
    padding-left: 10px;
  }
  .exposureText {
    font-style: italic;
    color: #3d87f0;
    font-weight: 800;
    padding-right: 10px;
  }
  .project-name {
    font-weight: 800;
  }
  .cell-box {
    padding: 20px;
    padding-bottom: 0;
    background-color: #4284f3;
    position: relative;
    height: 140px;
    .top {
      border-radius: 8px;
      background-color: #fff;
      padding: 20px;
      padding-top: 4px;
      position: absolute;
      width: 93%;
      margin: auto;
      left: 0;
      bottom: -60px;
      right: 0;
      box-shadow: 0 0 7px #e5e5e5;
      .msgItem {
        font-size: 18px;
        color: #656565;
        margin-top: 6px;
        text-align: left;
        .text {
          margin-left: 10px;
        }
      }

      .myIcon {
        font-weight: 800;
      }
    }
  }
  .chartItems {
    width: 50%;
    color: #5c5c5c;
    font-size: 16px;
    text-align: left;
  }
  .box {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #fff;
    .van-cell {
      padding: 10px 0;
    }
    .title2 {
      font-weight: 800;
      color: #333;
      font-size: 16px;
    }
    .allIconBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      .tac {
        width: 33%;
        flex-shrink: 0;
        margin-top: 20px;
        .iconBox {
          font-size: 24px;
          color: #3a84f2;
        }
      }
      .text {
        color: #999;
        font-size: 16px;
        margin-top: 10px;
        display: inline-block;
        width: 100%;
      }
    }
    .dateBox {
      display: flex;
      justify-content: center;
      align-items: center;
      #chartPie,
      #chartPie1 {
        width: 80px;
        height: 80px;
        flex-shrink: 0;
        div {
          width: 100%;
        }
      }
      .item {
        flex-shrink: 0;
        .date {
          width: 100%;
          color: #999;
          font-weight: 800;
        }
        .text,
        sup {
          color: #9a9a9a;
        }
      }
    }
  }
  .activeBtn {
    text-align: left;
    margin-top: 20px;
    span {
      padding: 0 20px;
      border-radius: 14px;
      color: #999;
      line-height: 28px;
      text-align: center;
    }
    .active {
      background-color: #4186f4;
      color: #fff;
    }
  }
  .lincenseBox {
    background-color: #f9f9f9;
    padding: 0;
    .item {
      background-color: #fff;
      margin-bottom: 10px;
      padding: 15px;
      padding-left: 20px;
      text-align: left;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .top-left {
          flex-grow: 1;
          overflow: hidden;
          display: flex;
          font-weight: 800;
          align-items: center;
          justify-content: space-between;
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
      .stateP {
        font-weight: 800;
      }
    }
  }
}
</style>
