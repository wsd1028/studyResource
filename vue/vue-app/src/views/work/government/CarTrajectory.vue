<template>
  <div class="workGov-carTrajectory">
    <div class="flotDiv">
      <div class="showBox" ref="showBox">
        <div class="showDiv" ref="showDiv">
          <footer>
            <div>
              <el-date-picker
                :clearable="false"
                :editable="false"
                @change="getHistoryCar"
                placeholder="选择日期"
                size="mini"
                style="width:110px;margin-right:5px"
                type="date"
                v-model="date"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
              <el-select placeholder="请选择" size="mini" style="width:60px" v-model="player.speed">
                <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in playSpeedList"></el-option>
              </el-select>
            </div>
            <div class="carMsg">
              <div @click="playCar" class="iconDiv">
                <van-icon :name="carHistory.list.length > 0 ? (player.isPlay ? 'pause' : 'play') : 'play'" color="#fff" size="25" style="line-height:40px" />
              </div>
              <div class="df">
                <van-image :src="require('@/assets/image/index_icon7.png')" height="12" width="20" />
                <span class="plateNumber" style="margin-left:5px" v-text="paramsData.plateNumber"></span>
                <span class="carTag1" v-if="paramsData.tabActive == 1">非名录车</span>
                <span class="carTag0" v-else>名录车</span>
              </div>
              <div v-if="paramsData.tabActive == 0">
                <p>
                  <span class="label">企业名称:</span>
                  <span class="value">{{ paramsData.companyName }}</span>
                </p>
                <p>
                  <span class="label">企业电话:</span>
                  <span class="value">{{ paramsData.companyPhone }}</span>
                </p>
                <div class="dfsb">
                  <p>
                    <span class="label">登记区县:</span>
                    <span class="value">{{ paramsData.areaName }}</span>
                  </p>
                  <p>
                    <span class="label">登记时间:</span>
                    <span class="value">{{ paramsData.createDate }}</span>
                  </p>
                </div>
              </div>
              <div v-else>
                <p>
                  <span class="label">告警时间:</span>
                  <span class="value">{{ paramsData.violationDate }}</span>
                </p>
              </div>
            </div>
            <div class="porjectList">
              <div class="df" style="margin-bottom:5px">
                <van-image :src="require('@/assets/image/index_icon3.png')" height="14" width="14" />
                <span class="plateNumber" style="margin-left:5px">工地统计</span>
              </div>
              <div :key="index" class="item" v-for="(item, index) in projectList">
                <p class="value">{{ index + 1 }}. {{ item.workplaceName }}</p>
                <div class="df" style="margin-top:5px">
                  <div class="dotBox" style="margin-right:50px">
                    <span class="green dot"></span>
                    <span class="label">进:</span>
                    <span class="plateNumber">{{ item.jin }}</span>
                  </div>
                  <div class="dotBox">
                    <span class="red dot"></span>
                    <span class="label">出:</span>
                    <span class="plateNumber">{{ item.chu }}</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
    <div class="backContent mainBox">
      <myTitle class="mainTop" style="z-index:2" titleName="车辆轨迹"></myTitle>
      <section class="mainBottom">
        <div class="colorDiv">
          <div class="colorText">
            <p></p>
            <p class="item">30</p>
            <p class="item">60</p>
            <p class="item">100</p>
            <p class="item">120</p>
            <p></p>
          </div>
          <div class="colorBox"></div>
        </div>
        <baidu-map :center="mapConfig.center" :dragging="mapConfig.dragging" :scroll-wheel-zoom="true" :zoom="mapConfig.zoom" @ready="ready" class="bm-view">
          <div v-if="startCarData.longitudeBD09">
            <!--车辆起始点-->
            <bm-marker
              :icon="{
                url: require('@/assets/svg/start.svg'),
                size: { width: 40, height: 80 }
              }"
              :position="{ lng: startCarData.longitudeBD09, lat: startCarData.latitudeBD09 }"
              :zIndex="100"
            ></bm-marker>
          </div>
          <div v-if="endCarData.longitudeBD09">
            <!--车辆终点-->
            <bm-marker
              :icon="{
                url: require('@/assets/svg/end.svg'),
                size: { width: 40, height: 80 }
              }"
              :position="{ lng: endCarData.longitudeBD09, lat: endCarData.latitudeBD09 }"
              :zIndex="100"
            ></bm-marker>
          </div>
          <div v-if="garbageData.longitude">
            <!--消纳站-->
            <bm-marker
              :icon="{
                url: require('@/assets/svg/carGarbage.svg'),
                size: { width: 40, height: 80 }
              }"
              :position="{ lng: endCarData.longitude, lat: endCarData.latitude }"
              :zIndex="100"
            ></bm-marker>
          </div>
          <div v-if="nowCarData.longitudeBD09">
            <bm-marker
              :icon="{
                url: require('@/assets/svg/whiteCar.svg'),
                size: { width: 35, height: 40 }
              }"
              :position="{ lng: nowCarData.longitudeBD09, lat: nowCarData.latitudeBD09 }"
              :rotation="parseFloat(nowCarData.direction)"
              :zIndex="100"
            ></bm-marker>
          </div>
        </baidu-map>
      </section>
    </div>
  </div>
</template>

<script>
import Linq from 'linq'

export default {
  data() {
    return {
      //body高度
      bodyHeight: 0,
      //第一次看到showBox的高度
      firstShow: 200,
      paramsData: {},
      //工地统计列表
      projectList: [],
      date: '',
      playSpeedList: [
        {
          value: 1,
          label: '1.0x'
        },
        {
          value: 2,
          label: '2.0x'
        },
        {
          value: 4,
          label: '4.0x'
        },
        {
          value: 8,
          label: '8.0x'
        },
        {
          value: 16,
          label: '16.0x'
        },
        {
          value: 32,
          label: '32.0x'
        }
      ],
      //地图配置
      mapConfig: {
        map: null,
        zoom: 13,
        dragging: true,
        center: { lat: 28.756994, lng: 104.641929 } //地图中心
      },
      startCarData: {}, //车辆开始位置信息
      endCarData: {}, //车辆结束位置信息
      nowCarData: {}, //当前车辆
      garbageData: {}, //消纳站
      //播放器
      player: {
        isPlay: false,
        speed: 1, //播放速度
        count: 0, //车辆位置下标
        timer: null //计时器
      },
      //mapv对象
      mapv: {},
      //车辆历史轨迹
      carHistory: {
        list: [],
        dataSet: null,
        mapvLayer: null
      }
    }
  },
  async mounted() {
    this.date = this.$moment().format('YYYY-MM-DD')
    this.paramsData = this.$store.state.user.paramsData
    //计算showBox高度,实现滚动
    this.bodyHeight = document.documentElement.clientHeight
    let showDivHeight = parseInt(window.getComputedStyle(this.$refs.showDiv).height)
    if (this.firstShow < showDivHeight) {
      this.$refs.showBox.style.height = parseInt(this.bodyHeight) + showDivHeight - this.firstShow + 'px'
    }
    this.getProjectList()
    if (this.paramsData.tabActive == 0) this.getGarbage()
  },
  methods: {
    //清空计时器
    clearTimer() {
      if (this.player.timer) {
        this.player.count = 0
        clearInterval(this.player.timer)
        this.player.isPlay = false //车辆轨迹播放结束
        this.player.timer = null
      }
    },
    playCar() {
      if (this.carHistory.list.length == 0) return
      this.player.isPlay = !this.player.isPlay
      if (this.player.isPlay && !this.myTime) {
        this.player.timer = setInterval(() => {
          this.nowCarData = this.carHistory.list[this.player.count]
          this.player.count += this.player.speed
          if (this.player.count > this.carHistory.list.length - this.player.speed) {
            if (this.player.count != this.carHistory.list.length - 1) this.nowCarData = this.carHistory.list[this.carHistory.list.length - 1]
            this.clearTimer()
          }
        }, 1000)
      }
      if (!this.player.isPlay && this.player.timer) {
        this.clearTimer()
      }
    },
    //得到车辆去往的消纳站信息
    async getGarbage() {
      let resp = await this.$http.get('/carp/business/a/q/car/garbage/plate', {
        params: {
          plateNumber: this.paramsData.plateNumber,
          projectId: this.paramsData.projectId
        }
      })
      if (resp.code == 0) {
        this.garbageData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取消纳站失败',
          confirmButtonColor: 'red'
        })
      }
    },
    //地图初始化时,定位当前位置
    ready(e) {
      const that = this
      this.mapConfig.map = e.map
      if (e.BMap) {
        // 引入mapv
        const { DataSet, baiduMapLayer, utilCityCenter } = require('mapv')
        this.mapv = {
          DataSet,
          baiduMapLayer,
          utilCityCenter
        }
        this.getHistoryCar()
      }
    },
    //得到历史轨迹数据
    async getHistoryCar() {
      let resp = await this.$http.get('/carp/business/a/q/hbase/util/gps/history/page', {
        params: {
          licensePlate: this.paramsData.plateNumber,
          startTime: this.date + ' 00:00:00',
          endTime: this.date + ' 23:59:59'
        }
      })
      if (resp.code == 0) {
        if (resp.data.length == 0) return
        this.carHistory.list = resp.data
        this.startCarData = resp.data[0]
        this.endCarData = resp.data[resp.data.length - 1]
        this.mapConfig.center = {
          lng: this.startCarData.longitudeBD09,
          lat: this.startCarData.latitudeBD09
        }
        if (this.carHistory.mapvLayer) {
          this.carHistory.dataSet.set(this.fixHistoryData(this.carHistory.list))
        } else {
          this.drawHistoryCar()
        }
      } else {
        this.$dialog.alert({
          message: '获取车辆轨迹失败',
          confirmButtonColor: 'red'
        })
      }
    },
    //组装历史轨迹数据
    fixHistoryData(list) {
      let data = []
      for (let i = 0; i < list.length - 1; i++) {
        data.push({
          geometry: {
            type: 'LineString',
            coordinates: [
              [list[i].longitudeBD09, list[i].latitudeBD09],
              [list[i + 1].longitudeBD09, list[i + 1].latitudeBD09]
            ]
          },
          count: parseFloat(list[i].speed)
        })
      }
      return data
    },
    //绘制历史轨迹
    drawHistoryCar() {
      this.carHistory.dataSet = new this.mapv.DataSet(this.fixHistoryData(this.carHistory.list))
      let gradient = {}
      let count = 1 / 150
      for (let i = 0; i < 149; i++) {
        gradient[(i * count).toFixed(2)] = this.$until.colorExcessive(i)
      }
      gradient[1] = this.$until.colorExcessive(150)
      var options = {
        gradient,
        lineWidth: 4,
        max: 150,
        draw: 'intensity'
      }
      this.carHistory.mapvLayer = new this.mapv.baiduMapLayer(this.mapConfig.map, this.carHistory.dataSet, options)
    },
    //得到工地统计
    async getProjectList() {
      let resp = await this.$http.get('/carp/business/a/q/license/record/trajectory', {
        params: {
          license: this.paramsData.plateNumber,
          startTime: this.date + ' 00:00:00',
          endTime: this.date + ' 23:59:59'
        }
      })
      if (resp.code == 0) {
        let projectList = []
        let singArr = Linq.from(resp.data)
          .distinct('x=>x.workplaceId')
          .toArray()
        for (let i = 0; i < singArr.length; i++) {
          let obj = singArr[i]
          for (let j = 0; j < resp.data.length; j++) {
            if (singArr[i].id == resp.data[j].id) {
              if (resp.data[j].direction == this.$dictionaries.direction.jin) {
                obj.jin = resp.data[j].count
              } else {
                obj.chu = resp.data[j].count
              }
            }
          }
          projectList.push(obj)
        }
        this.projectList = projectList
      } else {
        this.$dialog.alert({
          message: '获取工地失败',
          confirmButtonColor: 'red'
        })
      }
    }
  },
  beforeDestroy() {
    this.clearTimer()
  }
}
</script>

<style lang="less">
.workGov-carTrajectory {
  text-align: left;
  background-color: #f9f9f9;
  height: 100%;
  overflow: hidden;
  .df {
    display: flex;
    align-items: center;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 10px;
  }
  .el-input__suffix {
    display: none;
  }
  .el-select .el-input.is-focus .el-input__inner,
  .el-select .el-input__inner:focus {
    border-color: #dcdfe6;
  }
  .carTag0 {
    border-radius: 4px;
    line-height: 24px;
    padding: 0 10px;
    font-size: 12px;
    border: 1px solid #00ce5e;
    color: #00ce5e;
    margin-left: 10px !important;
  }
  .carTag1 {
    font-size: 12px;
    border-radius: 4px;
    line-height: 24px;
    padding: 0 10px;
    margin-left: 10px !important;
    border: 1px solid #ff2c37;
    color: #ff2c37;
  }
  .dotBox {
    display: flex;
    align-items: center;
    .label {
      margin: 0 5px;
    }
    .plateNumber {
      font-size: 12px;
    }
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 100%;
  }
  .red {
    background-color: #ff2c37;
  }
  .green {
    background-color: #00ce5e;
  }
  .van-nav-bar__title {
    text-align: center;
  }
  .bm-view {
    width: 100%;
    height: 100%;
  }
  section {
    position: relative;
    .colorDiv {
      position: absolute;
      z-index: 1;
      top: 40px;
      right: 20px;
      width: 150px;
      .colorText {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .item {
          width: 25px;
          height: 25px;
          border-radius: 25px;
          line-height: 25px;
          text-align: center;
          background-color: #fff;
          color: #666;
          font-size: 12px;
        }
      }
      .colorBox {
        border-radius: 10px;
        height: 10px;
        background-image: linear-gradient(to right, rgb(68, 130, 229), rgb(33, 214, 156), rgb(244, 207, 54), rgb(236, 58, 58));
      }
    }
  }
  footer {
    z-index: 2;
    position: relative;
    bottom: 0px;
    padding: 10px;
    width: 100%;
    .plateNumber {
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 800;
      color: rgba(51, 51, 51, 1);
    }
    .label {
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #666;
      margin-right: 5px;
      margin-top: 5px;
    }
    .value {
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #333;
    }
    .carMsg {
      margin-top: 10px;
      background-color: #fff;
      padding: 10px;
      border-radius: 4px;
    }
    .porjectList {
      margin-top: 10px;
      background-color: #fff;
      padding: 10px;
      border-radius: 4px;
    }
    .iconDiv {
      position: absolute;
      right: 26px;
      top: 27px;
      width: 40px;
      height: 40px;
      border-radius: 100%;
      background-color: rgb(64, 158, 255);
      text-align: center;
    }
  }
}
.workGov-carTrajectory {
  .backContent {
    height: 100%;
  }
  .flotDiv {
    height: 100%;
    width: 100%;
    top: 0;
    position: absolute;
    overflow: auto;
    .showBox {
      height: 100%;
      display: flex;
      flex-direction: column-reverse;
    }
  }
}
</style>
