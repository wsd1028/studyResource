<template>
  <div class="container dataView" ref="container">
    <header>
      <p class="time">
        <span>{{ time }}</span>
      </p>
      <h2 class="title">宜宾市建筑工地扬尘治理中心</h2>
      <p class="weather">
        <span>{{ weather.wea }}</span>
        <span class="mr">{{ weather.tem2 }}°/{{ weather.tem1 }}°</span>
        <span class="mr">{{ weather.win }}</span>
        <el-tag class="mr" effect="dark" size="mini" type="warning">{{ weather.air_level }}</el-tag>
        <span class="mr">污染物PM2.5: {{ weather.air_pm25 }} ug/m³</span>
      </p>
    </header>
    <section>
      <div class="left-boxs">
        <div class="box fg2">
          <p class="title">区县排名</p>
          <div class="box-item" id="areaRankingChart"></div>
        </div>
        <div class="box fg3">
          <p class="title">移动源统计</p>
          <div class="box-item" id="mobileSourceChart"></div>
        </div>
        <div class="box fg2">
          <p class="title">大数据资源统计</p>
          <div class="box-item" id="bigDataChart"></div>
        </div>
      </div>
      <div class="middle-boxs">
        <div class="box fg6">
          <div class="mapTop">
            <p class="title" style="margin-right:20px">电子地图</p>
            <el-select @change="changeArea" placeholder="请选择" size="mini" v-model="mapConfig.areaCode">
              <el-option :key="item.code" :label="item.name" :value="item.code" v-for="item in areaList"></el-option>
            </el-select>
          </div>
          <div class="box-item mapDiv">
            <div class="funcionCard">
              <div class="funcItem">
                <span class="text">在线</span>
                <el-checkbox v-model="functionBtn.online"></el-checkbox>
              </div>
              <div class="funcItem">
                <span class="text" style="color:#A6A5A5">离线</span>
                <el-checkbox v-model="functionBtn.outline"></el-checkbox>
              </div>
              <div style="width:100%;border: 0.5px solid #fff;margin-top:10px"></div>
              <!--<div class="funcItem">
                <span class="text">
                  <i class="icon iconfont iconfont-cheliangziliao" style="color:#fff;font-size:10px"></i>
                  运输车辆
                </span>
                <el-switch :width="30" active-color="#1C7AFE" inactive-color="#E4E4E4" v-model="functionBtn.car"></el-switch>
              </div>-->
              <div class="funcItem">
                <span class="text">
                  <i class="icon iconfont iconfont-lajitong" style="color:#fff;font-size:20px"></i>
                  消纳场
                </span>
                <el-switch :width="30" active-color="#1C7AFE" inactive-color="#E4E4E4" v-model="functionBtn.garbage"></el-switch>
              </div>
              <div class="funcItem">
                <span class="text">
                  <i class="icon iconfont iconfont-dizhi" style="color:#fff;font-size:15px"></i>
                  扬尘监测点
                  <!--AQI-->
                </span>
                <el-switch :width="30" active-color="#1C7AFE" inactive-color="#E4E4E4" v-model="functionBtn.AQI"></el-switch>
              </div>
              <div class="funcItem">
                <span class="text">
                  <i class="icon iconfont iconfont-yuan" style="color:#fff;font-size:15px"></i>
                  固定源(设备)
                </span>
                <el-switch :width="30" @change="changeDeviceState" active-color="#1C7AFE" inactive-color="#E4E4E4" v-model="functionBtn.device"></el-switch>
              </div>
              <!--<div class="funcItem">
                <span class="text">
                  <i class="icon iconfont iconfont-ziyuan" style="color:#fff;font-size:9px"></i>
                  固定源(无设备)
                </span>
                <el-switch :width="30" active-color="#1C7AFE" inactive-color="#E4E4E4" v-model="functionBtn.noDevice"></el-switch>
              </div>-->
            </div>
            <baidu-map
              :center="mapConfig.position"
              :dragging="mapConfig.dragging"
              :map-click="false"
              :scroll-wheel-zoom="true"
              :zoom="mapConfig.zoom"
              @ready="onBaiduMapReady"
              class="bm-view"
            >
              <div v-if="functionBtn.car">
                <bm-marker
                  :icon="{
                    url: require('@/assets/images/svg/car.svg'),
                    size: { width: 40, height: 40 }
                  }"
                  :key="index"
                  :position="item.location"
                  :zIndex="10"
                  v-for="(item, index) in carList"
                ></bm-marker>
              </div>
              <div v-if="functionBtn.garbage">
                <bm-marker
                  :icon="{
                    url: require('@/assets/images/svg/garbage.svg'),
                    size: { width: 40, height: 40 }
                  }"
                  :key="index"
                  :position="item.location"
                  :title="item.name"
                  :zIndex="10"
                  @click="garbageOpen($event, item)"
                  v-for="(item, index) in garbageList"
                ></bm-marker>
                <bm-info-window :position="garbageDetail.location" :show="garbageDetail.show" @close="garbageClose" @open="garbageOpen" title>
                  <!--设备详细信息窗体-->
                  <p>消纳站名称：{{ garbageDetail.name }}</p>
                  <p>消纳站地址：{{ garbageDetail.address }}</p>
                </bm-info-window>
              </div>
              <div v-if="functionBtn.noDevice">
                <bm-marker
                  :icon="{
                    url: require('@/assets/images/svg/noDevice.svg'),
                    size: { width: 40, height: 40 }
                  }"
                  :key="index"
                  :position="item.location"
                  :zIndex="10"
                  v-for="(item, index) in noDeviceList"
                ></bm-marker>
              </div>
              <div v-if="functionBtn.AQI">
                <bm-marker
                  :icon="{
                    url: require('@/assets/images/svg/AQI.svg'),
                    size: { width: 40, height: 40 }
                  }"
                  :key="index"
                  :position="item.location"
                  :zIndex="10"
                  v-for="(item, index) in AQIList"
                ></bm-marker>
              </div>
              <bm-info-window :closeOnClick="true" :position="deviceDetail.position" :show="deviceShow" @close="infoWindowClose" @open="infoWindowOpen" title>
                <!--设备详细信息窗体-->
                <p>项目名称：{{ deviceDetail.projectName }}</p>
                <p>项目地址：{{ deviceDetail.projectAddress }}</p>
                <p>设备号：{{ deviceDetail.sn }}</p>
                <p>设备厂商：{{ deviceDetail.manufacturerName }}</p>
                <p>PM2.5/国控:{{ deviceDetail.pm25 }}/{{ deviceDetail.dustMonitorDataEntity.pm25 }} ug/m³</p>
                <p>PM10/国控:{{ deviceDetail.pm10 }}/{{ deviceDetail.dustMonitorDataEntity.pm10 }} ug/m³</p>
                <p>温度:{{ deviceDetail.temperature }} ℃</p>
                <p>湿度:{{ deviceDetail.humidity }}%RH</p>
              </bm-info-window>
            </baidu-map>
            <!-- <iframe allowfullscreen border="0" src="http://yb.hgyun.net/DustNoise/ybMapGis/" style="width:100%;height:100%;border:none"></iframe> -->
            <div class="exposure">
              <span class="exposureText">曝光台</span>
              <p class="exposureTitle" v-text="exposureList[exposureActive].title"></p>
              <span class="date" v-text="exposureList[exposureActive].createDate"></span>
            </div>
          </div>
        </div>
        <div class="box fg3">
          <p class="title">PM10</p>
          <div class="box-item" id="PM10Chart"></div>
        </div>
      </div>
      <div class="right-boxs">
        <div class="box fg2">
          <p class="title">目标任务</p>
          <div class="box-item">
            <div id="targetTaskChart1" style="width:33%;height:100%"></div>
            <div id="targetTaskChart2" style="width:33%;height:100%"></div>
            <div id="targetTaskChart3" style="width:33%;height:100%"></div>
          </div>
        </div>
        <div class="box fg3">
          <p class="title">热点追踪</p>
          <div class="box-item">
            <div class="hotspots">
              <div :key="index" class="hotspot" v-for="(item, index) in hotspots">
                <div class="left">
                  <el-image :src="require('@/assets/images/dataView/dataView' + item.iconIndex + '.png')" fit="fill" style="width:54px; height:54px"></el-image>
                  <div style="margin-left:10px">
                    <p style="font-weight:800">
                      {{ item.name }}
                      <span :class="'color' + item.iconIndex" style="font-size:16px">{{ item.totalCount }}</span>
                    </p>
                    <p>
                      已完成:
                      <span>{{ item.hasFinishCount }}</span>
                      未完成:
                      <span>{{ item.notFinishCount }}</span>
                    </p>
                  </div>
                </div>
                <div class="right">
                  <span style="margin-right:10px;font-size:14px">完成率</span>
                  <el-progress :color="colorList[index]" :percentage="item.finishRate" :width="50" type="circle"></el-progress>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box fg2">
          <p class="title">自动巡检</p>
          <div class="box-item" id="automaticCheckChart"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import echarts from 'echarts'
import { styleJson } from '@/libs/mapStyle.js'
export default {
  name: 'dataView',
  data() {
    return {
      //天气信息
      weather: {},
      areaList: [],
      //mapv数据集
      DataSet: null,
      //mapv图层
      baiduMapLayer: null,
      mapConfig: {
        areaCode: '',
        zoom: 13,
        dragging: true,
        center: {}, //地图中心
        position: {}, //定位
        showMark: false
      },
      time: '',
      //电子地图功能按钮
      functionBtn: {
        online: true, //在线
        outline: true, //离线
        car: false, //运输车辆
        noDevice: false, //固定源(无设备)
        garbage: true, //消纳场
        AQI: true,
        device: true //固定源(设备)
      },
      //地图运输车辆信息列表
      carList: [],
      noDeviceList: [
        {
          location: {
            lat: 28.74161,
            lng: 104.648103
          }
        }
      ],
      //地图消纳场信息列表
      garbageList: [],
      //消纳站信息窗体
      garbageDetail: {},
      //地图AQI信息列表
      AQIList: [
        {
          location: {
            lat: 28.72361,
            lng: 104.638103
          }
        }
      ],
      //地图设备信息列表
      deviceList: [],
      //地图设备详细列表
      deviceDetail: {
        dustMonitorDataEntity: {}
      },
      deviceShow: false,
      //车辆图标对象
      deviceDateSet: null,
      //车辆图标覆盖物
      deviceMapLayer: null,
      exposureTimer: null,
      exposureList: [
        {
          title: '',
          createDate: ''
        }
      ],
      exposureActive: 0,
      colorList: ['#57fff9', '#c657ff', ' #f6f855', '#ff8d57'],
      hotspots: [], //热点追踪
      areaRankingChart: null, //区县排名
      mobileSourceChart: null, //移动源
      bigDataChart: null, //大数据统计
      PM10Chart: null, //PM10统计
      targetTaskChart1: null, //目标任务1
      targetTaskChart2: null, //目标任务2
      targetTaskChart3: null, //目标任务3
      automaticCheckChart: null //自动巡检
    }
  },
  async mounted() {
    this.deviceImg = await this.getImg('project2')
    this.mapConfig.areaCode = this.$store.state.user.userInfo.accountTypeDto.code
    this.getArea()
    this.getExposure()
    this.$moment.locale('zh-cn')
    this.time = this.$moment().format('YYYY 年 MM 月 DD  dddd  HH:mm:ss')
    this.DateInter = setInterval(() => {
      this.time = this.$moment().format('YYYY 年 MM 月 DD  dddd  HH:mm:ss')
    }, 1000)
    this.allDraw()
    this.getWeather()
    window.addEventListener('resize', () => {
      if (this.areaRankingChart) this.areaRankingChart.resize()
      if (this.mobileSourceChart) this.mobileSourceChart.resize()
      if (this.bigDataChart) this.bigDataChart.resize()
      if (this.PM10Chart) this.PM10Chart.resize()
      if (this.targetTaskChart1) this.targetTaskChart1.resize()
      if (this.targetTaskChart2) this.targetTaskChart2.resize()
      if (this.targetTaskChart3) this.targetTaskChart3.resize()
      if (this.automaticCheckChart) this.automaticCheckChart.resize()
    })
  },
  methods: {
    //绘制所有chart
    async allDraw() {
      this.drawAreaRanking({ id: 'areaRankingChart' })
      this.drawMobileSource({ id: 'mobileSourceChart' })
      this.getHotspots() //热点追踪
      this.getBigData() //大数据统计
      this.drawPM({ id: 'PM10Chart' })
      this.drawTargetTask({ id: 'targetTaskChart1', color: '#1EC641', title: '优良天数' })
      this.drawTargetTask({ id: 'targetTaskChart2', color: '#F6B041', title: 'PM2.5' })
      this.drawTargetTask({ id: 'targetTaskChart3', color: '#F47D2C', title: 'PM10' })
      this.getAutomaticCheckData() //自动巡检
      this.getMapData() //得到地图数据
    },
    //得到天气
    async getWeather() {
      let resp = await this.$http.get('https://tianqiapi.com/api?version=v6&appid=66527314&appsecret=79zfaynW')
      this.weather = resp
    },
    //得到地图数据
    async getMapData() {
      this.getGarbage()
    },
    //关闭消纳站
    garbageClose() {
      this.garbageDetail.show = false
    },
    //打开消纳站
    garbageOpen(e, data) {
      this.garbageShow = true
      if (data) {
        this.garbageDetail = data.detail || {}
        this.garbageDetail.location = data.location
      }
      this.garbageDetail.show = true
    },
    //得到消纳站数据
    async getGarbage() {
      let resp = await this.$http.get(`/carp/business/a/q/garbage/station/page?areaCode=${this.mapConfig.areaCode}&limit=1000&page=1`)
      if (resp.code == 0) {
        let garbageList = []
        for (let i = 0; i < resp.data.records.length; i++) {
          garbageList.push({
            location: {
              lat: resp.data.records[i].latitude,
              lng: resp.data.records[i].longitude
            },
            id: resp.data.records[i].id,
            name: resp.data.records[i].name,
            detail: resp.data.records[i]
          })
        }
        this.garbageList = garbageList
      } else {
        this.$message.error('获取消纳站失败' + resp.message)
      }
    },
    async getImg(name) {
      let img = await new Promise((resolve, reject) => {
        var image = new Image()
        image.src = require('@/assets/images/svg/' + name + '.svg')
        if (image) {
          resolve(image)
        } else {
          reject(false)
        }
      })
      return img
    },
    //点击是否显示设备
    changeDeviceState() {
      if (this.functionBtn.device) {
        if (this.deviceDateSet) {
          this.deviceDateSet.set(this.fixDeviceData(this.deviceList))
        } else {
          this.drawDevice(this.deviceList)
        }
      } else {
        this.deviceShow = false
        if (this.deviceDateSet) this.deviceDateSet.set([])
      }
    },
    //得到固定源(设备)数据
    async getDevice() {
      let resp = await this.$http.get('/carp/device/a/q/dust/info/listByAreaCode?areaCode=' + this.mapConfig.areaCode)
      if (resp.code == 0) {
        this.deviceList = resp.data
        if (this.deviceDateSet) {
          this.deviceDateSet.set(this.fixDeviceData(this.deviceList))
        } else {
          this.drawDevice(this.deviceList)
        }
      } else {
        this.$message.error('获取设备数据失败' + resp.message)
      }
    },
    //组装设备数据
    fixDeviceData(deviceList) {
      let deviceData = []
      for (let i = 0; i < deviceList.length; i++) {
        deviceData.push({
          geometry: {
            type: 'Point',
            coordinates: [deviceList[i].lng, deviceList[i].lat]
          },
          icon: this.deviceImg,
          target: deviceList[i]
        })
      }
      return deviceData
    },
    infoWindowClose() {
      this.deviceShow = false
    },
    infoWindowOpen() {
      this.deviceShow = true
    },
    async drawDevice(deviceList) {
      this.deviceDateSet = new this.DataSet(this.fixDeviceData(deviceList))
      let deviceOptions = {
        draw: 'icon',
        methods: {
          // 一些事件回调函数
          click: async e => {
            // 点击事件，返回对应点击元素的对象值
            if (e) {
              this.deviceDetail = {}
              this.deviceShow = true
              let resp = await this.$http.get('/carp/device/a/q/dust/avg/real/time/' + e.target.sn)
              if (resp.code == 0) {
                this.deviceDetail = resp.data || {}
                this.deviceDetail.position = {
                  lng: e.target.lng,
                  lat: e.target.lat
                }
                this.$forceUpdate()
              } else {
                this.$dialog.alert({
                  message: '获取扬尘实时数据失败:' + resp.message,
                  confirmButtonColor: 'red'
                })
              }
            }
          }
        }
      }
      this.deviceMapLayer = new this.baiduMapLayer(this.map, this.deviceDateSet, deviceOptions)
    },
    //得到区域
    changeArea() {
      let areaLocation = [
        {
          name: '宜宾市',
          areaCode: 5115,
          areaId: 511500000000,
          location: { lat: 28.77, lng: 104.62 }
        },
        {
          name: '翠屏区',
          areaCode: 511502,
          areaId: 511502000000,
          location: { lat: 28.760179, lng: 104.630231 }
        },
        {
          name: '南溪区',
          areaCode: 511503,
          areaId: 511503000000,
          location: { lat: 28.839806, lng: 104.981133 }
        },
        {
          name: '叙州区',
          areaCode: 511504,
          areaId: 511504000000,
          location: { lat: 28.695678, lng: 104.541489 }
        },
        {
          name: '江安县',
          areaCode: 511523,
          areaId: 511523000000,
          location: { lat: 28.728102, lng: 105.068697 }
        },
        {
          name: '长宁县',
          areaCode: 511524,
          areaId: 511524000000,
          location: { lat: 28.577271, lng: 104.921116 }
        },
        {
          name: '高县',
          areaCode: 511525,
          areaId: 511525000000,
          location: { lat: 28.435676, lng: 104.519187 }
        },
        {
          name: '珙县',
          areaCode: 511526,
          areaId: 511526000000,
          location: { lat: 28.449041, lng: 104.712268 }
        },
        {
          name: '筠连县',
          areaCode: 511527,
          areaId: 511527000000,
          location: { lat: 28.162017, lng: 104.507848 }
        },
        {
          name: '兴文县',
          areaCode: 511528,
          areaId: 511528000000,
          location: { lat: 28.302988, lng: 105.236549 }
        },
        {
          name: '屏山县',
          areaCode: 511529,
          areaId: 511529000000,
          location: { lat: 28.64237, lng: 104.162617 }
        }
      ]
      for (let i = 0; i < areaLocation.length; i++) {
        if (areaLocation[i].areaId == this.mapConfig.areaId) {
          this.mapConfig.center = areaLocation[i].location
          this.mapConfig.position = areaLocation[i].location
        }
      }
      this.getDevice()
    },
    //得到地区列表
    async getArea() {
      let code = this.$store.state.user.userInfo.accountTypeDto.code
      let resp = await this.$http.get('/carp/business/a/q/area/leading/level/page/3?parentId=290871061266829312')
      if (resp.code == 0) {
        resp.data = resp.data.filter(item => {
          return item.code.includes(code)
        })
        let areaList = resp.data
        if (code == 5115) {
          areaList.unshift({
            id: '290871061266829312',
            code: '5115',
            name: '宜宾市'
          })
        }
        for (let i = 0; i < areaList.length; i++) {
          this.areaList.push({ name: areaList[i].name, code: areaList[i].code, id: areaList[i].id })
        }
      } else {
        this.$message.error('获取地区失败' + resp.message)
      }
    },
    //得到曝光台数据
    async getExposure() {
      let resp = await this.$http.get('/carp/business/a/q/manage/center/getExposure')
      if (resp.code == 0) {
        if (resp.data.length == 0) return
        for (let i = 0; i < resp.data.length; i++) {
          resp.data[i].createDate = this.$moment(resp.data[i].createDate).format('YYY-MM-DD')
        }
        this.exposureList = resp.data
        this.exposureTimer = setInterval(() => {
          this.exposureActive++
          if (this.exposureActive > this.exposureList.length - 1) {
            this.exposureActive = 0
          }
        }, 1000 * 5)
      }
    },
    //地图初始化时,定位当前位置
    onBaiduMapReady(e) {
      this.BMap = e.BMap
      this.map = e.map
      if (this.BMap) {
        const { DataSet, baiduMapLayer } = require('mapv')
        this.DataSet = DataSet
        this.baiduMapLayer = baiduMapLayer
        this.getDevice() //得到设备数据
        e.map.setMapStyle({ styleJson: styleJson })
        let geolocation = new this.BMap.LocalCity()
        geolocation.get(res => {
          this.mapConfig.center = res.center
          this.mapConfig.position = res.center
        })
      }
    },
    //得到热点追踪数据
    async getHotspots() {
      let resp = await this.$http.get('/carp/business/a/q/manage/center/hotspot')
      if (resp.code == 0) {
        let hotspots = []
        for (let i = 0; i < resp.data.length; i++) {
          resp.data[i].finishRate = parseInt(resp.data[i].finishRate)
          resp.data[i].iconIndex = (i % 4) + 1
          hotspots.push(resp.data[i])
        }
        this.hotspots = hotspots
      }
    },
    // 绘制区县排名
    drawAreaRanking(data) {
      let { id, xData } = data
      xData = ['翠屏', '南溪', '叙州', '江安', '长宁', '高县', '珙县', '筠连', '兴文', '屏山']
      this[id] = echarts.init(document.getElementById(id))
      let option = {
        grid: {
          top: 20,
          left: 0,
          right: 10,
          bottom: 10,
          containLabel: true
        },
        tooltip: {
          //提示框组件
          trigger: 'axis',
          formatter: '{b}<br />{a0}: {c0}%<br />{a1}: {c1}%<br />{a2}: {c2}%',
          axisPointer: {
            type: 'shadow',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          textStyle: {
            color: '#fff',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 12
          }
        },
        legend: {
          //图例组件，颜色和名字
          right: '0',
          top: '2%',
          itemGap: 16,
          itemWidth: 18,
          itemHeight: 6,
          data: [
            {
              name: 'PM10'
            },
            {
              name: 'GPS在线率'
            },
            {
              name: '履职率'
            }
          ],
          textStyle: {
            color: '#fff',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 12
          }
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              //		interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
              //	margin:15,
              textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 12
              }
            },
            axisTick: {
              //坐标轴刻度相关设置。
              show: false
            },
            axisLine: {
              //坐标轴轴线相关设置
              lineStyle: {
                color: '#fff',
                opacity: 0.2
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            min: 0,
            max: 100,
            type: 'value',
            splitNumber: 10,
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontFamily: 'Source Han Sans CN;',
                fontSize: 12
              },
              formatter: '{value}%'
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                opacity: 0.2
              }
            },
            axisTick: {
              lineStyle: {
                color: '#fff',
                opacity: 0.2
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: 'PM10',
            type: 'bar',
            data: [70, 85, 60, 45, 75, 60, 82, 40, 60, 82],
            barWidth: 6,
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#F97D2C'
                  }
                ]),
                barBorderRadius: 50,
                borderWidth: 0
              }
            }
          },
          {
            name: 'GPS在线率',
            type: 'bar',
            data: [28, 75, 45, 80, 65, 45, 72, 86, 95, 45],
            barWidth: 6,
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#21DF44'
                  }
                ]),
                barBorderRadius: 50,
                borderWidth: 0
              }
            }
          },
          {
            name: '履职率',
            type: 'bar',
            data: [60, 45, 39, 49, 73, 85, 62, 76, 85, 75],
            barWidth: 6,
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#28A2FE'
                  }
                ]),
                barBorderRadius: 50,
                borderWidth: 0
              }
            }
          }
        ]
      }
      this[id].setOption(option, true)
    },
    //绘制移动源统计
    drawMobileSource(data) {
      let { id, xData } = data
      xData = ['03-20', '03-21', '03-22', '03-23']
      this[id] = echarts.init(document.getElementById(id))
      let option = {
        legend: {
          icon: 'circle',
          top: '2%',
          right: '5%',
          itemWidth: 6,
          itemGap: 20,
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          top: 50,
          left: 10,
          right: 20,
          bottom: 10,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xData,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#fff'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.3)'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#fff'
              }
            }
          }
        ],
        series: [
          {
            name: '总车辆GPS数量',
            type: 'line',
            data: [10, 10, 20, 12],
            symbolSize: 1,
            symbol: 'circle',
            smooth: true,
            label: {
              show: true,
              position: 'top',
              distance: 4,
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: [1, 8],
              color: '#202B33',
              fontSize: 12
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(255,255,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(255,255,255,0)'
                    }
                  ],
                  false
                )
              }
            },
            itemStyle: {
              normal: {
                color: '#fff',
                borderColor: '#fff'
              }
            }
          },
          {
            name: '在线车辆GPS数量',
            type: 'line',
            data: [5, 12, 11, 14],
            symbolSize: 1,
            symbol: 'circle',
            smooth: true,
            label: {
              show: true,
              position: 'top',
              distance: 4,
              backgroundColor: 'rgba(39, 201, 198, 1)',
              borderRadius: 10,
              padding: [1, 8],
              color: '#fff',
              fontSize: 12
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(39, 201, 198, 1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(39, 201, 198, 0)'
                    }
                  ],
                  false
                )
              }
            },
            itemStyle: {
              normal: {
                color: '#27C9C6',
                borderColor: '#27C9C6'
              }
            }
          }
        ]
      }
      this[id].setOption(option, true)
    },
    //得到大数据统计数据
    async getBigData() {
      let resp = await this.$http.get('/carp/business/a/q/manage/center/bigDataResource')
      let yData = [],
        maxData = [],
        xData = []
      if (resp.code == 0) {
        for (const key in resp.data) {
          yData.push(key)
          xData.push(resp.data[key])
          let value = resp.data[key] + ''
          maxData.push(10 ** value.length)
        }
        let max = Math.max.apply(null, maxData)
        for (let i = 0; i < maxData.length; i++) {
          maxData[i] = max
        }
      }
      this.drawBigData({ id: 'bigDataChart', yData, maxData, xData })
    },
    //绘制大数据统计
    drawBigData(data) {
      let { id, yData, maxData, xData } = data
      this[id] = echarts.init(document.getElementById(id))
      let option = {
        grid: {
          left: '5%',
          right: '5%',
          bottom: 10,
          top: 5,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          },
          formatter: function(item) {
            return item[0].name + ':' + item[0].value
          }
        },
        xAxis: [
          {
            show: false,
            type: 'value'
          }
        ],
        yAxis: [
          {
            type: 'category',
            inverse: true,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            data: yData
          },
          {
            type: 'category',
            inverse: true,
            axisTick: 'none',
            axisLine: 'none',
            show: true,
            axisLabel: {
              textStyle: {
                color: '#ffffff',
                fontSize: '12'
              }
            },
            data: xData
          }
        ],
        series: [
          {
            name: '大数据',
            type: 'bar',
            zlevel: 1,
            itemStyle: {
              normal: {
                barBorderRadius: 10,
                color: '#1BE6EB'
              }
            },
            barWidth: 10,
            data: xData
          },
          {
            name: '',
            type: 'bar',
            barWidth: 10,
            barGap: '-100%',
            data: maxData,
            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 1,
                color: 'transparent',
                barBorderRadius: 10
              }
            }
          }
        ]
      }
      this[id].setOption(option, true)
    },
    //绘制PM10统计
    drawPM(data) {
      let { id, xData } = data
      xData = ['03-20', '03-21', '03-22', '03-23']
      this[id] = echarts.init(document.getElementById(id))
      let option = {
        title: {
          subtext: '单位:μg/m3',
          right: '20',
          top: '0',
          subtextStyle: {
            color: '#fff',
            fontSize: '14'
          }
        },
        legend: {
          icon: 'circle',
          top: '5%',
          right: '15%',
          itemWidth: 6,
          itemGap: 20,
          textStyle: {
            color: '#fff',
            fontSize: '14'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          top: 40,
          left: 10,
          right: 20,
          bottom: 10,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xData,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#4595CE'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: '#4595CE'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#4595CE'
              }
            }
          }
        ],
        series: [
          {
            name: 'PM10',
            type: 'line',
            data: [10, 10, 30, 12],
            symbolSize: 1,
            symbol: 'circle',
            label: {
              show: true,
              position: 'top',
              distance: 4,
              color: '#1BE6EB',
              fontSize: 12
            },
            itemStyle: {
              normal: {
                color: '#1BE6EB',
                borderColor: '#1BE6EB'
              }
            }
          },
          {
            name: '国控',
            type: 'line',
            data: [5, 12, 11, 14],
            symbolSize: 1,
            symbol: 'circle',
            label: {
              show: true,
              position: 'top',
              distance: 4,
              color: '#F57D2C',
              fontSize: 12
            },
            itemStyle: {
              normal: {
                color: '#F57D2C',
                borderColor: '#F57D2C'
              }
            }
          }
        ]
      }
      this[id].setOption(option, true)
    },
    //绘制目标任务
    drawTargetTask(data) {
      let { id, color, title } = data
      this[id] = echarts.init(document.getElementById(id))
      let value = 50
      let max = 100
      function _pie3() {
        let dataArr = []
        for (var i = 0; i < 6; i++) {
          if (i % 2 === 0) {
            dataArr.push({
              value: 30,
              itemStyle: {
                normal: {
                  borderWidth: 2,
                  borderColor: 'rgba(0,0,0,0)'
                }
              }
            })
          } else {
            dataArr.push({
              value: 2,
              itemStyle: {
                normal: {
                  color: 'rgba(88,142,197,0)',
                  borderWidth: 2,
                  borderColor: 'rgba(0,0,0,0)'
                }
              }
            })
          }
        }
        return dataArr
      }
      function pieData() {
        let dataArr = []
        for (var i = 0; i < max + value; i++) {
          if (i <= value) {
            dataArr.push({
              value: 10,
              itemStyle: {
                normal: {
                  color: color,
                  borderColor: 'rgba(0,0,0,0)'
                }
              }
            })
            dataArr.push({
              value: 10,
              itemStyle: {
                normal: {
                  color: 'rgba(0,0,0,0)',
                  borderColor: 'rgba(0,0,0,0)'
                }
              }
            })
          } else {
            dataArr.push({
              name: (i + 1).toString(),
              value: 10,
              itemStyle: {
                normal: {
                  color: 'rgba(0,0,0,0)',
                  borderColor: 'rgba(0,0,0,0)'
                }
              }
            })
          }
        }
        return dataArr
      }
      let option = {
        title: [
          {
            text: value + '\n',
            subtext: '\n' + '\n' + '\n' + '\n' + '{a|' + title + '}' + '\n' + '\n' + '\n' + '{b|年度目标:' + max + '}',
            subtextStyle: {
              rich: {
                a: {
                  color: color,
                  fontSize: 16,
                  fontWeight: 'bold'
                },
                b: {
                  color: '#C4D9FF',
                  fontSize: 16,
                  fontWeight: 'bold'
                }
              }
            },
            x: '45%',
            y: '30%',
            textAlign: 'center',
            textStyle: {
              color: '#fff',
              fontSize: 20
            }
          }
        ],
        tooltip: {
          show: false
        },
        series: [
          {
            //最外面
            type: 'pie',
            zlevel: 2,
            silent: true,
            radius: ['80%', '82%'],
            center: ['50%', '35%'],
            startAngle: 90,
            hoverAnimation: false,
            color: '#273065',
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: _pie3()
          },
          {
            //第二层
            type: 'pie',
            silent: true,
            zlevel: 5,
            hoverAnimation: false,
            radius: ['65%', '67%'],
            center: ['50%', '35%'],
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: 1,
                itemStyle: {
                  normal: {
                    borderWidth: 1,
                    borderColor: color
                  }
                }
              }
            ]
          },
          {
            //第三层
            type: 'pie',
            silent: true,
            zlevel: 4,
            radius: ['45%', '47%'],
            center: ['50%', '35%'],
            color: '#273065',
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [1]
          },
          {
            type: 'pie',
            zlevel: 3,
            silent: true,
            radius: ['40%', '60%'],
            center: ['50%', '35%'],
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: pieData()
          }
        ]
      }

      this[id].setOption(option, true)
    },
    //得到自动巡检数据
    async getAutomaticCheckData() {
      let resp = await this.$http.get('/carp/business/a/q/manage/center/autoCheck')
      let xData = [],
        video = [],
        todeyCheck = []
      if (resp.code == 0) {
        for (let i = 0; i < resp.data.date.length; i++) {
          resp.data.date[i] = this.$moment(resp.data.date[i]).format('MM-DD')
        }
        xData = resp.data.date
        video = resp.data.videos
        todeyCheck = resp.data.todays
      }
      this.drawAutomaticCheck({ id: 'automaticCheckChart', xData, video, todeyCheck })
    },
    //绘制自动巡检
    drawAutomaticCheck(data) {
      let { id, xData, video, todeyCheck } = data
      this[id] = echarts.init(document.getElementById(id))
      let option = {
        title: {
          subtext: '单位:次',
          right: '20',
          top: '0',
          subtextStyle: {
            color: '#fff',
            fontSize: '14'
          }
        },
        legend: {
          icon: 'circle',
          top: '5%',
          left: '10%',
          itemWidth: 6,
          itemGap: 20,
          textStyle: {
            color: '#fff',
            fontSize: '14'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          top: 40,
          left: 10,
          right: 20,
          bottom: 10,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xData,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#4595CE'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: '#4595CE'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#4595CE'
              }
            }
          }
        ],
        series: [
          {
            name: '今日巡检',
            type: 'line',
            data: todeyCheck,
            symbolSize: 1,
            symbol: 'circle',
            label: {
              show: true,
              position: 'top',
              distance: 4,
              color: '#66E583',
              fontSize: 12
            },
            itemStyle: {
              normal: {
                color: '#66E583',
                borderColor: '#66E583'
              }
            }
          },
          {
            name: '视频巡检',
            type: 'line',
            data: video,
            symbolSize: 1,
            symbol: 'circle',
            label: {
              show: true,
              position: 'top',
              distance: 4,
              color: '#F6B041',
              fontSize: 12
            },
            itemStyle: {
              normal: {
                color: '#F6B041',
                borderColor: '#F6B041'
              }
            }
          }
        ]
      }
      this[id].setOption(option, true)
    }
  },
  beforeDestroy() {
    clearInterval(this.exposureTimer)
    clearInterval(this.DateInter)
    window.removeEventListener('resize', () => {})
  }
}
</script>

<style lang="less">
@import './style/index.less';
@import '~@/assets/less/common';

.dataView {
  * {
    box-sizing: border-box;
  }
  box-sizing: border-box;
  height: 100%;
  display: flex;
  background: url('../../../assets/images/dataView/bigScreen-bg.jpg') no-repeat;
  background-size: cover;
  flex-direction: column;
  padding: 10px 0 20px;
  .el-progress--circle .el-progress__text,
  .el-progress--dashboard .el-progress__text {
    color: #fff;
  }
  .anchorBL {
    display: none;
  }
  .bm-view {
    height: 100%;
    width: 100%;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    overflow: hidden;
  }
  .color1 {
    color: #57fff9;
  }
  .color2 {
    color: #c657ff;
  }
  .color3 {
    color: #f6f855;
  }
  .color4 {
    color: #ff8d57;
  }
  p,
  h2,
  header {
    margin: 0;
    padding: 0;
  }
  .fg2 {
    flex-grow: 3;
  }
  .fg3 {
    flex-grow: 4;
  }
  .fg6 {
    flex-grow: 6;
  }
  .mr {
    margin-right: 10px;
  }
  header {
    height: 100px;
    flex-shrink: 0;
    line-height: 100px;
    display: flex;
    width: 100%;
    .title {
      text-align: center;
      color: #fff;
      width: 53%;
      font-family: FZZhengHeiS-DB-GB;
      font-size: 35px;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
    }
    .time,
    .weather {
      width: 23.5%;
      text-align: right;
      color: #fff;
      font-size: 16px;
    }
    .weather {
      text-align: left;
    }
  }
  section {
    display: flex;
    flex-grow: 1;
    .left-boxs,
    .right-boxs {
      margin: 0 10px;
      height: 100%;
      display: flex;
      flex-grow: 5;
      flex-basis: 0;
      flex-direction: column;
      flex-wrap: wrap;
    }
    .middle-boxs {
      margin: 0 10px;
      height: 100%;
      display: flex;
      flex-grow: 14;
      flex-basis: 0;
      flex-direction: column;
      flex-wrap: wrap;
      .mapTop {
        display: flex;
        align-items: center;
      }
      .mapDiv {
        border-radius: 10px;
        overflow: hidden;
        padding: 10px 10px 40px;
        display: block !important;
        position: relative;
      }
      .funcionCard {
        position: absolute;
        left: 30px;
        top: 30px;
        border-radius: 8px;
        padding: 8px;
        padding-top: 0;
        padding-bottom: 20px;
        width: 160px;
        background: rgba(17, 21, 35, 1);
        z-index: 10;
        .funcItem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          vertical-align: bottom;
          margin-top: 10px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          .el-checkbox__label {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
          }
          .text {
            color: #fff;
          }
        }
      }
      .exposure {
        display: flex;
        align-items: center;
        height: 30px;
        padding: 0 10px;
        padding-right: 40px;
        width: 100%;
        background: rgb(17, 21, 35);
        opacity: 0.75;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        line-height: 30px;
        .exposureText {
          font-style: italic;
          color: #3d87f0;
          font-weight: 800;
          padding-right: 10px;
          font-size: 18px;
        }
        .exposureTitle {
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          flex-grow: 1;
        }
        .date {
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
    .box {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      flex-basis: 0;
      .title {
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        flex-grow: 0;
        font-size: 24px;
        line-height: 40px;
        // flex-basis: 0;
      }
      .box-item {
        display: flex;
        flex-grow: 1;
        flex-basis: 0;
        border: 1px solid rgba(5, 14, 50, 0.86);
        box-shadow: 0px 0px 4px rgba(73, 136, 188, 0.57) inset;
        border-radius: 10px;
        background: rgba(134, 199, 254, 0.2);
        .hotspots {
          padding: 20px;
          padding-top: 10px;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          overflow: auto;
          .hotspot {
            flex-shrink: 0;
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            background: rgba(13, 34, 83, 1);
            border-radius: 4px;
            box-shadow: 0px 2px 17px 0px rgba(21, 34, 54, 0.44);
            .left {
              display: flex;
              color: #fff;
              font-size: 14px;
            }
            .right {
              display: flex;
              align-items: center;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
