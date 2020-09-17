<template>
  <div class="company-home">
    <GoTop></GoTop>
    <van-pull-refresh @refresh="appMain" v-model="refreshloading">
      <div class="head">
        <HomeTitle titleName="扬尘治理"></HomeTitle>
        <div class="cell-box">
          <div class="top">
            <div class="msgItem">
              <span>
                <van-image :src="require('@/assets/image/index_icon3.png')" height="18" width="18" />
              </span>
              <span
                @click="goSkip('company-projectDetail')"
                class="text"
                style="fontWeight:800;color:#333"
                v-if="userMsg.accountTypeDto.type == $dictionaries.userType.project"
                v-text="project.name"
              ></span>
              <span class="text" style="fontWeight:800;color:#333" v-else v-text="project.name"></span>
            </div>
            <div class="msgItem dfsb">
              <van-image :src="require('@/assets/image/index_icon4.png')" height="18" width="14" />
              <p class="textFlowP">
                <span class="text textFlow" v-text="project.address"></span>
              </p>
            </div>
            <div @click="goSkip('company-dustNoise')" style="display:flex;width:100%;marginTop:20px;align-items:flex-end" v-if="weather.wea_img">
              <van-image :src="require(`@/assets/image/${weather.wea_img}.png`)" height="40" width="40" />
              <p style="color:#4285F4;text-align:left;margin-left:5px">
                <span v-text="weather.wea"></span>
                <br />
                <span>{{ weather.tem2 }}°/{{ weather.tem1 }}°</span>
              </p>
              <van-tag :color="getWeatherColor(weather.air_level)" style="margin:0 6px;padding:2px 4px;font-size:16px"
                >{{ weather.air_pm25 }}{{ weather.air_level }}</van-tag
              >
              <span style="color:#666;margin-right:6px">风力{{ weather.win_speed }}</span>
              <span style="color:#666">湿度{{ weather.humidity }}</span>
            </div>
            <div style="height:62px" v-else></div>
            <!--<div style="display:flex;width:100%;marginTop:30px">
              <div @click="goSkip('company-dustNoise')" class="chartItems" style="marginRight:10px">
                <span style="color:#fc7403">pm25:{{ polluteData.pm25 }}</span>
              </div>
              <div @click="goSkip('company-dustNoise')" class="chartItems" style="marginLeft:10px">
                <span style="color:#f42037">PM10:{{ polluteData.pm10 }}μg/m3</span>
              </div>
            </div>-->
          </div>
        </div>
        <div style="height:70px"></div>
        <van-notice-bar :text="noticeText" color="#538dc3" speed="50">
          <template #right-icon>
            <div @click="goSkip('company-exposure')" class="exposureIcon">
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
          <span class="title2">今日待办</span>
          <van-divider></van-divider>
        </div>
        <div class="allIconBox">
          <div @click="goSkip('company-todayWarn', { active: 'dust' })" class="tac">
            <div class="iconBox" style="color:#ee4634" v-text="dustWarnNum"></div>
            <span class="text">告警记录</span>
          </div>
          <div @click="goSkip('company-todayCheck')" class="tac">
            <div class="iconBox" style="color:#333" v-text="todayWait.todayCheckNumber"></div>
            <span class="text">每日巡检</span>
          </div>
          <div @click="goSkip('company-appointCheck')" class="tac">
            <div class="iconBox" v-text="todayWait.assignCheckNumber"></div>
            <span class="text">指派点检</span>
          </div>
          <div @click="goSkip('company-problemReport')" class="tac">
            <div class="iconBox" v-text="todayWait.questionReportNumber"></div>
            <span class="text">问题上报</span>
          </div>
          <div @click="goSkip('company-dispatch')" class="tac">
            <div class="iconBox" v-text="todayWait.taskNumber"></div>
            <span class="text">督办派单</span>
          </div>
          <div @click="handelVideo" class="tac" v-if="!isGarbage">
            <div class="iconBox" v-text="todayWait.videoNum"></div>
            <span class="text">音视频巡检</span>
          </div>
          <div class="tac"></div>
        </div>
      </div>
      <div class="box" style="paddingTop:0">
        <van-cell is-link style="textAlign:left" to="/work/company/carIdentify" value="更多">
          <template #title>
            <span class="title2">车辆识别</span>
          </template>
        </van-cell>
        <van-divider></van-divider>
        <div class="activeBtn">
          <span :class="activeBtn === 3 ? 'active' : ''" @click="handelActive(3)">全部</span>
          <span :class="activeBtn === 1 ? 'active' : ''" @click="handelActive(1)">已占用</span>
          <span :class="activeBtn === 2 ? 'active' : ''" @click="handelActive(2)">未占用</span>
        </div>
      </div>
      <div class="box lincenseBox">
        <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
          <van-row :key="index" class="item" v-for="(item, index) in list">
            <van-col span="6" style="height:85px;position:relative">
              <div class="jin" v-if="item.direction == $dictionaries.direction.jin">进</div>
              <div class="chu" v-if="item.direction == $dictionaries.direction.chu">出</div>
              <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item.carPhoto" :isPreviewShow="true" height="100%" style="width:100%;height:100%" width="100%" />
            </van-col>
            <van-col span="1"></van-col>
            <van-col span="17">
              <div class="top">
                <p>
                  <span class="textFlow plateNumber" style="width:80px" v-text="item.license"></span>
                  <span class="carTag0" v-if="item.carState">名录车</span>
                  <span class="carTag1" v-if="!item.carState">非名录车</span>
                </p>
                <p class="carCreat">
                  <span @click="handelCreate(item)" class="carCreat0" v-if="!item.occupancy && item.direction == $dictionaries.direction.chu && !isGarbage">
                    <!--eslint-->
                    新建
                  </span>
                  <span class="carCreat1" v-if="item.occupancy && item.direction == $dictionaries.direction.chu">已建</span>
                </p>
              </div>
              <div class="bottom">
                <p>运输企业:{{ item.transportCompanyName }}</p>
                <p>排放企业:{{ item.projectCompanyName }}</p>
                <p>创建时间:{{ item.createDate }}</p>
              </div>
            </van-col>
          </van-row>
        </van-list>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import HomeTitle from '@/components/HomeTitle.vue'
import GoTop from '@/components/GoTop.vue'
import { Bus } from '@/bus'
export default {
  data() {
    return {
      refreshloading: false,
      weather: {},
      exposureList: [], //曝光台列表
      exposureIndex: 0, //曝光台下标
      noticeText: '', //当前曝光台文字
      project: {
        //项目详细
        name: '',
        address: ''
      },
      isGarbage: false, //是否是消纳员账号
      userMsg: {
        //用户信息
        accountTypeDto: {}
      },
      dustWarnNum: 0, //扬尘告警数量
      todayWait: {
        //今日待办
        carNumber: 0,
        todayCheckNumber: 0,
        questionReportNumber: 0,
        assignCheckNumber: 0,
        taskNumber: 0,
        videoNum: 0
      },
      activeBtn: 3, //车辆识别当前tab
      list: [], //车辆识别列表
      loading: false, //加载
      finished: false, //完成
      searchData: {
        //车辆识别查询条件
        license: '',
        limit: 10,
        page: 1,
        workplaceId: '',
        workplaceType: this.$dictionaries.machineType.company,
        occupancy: ''
      },
      polluteData: {
        AQI: 0,
        pm10: 0,
        pm25: 0
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
    handelVideo() {
      if (window.jsCall) {
        window.jsCall.videoInspectionList()
      } else {
        this.$router.push({
          name: 'work-videoCheck'
        })
      }
    },
    //程序入口
    appMain() {
      this.userMsg = this.$store.state.user.user
      this.searchData.workplaceId = this.$store.state.user.project.id
      if (this.userMsg.accountTypeDto.type == this.$dictionaries.userType.garbage) {
        this.searchData.workplaceType = this.$dictionaries.machineType.garbage
        this.isGarbage = true
      } else {
        this.isGarbage = false
      }
      this.getProject()
      this.getExposure()
      this.getTodayWait()
      //this.getDustNum()//获取扬尘告警数量
      this.getWeather()
      this.refreshloading = false
      Bus.$on('searchValue', value => {
        this.searchData.license = value
        this.list = []
        this.searchData.page = 1
        this.select()
      })
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
    async getPollute(longitude, latitude) {
      return
      let resp = await this.$http.get(`/carp/device/a/q/dust/info/recent/monitor/data?longitude=${longitude}&latitude=${latitude}`)
      if (resp.code == 0) {
        if (resp.data) this.polluteData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取pm25/PM10失败:' + resp.message,
          confirmButtonColor: 'red'
        })
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
      fd.append('projectIdList', [this.searchData.workplaceId])
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
      let departmentState = this.$dictionaries.machineType.company
      if (this.$store.state.user.user.accountTypeDto.type == this.$dictionaries.userType.garbage) {
        departmentState = this.$dictionaries.machineType.garbage
      }
      let resp = await this.$http.get(`/carp/business/a/q/data/num/statistics`, {
        params: {
          projectId: this.searchData.workplaceId, //项目id
          receiverId: this.userMsg.id, //收单人id
          initiatorPeopleId: this.userMsg.id, //收单人id
          warningCode: this.$dictionaries.warnType.car,
          departmentState,
          carState: this.$dictionaries.carWarn.waitCheck, //非名录车状态
          todayState: this.$dictionaries.todayCheck.update, //今日巡检状态
          questionState: this.$dictionaries.problem.report, //问题上报状态
          assignState: this.$dictionaries.appointCheck.update, //指派点检状态
          taskState: this.$dictionaries.dispatch.wait //督办派单状态
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
    //跳转联单点检界面
    handelCreate(item) {
      this.$router.push({
        name: 'formDetail',
        params: {
          createDate: item.createDate,
          id: item.id,
          projectId: this.searchData.workplaceId
        }
      })
    },
    //查询数据
    async select() {
      let resp = await this.$http.get('/carp/business/a/q/license/record/current/page', {
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
          message: '获取车辆识别失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //点击按钮
    handelActive(val) {
      if (this.activeBtn !== val) {
        this.activeBtn = val
        if (this.activeBtn == 3) {
          this.searchData.occupancy = ''
        }
        if (this.activeBtn == 1) {
          this.searchData.occupancy = 1
        }
        if (this.activeBtn == 2) {
          this.searchData.occupancy = 0
        }
        this.searchData.page = 1
        this.select()
      }
    },
    //得到项目详情
    getProject() {
      if (this.userMsg.accountTypeDto.type == this.$dictionaries.userType.project) {
        this.$http.get('/carp/business/k/s/project/' + this.searchData.workplaceId).then(resp => {
          if (resp.code == 0) {
            this.project = resp.data
            this.getPollute(parseFloat(resp.data.longitude), parseFloat(resp.data.latitude))
          } else {
            this.$dialog.alert({
              message: '获取项目信息失败:' + resp.message,
              confirmButtonColor: 'red'
            })
          }
        })
      }
      if (this.userMsg.accountTypeDto.type == this.$dictionaries.userType.garbage) {
        this.$http.get('/carp/business/a/q/garbage/station/' + this.searchData.workplaceId).then(resp => {
          if (resp.code == 0) {
            this.project = resp.data
            this.getPollute(parseFloat(resp.data.longitude), parseFloat(resp.data.latitude))
          } else {
            this.$dialog.alert({
              message: '获取消纳站信息:' + resp.message,
              confirmButtonColor: 'red'
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.company-home {
  padding-bottom: 50px;
  background-color: #f9f9f9;
  min-height: 100%;
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
    font-size: 18px;
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
        font-size: 16px;
        color: #656565;
        display: flex;
        margin-top: 16px;
        align-items: center;
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
      padding: 10px;
      text-align: left;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .carTag0 {
          border-radius: 4px;
          line-height: 24px;
          padding: 0 4px;
          border: 1px solid #00ce5e;
          color: #00ce5e;
          margin-left: 5px;
        }
        .carTag1 {
          border-radius: 4px;
          line-height: 24px;
          padding: 0 4px;
          margin-left: 5px;
          border: 1px solid #ff2c37;
          color: #ff2c37;
        }
        .carCreat {
          span {
            padding: 0 10px;
            border-radius: 14px;
            color: #fff;
            line-height: 28px;
            text-align: center;
          }
          .carCreat0 {
            background-color: #4186f4;
          }
          .carCreat1 {
            background-color: #ccc;
          }
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
